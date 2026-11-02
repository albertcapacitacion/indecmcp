import { build } from "esbuild";
import { mkdir, copyFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
await import("./public-pages.mjs");
await mkdir("dist/server", { recursive: true }); await mkdir("dist/.openai", { recursive: true });
const output = resolve("dist/server/index.js");
await build({ entryPoints: ["src/index.ts"], outfile: output, bundle: true, format: "esm", platform: "browser", target: "es2022", conditions: ["workerd", "worker", "browser"], minify: true, sourcemap: false, legalComments: "eof" });
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
let notices = "INDEC MCP code: Apache-2.0. Third-party license texts follow.\n\n";
for (const packageName of ["@modelcontextprotocol/server", "@modelcontextprotocol/core", "zod"]) {
  const license = await readFile(`node_modules/${packageName}/LICENSE`, "utf8").catch(() => null);
  if (license) notices += `===== ${packageName} =====\n${license}\n\n`;
}
const { writeFile } = await import("node:fs/promises");
await writeFile("dist/THIRD_PARTY_NOTICES.txt", notices);
const source = await readFile(output, "utf8");
if (/Bearer\s+eyJ/.test(source)) throw new Error("A credential-like value was detected in the build.");
const worker = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
if (typeof worker.default?.fetch !== "function") throw new Error("Invalid Sites Worker artifact.");
console.log(`Built native Sites Worker (${Buffer.byteLength(source)} bytes).`);
