import * as z from "zod/v4";
import { IndecClient } from "./indec.js";
import { month, getSeries, seriesOutput } from "./series.js";
import { wageMeasures, type SeriesId } from "./catalog.js";
import { baselinePeriod, realWageChange } from "./statistics.js";
import type { State } from "./state.js";

export const wageInput = z.strictObject({ sector: z.enum(["total", "private_registered", "public", "private_unregistered"]).default("total"), end_period: month.optional(), window: z.enum(["monthly", "year_over_year", "year_to_date"]).default("year_over_year") });
export const unavailableOutput = z.object({ status: z.literal("error"), error: z.object({ code: z.string(), message: z.string(), retryable: z.boolean() }) });

export type WageInput = z.infer<typeof wageInput>;
const baselineMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).nullable();
export const wageOutput = seriesOutput.extend({
  sector: wageInput.shape.sector, window: wageInput.shape.window,
  reference_period: month.nullable(), baseline_period: baselineMonth,
  period_selection: z.enum(["latest_available", "requested_exact"]),
  value: z.number().finite().nullable(), official_measure: z.string()
});
export const comparisonOutput = z.object({
  schema_version: z.literal("1.0"), status: z.enum(["ok", "unavailable"]), data_source: z.literal("current_official"),
  sector: wageInput.shape.sector, window: wageInput.shape.window, reference_period: month.nullable(), baseline_period: baselineMonth,
  frequency: z.literal("monthly"), period_selection: z.enum(["latest_mutual_cutoff", "requested_exact"]),
  latest_available_periods: z.object({ wages: month.nullable(), inflation: month.nullable() }).nullable(),
  wages: wageOutput, inflation: seriesOutput,
  calculated: z.literal(true), real_wage_change_percent: z.number().finite().nullable(), growth_gap_percentage_points: z.number().finite().nullable(),
  formula: z.literal("((1 + wage_growth_percent / 100) / (1 + inflation_percent / 100) - 1) * 100"),
  warnings: z.array(z.string())
});
const ipcMeasures = { monthly: "monthly_change", year_over_year: "year_over_year", year_to_date: "year_to_date" } as const;

export async function wageGrowth(client: IndecClient, state: State, input: WageInput) {
  const series = await getSeries(client, state, { series_id: `wages.${input.sector}.${input.window}`, start_period: input.end_period, end_period: input.end_period, limit: 1 });
  const observation = series.observations[0];
  const period = input.end_period ?? observation?.reference_period ?? null;
  return wageOutput.parse({ ...series, sector: input.sector, window: input.window,
    reference_period: period, baseline_period: period ? baselinePeriod(period, input.window) : null,
    period_selection: input.end_period ? "requested_exact" : "latest_available", value: observation?.value ?? null,
    official_measure: wageMeasures[input.window].description,
    warnings: [...series.warnings, "Published official percentage change; not a sum of monthly rates. The baseline identifies the measure's comparison period, not a separately retrieved index observation.", ...(input.end_period ? [] : ["Latest available wage month; not necessarily the previous calendar month."])]
  });
}

export async function compareWagesInflation(client: IndecClient, state: State, input: WageInput) {
  const ipcId: SeriesId = `ipc.national.headline.${ipcMeasures[input.window]}`;
  const ipc = (period?: string) => getSeries(client, state, { series_id: ipcId, start_period: period, end_period: period, limit: 1 });
  let wages = await wageGrowth(client, state, input);
  let inflation = await ipc(input.end_period);
  const latest = input.end_period ? null : { wages: wages.reference_period, inflation: inflation.observations[0]?.reference_period ?? null };
  // Require exact observations at the earlier latest reference month. Never scan
  // backwards or skip a null to manufacture an available comparison.
  const period = input.end_period ?? (latest?.wages && latest.inflation ? [latest.wages, latest.inflation].sort()[0] : null);
  if (period && wages.reference_period !== period) wages = await wageGrowth(client, state, { ...input, end_period: period });
  if (period && inflation.observations[0]?.reference_period !== period) inflation = await ipc(period);
  const wageValue = period && wages.reference_period === period ? wages.value : null;
  const inflationValue = period && inflation.observations[0]?.reference_period === period ? inflation.observations[0].value as number | null : null;
  const real = realWageChange(wageValue, inflationValue);
  const warnings = [...new Set([...wages.warnings, ...inflation.warnings])];
  warnings.push("Real wage change is calculated from published, potentially rounded official rates; the percentage-point gap is a different measure.");
  if (!input.end_period) warnings.push("Compared the earlier of the latest wage and inflation reference months, requiring exact observations at that cutoff. No older month or non-null value was substituted.");
  if (real === null) warnings.push("A same-period wage/inflation comparison is unavailable; missing values are not zero.");
  return comparisonOutput.parse({ schema_version: "1.0", status: real === null ? "unavailable" : "ok", data_source: "current_official", sector: input.sector, window: input.window,
    reference_period: period, baseline_period: period ? baselinePeriod(period, input.window) : null, frequency: "monthly",
    period_selection: input.end_period ? "requested_exact" : "latest_mutual_cutoff", latest_available_periods: latest, wages, inflation,
    calculated: true, real_wage_change_percent: real, growth_gap_percentage_points: wageValue === null || inflationValue === null ? null : wageValue - inflationValue,
    formula: "((1 + wage_growth_percent / 100) / (1 + inflation_percent / 100) - 1) * 100", warnings });
}
