import { isDeepStrictEqual } from "node:util";
import { latestOutput } from "../src/inflation.js";
import { seriesOutput } from "../src/series.js";
import { wageOutput, comparisonOutput } from "../src/wages.js";
import { catalog, type SeriesId } from "../src/catalog.js";
import { SITE_HOST } from "../src/index.js";

export const E2E_CASES = [
  { id: "latest_inflation", name: "get_latest_inflation", arguments: {} },
  { id: "inflation_cache", name: "get_latest_inflation", arguments: {} },
  { id: "accumulated_inflation", name: "get_inflation_history", arguments: { measure: "year_to_date", limit: 3 } },
  { id: "wage_growth", name: "get_wage_growth", arguments: { sector: "total", window: "year_over_year" } },
  { id: "real_wages", name: "compare_wages_inflation", arguments: { sector: "total", window: "year_over_year" } },
  { id: "basic_basket", name: "get_basic_basket", arguments: { basket: "cbt" } },
  { id: "unemployment", name: "get_series", arguments: { series_id: "unemployment.eph.31_agglomerations", limit: 4 } },
  { id: "adjusted_activity", name: "get_series", arguments: { series_id: "activity.emae.seasonally_adjusted.index", limit: 12 } },
  { id: "missing_exact_period", name: "compare_wages_inflation", arguments: { sector: "total", window: "year_over_year", end_period: "1900-01" } }
] satisfies { id: string; name: string; arguments: Record<string, unknown> }[];
export type ToolResponse = { isError?: boolean; structuredContent?: unknown };
export interface E2eRecording {
  target: "local_http" | "native_sites";
  endpoint: string;
  started_at: string;
  finished_at: string;
  calls: { request: { id: string; name: string; arguments: Record<string, unknown> }; result: ToolResponse }[];
}
export class E2eFailure extends Error {}
function check(condition: unknown, label: string): asserts condition { if (!condition) throw new E2eFailure(label); }
const close = (a: number | null, b: number) => a !== null && Math.abs(a - b) <= 1e-10 * Math.max(1, Math.abs(b));

