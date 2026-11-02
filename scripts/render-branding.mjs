import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile, mkdir } from "node:fs/promises";
await mkdir(".local/branding", { recursive: true });
for (const asset of ["icon", "logo"]) {
  const svg = await readFile(`plugin/assets/${asset}.svg`, "utf8");
  const rendered = new Resvg(svg, { fitTo: { mode: "width", value: 512 } }).render();
  await writeFile(`.local/branding/${asset}.png`, rendered.asPng());
}
console.log("Rendered plugin logo and composer icon for visual verification.");
