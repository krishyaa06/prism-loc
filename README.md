<!-- ═════════════ HEADER ═════════════ -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:07060f,50:00D2FF,100:7CFFB2&height=200&section=header&text=Prism%20LOC&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=Lines%20of%20code%2C%20by%20language&descAlignY=58&descSize=16" width="100%" alt="Prism LOC" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=19&duration=2600&pause=800&color=00D2FF&center=true&vCenter=true&width=680&lines=loc;How+big+is+this+repo%3F;code+%C2%B7+comment+%C2%B7+blank;38+languages" alt="Typing SVG" />
</p>

<p align="center">
  <a href="https://github.com/krishyaa06/prism-loc/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/krishyaa06/prism-loc/ci.yml?branch=main&style=for-the-badge&label=CI&logo=githubactions&logoColor=white" alt="CI" /></a>
  <img src="https://img.shields.io/badge/Node.js-%E2%89%A518.17-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/dependencies-0-00D2FF?style=for-the-badge" alt="Zero dependencies" />
  <a href="LICENSE"><img src="https://img.shields.io/github/license/krishyaa06/prism-loc?style=for-the-badge&color=7CFFB2" alt="License" /></a>
</p>

<p align="center">
  <img src="assets/screenshots/demo.png" width="90%" alt="Prism LOC screenshot" />
</p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%" alt="" />

## ⚡ Overview

**Prism LOC** (`loc`) answers "how big is this codebase?" in milliseconds. It walks your project (respecting `.gitignore`, skipping `node_modules`, builds, lockfiles, minified and binary files), detects 38 languages and splits every file into code, comment and blank lines with block-comment and string awareness. The output uses GitHub's language colours, and `--md` gives you a table ready to paste into a README.

## ✨ Features

- **38 languages** from TypeScript, Python, Go and Rust to Solidity, Prisma, Svelte and Astro
- **Code / comment / blank** with block comments, docstrings and strings handled
- **GitHub language colours**, share bars and a language strip
- `-f [n]` largest files, `-l ts,py` filter, `-e` extra excludes, `-s` sort
- `--md` markdown table for READMEs, `--json` for scripts and dashboards
- Respects `.gitignore`; skips lockfiles, `.min.*`, binaries and files over 2 MB; zero dependencies

## 🚀 Quick Start

```bash
# run without installing
npx github:krishyaa06/prism-loc 

# or install globally
npm install -g github:krishyaa06/prism-loc
loc -f 10
```

Requires Node.js 18.17+. No dependencies.

## 🛠️ Usage

```text
loc [dir] [options]

  -f, --files [n]        top n largest files (default 10)
  -l, --lang <list>      only these languages (ts,js,py,…)
  -e, --exclude <glob>   extra ignore pattern (repeatable)
  -s, --sort <key>       code | lines | files | comment (default code)
      --no-gitignore     don't read .gitignore
      --json             machine-readable output
      --md               markdown table (for READMEs)
```

Example `--md` output:

| Language | Files | Code | Comment | Blank |
| --- | ---: | ---: | ---: | ---: |
| TypeScript | 18 | 2,603 | 24 | 248 |
| CSS | 1 | 2,449 | 13 | 425 |
| **Total** | **30** | **5,235** | **41** | **714** |

## 📁 Project Structure

```text
prism-loc/
├── assets/
│   ├── logo.png
│   └── logo.svg
├── bin/
│   └── loc.js   # CLI entry
├── src/
│   ├── index.js   # walker + line classifier
│   ├── langs.js   # 38 language definitions
│   ├── ui.js   # colours, tables
│   └── walk.js
├── test/
│   └── loc.test.js
├── .gitignore
├── LICENSE
└── package.json
```

## 🧪 Tests

```bash
npm test
```

Tests use the built-in `node:test` runner, so there is nothing to install. CI runs them on Node 20 and 22.

## 🤝 Contributing

1. Fork the repo and create a branch: `git checkout -b feature/my-idea`
2. Make your change and add a test in `test/`
3. Run `npm test` and open a Pull Request

## 🔷 Part of Prism Protocol

Prism LOC is one of the open-source tools built by [Prism Protocol](https://dc.gg/prismprotocol), a tech community where young builders learn, ship and compete together.

## 👤 Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/krishyaa06"><img src="https://github.com/krishyaa06.png" width="90" style="border-radius:50%" alt="Soumya Bhandare" /><br><b>Soumya Bhandare</b></a><br>
      <sub>Founder @ Prism Protocol</sub>
    </td>
    <td>
      <a href="https://dc.gg/prismprotocol"><img src="https://img.shields.io/badge/Discord-Prism%20Protocol-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" /></a><br>
      <a href="https://instagram.com/prism_protocol_"><img src="https://img.shields.io/badge/Instagram-@prism__protocol__-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" /></a><br>
      <a href="https://x.com/krishyaa06"><img src="https://img.shields.io/badge/X-@krishyaa06-000000?style=for-the-badge&logo=x&logoColor=white" alt="X" /></a>
    </td>
  </tr>
</table>

## 📄 License

Released under the [MIT License](LICENSE).

<p align="center">
  <b>If you like this project, consider giving it a ⭐</b><br>
  <sub>"Build. Create. Compete." · Made with ⚡ by Prism Protocol</sub>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:7CFFB2,50:00D2FF,100:07060f&height=110&section=footer" width="100%" alt="" />
