"use strict";
const fs = require("node:fs");
const path = require("node:path");
const LANGS = require("./langs");
const { walk, isBinary } = require("./walk");

const BY = new Map();
for (const [name, [exts]] of Object.entries(LANGS)) for (const e of exts) BY.set(e.startsWith(".") ? e.toLowerCase() : e, name);
function detect(file) { const b = path.basename(file); return BY.get(b) || BY.get(path.extname(b).toLowerCase()) || (b.startsWith("Dockerfile") ? "Dockerfile" : null); }

/** Count blank / comment / code lines. Handles block comments and strings naively-but-safely. */
function count(text, lang) {
  const [, line = [], block] = LANGS[lang] || [];
  const r = { lines: 0, code: 0, comment: 0, blank: 0 };
  if (!text.length) return r;
  const rows = text.split(/\r?\n/); if (rows[rows.length - 1] === "") rows.pop();
  let inBlock = false;
  for (const raw of rows) {
    r.lines++;
    const s = raw.trim();
    if (!s) { if (inBlock) r.comment++; else r.blank++; continue; }
    let code = false, i = 0, comment = inBlock;
    while (i < s.length) {
      if (inBlock) { const j = s.indexOf(block[1], i); if (j < 0) { i = s.length; break; } inBlock = false; i = j + block[1].length; continue; }
      if (block && s.startsWith(block[0], i)) { inBlock = true; comment = true; i += block[0].length; continue; }
      if (line.some((l) => s.startsWith(l, i))) { comment = true; break; }
      const ch = s[i];
      if (ch === '"' || ch === "'" || ch === "`") { const q = ch; i++; while (i < s.length && s[i] !== q) i += s[i] === "\\" ? 2 : 1; i++; code = true; continue; }
      if (ch !== " " && ch !== "\t") code = true;
      i++;
    }
    if (code) r.code++; else if (comment) r.comment++; else r.code++;
  }
  return r;
}

/** Scan a directory → { langs: {name: {files, lines, code, comment, blank}}, files: [...], total } */
function scan(root, { exclude = [], include, gitignore = true, maxSize = 2 << 20 } = {}) {
  const files = walk(root, { extraIgnore: exclude, useGitignore: gitignore });
  const langs = {}, out = [], total = { files: 0, lines: 0, code: 0, comment: 0, blank: 0 };
  let skipped = 0;
  for (const rel of files) {
    const lang = detect(rel); if (!lang || (include && !include.includes(lang.toLowerCase()))) continue;
    const abs = path.join(root, rel); let st; try { st = fs.statSync(abs); } catch { continue; }
    if (st.size > maxSize || /\.min\.(js|css)$|(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$/.test(rel)) { skipped++; continue; }
    const buf = fs.readFileSync(abs); if (isBinary(buf)) { skipped++; continue; }
    const r = count(buf.toString("utf8"), lang);
    const L = (langs[lang] ??= { files: 0, lines: 0, code: 0, comment: 0, blank: 0, color: LANGS[lang][3] });
    L.files++; total.files++;
    for (const k of ["lines", "code", "comment", "blank"]) { L[k] += r[k]; total[k] += r[k]; }
    out.push({ file: rel, lang, ...r });
  }
  return { langs, files: out, total, skipped };
}
module.exports = { detect, count, scan, LANGS };
