import { NATIONAL_MONTHLY } from "./inflation.js";
import { IPC_ORDER, ipcRowSchema, type Dataset } from "./indec.js";
import * as z from "zod/v4";

const monthly = { periodo: z.string().regex(/^\d{4}(0[1-9]|1[0-2])$/), anio: z.number().int(), mes: z.number().int().min(1).max(12), valor: z.number().finite().nullable(), valor_null: z.string().nullable().optional(), observaciones: z.string().nullable() };
export interface SeriesDefinition {
  dataset: Dataset; filters: Record<string, string>; order: string; frequency: "monthly" | "quarterly";
  coverage: string; adjustment: "original" | "seasonally_adjusted" | "trend_cycle" | "not_applicable";
  unit: string; valueField: string; methodology: string; schema: z.ZodType<Record<string, unknown>>;
}
const ipc = (type: string, description: string, unit: string): SeriesDefinition => ({
  dataset: "ipc_nacional", filters: { ...NATIONAL_MONTHLY, tipo_de_indicador: type, tipo_de_indicador_descripcion: description, unidad_de_medida: unit === "index" ? "Unidad" : "Porcentaje" },
  order: IPC_ORDER, frequency: "monthly", coverage: "Argentina, national", adjustment: "not_applicable", unit,
  valueField: "valor", methodology: "https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_ipc_nacional_2019.pdf", schema: ipcRowSchema
});
const basket = (kind: "CBA" | "CBT"): SeriesDefinition => ({
  dataset: "valorizacion_canastas_cba_cbt", filters: { clasificador: "CBA y CBT", nivel: "Adulto equivalente", codigo: kind, descripcion: kind === "CBA" ? "Canasta Basica Alimentaria" : "Canasta Basica Total", indicador: "Canasta", tipo_de_indicador: kind, tipo_de_indicador_descripcion: "Valores mensuales por adulto equivalente, expresados en pesos", region: "GBA", unidad_de_medida: "Pesos argentinos" },
  order: IPC_ORDER, frequency: "monthly", coverage: "Gran Buenos Aires, per adult equivalent", adjustment: "not_applicable", unit: "ARS", valueField: "valor",
  methodology: "https://www.indec.gob.ar/ftp/cuadros/sociedad/EPH_metodologia_22_pobreza.pdf", schema: ipcRowSchema
});
const activity = (description: string, adjustment: SeriesDefinition["adjustment"]): SeriesDefinition => ({
  dataset: "estimador-mensual-de-actividad-economica-nivel-general", filters: { tipo_de_indicador: "Índice base 2004=100", tipo_de_indicador_descripcion: description },
  order: "periodo.desc,tipo_de_indicador_descripcion,anio,mes,tipo_de_indicador", frequency: "monthly", coverage: "Argentina, national", adjustment, unit: "index (2004=100)", valueField: "valor",
  methodology: "https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_emae_ago_16.pdf", schema: z.looseObject({ ...monthly, tipo_de_indicador: z.string(), tipo_de_indicador_descripcion: z.string() })
});

export const wageSectors = {
  total: { nivel: "0", codigo: "0", descripcion: "Nivel general" },
  private_registered: { nivel: "2", codigo: "110", descripcion: "Sector privado registrado" },
  public: { nivel: "2", codigo: "120", descripcion: "Sector público" },
  private_unregistered: { nivel: "1", codigo: "200", descripcion: "Total no registrado" }
} as const;
export type WageSector = keyof typeof wageSectors;
export const wageMeasures = {
  index: { type: "Indice", description: "Nivel del período, base octubre 2016=100", unit: "Unidad" },
  monthly: { type: "v_m", description: "Variación porcentual respecto del período anterior", unit: "Porcentaje" },
  year_over_year: { type: "v_ia", description: "Variación porcentual respecto del mismo período del año anterior", unit: "Porcentaje" },
  year_to_date: { type: "v_acum", description: "Variación porcentual acumulada desde diciembre del año anterior", unit: "Porcentaje" }
} as const;
// Current docs and authenticated rows verified 2026-11-03: valor is number|null,
// unlike string|null in the retained original supplied OpenAPI file.
function wage(sector: WageSector, measure: keyof typeof wageMeasures): SeriesDefinition {
  const metadata = wageMeasures[measure];
  return {
    dataset: "indice_salarios", filters: { clasificador: "IS 2001", ...wageSectors[sector], indicador: "Índice de salarios (IS)", tipo_de_indicador: metadata.type, tipo_de_indicador_descripcion: metadata.description, unidad_de_medida: metadata.unit },
    order: "periodo.desc,clasificador,nivel,codigo,descripcion,anio,mes,indicador,tipo_de_indicador,tipo_de_indicador_descripcion,unidad_de_medida",
    frequency: "monthly", coverage: "Argentina, national; selected wage sector", adjustment: "not_applicable", unit: measure === "index" ? "index (October 2016=100)" : "percent", valueField: "valor",
    methodology: "https://www.indec.gob.ar/ftp/cuadros/sociedad/cvs_metodologia.pdf", schema: ipcRowSchema.omit({ region: true })
  };
}

