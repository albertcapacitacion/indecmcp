import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { E2E_CASES, E2eFailure, verifyE2e, type E2eRecording } from "../scripts/e2e-checks.js";

// A synthetic unit fixture assembled from retained public observations. This
// checks the validator, not live integration; real E2E runs are separate.
function fixture(): E2eRecording {
  const live = JSON.parse(readFileSync(new URL("../docs/examples/live-2026-11-03T05-49-24.663Z.json", import.meta.url), "utf8"));
  const native = JSON.parse(readFileSync(new URL("../docs/examples/native-wages-2026-11-03T05-54-02.780Z.json", import.meta.url), "utf8"));
  const calls = E2E_CASES.map(request => {
    const found = request.id === "missing_exact_period" ? native.calls.find((call: { request: { name: string } }) => call.request.name === "missing_exact_month")
      : live.calls.find((call: { request: { name: string; arguments: { series_id?: string } } }) => call.request.name === request.name && (request.name !== "get_series" || call.request.arguments.series_id === (request.arguments as { series_id: string }).series_id));
    const result = structuredClone(found.result);
    if (request.id === "inflation_cache") result.structuredContent.cache.hit = true;
    if (request.id === "missing_exact_period") {
      const data = result.structuredContent;
      data.reference_period = "1900-01"; data.baseline_period = "1899-01";
      data.wages.reference_period = "1900-01"; data.wages.baseline_period = "1899-01";
      for (const series of [data.wages, data.inflation]) series.requested_start = series.requested_end = "1900-01";
    }
    return { request, result };
  });
  return { target: "native_sites", endpoint: "https://indec-mcp.albertcapacitaciondi.chatgpt.site/mcp", started_at: "2026-11-03T05:48:00Z", finished_at: "2026-11-03T05:55:00Z", calls };
}
test("E2E validator accepts a complete internally consistent fixture", () => {
  assert.equal(verifyE2e(fixture()).calls_verified, 9);
});
test("E2E validator rejects incorrect calculations and period alignment", () => {
  for (const field of ["real_wage_change_percent", "growth_gap_percentage_points", "reference_period"]) {
    const record = fixture(); const data = record.calls[4].result.structuredContent as Record<string, unknown>;
    data[field] = field === "reference_period" ? "2026-07" : Number(data[field]) + 1;
    assert.throws(() => verifyE2e(record), E2eFailure);
  }
});
test("E2E validator rejects omitted cases and fabricated missing-period results", () => {
  const incomplete = fixture(); incomplete.calls.pop(); assert.throws(() => verifyE2e(incomplete), E2eFailure);
  const record = fixture(); (record.calls[8].result.structuredContent as Record<string, unknown>).real_wage_change_percent = 0;
  assert.throws(() => verifyE2e(record), E2eFailure);
});
test("E2E validator rejects lost flags and unexpected endpoints", () => {
  const record = fixture(); const data = record.calls[3].result.structuredContent as { observations: { statistical_flag: string | null }[] };
  data.observations[0].statistical_flag = "invented"; assert.throws(() => verifyE2e(record), E2eFailure);
  const wrongHost = fixture(); wrongHost.endpoint = "https://example.com/mcp"; assert.throws(() => verifyE2e(wrongHost), E2eFailure);
});
