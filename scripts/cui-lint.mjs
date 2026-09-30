#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { TokenLinter } from "./cui-lib/token-linter.mjs";
import { SvelteAstLinter } from "./cui-lib/svelte-ast-linter.mjs";
import { reportDiagnostics } from "./cui-lib/agent-reporter.mjs";

const rootDir = path.resolve(".");
const configPath = path.join(rootDir, "cui.config.json");

let config = {};
if (fs.existsSync(configPath)) {
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (err) {
    console.error(`Failed to parse cui.config.json:`, err);
  }
}

// CLI argument parsing
const args = process.argv.slice(2);
const isJson = args.includes("--json");
const isFix = args.includes("--fix");
const customFiles = args.filter(a => !a.startsWith("--"));

// Initialize linters
const tokenLinter = new TokenLinter(config, rootDir);
const svelteAstLinter = new SvelteAstLinter(config, rootDir);

// Collect files to lint
function collectFiles(dir, extensions, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".svelte-kit", "build", "dist", ".git"].includes(entry.name)) continue;
      collectFiles(fullPath, extensions, acc);
    } else if (entry.isFile()) {
      if (extensions.some(ext => entry.name.endsWith(ext))) {
        acc.push(fullPath);
      }
    }
  }

  return acc;
}

let sassFiles = [];
let svelteFiles = [];

if (customFiles.length > 0) {
  for (const f of customFiles) {
    const abs = path.resolve(rootDir, f);
    if (abs.endsWith(".sass") || abs.endsWith(".scss") || abs.endsWith(".css")) {
      sassFiles.push(abs);
    } else if (abs.endsWith(".svelte")) {
      svelteFiles.push(abs);
    }
  }
} else {
  const stylesDir = config.stylesDir || "src/lib/styles/components";
  const compDir = config.componentsDir || "src/lib/components/generated";
  const routesDir = config.routesDir || "src/routes";
  sassFiles = collectFiles(path.join(rootDir, stylesDir), [".sass", ".scss"]);
  svelteFiles = [
    ...collectFiles(path.join(rootDir, compDir), [".svelte"]),
    ...collectFiles(path.join(rootDir, routesDir), [".svelte"])
  ];
}

const allDiagnostics = [];

// 1. Lint Sass files with token purity rules
for (const file of sassFiles) {
  const diags = tokenLinter.lintFile(file);
  allDiagnostics.push(...diags);
}

// 2. Lint Svelte files with AST contract rules
for (const file of svelteFiles) {
  const diags = svelteAstLinter.lintFile(file);
  allDiagnostics.push(...diags);
}

// Auto-fix if requested
if (isFix) {
  let fixCount = 0;
  // Group fixes by file
  const fixesByFile = new Map();
  for (const d of allDiagnostics) {
    if (d.fix && d.fix.target) {
      if (!fixesByFile.has(d.file)) fixesByFile.set(d.file, []);
      fixesByFile.get(d.file).push(d.fix);
    }
  }

  for (const [relFile, fixes] of fixesByFile.entries()) {
    const absPath = path.join(rootDir, relFile);
    if (!fs.existsSync(absPath)) continue;
    let content = fs.readFileSync(absPath, "utf8");
    for (const fix of fixes) {
      if (content.includes(fix.target)) {
        content = content.replace(fix.target, fix.replacement);
        fixCount++;
      }
    }
    fs.writeFileSync(absPath, content, "utf8");
  }

  if (!isJson && fixCount > 0) {
    console.log(`\x1b[32m✔ Applied ${fixCount} automatic fixes.\x1b[0m`);
  }
}

// Report results
reportDiagnostics(allDiagnostics, { json: isJson });

const hasErrors = allDiagnostics.some(d => d.severity === "error");
process.exit(hasErrors ? 1 : 0);
