#!/usr/bin/env node
"use strict";
const path = require("node:path");
const fs = require("node:fs");
const { parseArgs } = require("node:util");
const { scan } = require("../src");
const { c, header, table, plural, useColor } = require("../src/ui");
const pkg = require("../package.json");

const HELP = `${header("loc", "lines of code, by language")}

${c.bold("Usage")}
  loc [dir] [options]

${c.bold("Options")}
  -f, --files [n]        top n largest files (default 10)
  -l, --lang <list>      only these languages (e.g. ts,js → typescript,javascript)
  -e, --exclude <glob>   extra ignore pattern (repeatable)
  -s, --sort <key>       code | lines | files | comment (default code)
      --no-gitignore     don't read .gitignore
      --json             machine-readable output
      --md               markdown table (for READMEs)
  -v, --version / -h, --help

Skips node_modules, dist, build, lockfiles, minified and binary files.`;

const ALIAS = { ts: "typescript", js: "javascript", py: "python", rs: "rust", rb: "ruby", md: "markdown", sh: "shell", cs: "c#", cpp: "c++", yml: "yaml" };
let a;
try { a = parseArgs({ allowPositionals: true, options: { files: { type: "string", short: "f" }, lang: { type: "string", short: "l" }, exclude: { type: "string", short: "e", multiple: true }, sort: { type: "string", short: "s", default: "code" }, "no-gitignore": { type: "boolean" }, json: { type: "boolean" }, md: { type: "boolean" }, version: { type: "boolean", short: "v" }, help: { type: "boolean", short: "h" } }, args: process.argv.slice(2).flatMap((x, i, arr) => ((x === "-f" || x === "--files") && (!arr[i + 1] || arr[i + 1].startsWith("-") || !/^\d+$/.test(arr[i + 1])) ? [x, "10"] : [x])) }); }
catch (e) { console.error(c.red(`✖ ${e.message}`)); process.exit(2); }
const o = a.values;
if (o.help) { console.log(HELP); process.exit(0); }
if (o.version) { console.log(pkg.version); process.exit(0); }
if (!["code", "lines", "files", "comment"].includes(o.sort)) { console.error(c.red(`✖ --sort must be code, lines, files or comment`)); process.exit(2); }
const root = path.resolve(a.positionals[0] || ".");
if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) { console.error(c.red(`✖ Not a directory: ${root}`)); process.exit(2); }
const include = o.lang ? o.lang.toLowerCase().split(",").map((s) => ALIAS[s.trim()] || s.trim()) : undefined;
const t0 = Date.now();
const r = scan(root, { exclude: o.exclude || [], include, gitignore: !o["no-gitignore"] });
const ms = Date.now() - t0;
const langs = Object.entries(r.langs).sort((x, y) => y[1][o.sort] - x[1][o.sort] || y[1].lines - x[1].lines);
if (o.json) { console.log(JSON.stringify({ total: r.total, languages: Object.fromEntries(langs.map(([k, { color, ...v }]) => [k, v])), files: o.files ? r.files.sort((x, y) => y.code - x.code).slice(0, +o.files) : undefined }, null, 2)); process.exit(0); }
const n = (x) => x.toLocaleString("en-US");
if (o.md) {
  console.log("| Language | Files | Code | Comment | Blank |\n| --- | ---: | ---: | ---: | ---: |");
  for (const [k, v] of langs) console.log(`| ${k} | ${n(v.files)} | ${n(v.code)} | ${n(v.comment)} | ${n(v.blank)} |`);
  console.log(`| **Total** | **${n(r.total.files)}** | **${n(r.total.code)}** | **${n(r.total.comment)}** | **${n(r.total.blank)}** |`); process.exit(0);
}
if (!langs.length) { console.log(`${header("loc", path.basename(root))}\n\n${c.dim("No source files found.")}`); process.exit(0); }
const hex = (h, s) => { if (!useColor) return s; const v = parseInt(h.slice(1), 16); return `\x1b[38;2;${v >> 16};${(v >> 8) & 255};${v & 255}m${s}\x1b[39m`; };
const W = 18, sum = r.total.code || 1;
console.log(header("loc", `${path.basename(root)} · ${plural(r.total.files, "file")} · ${ms}ms`) + "\n");
const rows = langs.map(([k, v]) => { const f = v.code / sum; const w = Math.max(f > 0 ? 1 : 0, Math.round(f * W)); return [hex(v.color, "●") + " " + k, n(v.files), c.bold(n(v.code)), c.dim(n(v.comment)), c.dim(n(v.blank)), hex(v.color, "█".repeat(w)) + c.dim("░".repeat(W - w)) + " " + c.dim((f * 100).toFixed(1) + "%")]; });
rows.push([c.bold("Total"), c.bold(n(r.total.files)), c.bold(c.accent(n(r.total.code))), c.dim(n(r.total.comment)), c.dim(n(r.total.blank)), ""]);
console.log(table(rows, { head: ["language", "files", "code", "comment", "blank", ""], align: ["", "right", "right", "right", "right", ""] }));
// language strip
const strip = langs.map(([, v]) => hex(v.color, "▇".repeat(Math.max(1, Math.round((v.code / sum) * 60))))).join("");
console.log("\n" + strip);
if (o.files) {
  console.log(`\n${c.bold(`Largest files`)}`);
  console.log(table(r.files.sort((x, y) => y.code - x.code).slice(0, +o.files).map((f) => [c.bold(n(f.code)), hex(r.langs[f.lang].color, "●"), f.file]), { align: ["right"] }));
}
const ratio = r.total.code ? r.total.comment / r.total.code : 0;
console.log(`\n${c.dim(`comment ratio ${(ratio * 100).toFixed(1)}%${r.skipped ? ` · skipped ${plural(r.skipped, "file")} (lockfiles, minified, binary, >2MB)` : ""}`)}`);
