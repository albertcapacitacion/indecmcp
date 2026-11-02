import * as z from "zod/v4";
import { catalog, seriesIds, type SeriesId, type SeriesDefinition } from "./catalog.js";
import { IndecClient } from "./indec.js";
import { ServiceError } from "./errors.js";
import type { State } from "./state.js";

export const month = z.string().regex(/^(19|20)\d{2}-(0[1-9]|1[0-2])$/);
export const seriesInput = z.strictObject({
  series_id: z.enum(seriesIds),
  start_period: z.string().max(7).optional().describe("Inclusive YYYY-MM, or YYYY-Qn for a quarterly series."),
  end_period: z.string().max(7).optional().describe("Inclusive YYYY-MM, or YYYY-Qn for a quarterly series."),
  limit: z.number().int().min(1).max(240).default(24)
});
export const observationSchema = z.object({ reference_period: z.string(), value: z.union([z.number(), z.string(), z.null()]), statistical_flag: z.string().nullable(), observations: z.string().nullable(), raw: z.record(z.string(), z.unknown()) });
export const seriesOutput = z.object({
  schema_version: z.literal("1.0"), status: z.enum(["ok", "unavailable", "partial"]), data_source: z.literal("current_official"), series_id: z.string(),
  frequency: z.enum(["monthly", "quarterly", "semiannual"]), coverage: z.string(), seasonal_adjustment: z.string(), unit: z.string(), calculated: z.literal(false),
  observations: z.array(observationSchema), returned_order: z.literal("ascending"), requested_start: z.string().nullable(), requested_end: z.string().nullable(), truncated: z.boolean(),
  sources: z.array(z.object({ url: z.string(), retrieved_at: z.string() })), publication_date: z.null(), methodology_source: z.string(),
  cache: z.object({ hit: z.boolean(), expires_at: z.string() }), warnings: z.array(z.string())
});

function apiPeriod(period: string, frequency: SeriesDefinition["frequency"]) {
  if (frequency === "monthly" && month.safeParse(period).success) return period.replace("-", "");
  if (frequency === "quarterly" && /^(19|20)\d{2}-Q[1-4]$/.test(period)) return `${period.slice(0, 4)}${period.at(-1)}T`;
  throw new ServiceError("INVALID_PERIOD", `Use ${frequency === "monthly" ? "YYYY-MM" : "YYYY-Qn"} for this series.`);
}
export function referencePeriod(raw: string, frequency: SeriesDefinition["frequency"]) { return frequency === "monthly" ? `${raw.slice(0, 4)}-${raw.slice(4)}` : `${raw.slice(0, 4)}-Q${raw[4]}`; }

