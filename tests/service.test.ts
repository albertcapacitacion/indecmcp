import test from "node:test";
import assert from "node:assert/strict";
import { IndecClient, ipcQuery, parseRows, networkDiagnostic } from "../src/indec.js";
import { latestInflation, NATIONAL_MONTHLY } from "../src/inflation.js";
import { MemoryState } from "../src/state.js";
import { getSeries, seriesInput } from "../src/series.js";

// Synthetic test fixtures. These are not archived publications or proof of live integration.
export const row = (period = "202609", value: number | null = 1.9) => ({ ...NATIONAL_MONTHLY, periodo: period, anio: Number(period.slice(0, 4)), mes: Number(period.slice(4)), valor: value, valor_null: value === null ? "..." : null, observaciones: "Dato provisorio", extra_statistical_flag: "*" });
export function upstream(rows: unknown[], total = rows.length) {
  return new IndecClient("test-only-token", async () => Response.json(rows, { status: total > rows.length ? 206 : 200, headers: { "content-range": `0-${Math.max(0, rows.length - 1)}/${total}` } }));
}
test("latest returns exact published value and preserves unknown flags", async () => {
  const result = await latestInflation(upstream([row()]), new MemoryState());
  assert.equal(result.value, 1.9); assert.equal(result.calculated, false); assert.equal(result.reference_period, "2026-09");
  assert.equal(result.raw_observation.extra_statistical_flag, "*"); assert.equal(result.publication_date, null);
});
test("latest null is explicit and is not replaced with the prior month", async () => {
  const result = await latestInflation(upstream([row("202609", null), row("202608", 1.7)]), new MemoryState());
  assert.equal(result.value, null); assert.equal(result.status, "unavailable"); assert.equal(result.reference_period, "2026-09");
  assert.equal(result.raw_observation.valor_null, "...");
});
test("ambiguous, wrong-dimension and inconsistent periods fail closed", async () => {
  for (const rows of [[row(), row()], [row("202608"), row("202609")], [{ ...row(), region: "GBA" }], [{ ...row(), mes: 1 }]]) {
    await assert.rejects(() => latestInflation(upstream(rows), new MemoryState()));
  }
});
test("cache hit retains upstream retrieval time and expiry", async () => {
  let calls = 0; const state = new MemoryState(); const client = new IndecClient("test", async () => { calls++; return Response.json([row()], { headers: { "content-range": "0-0/1" } }); });
  const first = await latestInflation(client, state); const second = await latestInflation(client, state);
  assert.equal(calls, 1); assert.equal(second.cache.hit, true); assert.equal(first.retrieved_at, second.retrieved_at); assert.equal(first.cache.expires_at, second.cache.expires_at);
});
test("expired cache refreshes and does not serve stale data on failure", async () => {
  let now = 1000; const state = new MemoryState(() => now);
  await latestInflation(upstream([row()]), state, () => now);
  now += 3_600_001;
  const failed = new IndecClient("test", async () => new Response("secret-token-upstream", { status: 500 }));
  await assert.rejects(() => latestInflation(failed, state, () => now), error => error instanceof Error && !error.message.includes("secret-token"));
});
test("upstream errors are sanitized and redirects are prohibited", async () => {
  let checked = false;
  const client = new IndecClient("test-secret", async (url, options) => { assert.equal(new URL(String(url)).hostname, "api.indec.gob.ar"); assert.equal(options?.redirect, "manual"); checked = true; return new Response("test-secret", { status: 401 }); });
  await assert.rejects(() => client.page("ipc_nacional", ipcQuery(NATIONAL_MONTHLY, 2)), error => error instanceof Error && !error.message.includes("test-secret")); assert(checked);
});
test("redirects are rejected without forwarding credentials or following Location", async () => {
  let calls = 0;
  const client = new IndecClient("test-secret", async (url, options) => { calls++; assert.equal(new URL(String(url)).hostname, "api.indec.gob.ar"); assert.equal(options?.redirect, "manual"); return new Response("", { status: 302, headers: { Location: "https://evil.example/" } }); });
  await assert.rejects(() => client.page("ipc_nacional", ipcQuery(NATIONAL_MONTHLY, 2)), error => error instanceof Error && error.message.includes("redirect"));
  assert.equal(calls, 1);
});
test("operator network diagnostics redact credentials and URLs", () => {
  const token = "TEST_PRIVATE_SECRET";
  const diagnostic = networkDiagnostic(new TypeError(`Cannot fetch https://api.indec.gob.ar/v1?key=${token} Authorization: Bearer ${token}`), token);
  assert(!JSON.stringify(diagnostic).includes(token)); assert(!JSON.stringify(diagnostic).includes("https://"));
});
test("default fetch retains the native global receiver in hosted runtimes", async () => {
  const previous = globalThis.fetch;
  try {
    globalThis.fetch = async function(this: unknown) {
      assert.equal(this, globalThis, "Native fetch must not receive the IndecClient instance as this.");
      return Response.json([row()], { headers: { "content-range": "0-0/1" } });
    };
    assert.equal((await new IndecClient("test-only-token").page("ipc_nacional", ipcQuery(NATIONAL_MONTHLY, 2))).rows.length, 1);
  } finally { globalThis.fetch = previous; }
});
test("schema mismatch and oversized response are rejected", async () => {
  assert.throws(() => parseRows([{ ...row(), valor: "1.9" }]));
  const large = new IndecClient("test", async () => new Response('"' + "x".repeat(2_000_001) + '"', { headers: { "content-type": "application/json", "content-range": "0-0/1" } }));
  await assert.rejects(() => large.page("ipc_nacional", ipcQuery(NATIONAL_MONTHLY, 2)));
});
test("history bounds, ordering, truncation and null flags are explicit", async () => {
  const result = await getSeries(upstream([row("202609"), row("202608", null), row("202607")], 10), new MemoryState(), seriesInput.parse({ series_id: "ipc.national.headline.monthly_change", limit: 2 }));
  assert.deepEqual(result.observations.map(row => row.reference_period), ["2026-08", "2026-09"]); assert.equal(result.truncated, true); assert.equal(result.status, "partial");
  assert.equal(result.observations[0].statistical_flag, "...");
});
test("quarterly series rejects monthly bounds and raw queries", async () => {
  assert.equal(seriesInput.safeParse({ series_id: "https://example.com/", url: "https://example.com" }).success, false);
  await assert.rejects(() => getSeries(upstream([]), new MemoryState(), seriesInput.parse({ series_id: "unemployment.eph.31_agglomerations", start_period: "2026-01" })));
});
test("missing exact month returns unavailable with no substitution", async () => {
  const result = await getSeries(upstream([]), new MemoryState(), seriesInput.parse({ series_id: "ipc.national.headline.monthly_change", start_period: "2026-10", end_period: "2026-10" }));
  assert.equal(result.status, "unavailable"); assert.equal(result.observations.length, 0);
});
