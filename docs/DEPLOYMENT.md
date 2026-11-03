# Deployment verification

Target: ChatGPT Sites. Project ID is tracked in `.openai/hosting.json`.

Verified private production origin: https://indec-mcp.albertcapacitaciondi.chatgpt.site

The INDEC_API_TOKEN runtime entry was configured as a Sites secret on 2026-11-02. Its value is not stored in this document or the deployment artifact. Local development uses a separately ignored `.env`.

Verified functional native Sites publication: version 4, deployment `appgdep_6ae91ce772588191b858b3636ba1b28f`, source commit `17750253dede825a8e31787717d1f781588ca6a4`. Deployment succeeded with MCP enabled and secret environment revision 1. Both D1 tables (`response_cache`, `usage_limits`) exist. A later documentation-only publication can reference these same functional verification results.

Native MCP URL and OAuth resource: https://indec-mcp.albertcapacitaciondi.chatgpt.site/mcp

Sites-created plugin: `plugin_asdk_app_sites_32caa3104d248191873ae37d7e75653d`. Registered app: `asdk_app_sites_32caa3104d248191873ae37d7e75653d`. The native installation tool reports already installed; its cached package references the correct app. App permissions use the existing low-risk default. Native server/discover and tools/list requests both reached the deployed endpoint and returned HTTP 200.

**Native data integration verified:** the installed INDEC MCP tools became available in this chat. The first hosted attempt reached the Worker but failed because the runtime does not support `redirect: "error"`. The production adapter now uses `manual` and explicitly rejects all 3xx responses. The hosted tool then returned 1.9 percent national monthly IPC for reference month 2026-09, retrieved at 2026-11-02T23:30:14.749Z. A second call hit shared D1 cache with the same retrieval time.

Hosted calls also verified official year-to-date history, GBA CBT per adult equivalent, quarterly EPH unemployment (including provisional notes), and the seasonally adjusted EMAE index. A query specifically for 2026-10 returned unavailable with no substitute. Both wage tools returned the actual documented endpoint's HTTP 404. Full structured evidence is in `examples/native-sites-2026-11-02T23-30-14.749Z.json`.

The earlier selected-plugin chat answered through web browsing; that earlier answer was not MCP verification. A connected account's ordinary Reconnect menu item alone was not evidence of expired authentication.

An owner-private Site service-access probe received HTTP 401 at the MCP boundary. Service-access credentials are not a substitute for the native user MCP/OAuth connection. No user identity header was forged and access controls were not relaxed.

Pending: generic third-party-client OAuth; public submission authentication/domain verification; wage endpoint restoration and exact sector mappings; publisher/policy completion; public directory review and publication. The running service is private, and directory publication has not occurred.

See NATIVE_PLUGIN_DIAGNOSTICS.md for the bounded diagnostic evidence and remaining connection check.
