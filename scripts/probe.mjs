// Operator-only, bounded discovery. Prints public INDEC rows, never credentials or raw errors.
import { readFile } from "node:fs/promises";
const token = process.env.INDEC_API_TOKEN;
if (!token?.trim()) { console.error("INDEC_API_TOKEN is missing."); process.exit(1); }
const spec = JSON.parse(await readFile(new URL("../docs/api-1.json", import.meta.url), "utf8"));
const dataset = process.argv[2] ?? "ipc_nacional";
const operation = spec.paths[`/${dataset}`]?.get;
if (!operation) throw new Error("Dataset is not in the supplied specification.");
const keys = operation.parameters.find(parameter => parameter.name === "order").description.split("clave completa: ")[1];
const query = new URLSearchParams({ order: `periodo.desc,${keys.split(",").filter(key => key !== "periodo").join(",")}`, limit: "100", offset: "0" });
for (const filter of process.argv.slice(3)) {
  const separator = filter.indexOf("="); const key = filter.slice(0, separator);
  if (separator < 1 || !operation.parameters.some(parameter => parameter.name === key && parameter.in === "query")) throw new Error("Undocumented filter.");
  query.set(key, filter.slice(separator + 1));
}
const url = new URL(dataset, "https://api.indec.gob.ar/v1/");
url.search = query.toString();
try {
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Prefer: "count=exact" }, signal: AbortSignal.timeout(15000), redirect: "error" });
  console.log(JSON.stringify({ status: response.status, range: response.headers.get("content-range") }));
  if (![200, 206].includes(response.status)) { await response.body?.cancel(); process.exitCode = 1; }
  else {
    const reader = response.body.getReader(); let size = 0; const chunks = [];
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 2000000) { await reader.cancel(); throw new Error(); } chunks.push(value); }
    const rows = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const period = rows[0]?.periodo;
    console.log(JSON.stringify({ period, rows: rows.slice(0, 6), dimensions: Object.fromEntries(["clasificador", "nivel", "codigo", "descripcion", "indicador", "tipo_de_indicador", "region", "unidad_de_medida"].map(key => [key, [...new Set(rows.map(row => row[key]))]])) }));
  }
} catch { console.error("INDEC probe failed; no upstream error body was logged."); process.exitCode = 1; }
