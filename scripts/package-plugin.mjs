import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { zipSync, unzipSync } from "fflate";
import { resolve, relative, sep } from "node:path";
const root = resolve("plugin"); const draft = process.argv.includes("--draft");
const manifest = JSON.parse(await readFile(resolve(root, "plugin.json"), "utf8"));
const cases = JSON.parse(await readFile(resolve(root, "review-cases.json"), "utf8"));
const listing = manifest.extensions["com.openai"].interface;
for (const field of ["displayName", "shortDescription"]) if (listing[field].length > 30) throw new Error(`${field} exceeds the public listing limit.`);
if (cases.positive.length !== 5 || cases.negative.length !== 3) throw new Error("Review requires five positive and three negative cases.");
for (const locale of Object.values(manifest.extensions["com.openai"].publication.translations)) if (locale.subtitle.length > 30) throw new Error("Translated subtitle exceeds the public listing limit.");
const pending = [];
if (JSON.stringify(manifest).includes("_PENDING")) pending.push("publisher identity/contact");
const demo = manifest.extensions["com.openai"].review?.demo_recording_url;
if (!demo || demo.includes("PENDING")) pending.push("review demo recording URL");
const status = JSON.parse(await readFile("docs/release-status.json", "utf8"));
for (const [key, value] of Object.entries(status)) if (key !== "public_submission_approved" && value !== true) pending.push(key);
if (!draft && pending.length) throw new Error(`Release blocked: ${pending.join(", ")}. Draft packaging is available with --draft.`);
manifest.extensions["com.openai"].review = { test_cases: cases, commerce: false, commerce_description: "No products, payments or commerce actions.", ...(demo ? { demo_recording_url: demo } : {}) };
const files = {};
const allowed = ["plugin.json", "mcp.json", "assets", "skills"];
async function include(path) {
  const full = resolve(root, path);
  const content = await readdir(full, { withFileTypes: true }).catch(() => null);
  if (content) { for (const entry of content) { if (entry.isSymbolicLink()) throw new Error("Symlinks are not allowed in plugin packages."); await include(`${path}/${entry.name}`); } }
  else {
    if (path.includes(".env") || /\.(exe|dll|key|pem)$/.test(path)) throw new Error("Unexpected plugin file.");
    files[path] = new Uint8Array(await readFile(full));
  }
}
for (const path of allowed) await include(path);
for (const field of ["logo", "composerIcon"]) if (!files[listing[field].replace(/^\.\//, "")]) throw new Error(`Missing ${field}.`);
files["plugin.json"] = new TextEncoder().encode(JSON.stringify(manifest, null, 2) + "\n");
files["LICENSE"] = new Uint8Array(await readFile("LICENSE"));
const archive = zipSync(files, { level: 6 });
const entries = Object.keys(unzipSync(archive));
if (!entries.includes("plugin.json") || !entries.includes("mcp.json") || !entries.some(name => name.endsWith("SKILL.md"))) throw new Error("Invalid package structure.");
await mkdir(".local/artifacts", { recursive: true });
const output = resolve(`.local/artifacts/indec-mcp-${draft ? "draft" : "submission"}.zip`);
if (!relative(resolve(".local"), output).startsWith(`artifacts${sep}`)) throw new Error("Unsafe output path.");
await writeFile(output, archive);
console.log(JSON.stringify({ archive: output, draft, files: entries.length, bytes: archive.length, release_blockers: pending }));
