# Tool contract v1

`tools/list` is the authoritative machine-readable contract. All inputs reject additional properties; defaults are applied server-side. Output schemas are generated from the same Zod definitions used for validation.

Success contains exact official values and raw observations, series identity, reference periods, frequency, coverage, adjustment, source queries, retrieval timestamps, cache expiry and warnings. `calculated: false` identifies direct official measures. `status: unavailable` means no value is available; nulls are retained. `partial` identifies returned nulls in a mixed series. `truncated` identifies a bounded latest subset. Requested boundaries and ascending output order are explicit.

Tool failures use `isError: true` and `{status: "error", error: {code, message, retryable}}`. Error messages are fixed and sanitized. Authentication, invalid input, unavailable datasets, ambiguity and failed upstream requests never yield invented values. Protocol parse/method/schema errors are handled by the official MCP SDK.

`get_series` IDs are declared in `src/catalog.ts` and enumerated in its public input schema. Each maps to one reviewed operation. No discovery/executor combination, raw URL, raw PostgREST filter or arbitrary endpoint is exposed. Monthly bounds use YYYY-MM. Quarterly bounds use YYYY-Qn. The period parser rejects mismatched frequencies.

Annotations: readOnlyHint=true, destructiveHint=false, openWorldHint=false (bounded official catalog; no arbitrary entities or destinations), idempotentHint=true (safe to retry; source revisions may change results). Operational cache and rate counters do not alter upstream data or create user artifacts.

The wage tools' declared output is presently the unavailable/error schema. Their intended sector, period and window inputs are documented, but no unverified numerical output is advertised. Enabling wages requires a verified endpoint, exact dimensions and a reviewed schema update.
