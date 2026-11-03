# INDEC MCP

Official Argentina statistics for ChatGPT, Codex and compatible MCP clients. An independent Apache-2.0 project using official INDEC data; it is not an INDEC product or endorsement.

Public name: **INDEC MCP**. English subtitle: **Official Argentina statistics**. Spanish subtitle: **Estadísticas de Argentina**. Spanish description: **Estadísticas oficiales de Argentina, consultables desde ChatGPT y Codex.**

## Status

The first national monthly inflation slice has passed an actual HTTP MCP client call against authenticated INDEC data. All six V0 tool names are exposed. Inflation, baskets, activity and unemployment have live verified mappings. **Wage growth and wage/inflation comparison are blocked:** `/indice_salarios` from the supplied specification returns HTTP 404. Those tools return explicit errors; they do not produce numeric results or use another source. This is not a claim of a complete V0 or public directory approval.

The private Sites deployment and native plugin creation/installation are verified. Real authenticated calls through the installed INDEC MCP plugin return official inflation, basket, unemployment and activity observations. Hosted cache hits retain the original retrieval time, and an unavailable exact month stays unavailable. See [deployment verification](docs/DEPLOYMENT.md) and the native Sites recording under `docs/examples/`.

The standalone GitHub repository is `albertcapacitacion/indecmcp` (existing name retained by user approval); the package identifier is `indec-mcp`. It has no dependency on the newspaper's editorial system.

## Local development

Node.js 22.13+ is required. From this checkout:

```powershell
npm ci --cache .local/npm-cache
Copy-Item .env.example .env
# Edit .env privately and set INDEC_API_TOKEN. Do not commit or share it.
npm run typecheck
npm test
npm run dev
```

The local endpoint is `http://127.0.0.1:8787/mcp`. The development adapter binds only to loopback and supplies an explicit development identity. It uses memory-only rate limits/cache; it is not a production hosting path. Stop it with Ctrl+C.

```powershell
npm run verify:selector
npm run test:live
npm run test:live -- --record
npm run build
npm run docs:mapping
npm run package:plugin -- --draft
```

`npm test` uses synthetic fixtures, without network access. `test:live` uses a real SDK client over local HTTP and real INDEC requests. Recording writes a new, uniquely named sample to `docs/examples/`; it never overwrites prior recordings or claims they are newspaper publication archives.

## Tools

| Tool | Inputs | Behavior |
| --- | --- | --- |
| get_latest_inflation | `{}` | Latest available national monthly headline IPC percentage change |
| get_inflation_history | Optional start_period/end_period (YYYY-MM), measure, limit | Published monthly, annual, year-to-date measures or index levels |
| get_wage_growth | sector, end_period, window | Explicit upstream-unavailable error pending verified wage endpoint |
| compare_wages_inflation | sector, end_period, window | Explicit upstream-unavailable error; never compares unaligned or invented observations |
| get_basic_basket | basket: cba/cbt; optional period | GBA cost in ARS **per adult equivalent**, not a national family cost |
| get_series | Enumerated series_id, optional period bounds, limit | Fixed IPC/basket/EMAE/unemployment catalog, maximum 240 observations |

Every tool publishes JSON input/output schemas and read-only, destructive and open-world annotations. The SDK serves MCP 2026-07-28 discovery and legacy Streamable HTTP from the same definitions. GET/DELETE session operations are unsupported because the server is stateless. See [tool contract](docs/TOOL_CONTRACT.md), [API mapping](docs/API_MAPPING.md), and [examples](docs/EXAMPLES.md).

## Statistical interpretation

- Latest available reference month can lag the previous calendar month. No publication timestamp is inferred from retrieval time.
- Original monthly/quarterly frequencies, coverage and adjustment are explicit. EPH covers 31 urban agglomerations, not the entire population.
- Official `v_acum` and `v_ia` rates are returned directly. Accumulation is never a sum of monthly percentages. Calculations from rounded levels must be labeled as calculated and may differ from official releases.
- Nulls, provisional notes and extra `*_null` signs survive validation. Missing exact periods return unavailable; no older month is silently substituted.
- Numerical helpers test index growth `(end/start-1)*100` and real wage growth `((1+w/100)/(1+p/100)-1)*100`. Percentage-point differences are separate. Wage helpers are not enabled as live numerical tools until mappings are verified.
- No historical publication vintage can be reconstructed from this operational cache.

## Caching and safeguards

Successful responses are cached for one hour in Sites-managed D1. Cache hits keep the **original INDEC retrieval timestamp** and fixed expiry. Errors are not cached; expired responses are never used as silent fallbacks. A latest-null response remains null. A missing exact period can remain unavailable until its one-hour cache expires.

Each identity receives 30 tool calls/minute, including cache hits. Global tool budget: 300/minute. Upstream request budgets: 120/minute and 3000/day. Counters use atomic D1 upserts, shared across isolates. No in-memory production fallback exists. A counter/storage failure fails closed.

Request bodies are capped at 16 KiB; upstream bodies at 2 MB and 1000 rows/page. Upstream timeout is eight seconds per request, redirects are prohibited and there are no automatic retries. History uses at most three pages of up to 100 rows (241 fetched rows maximum, 240 returned), ordered by the full unique key. Truncation is explicit. Duplicate periods or a changing total row count fail closed; no complete atomic publication vintage is implied by pagination.

## ChatGPT Sites deployment

Sites is the only production hosting target. No separate hosting account or provider deployment is needed. The native Worker artifact is `dist/server/index.js`, with `.openai/hosting.json` and the schema-only `drizzle/` migrations. The manifest declares `capabilities: ["mcp"]`, D1 binding `DB`, and no R2 storage. This is a small backend service; no frontend framework is needed.

1. Create/reuse the Site ID recorded in `.openai/hosting.json`. Never copy its identity into an unrelated project.
2. Configure **INDEC_API_TOKEN** through native Sites runtime settings, marked secret. Never put the value in source, hosting.json, URLs, plugin manifests or logs. Obtain a JWT through the INDEC portal/profile as described in `docs/api-1.json`; rotate through that portal when needed. Local `.env` is separate from hosted settings.
3. Run typecheck, tests and the build. Use the Sites source workflow to push the exact commit and package its artifact. Keep temporary output under ignored `.local/`.
4. Save/deploy that artifact using native Sites tools. Sites provisions D1 and applies schema migrations. Do not deploy directly with Wrangler or another provider.
5. On publication, Sites creates/refreshes the associated plugin. Retrieve its connection using `get_site(include_mcp_connection: true)`, install/connect it, and make an authenticated tool call.
6. Verify public review authentication, domain challenge and cross-client access before opening public distribution. Native installation and directory approval are different milestones.

Production relies on identity inserted by the Sites authentication boundary, and rejects anonymous tool execution. The origin must remain Sites-managed: do not expose the Worker directly with client-supplied identity headers. No additional OAuth server or shared client API key is implemented.

See [security](SECURITY.md), [privacy draft](docs/PRIVACY.md), [submission plan](docs/SUBMISSION.md), [deployment state](docs/DEPLOYMENT.md), and [Codex configuration](examples/codex.toml).

## Newspaper integration

The newspaper can consume the same MCP tools through a supported authenticated service connection. Editorial content and immutable publication snapshots remain separate. See [integration plan](docs/NEWSPAPER_INTEGRATION.md).
