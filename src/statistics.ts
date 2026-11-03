import { ServiceError } from "./errors.js";

export function numericValue(raw: number | string | null): number | null {
  if (raw === null) return null;
  if (typeof raw === "string" && !/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(raw)) {
    throw new ServiceError("INVALID_NUMERIC_VALUE", "The published string cannot be interpreted as an unambiguous decimal number.");
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new ServiceError("INVALID_NUMERIC_VALUE", "A finite numeric observation is required.");
  return value;
}
export function percentChange(start: number | string | null, end: number | string | null): number | null {
  const a = numericValue(start); const b = numericValue(end);
  if (a === null || b === null) return null;
  if (a <= 0 || b < 0) throw new ServiceError("INVALID_INDEX", "A positive baseline and nonnegative ending index are required.");
  const result = (b / a - 1) * 100;
  if (!Number.isFinite(result)) throw new ServiceError("INVALID_INDEX", "The index ratio exceeds numeric bounds.");
  return result;
}
export function realWageChange(wagePercent: number | null, inflationPercent: number | null): number | null {
  if (wagePercent === null || inflationPercent === null) return null;
  if (!Number.isFinite(wagePercent) || !Number.isFinite(inflationPercent) || inflationPercent <= -100) throw new ServiceError("INVALID_INDEX", "The real wage ratio is undefined.");
  const result = ((1 + wagePercent / 100) / (1 + inflationPercent / 100) - 1) * 100;
  if (!Number.isFinite(result)) throw new ServiceError("INVALID_INDEX", "The real wage ratio exceeds numeric bounds.");
  return result;
}
export function shiftMonth(period: string, months: number): string {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + months, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}
export function baselinePeriod(end: string, window: "monthly" | "year_over_year" | "year_to_date") {
  return window === "year_to_date" ? `${Number(end.slice(0, 4)) - 1}-12` : shiftMonth(end, window === "monthly" ? -1 : -12);
}
