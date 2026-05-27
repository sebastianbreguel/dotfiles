#!/usr/bin/env node
/**
 * generate-docs.js
 *
 * Single source of truth: reads app/src/data.js and generates:
 *   - TOOLKIT.md (full catalog in markdown tables)
 *   - README.md sections (install commands for setup guide)
 *
 * Usage: node scripts/generate-docs.js
 */

import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ---------------------------------------------------------------------------
// 1. Load data.js by extracting the raw JS and evaluating it
// ---------------------------------------------------------------------------

const dataPath = join(ROOT, "app", "src", "data.js");
const dataSrc = readFileSync(dataPath, "utf-8");

// Extract DATA object from the ES module (new nested format)
const dataMatch = dataSrc.match(
  /export\s+const\s+DATA\s*=\s*(\{[\s\S]*?\n\};)/
);

if (!dataMatch) {
  console.error("Failed to parse data.js exports");
  process.exit(1);
}

const DATA = new Function(`return ${dataMatch[1]}`)();

// Derive CATEGORIES and items from DATA to keep the rest of the script working
function deriveInstallMethod(install) {
  if (!install) return "manual";
  if (install.includes("--cask")) return "brew";
  if (install.startsWith("brew install")) return "brew";
  if (install.includes("pnpm install") || install.includes("pnpm add")) return "pnpm";
  if (install.includes("npm install")) return "npm";
  if (install.includes("uv tool install")) return "uv";
  if (install.includes("uv pip install") || install.includes("pip install")) return "pip";
  if (install.includes("code --install-extension")) return "marketplace";
  return "manual";
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const CATEGORIES = {};
const items = [];

for (const [catName, catObj] of Object.entries(DATA)) {
  const catKey = catObj.catKey;
  const subcategories = {};
  for (const groupName of Object.keys(catObj.groups)) {
    subcategories[slugify(groupName)] = groupName;
  }
  CATEGORIES[catKey] = { label: catName, subcategories };

  for (const [groupName, tools] of Object.entries(catObj.groups)) {
    for (const tool of tools) {
      items.push({
        id: tool.id,
        name: tool.name,
        description: tool.desc || "",
        install: tool.install || "",
        installMethod: deriveInstallMethod(tool.install),
        cost: (tool.badges && tool.badges[0]) || "Free",
        url: tool.site ? (tool.site.startsWith("http") ? tool.site : `https://${tool.site}`) : "",
        tags: tool.tags || [],
        category: catKey,
        subcategory: slugify(groupName),
        featured: tool.featured || false,
        note: tool.note || "",
        related: tool.related || [],
      });
    }
  }
}

// ---------------------------------------------------------------------------
// 1b. Schema validation — warn on missing/invalid fields
// ---------------------------------------------------------------------------
const REQUIRED_FIELDS = ["id", "name", "category", "subcategory", "description"];
const validCategories = Object.keys(CATEGORIES);
const validationWarnings = [];

items.forEach((item) => {
  const label = item.id || item.name || "(unknown)";

  for (const field of REQUIRED_FIELDS) {
    if (item[field] === undefined || item[field] === null || item[field] === "") {
      validationWarnings.push(`Warning: item "${label}" — missing field "${field}"`);
    }
  }

  if (typeof item.id !== "string" || item.id.trim() === "") {
    validationWarnings.push(`Warning: item "${label}" — id must be a non-empty string`);
  }

  if (item.category && !validCategories.includes(item.category)) {
    validationWarnings.push(`Warning: item "${label}" — invalid category "${item.category}"`);
  }

  if (
    item.category &&
    CATEGORIES[item.category] &&
    item.subcategory &&
    !CATEGORIES[item.category].subcategories?.[item.subcategory]
  ) {
    validationWarnings.push(
      `Warning: item "${label}" — invalid subcategory "${item.subcategory}" for category "${item.category}"`
    );
  }
});

if (validationWarnings.length > 0) {
  validationWarnings.forEach((w) => console.warn(w));
  console.warn(`\n${validationWarnings.length} validation warning(s) found.\n`);
}

console.log(`Loaded ${items.length} items from data.js`);

// ---------------------------------------------------------------------------
// 2. Helpers
// ---------------------------------------------------------------------------

/** Group items by category then subcategory */
function groupItems() {
  const grouped = {};
  for (const item of items) {
    const key = item.category;
    if (!grouped[key]) grouped[key] = {};
    const sub = item.subcategory;
    if (!grouped[key][sub]) grouped[key][sub] = [];
    grouped[key][sub].push(item);
  }
  return grouped;
}

/** Title-case a subcategory id */
function subTitle(catKey, subKey) {
  const cat = CATEGORIES[catKey];
  if (cat?.subcategories?.[subKey]) return cat.subcategories[subKey];
  return subKey
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function catLabel(catKey) {
  return CATEGORIES[catKey]?.label || catKey;
}

/** Escape pipe chars in markdown table cells */
function esc(str) {
  return (str || "").replace(/\|/g, "\\|");
}

// ---------------------------------------------------------------------------
// 3. Generate TOOLKIT.md
// ---------------------------------------------------------------------------

function generateToolkit() {
  const grouped = groupItems();
  const lines = [];

  lines.push("# Toolkit");
  lines.push("");
  lines.push(
    "> Mi setup completo de desarrollo. Cada herramienta esta aqui porque la uso — no es una lista de \"cosas cool\", es lo que realmente corre en mi maquina."
  );
  lines.push("");

  // Table of contents
  lines.push("## Indice");
  lines.push("");
  let sectionNum = 1;
  const catOrder = Object.keys(CATEGORIES);
  for (const catKey of catOrder) {
    lines.push(
      `${sectionNum}. [${catLabel(catKey)}](#${sectionNum}-${catKey})`
    );
    sectionNum++;
  }
  lines.push("");

  // Sections
  sectionNum = 1;
  for (const catKey of catOrder) {
    const subs = grouped[catKey];
    if (!subs) {
      sectionNum++;
      continue;
    }

    lines.push(`## ${sectionNum}. ${catLabel(catKey)}`);
    lines.push("");

    const subKeys = Object.keys(CATEGORIES[catKey].subcategories || {});

    for (const subKey of subKeys) {
      const subItems = subs[subKey];
      if (!subItems || subItems.length === 0) continue;

      lines.push(`### ${subTitle(catKey, subKey)}`);
      lines.push("");

      // Different table formats per category type
      if (catKey === "apps") {
        lines.push("| App | Descripcion | Instalacion | Costo |");
        lines.push("|-----|-------------|-------------|-------|");
        for (const it of subItems) {
          const name = it.url
            ? `**[${it.name}](${it.url})**`
            : `**${it.name}**`;
          const install = it.install ? `\`${it.install}\`` : "Manual";
          lines.push(
            `| ${name} | ${esc(it.description)} | ${install} | ${esc(it.cost || "Free")} |`
          );
        }
      } else if (catKey === "extensions") {
        lines.push("| Extension | ID | Descripcion | Costo |");
        lines.push("|-----------|-----|-------------|-------|");
        for (const it of subItems) {
          const name = it.url
            ? `**[${it.name}](${it.url})**`
            : `**${it.name}**`;
          lines.push(
            `| ${name} | \`${it.id}\` | ${esc(it.description)} | ${esc(it.cost || "Free")} |`
          );
        }
      } else if (catKey === "claude-code") {
        if (subKey === "agents") {
          lines.push("| Agent | Descripcion |");
          lines.push("|-------|-------------|");
          for (const it of subItems) {
            lines.push(`| **${it.name}** | ${esc(it.description)} |`);
          }
        } else if (subKey === "skills") {
          lines.push("| Skill | Comando | Descripcion |");
          lines.push("|-------|---------|-------------|");
          for (const it of subItems) {
            const cmd = it.install || `/${it.id}`;
            lines.push(
              `| **${it.name}** | \`${cmd}\` | ${esc(it.description)} |`
            );
          }
        } else if (subKey === "plugins") {
          lines.push("| Plugin | Descripcion | Costo |");
          lines.push("|--------|-------------|-------|");
          for (const it of subItems) {
            const name = it.url
              ? `**[${it.name}](${it.url})**`
              : `**${it.name}**`;
            lines.push(
              `| ${name} | ${esc(it.description)} | ${esc(it.cost || "Free")} |`
            );
          }
        } else {
          // commands or other
          lines.push("| Nombre | Descripcion |");
          lines.push("|--------|-------------|");
          for (const it of subItems) {
            lines.push(`| **${it.name}** | ${esc(it.description)} |`);
          }
        }
      } else {
        // cli, shell, etc — generic table
        lines.push("| Tool | Descripcion | Costo |");
        lines.push("|------|-------------|-------|");
        for (const it of subItems) {
          const name = it.url
            ? `**[${it.name}](${it.url})**`
            : `**${it.name}**`;
          lines.push(
            `| ${name} | ${esc(it.description)} | ${esc(it.cost || "Free")} |`
          );
        }
      }

      lines.push("");
    }

    sectionNum++;
  }

  // Stats footer
  const totalFree = items.filter(
    (i) => !i.cost || i.cost.toLowerCase() === "free"
  ).length;
  const totalPaid = items.filter(
    (i) => i.cost && i.cost.toLowerCase() === "paid"
  ).length;
  const totalFreemium = items.filter(
    (i) => i.cost && i.cost.toLowerCase() === "freemium"
  ).length;

  lines.push("---");
  lines.push("");
  lines.push(
    `> **${items.length} herramientas** en total. ${totalFree} free, ${totalFreemium} freemium, ${totalPaid} paid.`
  );
  lines.push(
    "> Generado automaticamente desde `data.js` — no editar manualmente."
  );
  lines.push("");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// 4. Generate README sections (install commands)
// ---------------------------------------------------------------------------

function generateReadmeSections() {
  const sections = {};

  // Homebrew formulae: items with installMethod "brew" that are CLI tools
  const brewFormulae = [
    ...new Set(
      items
        .filter(
          (i) =>
            i.installMethod === "brew" &&
            i.install &&
            !i.install.includes("--cask")
        )
        .map((i) => i.install.replace("brew install ", "").trim())
    ),
  ].sort();

  sections.brewFormulae = `\`\`\`bash\nbrew install \\\n  ${brewFormulae.join(" \\\n  ")}\n\`\`\``;

  // Homebrew casks
  const brewCasks = [
    ...new Set(
      items
        .filter(
          (i) =>
            i.installMethod === "brew" &&
            i.install &&
            i.install.includes("--cask")
        )
        .map((i) => i.install.replace("brew install --cask ", "").trim())
    ),
  ].sort();

  sections.brewCasks = `\`\`\`bash\nbrew install --cask \\\n  ${brewCasks.join(" \\\n  ")}\n\`\`\``;

  // npm/pnpm globals
  const npmGlobals = [
    ...new Set(
      items
        .filter(
          (i) =>
            (i.installMethod === "npm" || i.installMethod === "pnpm") &&
            i.install &&
            (i.install.includes("npm") || i.install.includes("pnpm"))
        )
        .map((i) =>
          i.install
            .replace(/(?:pnpm|npm) install -g /, "")
            .replace(/pnpm add -g /, "")
            .trim()
        )
    ),
  ].sort();

  sections.npmGlobals = `\`\`\`bash\npnpm add -g \\\n  ${npmGlobals.join(" \\\n  ")}\n\`\`\``;

  // pip packages
  const pipPkgs = items
    .filter(
      (i) =>
        i.installMethod === "pip" && i.install && i.install.includes("pip")
    )
    .map((i) =>
      i.install
        .replace(/(?:uv )?pip install /, "")
        .trim()
    )
    .sort();

  if (pipPkgs.length > 0) {
    sections.pipPackages = `\`\`\`bash\npip3 install \\\n  ${pipPkgs.join(" \\\n  ")}\n\`\`\``;
  }

  // VS Code extensions
  const extensions = items
    .filter((i) => i.category === "extensions")
    .map((i) => i.id)
    .sort();

  sections.vscodeExtensions = extensions
    .map((id) => `code --install-extension ${id}`)
    .join("\n");
  sections.vscodeExtensionsBlock = `\`\`\`bash\n${sections.vscodeExtensions}\n\`\`\``;

  return sections;
}

// ---------------------------------------------------------------------------
// 5. Update README.md in-place (replace sections between markers)
// ---------------------------------------------------------------------------

function updateReadme(sections) {
  const readmePath = join(ROOT, "docs", "SETUP_GUIDE.md");
  let readme = readFileSync(readmePath, "utf-8");

  const replacements = [
    {
      // Section 2: Homebrew Formulae
      pattern:
        /(## 2\. Homebrew Formulae\n\n)```bash[\s\S]*?```/,
      replacement: `$1${sections.brewFormulae}`,
    },
    {
      // Section 3: Homebrew Casks
      pattern:
        /(## 3\. Homebrew Casks\n\n)```bash[\s\S]*?```/,
      replacement: `$1${sections.brewCasks}`,
    },
    {
      // Section 7: Global NPM Packages
      pattern:
        /(## 7\. Global NPM Packages\n\n)```bash[\s\S]*?```/,
      replacement: `$1${sections.npmGlobals}`,
    },
    {
      // Section 8: Python Packages
      pattern:
        /(## 8\. Python Packages \(pip\)\n\n)```bash[\s\S]*?```/,
      replacement: sections.pipPackages
        ? `$1${sections.pipPackages}`
        : null,
    },
    {
      // Section 9: VS Code Extensions
      pattern:
        /(## 9\. VS Code \/ Cursor Extensions\n\n)```bash[\s\S]*?```/,
      replacement: `$1${sections.vscodeExtensionsBlock}`,
    },
  ];

  for (const { pattern, replacement } of replacements) {
    if (!replacement) continue;
    if (pattern.test(readme)) {
      readme = readme.replace(pattern, replacement);
    } else {
      console.warn(`  Warning: Could not find section matching ${pattern.source.slice(0, 40)}...`);
    }
  }

  writeFileSync(readmePath, readme);
  console.log("Updated docs/SETUP_GUIDE.md sections");
}

// ---------------------------------------------------------------------------
// 6. Main
// ---------------------------------------------------------------------------

const toolkit = generateToolkit();
writeFileSync(join(ROOT, "TOOLKIT.md"), toolkit);
console.log(`Generated TOOLKIT.md (${items.length} items)`);

const sections = generateReadmeSections();
updateReadme(sections);

console.log("Done! data.js -> TOOLKIT.md + README.md");
