import * as z from "zod/v4";
import { readBoundedJson } from "./bounded.js";
import { ServiceError } from "./errors.js";

export const API_ORIGIN = "https://api.indec.gob.ar/v1/";
export const dimensions = ["clasificador", "nivel", "codigo", "descripcion", "indicador", "tipo_de_indicador", "tipo_de_indicador_descripcion", "region", "unidad_de_medida"] as const;
const dimensionShape = Object.fromEntries(dimensions.map(key => [key, z.string().min(1).max(250)])) as Record<typeof dimensions[number], z.ZodString>;
export const selectorSchema = z.strictObject(dimensionShape);
export const ipcRowSchema = z.looseObject({
  ...dimensionShape,
  periodo: z.string().regex(/^\d{4}(0[1-9]|1[0-2])$/),
  anio: z.number().int(), mes: z.number().int().min(1).max(12),
  valor: z.number().finite().nullable(), observaciones: z.string().nullable(),
  valor_null: z.string().nullable().optional()
});
export type IpcRow = z.infer<typeof ipcRowSchema>;
export type Selector = z.infer<typeof selectorSchema>;
export const IPC_ORDER = "periodo.desc,clasificador,nivel,codigo,descripcion,anio,mes,indicador,tipo_de_indicador,tipo_de_indicador_descripcion,region,unidad_de_medida";
export const IPC_PATH = "ipc_nacional";
export const DATASETS = [IPC_PATH, "indice_salarios", "valorizacion_canastas_cba_cbt", "estimador-mensual-de-actividad-economica-nivel-general", "mercado_trabajo_eph"] as const;
export type Dataset = typeof DATASETS[number];

export interface Page { rows: unknown[]; source: string; retrievedAt: string; total: number; }
export function networkDiagnostic(error: unknown, token: string) {
  const name = error instanceof Error ? error.name : "UnknownError";
  const message = error instanceof Error ? error.message : "Unknown network failure";
  const redacted = message.split(token).join("[redacted]")
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[redacted]")
    .replace(/https?:\/\/\S+/g, "[url]");
  return { event: "upstream_network_failure", error_name: /^[A-Za-z0-9_]{1,60}$/.test(name) ? name : "Error", reason: redacted.slice(0, 250) };
}
export class IndecClient {
  constructor(private readonly token: string, private readonly fetcher: typeof fetch = (input, init) => globalThis.fetch(input, init)) {}

  async page(path: Dataset, query: URLSearchParams): Promise<Page> {
    if (!this.token.trim()) throw new ServiceError("UPSTREAM_NOT_CONFIGURED", "The INDEC service credential has not been configured.");
    if (!DATASETS.includes(path)) throw new ServiceError("UNSUPPORTED_SERIES", "This dataset is not enabled.");
    const limit = Number(query.get("limit")); const offset = Number(query.get("offset") ?? 0);
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000 || !Number.isInteger(offset) || offset < 0 || offset > 2000) throw new ServiceError("REQUEST_LIMIT", "Invalid upstream pagination bounds.");
    const url = new URL(path, API_ORIGIN);
    url.search = query.toString();
    const signal = AbortSignal.timeout(8_000);
    try {
      const response = await this.fetcher(url, {
        headers: { Authorization: `Bearer ${this.token}`, Accept: "application/json", Prefer: "count=exact" },
        redirect: "error", signal
      });
      if (![200, 206].includes(response.status)) {
        await response.body?.cancel();
        if ([401, 403].includes(response.status)) throw new ServiceError("UPSTREAM_AUTH_ERROR", "INDEC rejected the server credential.");
        if (response.status === 404) throw new ServiceError("UPSTREAM_NOT_FOUND", "The dataset endpoint documented in the supplied INDEC specification is unavailable (HTTP 404).");
        if (response.status === 429) throw new ServiceError("UPSTREAM_RATE_LIMITED", "INDEC is temporarily rate limited.", true);
        throw new ServiceError("UPSTREAM_ERROR", "INDEC could not fulfill the request.", response.status >= 500);
      }
      if (!response.headers.get("content-type")?.includes("application/json")) {
        await response.body?.cancel();
        throw new ServiceError("INVALID_RESPONSE", "INDEC returned an unexpected response format.");
      }
      const data = await readBoundedJson(response.body, 2_000_000, signal);
      if (!Array.isArray(data) || data.length > limit) throw new ServiceError("INVALID_RESPONSE", "INDEC returned an invalid page.");
      const range = response.headers.get("content-range");
      const totalText = range?.match(/\/(\d+)$/)?.[1];
      if (!totalText || !Number.isSafeInteger(Number(totalText))) throw new ServiceError("INVALID_RESPONSE", "INDEC did not provide the requested exact row count.");
      if (data.length && Number(totalText) < offset + data.length) throw new ServiceError("INVALID_RESPONSE", "INDEC returned an inconsistent row count.");
      return { rows: data, source: url.href, retrievedAt: new Date().toISOString(), total: Number(totalText) };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      console.error(JSON.stringify(networkDiagnostic(error, this.token)));
      throw new ServiceError(signal.aborted ? "UPSTREAM_TIMEOUT" : "UPSTREAM_UNAVAILABLE", "The INDEC request could not be completed.", true);
    }
  }
}

export function parseRows(rows: unknown[]): IpcRow[] {
  const result = z.array(ipcRowSchema).safeParse(rows);
  if (!result.success || result.data.some(row => row.periodo !== `${row.anio}${String(row.mes).padStart(2, "0")}`)) {
    throw new ServiceError("SCHEMA_MISMATCH", "INDEC returned observations that do not match the verified schema.");
  }
  return result.data;
}

export function ipcQuery(selector: Selector, limit: number, offset = 0) {
  const query = new URLSearchParams({ order: IPC_ORDER, limit: String(limit), offset: String(offset) });
  for (const field of dimensions) query.set(field, `eq.${selector[field]}`);
  return query;
}
