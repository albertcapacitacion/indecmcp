import assert from "node:assert/strict";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { startServer } from "./dev.js";
import { writeFile, mkdir } from "node:fs/promises";
import { latestOutput } from "../src/inflation.js";
import { seriesOutput } from "../src/series.js";
import { unavailableOutput } from "../src/wages.js";
if (!process.env.INDEC_API_TOKEN?.trim()) { console.error("Configure INDEC_API_TOKEN in the ignored .env before live verification."); process.exit(1); }
const server = startServer(0);
await new Promise<void>(resolve => server.listening ? resolve() : server.once("listening", resolve));
const address = server.address(); if (!address || typeof address === "string") throw new Error("No local server address.");
const client = new Client({ name: "indec-live-verification", version: "0.1.0" }, { versionNegotiation: { mode: "auto" } });
try {
  await client.connect(new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${address.port}/mcp`)));
  const list = await client.listTools(); assert(list.tools.some(tool => tool.name === "get_latest_inflation"));
  const requests = [
    { name: "get_latest_inflation", arguments: {} },
    { name: "get_inflation_history", arguments: { measure: "year_to_date", limit: 3 } },
    { name: "get_inflation_history", arguments: { measure: "monthly_change", limit: 120 } },
    { name: "get_basic_basket", arguments: { basket: "cbt" } },
    { name: "get_series", arguments: { series_id: "unemployment.eph.31_agglomerations", limit: 4 } },
    { name: "get_series", arguments: { series_id: "activity.emae.seasonally_adjusted.index", limit: 12 } },
    { name: "get_wage_growth", arguments: {} },
    { name: "compare_wages_inflation", arguments: {} }
  ];
  const calls = [];
  for (const request of requests) {
    const result = await client.callTool(request);
    const wage = ["get_wage_growth", "compare_wages_inflation"].includes(request.name);
    if (wage) { assert.equal(result.isError, true); assert.equal(unavailableOutput.parse(result.structuredContent).error.code, "UPSTREAM_NOT_FOUND"); }
    else { assert(!result.isError, `Live tool failed: ${request.name}`); request.name === "get_latest_inflation" ? latestOutput.parse(result.structuredContent) : seriesOutput.parse(result.structuredContent); }
    calls.push({ request, result });
    console.log(JSON.stringify({ tool: request.name, outcome: wage ? "verified upstream 404" : "live data verified", data: request.name === "get_latest_inflation" ? result.structuredContent : undefined }));
  }
  const recording = { verification: "LIVE INDEC THROUGH REAL HTTP MCP CLIENT", purpose: "Reproducible integration evidence; not a newspaper publication archive", recorded_at: new Date().toISOString(), era: client.getProtocolEra(), calls };
  if (process.argv.includes("--record")) {
    await mkdir("docs/examples", { recursive: true });
    const filename = `docs/examples/live-${recording.recorded_at.replaceAll(":", "-")}.json`;
    await writeFile(filename, JSON.stringify(recording, null, 2) + "\n", { flag: "wx" }); console.log(`Saved ${filename}`);
  }
  console.log(JSON.stringify({ verification: recording.verification, era: recording.era, calls_verified: calls.length }));
} catch { console.error("Live MCP verification failed. No credential or raw upstream error has been logged."); process.exitCode = 1; }
finally { await client.close(); await new Promise<void>(resolve => server.close(() => resolve())); }
