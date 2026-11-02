import * as z from "zod/v4";
import { IndecClient } from "./indec.js";
import { ServiceError } from "./errors.js";
import { month } from "./series.js";
import type { State } from "./state.js";

export const wageInput = z.strictObject({ sector: z.enum(["total", "private_registered", "public", "private_unregistered"]).default("total"), end_period: month.optional(), window: z.enum(["monthly", "year_over_year", "year_to_date"]).default("year_over_year") });
export const unavailableOutput = z.object({ status: z.literal("error"), error: z.object({ code: z.string(), message: z.string(), retryable: z.boolean() }) });

/** Fail closed until the documented upstream service and its exact dimensions can be verified. */
export async function wageGrowth(client: IndecClient, state: State): Promise<never> {
  await state.consume("upstream:minute", 120, 60); await state.consume("upstream:day", 3000, 86400);
  await client.page("indice_salarios", new URLSearchParams({ order: "periodo.desc,clasificador,nivel,codigo,descripcion,anio,mes,indicador,tipo_de_indicador,tipo_de_indicador_descripcion,unidad_de_medida", limit: "1", offset: "0" }));
  // A newly available endpoint is not evidence of the correct sector/index selectors.
  throw new ServiceError("SERIES_NOT_VERIFIED", "The wage endpoint is reachable, but its sector and index mappings still require verification. No wage values or comparison have been substituted.");
}
