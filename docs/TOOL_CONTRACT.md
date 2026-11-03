# Tool contract v1

`tools/list` is the authoritative machine-readable contract. All inputs reject additional properties; defaults are applied server-side. Output schemas are generated from the same Zod definitions used for validation.

Success contains exact official values and raw observations, series identity, reference periods, frequency, coverage, adjustment, source queries, retrieval timestamps, cache expiry and warnings. `calculated: false` identifies direct official measures. `status: unavailable` means no value is available; nulls are retained. `partial` identifies returned nulls in a mixed series. `truncated` identifies a bounded latest subset. Requested boundaries and ascending output order are explicit.

Tool failures use `isError: true` and `{status: "error", error: {code, message, retryable}}`. Error messages are fixed and sanitized. Authentication, invalid input, unavailable datasets, ambiguity and failed upstream requests never yield invented values. Protocol parse/method/schema errors are handled by the official MCP SDK.

`get_series` IDs are declared in `src/catalog.ts` and enumerated in its public input schema. Each maps to one reviewed operation. No discovery/executor combination, raw URL, raw PostgREST filter or arbitrary endpoint is exposed. Monthly bounds use YYYY-MM. Quarterly bounds use YYYY-Qn. The period parser rejects mismatched frequencies.

Annotations: readOnlyHint=true, destructiveHint=false, openWorldHint=false (bounded official catalog; no arbitrary entities or destinations), idempotentHint=true (safe to retry; source revisions may change results). Operational cache and rate counters do not alter upstream data or create user artifacts.

`get_wage_growth` extends the series response with sector, window, reference_period, baseline_period, value and official_measure. Its value is an exact published rate (`calculated: false`). The baseline describes the official window; it does not imply a separately fetched baseline index. `get_series` also exposes 16 wage IDs: `wages.<sector>.<measure>`; sectors are total/private_registered/public/private_unregistered, and measures are index/monthly/year_over_year/year_to_date.

`compare_wages_inflation` returns both complete official input responses under wages/inflation, their source retrieval/cache metadata, a shared reference/baseline period, the calculated real wage change in percent and the distinct growth gap in percentage points. With no explicit end_period it selects the earlier latest reference month, then requires exact observations at that cutoff. It does not scan backwards or skip nulls. Explicit missing periods and unavailable inputs return status unavailable and null calculations. Rates are official measures, never sums of monthly percentages. Rounded published inputs can produce a different result from unrounded index ratios. See WAGES.md for schema verification and reproducible evidence.
