import fs from "node:fs";
import path from "node:path";
import { parse } from "svelte/compiler";
import { findClosestMatches } from "./fuzzy.mjs";

export class SvelteAstLinter {
  constructor(config, rootDir = ".") {
    this.config = config;
    this.rootDir = rootDir;
    this.componentsDir = config.componentsDir || "src/lib/components/generated";
    this.anatomyDir = config.anatomyDir || "anatomy";
    this.contracts = config.contracts || {};
    this.defaultContract = config.defaultContract || {
      allowStyleProperties: ["margin", "width", "max-width", "flex", "grid"],
      denyStyleProperties: ["padding", "background", "border", "border-radius", "color"]
    };

    this.knownComponents = new Map();
    this.initComponentContracts();
  }

  initComponentContracts() {
    const fullCompDir = path.resolve(this.rootDir, this.componentsDir);
    const fullAnatomyDir = path.resolve(this.rootDir, this.anatomyDir);

    // 1. Scan actual Svelte components and extract interface Props
    if (fs.existsSync(fullCompDir)) {
      const scanDir = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            scanDir(fullPath);
          } else if (entry.isFile() && entry.name.endsWith(".svelte")) {
            const compName = path.basename(entry.name, ".svelte");
            const content = fs.readFileSync(fullPath, "utf8");

            // Props may live in a sibling `<name>.types.ts` (PORTING-PLAN §4 convention).
            const typesPath = fullPath.replace(/\.svelte$/, ".types.ts");
            const sources = [content];
            if (fs.existsSync(typesPath)) sources.push(fs.readFileSync(typesPath, "utf8"));

            const props = new Set();
            for (const src of sources) {
              const propsMatch = src.match(/interface\s+Props\s*\{([\s\S]*?)\}/);
              if (!propsMatch) continue;
              const lines = propsMatch[1].split("\n");
              for (const line of lines) {
                const clean = line.trim();
                const match = clean.match(/^([a-zA-Z0-9_-]+)\??\s*:/);
                if (match && match[1] !== "[key") {
                  props.add(match[1]);
                }
              }
            }

            // Also check for snippet definitions in markup or slots
            const snippetMatches = content.matchAll(/data-slot="([a-zA-Z0-9_-]+)"/g);
            for (const sm of snippetMatches) {
              props.add(sm[1]);
            }

            const normalized = compName.toLowerCase().replace(/[^a-z0-9]/g, "");
            this.knownComponents.set(normalized, {
              canonicalName: compName,
              props,
              file: fullPath
            });
          }
        }
      };
      scanDir(fullCompDir);
    }

    // 2. Augment with anatomy schemas if available
    if (fs.existsSync(fullAnatomyDir)) {
      const files = fs.readdirSync(fullAnatomyDir).filter(f => f.endsWith(".json"));
      for (const file of files) {
        try {
          const raw = fs.readFileSync(path.join(fullAnatomyDir, file), "utf8");
          const data = JSON.parse(raw);
          const normalized = (data.component || path.basename(file, ".json")).toLowerCase().replace(/[^a-z0-9]/g, "");
          
          let info = this.knownComponents.get(normalized);
          if (!info) {
            info = {
              canonicalName: data.component || path.basename(file, ".json"),
              props: new Set()
            };
            this.knownComponents.set(normalized, info);
          }

          if (data.props) {
            for (const p of Object.keys(data.props)) info.props.add(p);
          }
          if (data.snippets) {
            for (const s of data.snippets) info.props.add(s);
          }
          if (data.parts) {
            for (const partName of Object.keys(data.parts)) info.props.add(partName);
          }
        } catch (err) {
          console.warn(`[SvelteAstLinter] Failed to parse anatomy: ${file}`, err);
        }
      }
    }
  }

  getComponentInfo(tag) {
    const normalized = tag.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (this.knownComponents.has(normalized)) {
      return this.knownComponents.get(normalized);
    }
    // Check compound matches (e.g. BreadcrumbItem -> breadcrumbitem)
    for (const [key, info] of this.knownComponents.entries()) {
      if (normalized === key) {
        return info;
      }
    }
    return null;
  }

  getLineAndCol(source, offset) {
    const lines = source.slice(0, offset).split("\n");
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    };
  }

  lintFile(filePath) {
    const diagnostics = [];
    if (!fs.existsSync(filePath)) return diagnostics;

    const relPath = path.relative(this.rootDir, filePath);
    const source = fs.readFileSync(filePath, "utf8");

    let ast;
    try {
      ast = parse(source, { filename: path.basename(filePath) });
    } catch (err) {
      return [{
        rule: "cui/svelte-parse",
        severity: "error",
        file: relPath,
        line: err.start?.line || 1,
        column: err.start?.column || 1,
        found: err.message,
        rationale: "File must be valid Svelte 5 syntax to verify design system contracts.",
        suggestion: "Fix syntax error in component file."
      }];
    }

    // Rule 1: cui/no-in-component-styles (Only for generated library components)
    const isLibraryComponent = relPath.includes(this.componentsDir.replace(/^\.?\//, ""));
    if (isLibraryComponent && ast.css) {
      const loc = this.getLineAndCol(source, ast.css.start);
      const baseName = path.basename(filePath, ".svelte").toLowerCase();
      diagnostics.push({
        rule: "cui/no-in-component-styles",
        severity: "error",
        file: relPath,
        line: loc.line,
        column: loc.column,
        found: "<style> block detected",
        rationale: "Library components must remain pure markup & logic. In-component styles prevent global theme switching and token modularity.",
        suggestion: `Move all styles to 'src/lib/styles/components/${baseName}.sass' using single-tab indented SASS syntax with semantic tokens. Remove the <style> block completely.`,
        fix: {
          target: source.slice(ast.css.start, ast.css.end),
          replacement: ""
        }
      });
    }

    // Traverse HTML AST for component calls
    const walkNode = (node) => {
      if (!node) return;

      const isComponent = node.type === "InlineComponent" || node.type === "Component";
      if (isComponent) {
        const compName = node.name;
        const compInfo = this.getComponentInfo(compName);

        if (compInfo && node.attributes) {
          this.checkComponentAttributes(node, compInfo, relPath, source, diagnostics);
        }
      }

      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) walkNode(child);
      }
      if (node.fragment) {
        walkNode(node.fragment);
      }
    };

    walkNode(ast.html);

    return diagnostics;
  }

  checkComponentAttributes(node, compInfo, relPath, source, diagnostics) {
    const compName = node.name;

    for (const attr of node.attributes) {
      if (attr.type !== "Attribute") continue;

      const attrName = attr.name;
      const loc = this.getLineAndCol(source, attr.start);

      // Rule 2: cui/no-component-restyle (Check style attribute)
      if (attrName === "style") {
        let styleStr = "";
        if (Array.isArray(attr.value) && attr.value[0]?.data) {
          styleStr = attr.value[0].data;
        }

        if (styleStr) {
          const deniedProps = this.defaultContract.denyStyleProperties || [];
          const declarations = styleStr.split(";").map(s => s.trim()).filter(Boolean);

          for (const decl of declarations) {
            const [prop, val] = decl.split(":").map(s => s.trim());
            if (!prop) continue;

            if (deniedProps.some(d => d === prop || prop.startsWith(`${d}-`))) {
              diagnostics.push({
                rule: "cui/no-component-restyle",
                severity: "error",
                file: relPath,
                line: loc.line,
                column: loc.column,
                found: `${prop}: ${val}`,
                rationale: `<${compName}> owns its internal ${prop.replace(/-.*/, "")} and geometry. Callers must not override internal component presentation via inline styles.`,
                suggestion: `Remove '${prop}: ${val}'.\n- To change visual treatment, use an authorized variant prop (e.g. variant="primary" | "secondary" | "danger").\n- To change size, use prop size="sm" | "md" | "lg".\n- To position <${compName}>, apply layout margin or parent container gap.`
              });
            }
          }
        }
      }

      // Rule 3: cui/strict-props-and-slots (Check unknown props)
      const isCommonProp = [
        "class", "id", "children", "style", "disabled", "title", "name", "value",
        "type", "href", "target", "rel", "download", "role", "tabindex", "open"
      ].includes(attrName) ||
        attrName.startsWith("on") || // event handlers (onclick, onkeydown, onchange, etc.)
        attrName.startsWith("aria-") ||
        attrName.startsWith("data-") ||
        attrName.startsWith("bind:");

      if (!isCommonProp && compInfo.props.size > 0 && !compInfo.props.has(attrName)) {
        const closest = findClosestMatches(attrName, compInfo.props, 2, 4);
        const allowedSample = Array.from(compInfo.props).slice(0, 6).join(", ");
        let suggestion = "";

        if (closest.length > 0) {
          suggestion = `Did you mean '${closest[0]}'?\nAllowed props on <${compName}>: ${allowedSample}`;
        } else {
          suggestion = `Prop '${attrName}' is not defined on <${compName}>.\nAllowed props: ${allowedSample}`;
        }

        diagnostics.push({
          rule: "cui/strict-props-and-slots",
          severity: "error",
          file: relPath,
          line: loc.line,
          column: loc.column,
          found: `${attrName}=...`,
          rationale: `<${compName}> has a strict contract defined in the component API. Hallucinated props will not render.`,
          suggestion
        });
      }
    }
  }
}
