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

// Closed catalog. Every filter value above was verified against real API rows on 2026-11-02.
export const catalog = {
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
