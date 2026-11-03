# Example MCP requests

JSON-RPC shown below uses legacy Streamable HTTP after initialize. Modern clients use server/discover and the SDK's per-request metadata envelope. Prefer the SDK rather than constructing protocol envelopes by hand.

```json
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_latest_inflation","arguments":{}}}
```

Other tool arguments:

```json
[
  {"name":"get_inflation_history","arguments":{"start_period":"2026-01","end_period":"2026-09","measure":"year_to_date","limit":12}},
  {"name":"get_basic_basket","arguments":{"basket":"cbt","period":"2026-09"}},
  {"name":"get_series","arguments":{"series_id":"unemployment.eph.31_agglomerations","start_period":"2025-Q1","end_period":"2026-Q2","limit":8}},
  {"name":"get_series","arguments":{"series_id":"activity.emae.seasonally_adjusted.index","limit":12}},
  {"name":"get_wage_growth","arguments":{"sector":"total","window":"year_over_year","end_period":"2026-08"}},
  {"name":"compare_wages_inflation","arguments":{"sector":"total","window":"year_over_year","end_period":"2026-08"}}
]
```

Run `npm run test:live -- --record` for full real tool requests/responses, including the actual retrieval timestamps and source URLs. The first live MCP call verified a published value of 1.9 percent for reference month 2026-09 on 2026-11-02. It did not establish a publication date or an October observation.

The wage tools currently return `UPSTREAM_NOT_FOUND`; their documented INDEC endpoint returned HTTP 404 in authenticated live checks. Fixture tests are synthetic and are not proof of live wage integration.

`examples/native-sites-2026-11-02T23-30-14.749Z.json` records actual calls through the installed Sites-created INDEC MCP plugin. It includes the successful latest IPC call, a hosted cache hit, official history/basket/activity/unemployment results, an unavailable exact month and the two actual wage endpoint failures. This establishes deployed integration separately from the local HTTP client recording.
