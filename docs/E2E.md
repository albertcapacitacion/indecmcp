# End-to-end call tests

The shared nine-case suite covers all six tools: latest national inflation, a second identical call to check caching, official accumulated inflation, wage growth, a same-period real-wage comparison, GBA CBT, quarterly unemployment, adjusted EMAE and a missing exact January 1900 comparison. Assertions check response schemas, official source/retrieval metadata, exact raw values/flags, coverage/frequency/adjustment, bounded ordered results, preserved cache timestamps and independently recalculated real growth and percentage-point gap. No fixed future economic values are expected. An unavailable live dataset or failed call fails the suite rather than being skipped.

## One-command local HTTP run with real INDEC

Configure the ignored local INDEC_API_TOKEN, then run:

```powershell
npm run test:e2e
npm run test:e2e -- --record
```

This starts a temporary loopback server on an ephemeral port, connects with the real MCP SDK HTTP transport, discovers the read-only tools, calls all nine cases and closes the client/server. INDEC requests use the real API and token. There is no mock fetch. Local authentication and state remain the existing explicit development identity and memory adapter; this does not test production Sites authentication or D1. Success reports target local_http and execution new_live_network_run. Optional uniquely named recordings go under ignored outputs/e2e/; nothing overwrites official observations or prior evidence.

## Hosted run through the installed plugin

Use a Codex/ChatGPT conversation with INDEC MCP connected. Ask:

> Run the hosted INDEC MCP E2E suite from docs/E2E.md. Execute the cases from scripts/e2e-checks.ts through the actual installed plugin, save a new recording under outputs/e2e/, and run the deterministic validator. Do not browse for substitute values, reuse old tool results as a new run, read connection credentials, forge identity headers or change the Site's access controls.

1. Print the ordered plan with `npm run test:e2e -- --plan` (this prints the plan only; it is not a test pass).
2. Record started_at in UTC, call each real native INDEC MCP tool with the listed arguments, and retain its actual structuredContent and isError. The first two inflation calls must be sequential and immediate; independent remaining cases can run concurrently. Do not replace errors with fixtures. Nine calls are below the normal 30/minute per-client limit.
3. Set finished_at after the calls. Write a new JSON file, never overwrite an existing recording. Its shape is:

```json
{
  "target": "native_sites",
  "endpoint": "https://indec-mcp.albertcapacitaciondi.chatgpt.site/mcp",
  "started_at": "<actual ISO UTC run start>",
  "finished_at": "<actual ISO UTC run finish>",
  "calls": [
    {
      "request": { "id": "latest_inflation", "name": "get_latest_inflation", "arguments": {} },
      "result": { "isError": false, "structuredContent": "<actual object, not this placeholder string>" }
    }
  ]
}
```

Include all nine calls in plan order. The response objects must be the complete actual structured outputs, including raw observations, source queries and original cache metadata. Do not put tokens or raw request headers in recordings.

4. Run `npm run test:e2e:hosted -- outputs/e2e/<new-recording>.json`. A nonzero exit or status failed fails the run. Only report success when the fresh native calls and validator both succeed. A cache-expiry boundary between the two inflation calls may require a fresh run; do not edit results to make it pass.

The hosted command validates the supplied recording; it does not independently authenticate or make remote calls. Revalidating an old recording is an audit, not a new E2E run. The native connector is the supported authenticated caller; no Site service token or the upstream INDEC token substitutes for it. This tests the existing connected plugin, deployed server, real INDEC and hosted cache. Fresh installation/login, third-party-client OAuth and natural-language tool-selection quality remain separate checks.

`npm test` includes negative unit checks proving the validator rejects wrong calculations, mismatched periods, omitted cases, fabricated unavailable values, lost flags and unexpected endpoints. Those synthetic fixtures are not live integration evidence.

## Verified run on 2026-11-03

- New local HTTP run: 9 calls / all 6 tools passed; recording `outputs/e2e/local-2026-11-03T06-09-34.892Z.json`.
- New native Sites run: 9 calls / all 6 tools passed, followed by the shared validator; recording `outputs/e2e/hosted-2026-11-03T06-10-03.803Z.json`.
- The hosted run used the existing connected INDEC MCP plugin and production endpoint. Both initial inflation calls were cache hits retaining the same original observation/retrieval timestamp. The missing January 1900 comparison returned unavailable with null calculations. No credentials or authentication settings were changed.
- These ignored recordings are local artifacts, not automatically distributed with a clone. Use the procedure above for a new run. All 44 offline automated tests and TypeScript checks also passed.
