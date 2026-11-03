**<img src="https://flagcdn.com/w40/gb.png" alt="English" width="24"> EN** · [<img src="https://flagcdn.com/w40/ar.png" alt="Español" width="24"> ES](START_HERE.es.md) · [README](../README.md)

# Start here: everyday questions with INDEC MCP in ChatGPT

Use INDEC MCP to bring official Argentine statistics into your conversation. Then ask ChatGPT to explain them, draw charts, compare them with your own numbers, or make a file you can keep.

## Your first question

Open a new ChatGPT chat. Select **INDEC MCP** from the apps menu or type `@INDEC` and select it. Copy this:

> Use INDEC MCP. What is the latest available monthly inflation figure for Argentina? Explain what it means with a simple example in pesos. Show the month the figure describes and the official source. Answer in English.

You can ask in your preferred language. If the answer comes back in another language, add **“Answer in English”**, or name the language you want.

“Latest available” may describe an earlier month. If you need a particular month, name it and ask ChatGPT to say when it is unavailable.

## Choose something useful

Send the steps in each workflow as separate messages in the same chat. Replace amounts and dates with your own. The numbers in the salary and household examples below are fictional.

### 1. See the whole year, then keep it in Excel

Start with:

> Use INDEC MCP. Show all 12 months of Argentina's national inflation in 2025, with the monthly percentage and the official accumulated percentage for each month. Show the source and flag any missing observations. Explain the difference between monthly and accumulated inflation. Answer in English.

Then:

> Turn the monthly percentages into a bar chart. Use short month labels, a clear title and a percentage axis. Include the source and year. Give me a downloadable PNG too.

Then:

> Now show how the general price level changed throughout 2025, starting at 100 in December 2024. Use the official national IPC index levels, rebase those levels to 100, and label the rebased figures as calculated. Do not reconstruct the index from rounded monthly inflation rates.

Keep an editable copy:

> Create a downloadable Excel workbook for national inflation in 2025. Retrieve the monthly changes, official accumulated changes, and official IPC index levels, including December 2024 as the baseline. Include the original values, source links, reference periods, a monthly bar chart, and a price-level chart rebased to December 2024 = 100. Calculate rebased levels directly from the official index levels, rather than chaining rounded monthly changes. Preserve missing inputs as blank. If a required input is missing, leave every result depending on it blank and show a clear unavailable status; never turn a missing value into zero. Keep independently available observations usable. Check this in a temporary copy by clearing one month's index and then the December 2024 baseline, restoring them before saving. Use readable month labels. Answer in English.

Check that the file has 12 monthly rows, a clearly labeled December 2024 baseline, and source links. Missing a March index should make March's rebased result unavailable; later months can still be calculated directly from their own official indices. Missing the baseline should make all rebased results unavailable.

### 2. Did my salary keep up?

Paste your monthly pay, or upload a simple file with month and amount columns:

> Use INDEC MCP to compare my 2025 pay with national inflation. My pay in pesos was: January 1000000; February 1000000; March 1100000; April 1100000; May 1150000; June 1800000; July 1200000; August 1200000; September 1250000; October unknown; November 1300000; December 2000000. Before calculating, ask about bonuses, missing values and which months the payments belong to. Keep unknown pay blank. Answer in English.

For this fictional example, clarify:

> Each amount belongs to the month named. June includes a 600000 bonus and December includes a 650000 bonus. October is unknown. Compare ordinary pay separately from total pay.

Then:

> Show ordinary pay and total pay in December 2024 pesos, using official IPC index levels. Chart purchasing power, explain the strongest and weakest known months, and create an editable Excel file with original inputs, formulas and sources. Keep missing amounts and dependent results unavailable. Check that clearing a required input does not create a false zero in a temporary copy before saving.

Optional follow-up:

> Help me write a short, factual summary for a pay discussion. State the dates and limitations, and keep the tone calm.

### 3. Was that fee increase above inflation?

> Use INDEC MCP. A monthly fee rose from ARS 50000 in December 2024 to ARS 75000 in December 2025. Compare the increase with official inflation over the same period. Show the percentage increase, an inflation-adjusted fee in pesos, and the difference. Explain percentage points and real change separately. State whether you use the published rounded rate or the full index ratio. Answer in English.

Then:

> Make a simple chart and an editable Excel template where I can add other expenses with their starting and ending prices. Show the dates, calculation method and source. Leave results unavailable when a required price is missing, and check adding a second expense in a temporary copy before saving.

This compares prices you provide with general inflation. It does not establish whether a particular fee increase is legally allowed.

### 4. Understand my household spending

Upload a CSV or Excel file with month and total spending columns. Remove account numbers and other details the comparison does not need.

> Use INDEC MCP to compare this spending record with national inflation over the same months. Before calculating, ask whether household size, buying habits or large one-time purchases changed. Keep my original numbers. Do not treat higher spending by itself as proof of my personal inflation rate. Answer in English.

Then, after answering those questions:

> Use the first month's regular spending as the starting budget and adjust it using official IPC index levels. Show actual regular spending, that inflation-adjusted budget, and their difference. Keep one-time purchases separate and explain the limits of the comparison. Create an Excel file with original data, formulas, charts and sources. Missing required inputs must make dependent results unavailable, rather than zero.

### 5. Try a purchasing-power calculator

> Use INDEC MCP to retrieve official national IPC index levels from December 2024 through December 2025. Create an interactive purchasing-power calculator with an amount in Argentine pesos, a starting month and an ending month. Start with ARS 100000, January 2025 to December 2025. Calculate equivalent amount as amount * ending index / starting index. Distinguish an empty amount from zero: empty must show "Enter an amount" and no numeric result; zero is valid and returns zero. Require both months, use only available index observations, and show a clear unavailable message for missing data. Show the selected inputs, date range, formula and official source. Answer in English.

