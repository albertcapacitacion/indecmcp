import test from "node:test";
import assert from "node:assert/strict";
import { IndecClient } from "../src/indec.js";
import { catalog, wageSectors, type SeriesId, type WageSector } from "../src/catalog.js";
import { MemoryState } from "../src/state.js";
import { wageInput, wageGrowth, compareWagesInflation, type WageInput } from "../src/wages.js";

// Synthetic observations exercise calculations; they are not live integration evidence.
export function observation(id: SeriesId, period: string, value: number | null) {
  return { ...catalog[id].filters, periodo: period.replace("-", ""), anio: Number(period.slice(0, 4)), mes: Number(period.slice(5)), valor: value, valor_null: value === null ? "..." : "*", observaciones: "Dato provisorio", extra_flag: "preserved" };
}
export function fixtureClient(rows: Record<string, unknown>[], requests: URL[] = []) {
  return new IndecClient("synthetic-wage-token", async input => {
    const url = new URL(String(input)); requests.push(url);
    const dataset = url.pathname.endsWith("indice_salarios") ? "wages" : "ipc";
    const filtered = rows.filter(row => (dataset === "wages") === (row.clasificador === "IS 2001") && [...url.searchParams].every(([field, filter]) => {
      if (["order", "limit", "offset"].includes(field)) return true;
      const dot = filter.indexOf("."); const op = filter.slice(0, dot); const value = filter.slice(dot + 1);
      return op === "eq" ? row[field] === value : op === "gte" ? String(row[field]) >= value : op === "lte" && String(row[field]) <= value;
    })).sort((a, b) => String(b.periodo).localeCompare(String(a.periodo)));
    const offset = Number(url.searchParams.get("offset")); const limit = Number(url.searchParams.get("limit"));
    return Response.json(filtered.slice(offset, offset + limit), { headers: { "content-range": `${offset}-${Math.max(offset, Math.min(filtered.length, offset + limit) - 1)}/${filtered.length}` } });
  });
}
const input = (args = {}) => wageInput.parse(args);

test("all wage sectors and windows use exact published measures and baseline periods", async () => {
  for (const sector of Object.keys(wageSectors) as WageSector[]) for (const window of ["monthly", "year_over_year", "year_to_date"] as const) {
    const result = await wageGrowth(fixtureClient([observation(`wages.${sector}.${window}`, "2026-08", 12.345)]), new MemoryState(), input({ sector, window }));
    assert.equal(result.value, 12.345); assert.equal(result.calculated, false); assert.equal(result.sector, sector);
    assert.equal(result.baseline_period, window === "monthly" ? "2026-07" : window === "year_over_year" ? "2025-08" : "2025-12");
    assert.equal(result.observations[0].statistical_flag, "*"); assert.equal(result.observations[0].raw.extra_flag, "preserved");
  }
});
test("comparison aligns lagging wages with exact inflation month and separates real change from pp gap", async () => {
  const requests: URL[] = [];
  const result = await compareWagesInflation(fixtureClient([
    observation("wages.total.year_over_year", "2026-08", 50),
    observation("ipc.national.headline.year_over_year", "2026-09", 30),
    observation("ipc.national.headline.year_over_year", "2026-08", 25)
  ], requests), new MemoryState(), input());
  assert.equal(result.reference_period, "2026-08"); assert.equal(result.baseline_period, "2025-08");
  assert.deepEqual(result.latest_available_periods, { wages: "2026-08", inflation: "2026-09" });
  assert(Math.abs(result.real_wage_change_percent! - 20) < 1e-10); assert.equal(result.growth_gap_percentage_points, 25);
  assert.equal(result.inflation.observations[0].reference_period, result.wages.reference_period);
  assert(requests.some(url => url.searchParams.getAll("periodo").join() === "gte.202608,lte.202608"));
});
test("comparison also aligns when inflation publication lags wages", async () => {
  const result = await compareWagesInflation(fixtureClient([
    observation("wages.total.monthly", "2026-09", 50), observation("wages.total.monthly", "2026-08", 10),
    observation("ipc.national.headline.monthly_change", "2026-08", 10)
  ]), new MemoryState(), input({ window: "monthly" }));
  assert.equal(result.reference_period, "2026-08"); assert.equal(result.wages.value, 10); assert.equal(result.real_wage_change_percent, 0);
});
test("null wages and missing exact inflation never fall back or become zero", async () => {
  for (const rows of [
    [observation("wages.total.year_over_year", "2026-08", null), observation("wages.total.year_over_year", "2026-07", 50), observation("ipc.national.headline.year_over_year", "2026-08", 25)],
    [observation("wages.total.year_over_year", "2026-08", 50), observation("ipc.national.headline.year_over_year", "2026-09", 25), observation("ipc.national.headline.year_over_year", "2026-07", 25)]
  ]) {
    const result = await compareWagesInflation(fixtureClient(rows), new MemoryState(), input());
    assert.equal(result.reference_period, "2026-08"); assert.equal(result.status, "unavailable");
    assert.equal(result.real_wage_change_percent, null); assert.equal(result.growth_gap_percentage_points, null);
  }
});
test("exact unavailable period preserves request and prior-year baseline", async () => {
  const result = await compareWagesInflation(fixtureClient([]), new MemoryState(), input({ end_period: "1900-01", window: "year_to_date" }));
  assert.equal(result.reference_period, "1900-01"); assert.equal(result.baseline_period, "1899-12");
  assert.equal(result.status, "unavailable"); assert.equal(result.period_selection, "requested_exact");
});
test("same-month official accumulated measures are used directly", async () => {
  const result = await compareWagesInflation(fixtureClient([
    observation("wages.public.year_to_date", "2026-08", 21), observation("ipc.national.headline.year_to_date", "2026-08", 10)
  ]), new MemoryState(), input({ sector: "public", window: "year_to_date", end_period: "2026-08" }));
  assert.equal(result.wages.value, 21); assert.equal(result.baseline_period, "2025-12"); assert(Math.abs(result.real_wage_change_percent! - 10) < 1e-10);
});
test("invalid numeric schema and duplicate wage observations fail closed", async () => {
  const row = observation("wages.total.year_over_year", "2026-08", 50);
  for (const rows of [[{ ...row, valor: "50" }], [row, row]]) await assert.rejects(() => wageGrowth(fixtureClient(rows), new MemoryState(), input()));
});
test("wage cache preserves original source retrieval time and expiry", async () => {
  const requests: URL[] = []; const state = new MemoryState(); const client = fixtureClient([observation("wages.total.year_over_year", "2026-08", 50)], requests);
  const first = await wageGrowth(client, state, input()); const second = await wageGrowth(client, state, input());
  assert.equal(requests.length, 1); assert.equal(second.cache.hit, true); assert.deepEqual(first.sources, second.sources); assert.equal(first.cache.expires_at, second.cache.expires_at);
});
test("empty latest source yields no inferred comparison period", async () => {
  const result = await compareWagesInflation(fixtureClient([observation("ipc.national.headline.year_over_year", "2026-08", 25)]), new MemoryState(), input());
  assert.equal(result.reference_period, null); assert.equal(result.real_wage_change_percent, null); assert.equal(result.status, "unavailable");
});
