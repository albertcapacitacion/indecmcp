import { createServer } from "node:http";
import { handleRequest } from "../src/index.js";
import { IndecClient } from "../src/indec.js";
import { MemoryState } from "../src/state.js";
const state = new MemoryState();
const client = new IndecClient(process.env.INDEC_API_TOKEN ?? "");
export function startServer(port = 8787) {
  const server = createServer(async (incoming, outgoing) => {
    try {
      if (!incoming.headers.host || !["127.0.0.1", "localhost"].includes(incoming.headers.host.split(":")[0])) { outgoing.writeHead(403).end(); return; }
      const chunks: Buffer[] = []; let size = 0;
      for await (const chunk of incoming) {
        size += chunk.length;
        if (size > 16_384) { outgoing.writeHead(413).end(); return; }
        chunks.push(chunk);
      }
      const headers = new Headers();
      for (const [key, value] of Object.entries(incoming.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(",") : value);
      // Only the loopback development harness supplies a local test identity.
      const request = new Request(`http://${incoming.headers.host}${incoming.url}`, { method: incoming.method, headers, ...(["GET", "HEAD"].includes(incoming.method ?? "GET") ? {} : { body: Buffer.concat(chunks) }) });
      const response = await handleRequest(request, { client, state, userId: "loopback-development" }, true);
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body) { const reader = response.body.getReader(); while (true) { const next = await reader.read(); if (next.done) break; outgoing.write(next.value); } }
      outgoing.end();
    } catch { outgoing.writeHead(500).end("Request failed"); }
  });
  server.requestTimeout = 15_000; server.headersTimeout = 10_000;
  return server.listen(port, "127.0.0.1");
}
if (process.argv[1]?.endsWith("dev.ts")) { startServer(); console.log("INDEC MCP local endpoint: http://127.0.0.1:8787/mcp"); }
