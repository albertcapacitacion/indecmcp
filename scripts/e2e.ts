import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { startServer } from "./dev.js";
import { E2E_CASES, E2eFailure, verifyE2e, type E2eRecording } from "./e2e-checks.js";

const args = process.argv.slice(2);
let client: Client | undefined;
let server: ReturnType<typeof startServer> | undefined;
try {
  if (args.length === 1 && args[0] === "--plan") { console.log(JSON.stringify(E2E_CASES, null, 2)); }
  else {
    let record: E2eRecording;
    if (args.length === 2 && args[0] === "--hosted-results") {
      if ((await stat(args[1])).size > 2_000_000) throw new E2eFailure("recording_size");
      record = JSON.parse(await readFile(args[1], "utf8"));
      if (record.target !== "native_sites") throw new E2eFailure("hosted_target_required");
    } else {
      if (args.some(arg => arg !== "--record")) throw new E2eFailure("unsupported_arguments");
      if (!process.env.INDEC_API_TOKEN?.trim()) throw new E2eFailure("configure_local_INDEC_API_TOKEN");
      server = startServer(0);
      await new Promise<void>(resolve => server!.listening ? resolve() : server!.once("listening", resolve));
      const address = server.address(); if (!address || typeof address === "string") throw new E2eFailure("local_server_address");
      const endpoint = `http://127.0.0.1:${address.port}/mcp`;
      client = new Client({ name: "indec-e2e", version: "1" }, { versionNegotiation: { mode: "auto" } });
      await client.connect(new StreamableHTTPClientTransport(new URL(endpoint)));
      const tools = (await client.listTools()).tools;
      for (const expected of E2E_CASES) if (!tools.some(tool => tool.name === expected.name && tool.annotations?.readOnlyHint === true)) throw new E2eFailure("discovery_and_read_only_tools");
      record = { target: "local_http", endpoint, started_at: new Date().toISOString(), finished_at: "", calls: [] };
      for (const request of E2E_CASES) record.calls.push({ request, result: await client.callTool({ name: request.name, arguments: request.arguments }) });
      record.finished_at = new Date().toISOString();
    }
    const result = verifyE2e(record);
    if (args.includes("--record")) {
      await mkdir("outputs/e2e", { recursive: true });
      const file = `outputs/e2e/local-${record.finished_at.replaceAll(":", "-")}.json`;
      await writeFile(file, JSON.stringify(record, null, 2) + "\n", { flag: "wx" });
      console.log(JSON.stringify({ recording: file }));
    }
    console.log(JSON.stringify({ ...result, execution: record.target === "local_http" ? "new_live_network_run" : "validation_of_supplied_native_call_recording" }));
  }
} catch (error) {
  console.error(JSON.stringify({ status: "failed", check: error instanceof E2eFailure ? error.message : "unexpected_failure", credentials_logged: false }));
  process.exitCode = 1;
} finally {
  await client?.close();
  if (server) await new Promise<void>(resolve => server!.close(() => resolve()));
}