/** Deterministic checks only. A saved recording is evidence, not a new network run. */
export function verifyE2e(record: E2eRecording) {
  check(record.target === "local_http" || record.target === "native_sites", "target");
  let endpoint: URL;
  try { endpoint = new URL(record.endpoint); } catch { throw new E2eFailure("endpoint"); }
  check(!endpoint.username && !endpoint.password && !endpoint.search && !endpoint.hash && endpoint.pathname === "/mcp", "endpoint");
  check(record.target === "native_sites" ? endpoint.href === `https://${SITE_HOST}/mcp` : endpoint.protocol === "http:" && endpoint.hostname === "127.0.0.1", "endpoint_target");
  const started = Date.parse(record.started_at), finished = Date.parse(record.finished_at);
  check(Number.isFinite(started) && Number.isFinite(finished) && finished >= started && finished - started < 600_000, "run_times");
  check(Array.isArray(record.calls) && record.calls.length === E2E_CASES.length, "complete_case_set");
  const parsed = record.calls.map((call, i) => {
    const expected = E2E_CASES[i];
    check(isDeepStrictEqual(call.request, expected), `request_${expected.id}`);
    check(call.result && !call.result.isError, `tool_success_${expected.id}`);
    const schema = expected.name === "get_latest_inflation" ? latestOutput : expected.name === "get_wage_growth" ? wageOutput : expected.name === "compare_wages_inflation" ? comparisonOutput : seriesOutput;
    const result = schema.safeParse(call.result.structuredContent);
    check(result.success, `output_schema_${expected.id}`);
    return result.data;
  });
  function metadata(data: { sources: { url: string; retrieved_at: string }[]; cache: { expires_at: string }; methodology_source: string }) {
    check(data.sources.length > 0, "source_metadata");
    const expiry = Date.parse(data.cache.expires_at);
    for (const source of data.sources) {
      let url: URL; try { url = new URL(source.url); } catch { throw new E2eFailure("source_url"); }
      check(url.origin === "https://api.indec.gob.ar" && url.pathname.startsWith("/v1/") && !url.username && !url.password && ![...url.searchParams.keys()].some(key => /token|authorization|secret/i.test(key)), "official_source");
      const retrieved = Date.parse(source.retrieved_at);
      check(Number.isFinite(retrieved) && retrieved >= started - 3_660_000 && retrieved <= finished + 60_000, "retrieval_time");
      check(Number.isFinite(expiry) && expiry > retrieved && expiry <= retrieved + 3_660_000, "fixed_cache_expiry");
    }
    check(data.methodology_source.startsWith("https://www.indec.gob.ar/"), "official_methodology");
  }
  function series(data: unknown, id: SeriesId, available = true) {
    const result = seriesOutput.parse(data);
    check(result.series_id === id && result.calculated === false, "series_identity");
    check(available ? result.status === "ok" && result.observations.length > 0 : result.status === "unavailable" && result.observations.length === 0, "series_availability");
    check(result.frequency === catalog[id].frequency && result.unit === catalog[id].unit && result.seasonal_adjustment === catalog[id].adjustment && result.coverage === catalog[id].coverage, "series_dimensions");
    metadata(result);
    for (let i = 0; i < result.observations.length; i++) {
      const row = result.observations[i], field = catalog[id].valueField;
      check(row.value === row.raw[field] && row.statistical_flag === (row.raw[`${field}_null`] ?? null) && row.observations === (row.raw.observaciones ?? null), "published_values_and_flags");
      check(i === 0 || result.observations[i - 1].reference_period < row.reference_period, "ascending_periods");
    }
    return result;
  }
  const first = latestOutput.parse(parsed[0]), cached = latestOutput.parse(parsed[1]);
  check(first.status === "ok" && first.value !== null && first.value === first.raw_observation.valor, "latest_published_value");
  metadata({ ...first, sources: [{ url: first.source, retrieved_at: first.retrieved_at }] });
  check(cached.cache.hit && cached.retrieved_at === first.retrieved_at && cached.cache.expires_at === first.cache.expires_at && cached.reference_period === first.reference_period && cached.value === first.value, "cache_retains_original_observation");
  check(series(parsed[2], "ipc.national.headline.year_to_date").observations.length <= 3, "history_bound");
  const wage = wageOutput.parse(parsed[3]);
  series(wage, "wages.total.year_over_year");
  check(wage.value === wage.observations[0].value && wage.reference_period === wage.observations[0].reference_period && wage.window === "year_over_year" && wage.sector === "total", "wage_measure");
  const comparison = comparisonOutput.parse(parsed[4]);
  series(comparison.wages, "wages.total.year_over_year");
  const inflation = series(comparison.inflation, "ipc.national.headline.year_over_year");
  const w = comparison.wages.observations[0], p = inflation.observations[0];
  check(comparison.status === "ok" && comparison.calculated && w.reference_period === p.reference_period && comparison.reference_period === w.reference_period && comparison.wages.value === w.value, "matching_comparison_periods");
  check(comparison.baseline_period === `${Number(w.reference_period.slice(0, 4)) - 1}${w.reference_period.slice(4)}` && comparison.wages.baseline_period === comparison.baseline_period, "annual_baseline");
  const latest = comparison.latest_available_periods;
  check(latest?.wages && latest.inflation && comparison.reference_period === [latest.wages, latest.inflation].sort()[0], "latest_mutual_cutoff");
  check(typeof w.value === "number" && typeof p.value === "number", "numeric_comparison_inputs");
  // Recalculate independently from raw published inputs, not the server's helper.
  check(close(comparison.real_wage_change_percent, ((100 + w.value) / (100 + p.value) - 1) * 100), "real_growth_calculation");
  check(close(comparison.growth_gap_percentage_points, w.value - p.value), "percentage_point_gap");
  series(parsed[5], "basket.gba.cbt.adult_equivalent");
  check(series(parsed[6], "unemployment.eph.31_agglomerations").observations.length <= 4, "quarterly_bound");
  check(series(parsed[7], "activity.emae.seasonally_adjusted.index").observations.length <= 12, "activity_bound");
  const missing = comparisonOutput.parse(parsed[8]);
  series(missing.wages, "wages.total.year_over_year", false); series(missing.inflation, "ipc.national.headline.year_over_year", false);
  check(missing.reference_period === "1900-01" && missing.baseline_period === "1899-01" && missing.wages.reference_period === "1900-01" && missing.wages.requested_start === "1900-01" && missing.inflation.requested_start === "1900-01" && missing.period_selection === "requested_exact" && missing.status === "unavailable" && missing.real_wage_change_percent === null && missing.growth_gap_percentage_points === null, "no_missing_period_substitution");
  return { status: "passed", target: record.target, endpoint: record.endpoint, calls_verified: record.calls.length, tools_verified: new Set(E2E_CASES.map(c => c.name)).size };
}
