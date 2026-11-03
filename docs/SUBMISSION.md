# Public plugin submission plan

Status: **draft; not submitted, approved, or published in the public directory**.

Use the one public directory shared by ChatGPT and Codex. Sites hosting, a native associated private plugin, directory submission, approval, and directory publication are separate milestones. Do not announce a public plugin until the approved listing has actually been published.

## Package

The package under `plugin/` uses portable root `plugin.json`, remote `mcp.json`, one focused skill, and original branding assets. Public submission must use **With MCP** and the exact Sites-supported production HTTPS endpoint. Do not submit an `.app.json` reference to the private registered app, lifecycle hooks, source code, credentials, or local execution requirements.

`npm run package:plugin -- --draft` creates an inspectable ZIP with explicitly pending publisher values. `npm run package:plugin` fails until publisher/contact/review metadata and runtime verification gates are complete. A draft ZIP is not submission-ready.

English is the base listing language. Spanish subtitle/description translations are included under `extensions.com.openai.publication.translations.es-AR`. Current documentation says translations are retained but do not yet change the displayed directory text. The approved short subtitles fit 30 characters. Keep the longer Spanish sentence in the description.

Logo requirements: square PNG/JPEG/WebP/SVG, at least 48×48, maximum 5 MiB per file; raster dimensions at most 4096×4096. SVG requires square numeric dimensions/viewBox. Include both logo and composerIcon. The original chart/wordmark direction was approved; no institutional INDEC logo or endorsement is implied.

## Publisher and listing gates

- Replace publisher name, verified developer identity, contact, homepage/support/privacy/terms URLs and repository placeholders as appropriate. All four listing URLs must be accessible HTTPS URLs under the same publisher identity.
- Complete individual/business verification and submission permissions in the OpenAI Platform Dashboard. Never include reviewer passwords, INDEC JWTs, client secrets or bearer headers in the ZIP.
- Complete privacy/terms/security support drafts and confirm INDEC's usage/redistribution terms for the public service.
- Choose country availability explicitly. The intended service is usable internationally; do not restrict it to Argentina by accident.
- Verify the native Sites authentication settings against the public submission portal. The portal supports OAuth, mixed access or no auth; it does not offer a generic bearer/API-key entry flow. Never label this protected server unauthenticated to bypass that requirement.
- Host the exact portal-issued domain challenge at the required `/.well-known/openai-apps-challenge` location using a supported Sites route. No challenge value is invented or committed before it is issued.

## Review evidence

Provide exactly five positive and three negative initial MCP review cases, a reviewer-accessible video walkthrough, release notes, and any secure reviewer account required by the portal. Cases in `plugin/review-cases.json` describe reproducible expectations rather than inventing fixed future values. Positive coverage includes wage/inflation period alignment; negative coverage checks exact unavailable periods without invented or substituted data. All six tools have real local MCP integration evidence; hosted wage verification is tracked separately in release-status.json.

1. Upload the ZIP with its MCP connection declared from the start.
2. Complete domain verification and authentication, scan all tools, and fix required findings.
3. Verify input/output schemas, read-only/destructive/open-world annotations and tool independence. `get_series` must expose only its explicit reviewed catalog.
4. Test native ChatGPT/Codex installation and all supported client paths. Capture real official data and explicit upstream failures; fixtures do not prove integration.
5. Submit for review. After approval, choose Publish in the portal and verify the directory URL/name before announcing publication.

Official references, checked 2026-11-02:

- https://learn.chatgpt.com/docs/extend/mcp
- https://developers.openai.com/plugins/build/plugins
- https://developers.openai.com/plugins/deploy/submission
- https://developers.openai.com/plugins/plugin-guidelines
- https://developers.openai.com/plugins/deploy/app-review
