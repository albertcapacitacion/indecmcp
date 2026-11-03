<img src="https://www.indec.gob.ar/Images_WEBINDEC_2026/Logo/home_header_logo.png" alt="INDEC logo" width="280">

**Independent project. Not affiliated with or endorsed by INDEC.**

**<img src="https://flagcdn.com/w40/gb.png" alt="English" width="24"> EN** · [<img src="https://flagcdn.com/w40/ar.png" alt="Español" width="24"> ES](README.es.md)

# INDEC MCP

**Official Argentine statistics, in your chat.** Ask about inflation, wages, basic baskets, unemployment and economic activity. Get figures with reference periods and official sources, then turn them into charts, comparisons or downloadable files.

**v0.1.0**

## Install and run locally

Run the INDEC MCP server locally from this repository.

**Requirements:** Git, Node.js 22.13+ (including npm), and an INDEC API token. AI client connection requirements are listed in step 4.

### 1. Clone the repository and install dependencies

Open PowerShell in a projects folder outside OneDrive or Google Drive, then run:

```powershell
git clone https://github.com/albertcapacitacion/indecmcp.git
cd indecmcp
npm ci --cache .local/npm-cache
Copy-Item .env.example .env
```

These commands are for a fresh clone. If you already have a `.env` file, edit it instead of copying over it.

### 2. Get your INDEC API token

**Get the key from the official INDEC API portal: [https://api.indec.gob.ar/](https://api.indec.gob.ar/).** Register, verify your email, then generate a JWT token from your profile settings.

Open the `.env` file in the cloned repository and set `INDEC_API_TOKEN` to your token:

```dotenv
INDEC_API_TOKEN=your_indec_token_here
```

Replace the placeholder with your actual token. This is an **INDEC token**, separate from your ChatGPT or Claude account. Keep it in the gitignored `.env` file; do not paste it into chat, commit it, or put it in your AI client's configuration.

### 3. Start the server

```powershell
npm run dev
```

The server runs at `http://127.0.0.1:8787/mcp`. Keep this terminal open while using it; press **Ctrl+C** to stop it. This local development server listens only on your computer.

### 4. Connect an AI client

Configure an MCP connection in the chosen AI client:

| Client | What local use requires |
| --- | --- |
| **Codex running locally** | Connect to `http://127.0.0.1:8787/mcp` using the repository's [example MCP configuration](examples/codex.toml). See the [official MCP setup instructions](https://learn.chatgpt.com/docs/extend/mcp). |
| **ChatGPT in a browser** | Cannot connect directly to your computer's `127.0.0.1` address. A connection such as [OpenAI's Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) requires additional setup, a runtime API key, and the relevant account/workspace permissions. This repository does not include a verified ChatGPT tunnel setup. |
| **Claude Desktop** | [Supports local MCP servers](https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop), but this repository does not yet include a verified Claude connection setup or an installable desktop extension. Cloning alone does not connect it to Claude. |

Use your account for the chosen AI client. A ChatGPT subscription does not provide Claude access. The statistics server runs locally, but it still needs internet access to INDEC; the AI model runs through the chosen provider.

See [setup and development](docs/DEVELOPMENT.md) for technical details and checks.

## Try it in ChatGPT

After connecting INDEC MCP to ChatGPT, copy a prompt below and replace the amounts and dates with your own.

### Calculate purchasing power

> Use INDEC MCP to create an interactive purchasing-power calculator. Start with ARS 200000, December 2024 to December 2025. Use official national IPC index levels: amount * ending index / starting index. Let me change the amount and months. Show the selected dates and official source. Keep missing inputs unavailable; treat zero as valid. Answer in English.

![Purchasing-power calculator in ChatGPT with editable amount and months, equivalent amount, and official index values](docs/images/purchasing-power-chatgpt.png)

**Next:** “Export an editable Excel calculator using ARS 200000, December 2024 to December 2025. Include formulas, original index data and sources. Keep missing inputs and dependent results unavailable.” Repeat your chosen inputs when exporting.

### Turn inflation data into charts and Excel

> Use INDEC MCP to create a downloadable Excel workbook with Argentina's national inflation for all 12 months of 2025. Include monthly and official accumulated rates, source links and a monthly bar chart. Add a price-level chart rebased to December 2024 = 100 using official IPC index levels, not chained rounded rates. Label calculated values and keep missing inputs and dependent results unavailable. Answer in English.

![ChatGPT preview of an editable 2025 inflation workbook with monthly inflation bars and a rebased price-level chart](docs/images/inflation-excel-chatgpt.png)

Real ChatGPT examples tested on November 3, 2026. Charts, interactive controls and file exports depend on your chat's capabilities. If controls are unavailable, ask for a table or Excel file. Screenshots use the original response language.

## More prompts to copy

| Want to… | Ask… |
| --- | --- |
| Understand the latest inflation | Use INDEC MCP. What is the latest available monthly inflation in Argentina? Explain it with an example in pesos. Show the reference month and official source. |
| Compare wages with inflation | Use INDEC MCP to compare public-sector wage growth with national inflation over the latest matching annual period. Show real wage change separately from the percentage-point gap, with dates and sources. |
| Get an economic briefing | Use INDEC MCP to summarize the latest inflation, wages, basic food and total baskets, unemployment and economic activity. Show each indicator's reference period, units, coverage and official source. Flag unavailable figures. |

**Check the period, units and coverage before sharing.** Latest available data may describe an earlier month or quarter. Keep official observations separate from calculations and check downloaded files.

[Nine step-by-step workflows](docs/START_HERE.md) · [Setup and development](docs/DEVELOPMENT.md) · [Supported tools](docs/TOOL_CONTRACT.md) · [Security](SECURITY.md) · [Privacy](docs/PRIVACY.md)

**Help improve the first version:** [open an issue](https://github.com/albertcapacitacion/indecmcp/issues/new) with your prompt, expected result and what happened. Remove personal information and credentials.

Independent open-source project · [Apache-2.0](LICENSE) · Uses [official INDEC data](https://api.indec.gob.ar/); not an INDEC product or endorsement.
