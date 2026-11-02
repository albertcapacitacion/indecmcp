import assert from "node:assert/strict";
import { SITE_HOST } from "../src/index.js";
// This verifies the access boundary only, not an authenticated tool result.
const response = await fetch(`https://${SITE_HOST}/mcp`, {
  method: "POST", redirect: "manual", signal: AbortSignal.timeout(15_000),
  headers: { Accept: "application/json, text/event-stream", "Content-Type": "application/json" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" })
});
await response.body?.cancel();
assert([401, 403].includes(response.status), "Anonymous hosted MCP requests must be rejected.");
console.log(JSON.stringify({ verified: "Anonymous hosted MCP access is rejected", status: response.status, native_authenticated_tool_call: "still requires verification" }));
