import { hostHeaderValidationResponse, originValidationResponse } from "@modelcontextprotocol/server";
import { IndecClient } from "./indec.js";
import { mcpHandler, type Dependencies } from "./mcp.js";
import { D1State } from "./state.js";
import { publicPages } from "./generated-pages.js";

export const SITE_HOST = "indec-mcp.albertcapacitaciondi.chatgpt.site";
const SECURITY_HEADERS = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" };

export async function handleRequest(request: Request, deps: Dependencies, local = false, domainChallenge?: string): Promise<Response> {
  const allowed = local ? ["127.0.0.1", "localhost"] : [SITE_HOST];
  const rejected = hostHeaderValidationResponse(request, allowed) ?? originValidationResponse(request, allowed);
  if (rejected) return rejected;
  const path = new URL(request.url).pathname;
  if (path === "/.well-known/openai-apps-challenge" && domainChallenge && /^[^\r\n]{1,2048}$/.test(domainChallenge)) return new Response(domainChallenge, { headers: { ...SECURITY_HEADERS, "Content-Type": "text/plain; charset=utf-8" } });
  if (publicPages[path]) return new Response(publicPages[path], { headers: { ...SECURITY_HEADERS, "Content-Type": "text/plain; charset=utf-8" } });
  if (path === "/healthz") return Response.json({ service: "indec-mcp", version: "0.1.0", status: "running" }, { headers: SECURITY_HEADERS });
  if (path !== "/mcp") return new Response("INDEC MCP — Official Argentina statistics. MCP endpoint: /mcp", { status: path === "/" ? 200 : 404, headers: SECURITY_HEADERS });
  const response = await mcpHandler(deps).fetch(request);
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) headers.set(key, value);
  return new Response(response.body, { status: response.status, headers });
}

export default {
  async fetch(request: Request, bindings: { INDEC_API_TOKEN?: string; OPENAI_DOMAIN_CHALLENGE?: string; DB?: D1Database }): Promise<Response> {
    try {
      if (!bindings.DB && new URL(request.url).pathname === "/mcp") {
        return Response.json({ error: "SERVICE_NOT_CONFIGURED" }, { status: 503, headers: SECURITY_HEADERS });
      }
      return await handleRequest(request, {
        client: new IndecClient(bindings.INDEC_API_TOKEN ?? ""), state: new D1State(bindings.DB!),
        userId: request.headers.get("oai-authenticated-user-id")
      }, false, bindings.OPENAI_DOMAIN_CHALLENGE);
    } catch {
      console.error('{"event":"request_failure"}');
      return Response.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503, headers: SECURITY_HEADERS });
    }
  }
};