// Closed catalog. Non-wage filters verified against real API rows 2026-11-02.
export const catalog = {
  "wages.total.index": wage("total", "index"),
  "wages.total.monthly": wage("total", "monthly"),
  "wages.total.year_over_year": wage("total", "year_over_year"),
  "wages.total.year_to_date": wage("total", "year_to_date"),
  "wages.private_registered.index": wage("private_registered", "index"),
  "wages.private_registered.monthly": wage("private_registered", "monthly"),
  "wages.private_registered.year_over_year": wage("private_registered", "year_over_year"),
  "wages.private_registered.year_to_date": wage("private_registered", "year_to_date"),
  "wages.public.index": wage("public", "index"),
  "wages.public.monthly": wage("public", "monthly"),
  "wages.public.year_over_year": wage("public", "year_over_year"),
  "wages.public.year_to_date": wage("public", "year_to_date"),
  "wages.private_unregistered.index": wage("private_unregistered", "index"),
  "wages.private_unregistered.monthly": wage("private_unregistered", "monthly"),
  "wages.private_unregistered.year_over_year": wage("private_unregistered", "year_over_year"),
  "wages.private_unregistered.year_to_date": wage("private_unregistered", "year_to_date"),
  "ipc.national.headline.monthly_change": ipc("v_m", "Variación porcentual respecto del período anterior", "percent"),
  "ipc.national.headline.year_over_year": ipc("v_ia", "Variación porcentual respecto del mismo período del año anterior", "percent"),
  "ipc.national.headline.year_to_date": ipc("v_acum", "Variación porcentual acumulada desde diciembre del año anterior", "percent"),
  "ipc.national.headline.index": ipc("Indice", "Nivel del período, base Diciembre 2016 = 100", "index"),
  "basket.gba.cba.adult_equivalent": basket("CBA"), "basket.gba.cbt.adult_equivalent": basket("CBT"),
  "activity.emae.original.index": activity("Índice serie original", "original"),
  "activity.emae.seasonally_adjusted.index": activity("Índice serie desestacionalizada", "seasonally_adjusted"),
  "activity.emae.trend_cycle.index": activity("Índice serie tendencia-ciclo", "trend_cycle"),
  "unemployment.eph.31_agglomerations": {
    dataset: "mercado_trabajo_eph", filters: { area_geografica_nom: "T_31_A" }, order: "periodo.desc,area_geografica_nom", frequency: "quarterly", coverage: "EPH: 31 urban agglomerations; not the entire national population", adjustment: "not_applicable", unit: "percent", valueField: "tasa_de_desocupacion",
    methodology: "https://www.indec.gob.ar/ftp/cuadros/sociedad/metodologia_eph_continua.pdf", schema: z.looseObject({ periodo: z.string().regex(/^\d{4}[1-4]T$/), anio: z.number().int(), trimestre: z.number().int().min(1).max(4), area_geografica_nom: z.string(), area_geografica_cod: z.number().nullable(), tasa_de_desocupacion: z.number().finite().nullable(), observaciones: z.string().nullable() })
  } satisfies SeriesDefinition
} satisfies Record<string, SeriesDefinition>;
export type SeriesId = keyof typeof catalog;
export const seriesIds = Object.keys(catalog) as [SeriesId, ...SeriesId[]];
