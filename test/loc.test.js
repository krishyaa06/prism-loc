const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { count, detect, scan } = require("../src");
const bin = path.join(__dirname, "../bin/loc.js");

test("detect", () => { assert.equal(detect("a/b.tsx"), "TypeScript"); assert.equal(detect("Dockerfile"), "Dockerfile"); assert.equal(detect("x.unknown"), null); });
test("count js", () => {
  const src = `// header\nconst a = 1; // trailing\n\n/* block\n   still\n*/\nconst s = "http://x"; /* inline */ f();\nconst u = '/* not a comment */';\n`;
  assert.deepEqual(count(src, "JavaScript"), { lines: 8, code: 3, comment: 4, blank: 1 });
});
test("count python + html", () => {
  assert.deepEqual(count("# c\nx = 1\n\n\"\"\"doc\nmore\"\"\"\nprint(x)", "Python"), { lines: 6, code: 2, comment: 3, blank: 1 });
  assert.deepEqual(count("<!-- c -->\n<p>hi</p>", "HTML"), { lines: 2, code: 1, comment: 1, blank: 0 });
});
test("scan + cli", () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "loc-"));
  fs.mkdirSync(path.join(d, "src")); fs.mkdirSync(path.join(d, "node_modules/x"), { recursive: true }); fs.mkdirSync(path.join(d, "gen"));
  fs.writeFileSync(path.join(d, "src/a.ts"), "let a = 1;\n// c\n\nlet b = 2;\n");
  fs.writeFileSync(path.join(d, "src/b.py"), "x = 1\n");
  fs.writeFileSync(path.join(d, "node_modules/x/i.js"), "x\n".repeat(100));
  fs.writeFileSync(path.join(d, "gen/g.js"), "x\n");
  fs.writeFileSync(path.join(d, "app.min.js"), "x");
  fs.writeFileSync(path.join(d, ".gitignore"), "gen/\n");
  const r = scan(d);
  assert.deepEqual(Object.keys(r.langs).sort(), ["Python", "TypeScript"]); assert.equal(r.total.code, 3); assert.equal(r.skipped, 1);
  const j = JSON.parse(spawnSync("node", [bin, d, "--json", "-l", "ts"], { encoding: "utf8" }).stdout);
  assert.deepEqual(Object.keys(j.languages), ["TypeScript"]);
  const md = spawnSync("node", [bin, d, "--md"], { encoding: "utf8" }).stdout; assert.match(md, /\| \*\*Total\*\* \| \*\*2\*\* \| \*\*3\*\*/);
  const t = spawnSync("node", [bin, d, "-f"], { encoding: "utf8", env: { ...process.env, NO_COLOR: "1" } }); assert.equal(t.status, 0, t.stderr); assert.match(t.stdout, /Largest files/);
  assert.equal(spawnSync("node", [bin, d, "-s", "nope"]).status, 2);
});
