# Native plugin integration verification

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
| First user selected-plugin data test | Initially reported MCP unavailable and a web-browsed answer; not proof of MCP |
| Authenticated native data call | Verified through the installed INDEC MCP tools after runtime fix |
| Hosted D1 cache | Verified cache hit with unchanged original retrieval timestamp |
| Exact unavailable month | 2026-10 query returned unavailable, without an older-month substitution |
| Wage tools | Earlier 404 no longer reproduces; both now return real data/calculations through the hosted plugin |

The wage-enabled deployment and seven successful native verification cases from 2026-11-03 are recorded in `examples/native-wages-2026-11-03T05-54-02.780Z.json`; see DEPLOYMENT.md. Original 2026-11-02 samples retain the earlier 404 observations rather than rewriting that evidence.

No conclusion about successful hosted data retrieval is drawn from a matching web answer. Publication dates or schedules mentioned by a browsing answer are not metadata supplied by this API.

The first real native invocation reached the Worker, confirming that authentication and tool attachment worked. Redacted network diagnostics identified a runtime compatibility failure: Workers does not implement redirect mode error. Manual redirect mode plus explicit rejection of 3xx responses fixed it without permitting credential forwarding. Subsequent native calls returned real official values, including source and retrieval metadata. See the native Sites recording in docs/examples/.

For future connection problems, inspect Plugins → Personal → Created by you → INDEC MCP and the six listed tools. A Reconnect option in the ordinary account menu is not itself an error status. Use a fresh supported Work/Codex conversation, explicitly select INDEC MCP, and ask it to call get_latest_inflation and return reference_period, source, retrieved_at and cache fields without browsing.

Keep the existing Site and plugin IDs. Do not create another app, rewrite the installed plugin cache, add the INDEC JWT to client config, forge an identity header, or remove authentication to work around activation.

If the plugin is connected and its tools still do not attach, retain the deployment/plugin IDs from DEPLOYMENT.md, the user prompt, and sanitized discovery/listing outcomes for OpenAI support. Do not send credentials or raw request headers. The available management connector does not expose the app's OAuth connection status or a reconnect operation.