Try changing the amount and months. Clear the amount: it should ask you to enter one. Enter `0`: the result should be zero. Select the same month at both ends: the result should equal the amount you entered.

If interactive controls are unavailable, ask for the same calculation as a table or Excel file.

**When exporting, repeat your choices in the message.** A follow-up may not pick up changes you made inside interactive controls:

> Create a downloadable Excel version using ARS 200000, starting in December 2024 and ending in December 2025. Show those exact chosen inputs prominently and use official IPC index levels. Make the amount and month inputs editable, with formulas that recalculate. An empty amount must show "Enter an amount" and no numeric result; zero must return zero. Missing or invalid months and missing required index levels must produce a clear unavailable message and no numeric result. Check blank versus zero, same-month, changed dates and a missing baseline in a temporary copy, restoring the chosen inputs before saving. Include the original index data and source links. Answer in English.

The chosen example should give about **ARS 263097.52**. Check that each index label sits beside the correct value and that any heading showing your selections updates when you edit them. This is the equivalent amount at the later general price level, not an investment return or a forecast.

If the labels or heading are wrong:

> Create a separate corrected workbook. Put each starting and ending index label on the same row as its matching value. Make any heading showing my selected amount and dates update when those inputs change. Preserve the original official data, sources and correct calculations. Check the labels against the formulas, test changing the inputs, restore my chosen defaults, and render the worksheets before delivering the new file.

### 6. Compare wages across sectors

> Use INDEC MCP to compare registered private-sector, public-sector and unregistered private-sector wage indices with national IPC, from December 2024 through December 2025. Rebase every series to December 2024 = 100. Use identical periods, keep missing observations unavailable and show sources. Explain wage growth after inflation using a ratio, separately from a percentage-point gap. Answer in English.

Then:

> Give each wage sector its own chart against inflation, with matching axes. Export an Excel workbook with original index values, formulas, charts and source links. Guard missing observations and baselines so dependent results cannot turn into zero.

These sector indices describe groups of workers; they do not establish what happened to your own pay.

### 7. Explain it to family, a group or a class

After an inflation discussion:

> Turn our 2025 inflation explanation into a one-page A4 PDF with one chart, three takeaways and a simple example in pesos. Include the reference periods and official source links. Use embedded fonts and plain-text formulas with ASCII operators such as - and *. Check the downloaded PDF for missing symbols, clipped text and readable labels. Answer in English.

Other follow-ups:

> Draft a short WhatsApp message explaining these figures in everyday language. Include the year and source. Do not send it.

> Explain this to a teenager using an allowance example. Explain why lower inflation can still mean rising prices.

> Make a downloadable three-slide presentation from this explanation: what changed, an everyday example, and what to remember. Include the chart, dates and sources.

### 8. Compare two years fairly

> Use INDEC MCP to compare monthly national inflation in 2024 and 2025. Show corresponding months side by side and chart them. Report each year's official annual inflation separately; do not add monthly percentages to get the annual figure. Show the sources and flag missing values. Answer in English.

Then:

> Export an Excel workbook with separate sheets for 2024 and 2025 and a comparison sheet with charts. Keep official observations separate from calculations, use clear percentage labels, and leave dependent results unavailable when required inputs are missing.

### 9. Make an economic briefing you can repeat

> Use INDEC MCP to give me a plain-language briefing on the latest available inflation, wages compared with inflation, basic food and total baskets, unemployment and economic activity. Show each indicator's own reference period, units, coverage and official source. For the wage comparison use matching dates. Explain that the basket figures are for an adult equivalent in Greater Buenos Aires, and unemployment covers 31 urban areas. Include a few useful charts using comparable observations. Say when a requested figure is unavailable. Answer in English.

Then:

> Explain why these indicators describe different months or quarters, and what I can reasonably compare.

For a file that keeps the original briefing:

> Export the original economic briefing, including its charts, indicator table, reference periods, coverage and source links, as a two-page PDF. Keep the dates visible. Use embedded fonts and plain-text formulas with ASCII operators, for example (1.3561 / 1.335 - 1) * 100. Those numbers illustrate notation only; calculate with the actual matching-period data retrieved for this briefing. Check the downloaded file for missing symbols, clipped text and readable charts. Answer in English.

For next time:

> Give me one reusable prompt to repeat this briefing next month, retrieving fresh data and clearly showing which reference periods changed.

If a downloaded PDF has clipped text or crowded page edges:

> Regenerate a new PDF using the same figures, charts and ASCII formulas. Keep all text and charts inside at least 15 mm page margins on both pages, with footer space reserved. Shorten explanatory prose if needed rather than clipping it. Keep readable chart labels and clickable source links. Render and inspect both pages before delivering the new file.

## Before you keep or share a result

- Check the **month or quarter**, the units, and who or where the statistic covers.
- Download the file and open it. Check the chosen amounts and dates, formulas and chart labels. A preview alone does not prove that an exported file works.
- Ask for missing values to stay unavailable. A blank amount and a real zero mean different things.
- Keep official observations distinct from ChatGPT's calculations and your own numbers.
- Files are snapshots. To update them, ask ChatGPT to retrieve fresh data and create a new file.

The workflows were tested in ChatGPT on November 3, 2026. Charts, interactive controls and downloadable files depend on the capabilities available in your chat. These prompts improve reliability; review the generated result before relying on it.
