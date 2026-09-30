import fs from "node:fs";
import path from "node:path";
import { findClosestMatches, findClosestScaleToken } from "./fuzzy.mjs";

export class TokenLinter {
  constructor(config, rootDir = ".") {
    this.config = config;
    this.rootDir = rootDir;
    this.validTokens = new Set();
    this.hexToToken = new Map();

    this.initTokens();
  }

  initTokens() {
    const tokenPaths = this.config.tokens || ["tokens/createui.json"];

    for (const relPath of tokenPaths) {
      const fullPath = path.resolve(this.rootDir, relPath);
      if (!fs.existsSync(fullPath)) continue;

      try {
        const data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
        
        if (data.tokens) {
          for (const [catName, cat] of Object.entries(data.tokens)) {
            for (const [tokenName, tokenDef] of Object.entries(cat)) {
              this.validTokens.add(tokenName);
              if (tokenDef && typeof tokenDef === "object") {
                if (tokenDef.light) this.hexToToken.set(tokenDef.light.toLowerCase(), tokenName);
                if (tokenDef.dark) this.hexToToken.set(tokenDef.dark.toLowerCase(), tokenName);
              }
            }
          }
        }

        if (data.scales) {
          for (const scaleGroup of Object.values(data.scales)) {
            for (const tokenName of Object.keys(scaleGroup)) {
              this.validTokens.add(tokenName);
            }
          }
        }
      } catch (err) {
        console.warn(`[TokenLinter] Failed to parse token file: ${relPath}`, err);
      }
    }

    // Dynamic / component runtime tokens
    this.validTokens.add("--theme");
    this.validTokens.add("--theme-color");
    this.validTokens.add("--ring");
    this.validTokens.add("--slider-pct");
    this.validTokens.add("--scrollbar-thumb");
    this.validTokens.add("--scrollbar-track");
    this.validTokens.add("--cui-split");
    this.validTokens.add("--cui-scroller-max");
    this.validTokens.add("--cui-compare");
  }

  lintFile(filePath) {
    const diagnostics = [];
    if (!fs.existsSync(filePath)) return diagnostics;

    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    const relPath = path.relative(this.rootDir, filePath);
    const isPopup = relPath.includes("popup.sass");

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const cleanLine = line.replace(/\/\/.*$/, "").replace(/\/\*.*?\*\//, "").trim();
      if (!cleanLine) return;

      // Rule 1: No Raw Hex
      const hexMatches = cleanLine.matchAll(/#[0-9a-fA-F]{3,8}\b/g);
      for (const m of hexMatches) {
        const hex = m[0].toLowerCase();
        const column = m.index + 1;
        const matchingToken = this.hexToToken.get(hex);

        let suggestion = "";
        if (matchingToken) {
          suggestion = `Replace "${m[0]}" with semantic token 'var(${matchingToken})'.`;
        } else {
          const sampleTokens = ["var(--bg)", "var(--color-primary)", "var(--text)", "var(--stroke-base)"];
          suggestion = `Replace "${m[0]}" with an appropriate semantic color token, e.g.:\n  - ${sampleTokens.join("\n  - ")}`;
        }

        diagnostics.push({
          rule: "cui/token-purity",
          severity: "error",
          file: relPath,
          line: lineNum,
          column,
          found: m[0],
          rationale: "Raw hex colors bypass multi-mode theming (light/dark/neobrutalist). All colors must use semantic tokens.",
          suggestion,
          fix: {
            target: m[0],
            replacement: matchingToken ? `var(${matchingToken})` : "var(--color-primary)"
          }
        });
      }

      // Rule 2: No Hardcoded Pixels (>2px)
      const pxMatches = cleanLine.matchAll(/(?<![0-9])([3-9]|\d{2,})px\b/g);
      for (const m of pxMatches) {
        const pxStr = m[0];
        const column = m.index + 1;

        // Exception for popup arrow triangle geometry
        if (isPopup && ["8px", "-8px"].includes(pxStr)) continue;

        const isRadiusProp = /radius/i.test(cleanLine);
        const scaleMap = isRadiusProp ? (this.config.radiusScale || {}) : (this.config.spacingScale || {});
        const closest = findClosestScaleToken(pxStr, scaleMap);

        let suggestion = "";
        if (closest) {
          suggestion = `Replace "${pxStr}" with standard scale token '${closest.token}' (${closest.px}).`;
        } else {
          suggestion = `Replace "${pxStr}" with a standard scale token (e.g. var(--space-2), var(--space-4), or var(--radius-md)).`;
        }

        diagnostics.push({
          rule: "cui/token-purity",
          severity: "error",
          file: relPath,
          line: lineNum,
          column,
          found: cleanLine,
          rationale: "Arbitrary pixel dimensions break responsive density and the design system spacing/radius scale.",
          suggestion,
          fix: closest ? {
            target: pxStr,
            replacement: closest.token
          } : undefined
        });
      }

      // Rule 3: Deprecated Surface Rule
      if (cleanLine.includes("--bg-surface")) {
        diagnostics.push({
          rule: "cui/token-purity",
          severity: "error",
          file: relPath,
          line: lineNum,
          column: cleanLine.indexOf("--bg-surface") + 1,
          found: "--bg-surface",
          rationale: "'--bg-surface' is deprecated. The design system uses 'var(--bg)' and 'var(--bg-subtle)'.",
          suggestion: "Replace '--bg-surface' with 'var(--bg)'.",
          fix: {
            target: "--bg-surface",
            replacement: "--bg"
          }
        });
      }

      // Rule 4: Unmapped Variable Check
      const varMatches = cleanLine.matchAll(/var\((--[a-zA-Z0-9_-]+)/g);
      for (const vm of varMatches) {
        const varName = vm[1];
        if (!this.validTokens.has(varName)) {
          const closest = findClosestMatches(varName, this.validTokens, 3, 5);
          let suggestion = "";
          if (closest.length > 0) {
            suggestion = `Did you mean one of these valid tokens?\n  - ${closest.map(t => `var(${t})`).join("\n  - ")}`;
          } else {
            suggestion = `Token "${varName}" is not registered in tokens/createui.json. Please use an existing semantic token or register it in the design system.`;
          }

          diagnostics.push({
            rule: "cui/token-purity",
            severity: "error",
            file: relPath,
            line: lineNum,
            column: vm.index + 1,
            found: vm[0],
            rationale: `The token "${varName}" does not exist in the design system contract.`,
            suggestion,
            fix: closest[0] ? {
              target: varName,
              replacement: closest[0]
            } : undefined
          });
        }
      }
    });

    return diagnostics;
  }
}
