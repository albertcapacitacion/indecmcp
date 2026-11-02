# Deployment verification

Target: ChatGPT Sites. Project ID is tracked in `.openai/hosting.json`.

Verified private production origin: https://indec-mcp.albertcapacitaciondi.chatgpt.site

The INDEC_API_TOKEN runtime entry was configured as a Sites secret on 2026-11-02. Its value is not stored in this document or the deployment artifact. Local development uses a separately ignored `.env`.

Verified native Sites publication: version 2, deployment `appgdep_6ae91957f53c819191bd103aeaa4a4a5`, source commit `567af5d01b4eaaba387d823b6d3fccb3ed28c516`. Deployment succeeded with MCP enabled and secret environment revision 1. Both D1 tables (`response_cache`, `usage_limits`) exist.

Native MCP URL and OAuth resource: https://indec-mcp.albertcapacitaciondi.chatgpt.site/mcp

Sites-created plugin: `plugin_asdk_app_sites_32caa3104d248191873ae37d7e75653d`. Registered app: `asdk_app_sites_32caa3104d248191873ae37d7e75653d`. The native installation tool reports already installed; its cached package references the correct app. App permissions use the existing low-risk default. Native server/discover and tools/list requests both reached the deployed endpoint and returned HTTP 200.

**Unresolved:** the user selected the plugin in a fresh chat, but the chat reported MCP unavailable and answered through web browsing. That answer is not MCP verification. No data tool invocation from that test reached the Worker. This existing chat also does not expose the new plugin's tools.

An owner-private Site service-access probe received HTTP 401 at the MCP boundary. Service-access credentials are not a substitute for the native user MCP/OAuth connection. No user identity header was forged and access controls were not relaxed.

Pending: native plugin connection/activation and authenticated hosted tool call; live shared D1 cache/counter behavior through that call; cross-client OAuth; public submission authentication/domain verification; wage endpoint restoration; publisher/policy completion; public directory review and publication. The running service is private, and directory publication has not occurred.

See NATIVE_PLUGIN_DIAGNOSTICS.md for the bounded diagnostic evidence and remaining connection check.
