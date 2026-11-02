import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { D1State, type Database } from "../src/state.js";

// Integration against real SQLite and the actual migration/production SQL.
// This adapter is not claimed to be the hosted D1 platform itself.
function database() {
  const sql = new DatabaseSync(":memory:");
  sql.exec(readFileSync(new URL("../drizzle/0000_eager_vermin.sql", import.meta.url), "utf8").replaceAll("--> statement-breakpoint", ""));
  const adapter: Database = { prepare(query) { return { bind(...values) { return {
    async first<T>() { return (sql.prepare(query).get(...values) ?? null) as T | null; },
    async run() { return sql.prepare(query).run(...values); }
  }; } }; } };
  return { sql, adapter };
}
test("production SQL enforces shared atomic counters across state instances", async () => {
  const { sql, adapter } = database(); try {
    const states = [new D1State(adapter), new D1State(adapter)];
    const outcomes = await Promise.allSettled(Array.from({ length: 30 }, (_, index) => states[index % 2].consume("shared-client", 10, 60)));
    assert.equal(outcomes.filter(result => result.status === "fulfilled").length, 10);
    assert.equal(sql.prepare("SELECT hits FROM usage_limits WHERE bucket = ?").get("shared-client")?.hits, 10);
  } finally { sql.close(); }
});
test("production SQL cache expiry and counter windows remain separate", async () => {
  const { sql, adapter } = database(); let now = 1000; const state = new D1State(adapter, () => now);
  try {
    await state.cache("series", '{"value":1}', 2000); assert.equal(await state.cached("series"), '{"value":1}');
    await state.consume("client-a", 1, 60); await state.consume("client-b", 1, 60); await assert.rejects(() => state.consume("client-a", 1, 60));
    now = 61000; assert.equal(await state.cached("series"), null); await state.consume("client-a", 1, 60);
  } finally { sql.close(); }
});
