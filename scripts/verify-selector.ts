import assert from "node:assert/strict";
import { IndecClient, ipcQuery, parseRows, dimensions } from "../src/indec.js";
import { NATIONAL_MONTHLY } from "../src/inflation.js";
try {
  const page = await new IndecClient(process.env.INDEC_API_TOKEN ?? "").page("ipc_nacional", ipcQuery(NATIONAL_MONTHLY, 2));
  const rows = parseRows(page.rows); assert(rows.length > 0); assert(rows.every(row => dimensions.every(key => row[key] === NATIONAL_MONTHLY[key])));
  assert(rows.length < 2 || rows[0].periodo !== rows[1].periodo);
  console.log(JSON.stringify({ verified: true, period: rows[0].periodo, source: page.source, retrieved_at: page.retrievedAt }));
} catch { console.error("The IPC selector could not be verified; no upstream error body was logged."); process.exitCode = 1; }
