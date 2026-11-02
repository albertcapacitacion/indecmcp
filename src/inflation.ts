import * as z from "zod/v4";
import { dimensions, IndecClient, ipcQuery, parseRows, type Selector } from "./indec.js";
import { ServiceError } from "./errors.js";
import type { State } from "./state.js";

// All dimensions verified with authenticated INDEC observations, 2026-11-02.
export const NATIONAL_MONTHLY: Selector = {
  clasificador: "IPC", nivel: "Nivel General", codigo: "0", descripcion: "Nivel general",
  indicador: "IPC base Dic16=100", tipo_de_indicador: "v_m",
  tipo_de_indicador_descripcion: "Variación porcentual respecto del período anterior",
  region: "Nacional", unidad_de_medida: "Porcentaje"
};
export const latestInput = z.strictObject({});
export const latestOutput = z.object({
  schema_version: z.literal("1.0"), status: z.enum(["ok", "unavailable"]),
  data_source: z.literal("current_official"), series_id: z.literal("ipc.national.headline.monthly_change"),
  reference_period: z.string(), frequency: z.literal("monthly"), coverage: z.literal("Argentina, national"),
  seasonal_adjustment: z.literal("not_applicable"), value: z.number().nullable(), unit: z.literal("percent"),
  calculated: z.literal(false), official_dimensions: z.record(z.string(), z.string()),
  raw_observation: z.record(z.string(), z.unknown()), source: z.string(), methodology_source: z.string(),
  retrieved_at: z.string(), publication_date: z.null(), cache: z.object({ hit: z.boolean(), expires_at: z.string() }),
  warnings: z.array(z.string())
});

export async function latestInflation(client: IndecClient, state: State, now = () => Date.now()) {
  const key = "v1:ipc.national.headline.monthly_change:latest";
  const cached = await state.cached(key);
  if (cached) {
    const parsed = latestOutput.safeParse(JSON.parse(cached));
    if (parsed.success) return { ...parsed.data, cache: { ...parsed.data.cache, hit: true } };
  }
  await state.consume("upstream:minute", 120, 60);
  await state.consume("upstream:day", 3000, 86400);
  const page = await client.page("ipc_nacional", ipcQuery(NATIONAL_MONTHLY, 2));
  const rows = parseRows(page.rows);
  if (!rows.length) throw new ServiceError("DATA_UNAVAILABLE", "INDEC has no observations for the verified national monthly inflation series.");
  const row = rows[0];
  if (dimensions.some(key => row[key] !== NATIONAL_MONTHLY[key]) || (rows[1] && rows[1].periodo >= row.periodo)) {
    throw new ServiceError("AMBIGUOUS_SERIES", "INDEC observations do not uniquely identify the verified inflation series.");
  }
  const warnings = ["Latest available reference month; this is not necessarily the previous calendar month.", "Publication date is not supplied by this API."];
  if (row.valor === null) warnings.push("The latest observation is null; no older value has been substituted.");
  if (row.valor_null) warnings.push(`Official statistical flag: ${row.valor_null}`);
  if (row.observaciones) warnings.push(row.observaciones);
  const result = latestOutput.parse({
    schema_version: "1.0", status: row.valor === null ? "unavailable" : "ok", data_source: "current_official",
    series_id: "ipc.national.headline.monthly_change", reference_period: `${row.periodo.slice(0, 4)}-${row.periodo.slice(4)}`,
    frequency: "monthly", coverage: "Argentina, national", seasonal_adjustment: "not_applicable",
    value: row.valor, unit: "percent", calculated: false, official_dimensions: NATIONAL_MONTHLY,
    raw_observation: row, source: page.source,
    methodology_source: "https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_ipc_nacional_2019.pdf",
    retrieved_at: page.retrievedAt, publication_date: null,
    cache: { hit: false, expires_at: new Date(now() + 3_600_000).toISOString() }, warnings
  });
  await state.cache(key, JSON.stringify(result), now() + 3_600_000);
  return result;
}
