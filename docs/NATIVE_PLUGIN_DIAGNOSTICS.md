# Native plugin activation diagnostic

The hosted code is published privately through Sites. This is the same server that passed a real local HTTP MCP client with authenticated INDEC data. The following observations are separate:

| Check | Result |
| --- | --- |
| Hosted deployment | Succeeded; MCP enabled; INDEC secret revision applied |
| Sites D1 migration | Both operational tables present |
| Native server/discover | HTTP 200 |
| Native tools/list | HTTP 200 |
| Native plugin installation | Installation tool reports already installed; cached package exists |
| Cached app mapping | References the same asdk_app_sites ID as the Sites-created plugin |
| App permission | Uses existing low-risk default; no override was introduced |
| Local app enable/disable override | No override for this app was found |
| Anonymous production MCP request | HTTP 401 |
| User selected-plugin data test | User reported MCP unavailable and a web-browsed answer |
| Data invocation reaching production | Not yet observed |

No conclusion about successful hosted data retrieval is drawn from a matching web answer. Publication dates or schedules mentioned by a browsing answer are not metadata supplied by this API.

Next check: in Plugins → Personal → Created by you → INDEC MCP, inspect whether Connect/Reconnect is offered and whether the six tools are listed. Complete the normal native connection if required, then use a fresh supported Work/Codex conversation and explicitly select INDEC MCP. Ask it to call get_latest_inflation and return its reference_period, source, retrieved_at and cache fields without browsing. A browser answer alone does not complete this test.

Keep the existing Site and plugin IDs. Do not create another app, rewrite the installed plugin cache, add the INDEC JWT to client config, forge an identity header, or remove authentication to work around activation.

If the plugin is connected and its tools still do not attach, retain the deployment/plugin IDs from DEPLOYMENT.md, the user prompt, and sanitized discovery/listing outcomes for OpenAI support. Do not send credentials or raw request headers. The available management connector does not expose the app's OAuth connection status or a reconnect operation.
