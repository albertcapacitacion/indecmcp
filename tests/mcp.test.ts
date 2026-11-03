import test from "node:test";
import assert from "node:assert/strict";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { handleRequest } from "../src/index.js";
import { MemoryState } from "../src/state.js";
import { IndecClient } from "../src/indec.js";
import { NATIONAL_MONTHLY } from "../src/inflation.js";
import { latestOutput } from "../src/inflation.js";
import { unavailableOutput, wageOutput, comparisonOutput } from "../src/wages.js";

const mockRow = { ...NATIONAL_MONTHLY, periodo: "202609", anio: 2026, mes: 9, valor: 1.9, valor_null: null, observaciones: null };
async function connection(userId: string | null = "synthetic-client", mode: "auto" | "legacy" = "auto", state = new MemoryState(), injectHost = true, wagesAvailable = false) {
  const client = new Client({ name: "synthetic-integration-test", version: "1" }, { versionNegotiation: { mode } });
  const upstream = new IndecClient("SYNTHETIC_SECRET", async input => {
    const url = new URL(String(input)); const wage = url.pathname.endsWith("indice_salarios");
    if (!wagesAvailable) return wage ? new Response("SYNTHETIC_SECRET", { status: 404 }) : Response.json([mockRow], { headers: { "content-range": "0-0/1" } });
    const filters = Object.fromEntries([...url.searchParams].filter(([, value]) => value.startsWith("eq.")).map(([key, value]) => [key, value.slice(3)]));
    const period = url.searchParams.getAll("periodo").find(value => value.startsWith("gte."))?.slice(4) ?? "202608";
    return Response.json([{ ...filters, periodo: period, anio: Number(period.slice(0, 4)), mes: Number(period.slice(4)), valor: wage ? 50 : 25, valor_null: "*", observaciones: "Dato provisorio" }], { headers: { "content-range": "0-0/1" } });
  });
  const transport = new StreamableHTTPClientTransport(new URL("http://127.0.0.1/mcp"), { fetch: async (url, init) => { const request = new Request(url, init); if (injectHost) request.headers.set("host", "127.0.0.1"); return handleRequest(request, { client: upstream, state, userId }, true); } });
  await client.connect(transport); await client.listTools(); return client;
}
for (const mode of ["auto", "legacy"] as const) test(`real SDK client transport: ${mode} era, schemas and tool call`, async () => {
  const client = await connection("synthetic-client", mode);
  try {
    const tools = (await client.listTools()).tools; assert.equal(tools.length, 6);
    for (const tool of tools) { assert.equal(tool.annotations?.readOnlyHint, true); assert.equal(tool.annotations?.destructiveHint, false); assert.equal(tool.annotations?.openWorldHint, false); assert(tool.outputSchema); }
    const result = await client.callTool({ name: "get_latest_inflation", arguments: {} }); assert(!result.isError); assert.equal(latestOutput.parse(result.structuredContent).value, 1.9);
    assert(!JSON.stringify(result).includes("SYNTHETIC_SECRET"));
  } finally { await client.close(); }
});
test("anonymous tool calls are rejected without upstream data", async () => {
  const client = await connection(null); try { const result = await client.callTool({ name: "get_latest_inflation", arguments: {} }); assert.equal(result.isError, true); assert.equal(unavailableOutput.parse(result.structuredContent).error.code, "AUTHENTICATION_REQUIRED"); } finally { await client.close(); }
});
test("strict tool input rejects unknown properties", async () => {
  const client = await connection(); try { const result = await client.callTool({ name: "get_latest_inflation", arguments: { url: "https://evil.example" } }); assert.equal(result.isError, true); } finally { await client.close(); }
});
test("wage 404 and comparison return explicit errors", async () => {
  const client = await connection(); try {
    for (const name of ["get_wage_growth", "compare_wages_inflation"]) { const result = await client.callTool({ name, arguments: {} }); assert.equal(result.isError, true); assert.equal(unavailableOutput.parse(result.structuredContent).error.code, "UPSTREAM_NOT_FOUND"); }
  } finally { await client.close(); }
});
for (const mode of ["auto", "legacy"] as const) test(`wage growth and comparison return structured success through ${mode} MCP`, async () => {
  const client = await connection("synthetic-wage-client", mode, new MemoryState(), true, true);
  try {
    const wage = await client.callTool({ name: "get_wage_growth", arguments: { sector: "public", window: "year_to_date", end_period: "2026-08" } });
    assert(!wage.isError); const published = wageOutput.parse(wage.structuredContent); assert.equal(published.sector, "public"); assert.equal(published.value, 50); assert.equal(published.baseline_period, "2025-12");
    const comparison = await client.callTool({ name: "compare_wages_inflation", arguments: { sector: "public", window: "year_to_date", end_period: "2026-08" } });
    assert(!comparison.isError); const result = comparisonOutput.parse(comparison.structuredContent); assert.equal(result.reference_period, "2026-08"); assert(Math.abs(result.real_wage_change_percent! - 20) < 1e-10);
    assert(!JSON.stringify(comparison).includes("SYNTHETIC_SECRET"));
  } finally { await client.close(); }
});
test("client rate limits remain enforced on cached calls", async () => {
  const client = await connection(); try {
    for (let i = 0; i < 30; i++) assert(!(await client.callTool({ name: "get_latest_inflation", arguments: {} })).isError);
    assert.equal((await client.callTool({ name: "get_latest_inflation", arguments: {} })).isError, true);
  } finally { await client.close(); }
});
test("origin validation rejects cross-origin browser requests", async () => {
  const response = await handleRequest(new Request("http://127.0.0.1/mcp", { method: "POST", headers: { host: "127.0.0.1", Origin: "https://evil.example" } }), { client: new IndecClient(""), state: new MemoryState(), userId: null }, true);
  assert.equal(response.status, 403);
});
test("Sites internal forwarding without Host is accepted only for the approved URL hostname", async () => {
  const deps = { client: new IndecClient(""), state: new MemoryState(), userId: null };
  assert.equal((await handleRequest(new Request("http://127.0.0.1/healthz"), deps, true)).status, 200);
  assert.equal((await handleRequest(new Request("http://evil.example/healthz"), deps, true)).status, 403);
  assert.equal((await handleRequest(new Request("http://127.0.0.1/healthz", { headers: { host: "evil.example" } }), deps, true)).status, 403);
});
test("native request shape without Host preserves the full MCP request body", async () => {
  const client = await connection("synthetic-client", "auto", new MemoryState(), false);
  try { const result = await client.callTool({ name: "get_latest_inflation", arguments: {} }); assert(!result.isError); assert.equal(latestOutput.parse(result.structuredContent).value, 1.9); }
  finally { await client.close(); }
});
