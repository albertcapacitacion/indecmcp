import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
const env = await readFile(".env", "utf8").catch(() => "");
const token = parseEnv(env).INDEC_API_TOKEN;
if (!token) { console.log("No local credential is available for exact-value leak scanning."); process.exit(1); }
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { encoding: "utf8", windowsHide: true }).split("\0").filter(Boolean);
let leaks = 0;
for (const file of [...files, "dist/server/index.js", ".local/artifacts/indec-mcp-draft.zip"]) {
  const bytes = await readFile(file).catch(() => null);
  if (bytes?.includes(Buffer.from(token))) { leaks++; console.error(`Credential detected in ${file}`); }
}
if (leaks) process.exitCode = 1;
else console.log(`Exact-value credential scan passed across ${files.length} source files and the build/package artifacts. No credential value was printed.`);
