# Security

Report security concerns privately to the publisher contact, **pending configuration before public release**. Do not publish credentials in issues or chat. This placeholder is not an active support address.

The INDEC JWT is read only by the server-side upstream client. Requests target an exact allowlist under `https://api.indec.gob.ar/v1/`; redirects are rejected. MCP callers cannot set credentials, raw filters, URLs, SQL, datasets outside the catalog, HTTP methods or response formats.

Sites authenticates MCP connections and supplies a Site-scoped user identity. Tool execution requires that identity. Host/origin checks protect the MCP route. The standalone local development server listens only on 127.0.0.1; it must never be used as a public deployment.

Production rate limits and request budgets are shared through atomic D1 statements. Every successful tool invocation, including a cache hit, consumes its limits. Missing storage fails closed. SDK discovery/listing is handled by the Sites access boundary; application rate limits apply to tool calls. Platform-level request/CPU/billing limits still require operator configuration before general public access.

Logging is limited to fixed events, tool names, sanitized error codes and redacted network exception reasons. Credential values, Bearer values, JWTs and URLs are removed from network diagnostics. Raw authorization headers, input bodies, upstream response bodies, email addresses and user names are never application logs. Statistical result metadata contains source URLs without credentials. SQL uses bound parameters only. Upstream response bodies and request bodies are byte bounded, including chunked responses.

Release gates: verify native Sites OAuth through the public submission portal; verify identity header integrity at the Sites boundary; run deployed D1/authentication tests; configure publisher/legal/support details; confirm INDEC API usage and redistribution terms permit the proposed public service. These gates are not claims of completed validation.
