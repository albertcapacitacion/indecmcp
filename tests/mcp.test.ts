import test from "node:test";
import assert from "node:assert/strict";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { handleRequest } from "../src/index.js";
import { MemoryState } from "../src/state.js";
import { IndecClient } from "../src/indec.js";
import { NATIONAL_MONTHLY } from "../src/inflation.js";
import { latestOutput } from "../src/inflation.js";
import { unavailableOutput } from "../src/wages.js";

const mockRow = { ...NATIONAL_MONTHLY, periodo: "202609", anio: 2026, mes: 9, valor: 1.9, valor_null: null, observaciones: null };
async function connection(userId: string | null = "synthetic-client", mode: "auto" | "legacy" = "auto", state = new MemoryState()) {
  const client = new Client({ name: "synthetic-integration-test", version: "1" }, { versionNegotiation: { mode } });
  const upstream = new IndecClient("SYNTHETIC_SECRET", async url => String(url).includes("indice_salarios") ? new Response("SYNTHETIC_SECRET", { status: 404 }) : Response.json([mockRow], { headers: { "content-range": "0-0/1" } }));
  const transport = new StreamableHTTPClientTransport(new URL("http://127.0.0.1/mcp"), { fetch: async (url, init) => { const request = new Request(url, init); request.headers.set("host", "127.0.0.1"); return handleRequest(request, { client: upstream, state, userId }, true); } });
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
