import { createMcpHandler, McpServer, type CallToolResult } from "@modelcontextprotocol/server";
import { latestInflation, latestInput, latestOutput } from "./inflation.js";
import { IndecClient } from "./indec.js";
import { safeError, ServiceError } from "./errors.js";
import type { State } from "./state.js";
import { seriesInput, seriesOutput, historyInput, inflationHistory, getSeries, basketInput, basicBasket } from "./series.js";
import { wageInput, wageGrowth, wageOutput, comparisonOutput, compareWagesInflation } from "./wages.js";

export interface Dependencies { client: IndecClient; state: State; userId: string | null; }
export function createServer(deps: Dependencies) {
  const server = new McpServer({ name: "indec-mcp", title: "INDEC MCP", version: "0.1.0" }, {
    instructions: "Read-only official Argentine statistics. Cite source and reference period. Latest available is not necessarily last calendar month. Preserve nulls, flags and coverage; label calculated results. Never describe current observations as historical publication snapshots."
  });
  const annotations = { readOnlyHint: true, destructiveHint: false, openWorldHint: false, idempotentHint: true };
  async function guarded(tool: string, action: () => Promise<Record<string, unknown>>): Promise<CallToolResult> {
    try {
      if (!deps.userId) throw new ServiceError("AUTHENTICATION_REQUIRED", "Connect through the Site's authenticated MCP plugin.");
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(deps.userId));
      const userKey = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
      await deps.state.consume(`client:${userKey}`, 30, 60);
      await deps.state.consume("tools:global", 300, 60);
      const result = await action();
      return { structuredContent: result, content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (error) {
      const safe = safeError(error);
      console.error(JSON.stringify({ event: "tool_failure", tool, code: safe.code }));
      return { isError: true, structuredContent: { status: "error", error: safe }, content: [{ type: "text", text: JSON.stringify({ status: "error", error: safe }) }] };
    }
  }
  server.registerTool("get_latest_inflation", {
    title: "Latest national monthly inflation",
    description: "Retrieve INDEC's latest available national headline monthly IPC percentage change, with exact published value, reference month, official dimensions, flags, source and freshness. No arguments. Does not guarantee the previous calendar month or a publication date. Returns a null observation explicitly without substituting older data.",
    inputSchema: latestInput, outputSchema: latestOutput, annotations
  }, async () => guarded("get_latest_inflation", () => latestInflation(deps.client, deps.state)));
  server.registerTool("get_inflation_history", {
    title: "National inflation history",
    description: "Retrieve up to 240 monthly national headline IPC observations for inclusive YYYY-MM bounds. Choose the published monthly change, year-over-year change, year-to-date change, or index level. Year-to-date and annual rates are official measures, never sums of monthly percentages. Outputs ascend by reference month; truncation, nulls and flags are explicit.",
    inputSchema: historyInput, outputSchema: seriesOutput, annotations
  }, async input => guarded("get_inflation_history", () => inflationHistory(deps.client, deps.state, input)));
  server.registerTool("get_basic_basket", {
    title: "Basic basket cost in Gran Buenos Aires",
    description: "Retrieve the published CBA (food basket) or CBT (total basic basket) cost in ARS per adult equivalent in Gran Buenos Aires. Specify YYYY-MM or omit for latest available. This is not a national household cost or a family-of-four estimate. Missing periods and null values remain explicit.",
    inputSchema: basketInput, outputSchema: seriesOutput, annotations
  }, async input => guarded("get_basic_basket", () => basicBasket(deps.client, deps.state, input)));
  server.registerTool("get_series", {
    title: "Retrieve a reviewed official statistical series",
    description: "Retrieve a fixed catalog of national IPC, wage indices and published rates by sector, Gran Buenos Aires per-adult baskets, national EMAE original/seasonally-adjusted/trend-cycle indices, or EPH unemployment for 31 urban agglomerations. Series IDs are enumerated in the input schema. No arbitrary endpoint, URL, raw query, SQL, or operation execution is accepted. Use YYYY-MM for monthly and YYYY-Qn for quarterly series. Default 24, maximum 240 latest observations; source, nulls, flags, coverage, adjustment and truncation are explicit.",
    inputSchema: seriesInput, outputSchema: seriesOutput, annotations
  }, async input => guarded("get_series", () => getSeries(deps.client, deps.state, input)));
  server.registerTool("get_wage_growth", {
    title: "Official wage growth",
    description: "Retrieve the published monthly, year-over-year or year-to-date wage percentage change for total, private registered, public or private unregistered wages. Optional end_period is exact YYYY-MM; otherwise use the latest available reference month. Preserves nulls, flags, source/retrieval metadata and sector. Rates are official measures, not sums of monthly changes; baseline_period describes the official window.",
    inputSchema: wageInput, outputSchema: wageOutput, annotations
  }, async input => guarded("get_wage_growth", () => wageGrowth(deps.client, deps.state, input)));
  server.registerTool("compare_wages_inflation", {
    title: "Compare wages and national inflation",
    description: "Compare published wage and national IPC rates for the identical monthly, year-over-year or year-to-date window. Optional end_period is exact YYYY-MM. Otherwise use the earlier of their latest reference months and require exact observations at that cutoff; do not skip nulls or search backwards. Return calculated real wage change separately from the percentage-point gap, with both official inputs, sectors, coverage, flags, sources and original retrieval/cache timestamps. Missing data returns unavailable.",
    inputSchema: wageInput, outputSchema: comparisonOutput, annotations
  }, async input => guarded("compare_wages_inflation", () => compareWagesInflation(deps.client, deps.state, input)));
  return server;
}

export function mcpHandler(deps: Dependencies) {
  return createMcpHandler(() => createServer(deps), { maxRequestBodySize: 16_384, responseMode: "auto", legacy: "stateless", onerror: () => console.error('{"event":"mcp_protocol_error"}') });
}