export async function getSeries(client: IndecClient, state: State, input: z.infer<typeof seriesInput>, now = () => Date.now()) {
  const definition: SeriesDefinition = catalog[input.series_id];
  if (!definition) throw new ServiceError("UNSUPPORTED_SERIES", "The requested series is outside the reviewed catalog.");
  const start = input.start_period ? apiPeriod(input.start_period, definition.frequency) : null;
  const end = input.end_period ? apiPeriod(input.end_period, definition.frequency) : null;
  if (start && end && start > end) throw new ServiceError("INVALID_PERIOD", "start_period must not follow end_period.");
  const key = `series-v1:${input.series_id}:${start ?? ""}:${end ?? ""}:${input.limit}`;
  const cached = await state.cached(key);
  if (cached) { const result = seriesOutput.parse(JSON.parse(cached)); return { ...result, cache: { ...result.cache, hit: true } }; }
  const query = new URLSearchParams({ order: definition.order, offset: "0" });
  for (const [field, value] of Object.entries(definition.filters)) query.set(field, `eq.${value}`);
  if (start) query.append("periodo", `gte.${start}`);
  if (end) query.append("periodo", `lte.${end}`);
  const pages = [];
  const allRows: unknown[] = [];
  const target = input.limit + 1;
  let total: number | null = null;
  // At most three pages and 241 rows. All pages use the full unique upstream key.
  while (allRows.length < target && pages.length < 3) {
    query.set("offset", String(allRows.length));
    query.set("limit", String(Math.min(100, target - allRows.length)));
    await state.consume("upstream:minute", 120, 60); await state.consume("upstream:day", 3000, 86400);
    const page = await client.page(definition.dataset, query);
    if (total !== null && total !== page.total) throw new ServiceError("UPSTREAM_CHANGED", "INDEC's row count changed during pagination. Retry the query.", true);
    total = page.total; pages.push(page); allRows.push(...page.rows);
    if (allRows.length >= total) break;
    if (!page.rows.length) throw new ServiceError("INCOMPLETE_RESPONSE", "INDEC returned an incomplete paginated response.", true);
  }
  if (allRows.length < target && allRows.length < (total ?? 0)) throw new ServiceError("INCOMPLETE_RESPONSE", "INDEC did not return the bounded requested pages.", true);
  const rows: Record<string, unknown>[] = [];
  const seen = new Set<string>();
  for (const raw of allRows) {
    const parsed = definition.schema.safeParse(raw);
    if (!parsed.success) throw new ServiceError("SCHEMA_MISMATCH", "INDEC returned observations that do not match the verified schema.");
    const row = parsed.data;
    if (Object.entries(definition.filters).some(([field, value]) => row[field] !== value)) throw new ServiceError("AMBIGUOUS_SERIES", "An observation does not match the requested official series.");
    const period = String(row.periodo);
    if (seen.has(period)) throw new ServiceError("AMBIGUOUS_SERIES", "Multiple observations matched the same series and reference period.");
    if ((start && period < start) || (end && period > end)) throw new ServiceError("SCHEMA_MISMATCH", "An observation lies outside the requested reference periods.");
    if (definition.frequency === "monthly" && period !== `${row.anio}${String(row.mes).padStart(2, "0")}`) throw new ServiceError("SCHEMA_MISMATCH", "The observation month is inconsistent.");
    if (definition.frequency === "quarterly" && period !== `${row.anio}${row.trimestre}T`) throw new ServiceError("SCHEMA_MISMATCH", "The observation quarter is inconsistent.");
    seen.add(period); rows.push(row);
  }
  // The latest bounded page is explicitly ordered descending upstream; return it ascending.
  if (rows.some((row, i) => i > 0 && String(row.periodo) >= String(rows[i - 1].periodo))) throw new ServiceError("SCHEMA_MISMATCH", "INDEC did not honor the required stable order.");
  const selected = rows.slice(0, input.limit).reverse();
  const observations = selected.map(row => ({ reference_period: referencePeriod(String(row.periodo), definition.frequency), value: row[definition.valueField], statistical_flag: row[`${definition.valueField}_null`] ?? null, observations: row.observaciones ?? null, raw: row }));
  const warnings = ["Publication date is not supplied by this API. Current observations can be revised."];
  if (selected.length === 0) warnings.push("No observations are available for the requested series and period bounds.");
  if (observations.some(row => row.value === null)) warnings.push("Null observations are preserved; no older value has been substituted.");
  if (rows.length > input.limit || (total ?? 0) > input.limit) warnings.push("Only the most recent observations within the requested bounds and limit are returned.");
  const result = seriesOutput.parse({ schema_version: "1.0", status: observations.length === 0 || observations.every(row => row.value === null) ? "unavailable" : observations.some(row => row.value === null) ? "partial" : "ok", data_source: "current_official", series_id: input.series_id, frequency: definition.frequency, coverage: definition.coverage,
    seasonal_adjustment: definition.adjustment, unit: definition.unit, calculated: false, observations, returned_order: "ascending", requested_start: input.start_period ?? null, requested_end: input.end_period ?? null,
    truncated: (total ?? 0) > input.limit, sources: pages.map(page => ({ url: page.source, retrieved_at: page.retrievedAt })), publication_date: null, methodology_source: definition.methodology,
    cache: { hit: false, expires_at: new Date(now() + 3_600_000).toISOString() }, warnings });
  await state.cache(key, JSON.stringify(result), now() + 3_600_000);
  return result;
}

export const historyInput = z.strictObject({ start_period: month.optional(), end_period: month.optional(), measure: z.enum(["monthly_change", "year_over_year", "year_to_date", "index"]).default("monthly_change"), limit: z.number().int().min(1).max(240).default(24) });
export function inflationHistory(client: IndecClient, state: State, input: z.infer<typeof historyInput>) {
  return getSeries(client, state, { ...input, series_id: `ipc.national.headline.${input.measure}` as SeriesId });
}
export const basketInput = z.strictObject({ basket: z.enum(["cba", "cbt"]), period: month.optional() });
export function basicBasket(client: IndecClient, state: State, input: z.infer<typeof basketInput>) {
  return getSeries(client, state, { series_id: `basket.gba.${input.basket}.adult_equivalent`, start_period: input.period, end_period: input.period, limit: 1 });
}
