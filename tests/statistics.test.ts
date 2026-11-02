import test from "node:test";
import assert from "node:assert/strict";
import { baselinePeriod, numericValue, percentChange, realWageChange } from "../src/statistics.js";
test("inflation compounds through index ratios rather than adding rates", () => {
  assert(Math.abs(percentChange(100, 121)! - 21) < 1e-10);
  assert.notEqual(percentChange(100, 121), 20);
});
test("real wage change differs from the percentage-point gap", () => {
  const real = realWageChange(50, 25)!;
  assert(Math.abs(real - 20) < 1e-10); assert.notEqual(real, 25);
});
test("nulls are not converted into zero", () => {
  assert.equal(numericValue(null), null); assert.equal(percentChange(null, 100), null); assert.equal(realWageChange(null, 20), null);
});
test("ambiguous numeric strings, invalid baselines and nonfinite values fail", () => {
  for (const raw of ["", "1,234", "12abc", "NaN", "Infinity", " 12 "]) assert.throws(() => numericValue(raw));
  assert.throws(() => percentChange(0, 120)); assert.throws(() => numericValue(Infinity)); assert.throws(() => realWageChange(5, -100));
  assert.equal(numericValue("123.4500"), 123.45);
});
test("year-to-date uses prior December, annual uses twelve months", () => {
  assert.equal(baselinePeriod("2026-01", "year_to_date"), "2025-12");
  assert.equal(baselinePeriod("2026-01", "year_over_year"), "2025-01");
  assert.equal(baselinePeriod("2026-01", "monthly"), "2025-12");
});
