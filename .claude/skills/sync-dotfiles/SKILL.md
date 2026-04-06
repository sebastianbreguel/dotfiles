---
name: sync-dotfiles
description: Sync the current machine's configuration into the dotfiles repo and update the React showcase page. Use this skill whenever the user says "sync dotfiles", "update dotfiles", "sync config", "actualizar dotfiles", "sincronizar config", "update the repo with my current setup", or anything about pulling their current machine state into the dotfiles repo. Also trigger when the user mentions updating the toolkit page, adding new tools to the page, or keeping the dotfiles repo in sync with what's actually installed.
---

# Sync Dotfiles

This skill pulls the current machine's configuration into the dotfiles repo and updates both the data files and the README so everything stays in sync.

The dotfiles repo lives at `~/personal/dotfiles` (or wherever the current working directory is if it contains `setup.sh` and `app/src/data.js`).

## Overview

There are three layers to sync:
1. **Config files** — copy actual dotfiles from the machine into the repo
2. **Installed tools** — detect what's installed (brew, npm, pip, vscode, etc.) and update `data.js` + `README.md`
3. **Claude Code config** — sync agents, skills, commands, hooks, and settings

Run all three layers every time. Show a summary at the end.

## Step 1: Sync Config Files

Copy these files from the machine into the repo, overwriting what's there:

| Source (machine) | Destination (repo) |
|---|---|
| `~/.zshrc` | `shell/.zshrc` |
| `~/.p10k.zsh` | `shell/.p10k.zsh` |
| `~/.gitconfig` | `git/.gitconfig` |
| `~/.gitignore_global` or `~/.config/git/ignore` | `git/ignore` |
| `~/.ssh/config` | `ssh/config` |
| `~/Library/Application Support/Code/User/settings.json` | `vscode/settings.json` |
| `~/.config/gh/config.yml` | `gh/config.yml` |
| `~/.config/cmux/settings.json` | `settings.json` (root) |

For each file:
- Only copy if the source exists
- After copying, run a quick diff to track what changed
- **Never copy secrets** — skip files that contain tokens, passwords, or API keys. If `.gitconfig` has credential helpers with inline tokens, strip those lines before copying.

## Step 2: Detect Installed Tools

Run these commands to get the current state of the machine:

```bash
# Brew
brew leaves                          # formulae (user-installed only)
brew list --cask                     # casks

# VS Code / Cursor extensions
code --list-extensions 2>/dev/null
cursor --list-extensions 2>/dev/null

# Global packages
pnpm ls -g 2>/dev/null || npm ls -g --depth=0
uv pip list 2>/dev/null || pip list --not-required 2>/dev/null

# Claude Code
ls ~/.claude/agents/*.md 2>/dev/null           # agents
ls ~/.claude/skills/*/SKILL.md 2>/dev/null     # skills
ls ~/.claude/commands/*.md 2>/dev/null          # commands
cat ~/.claude/settings.json 2>/dev/null        # settings
```

Compare each list against what's currently in `app/src/data.js` (the `items` array).

### Updating data.js

For **new items** not yet in data.js:
- Generate an entry following the existing schema:
  ```js
  {
    id: "tool-name",           // lowercase, hyphenated
    name: "Tool Name",        // display name
    category: "cli",          // apps | cli | shell | claude-code | extensions
    subcategory: "dev-tools", // must match CATEGORIES in data.js
    description: "Brief description of what it does.",
    install: "brew install tool-name",
    installMethod: "brew",    // brew | npm | pip | manual | marketplace
    cost: "free",             // free | freemium | paid
    tags: ["relevant", "tags"],
    url: "https://...",       // official site (look it up)
    related: ["other-tool"],  // IDs of related items already in data.js
    why: "Why this tool is useful — write in the user's voice (Spanish, casual).",
  }
  ```
- Place the entry in the correct section (items are grouped by category/subcategory with comment headers like `// === CLI: Dev Tools ===`)
- For the `why` field: write a short, opinionated reason in Spanish, matching the casual tone of existing entries (e.g., "Lo uso para X. Hace Y mucho mas facil.")
- If you're unsure about category/subcategory for a new tool, pick the best fit and flag it in the summary

For **removed items** (in data.js but no longer installed):
- Don't auto-remove — flag them in the summary so the user can decide

### Regenerating TOOLKIT.md and README.md

**Do not manually edit TOOLKIT.md or README install sections.** Instead, after updating `data.js`, run the generator script:

```bash
node scripts/generate-docs.js
```

This script reads `data.js` (the single source of truth) and:
- Regenerates `TOOLKIT.md` completely (all tables, all categories)
- Updates docs/SETUP_GUIDE.md sections 2, 3, 7, 8, and 9 (brew, casks, npm, pip, vscode) in-place

### Updating setup.sh

Check if `setup.sh` has hardcoded lists (brew formulae, casks, npm packages, etc.) and update them to match the current machine state. Keep the script structure intact — only update the package lists.

## Step 3: Sync Claude Code Config

Copy Claude Code configuration into the repo's `.claude/` directory:

```bash
# Settings (but NOT settings.local.json — that's per-project)
cp ~/.claude/settings.json .claude/settings.json

# CLAUDE.md and referenced files
cp ~/.claude/CLAUDE.md .claude/CLAUDE.md
cp ~/.claude/RTK.md .claude/RTK.md 2>/dev/null

# Agents
cp ~/.claude/agents/*.md .claude/agents/ 2>/dev/null

# Commands
mkdir -p .claude/commands
cp ~/.claude/commands/*.md .claude/commands/ 2>/dev/null

# Hooks
mkdir -p .claude/hooks
cp ~/.claude/hooks/* .claude/hooks/ 2>/dev/null

# Skills (except gstack which is a git clone, and marketplace plugins)
for skill_dir in ~/.claude/skills/*/; do
  skill_name=$(basename "$skill_dir")
  # Skip gstack (managed via git) and any marketplace-installed plugins
  [[ "$skill_name" == "gstack" ]] && continue
  [[ -d "$skill_dir/.git" ]] && continue
  cp -r "$skill_dir" .claude/skills/
done
```

**Important**: Don't copy `~/.claude/settings.local.json` — that's per-project. Don't copy marketplace plugins (they live in `~/.claude/plugins/marketplaces/`). Don't copy the `memory/` directory.

## Step 4: Regenerate Docs

After updating `data.js` with new/changed items, run the generator:

```bash
node scripts/generate-docs.js
```

This regenerates `TOOLKIT.md` and updates README.md install sections automatically. Never edit those files by hand.

## Step 5: Summary

After syncing, print a clear summary:

```
## Sync Summary

### Config files updated
- shell/.zshrc (changed: added 3 aliases)
- git/.gitconfig (no changes)
- ...

### New tools detected (added to data.js)
- deno (cli/dev-tools) — JS/TS runtime
- shellcheck (cli/dev-tools) — shell script linter
- ...

### Possibly removed tools (still in data.js but not found on machine)
- ripgrep — not in `brew leaves` output. Remove from data.js? (y/n)

### README sections updated
- Section 2: Homebrew Formulae (+3 new, -1 removed)
- Section 9: VS Code Extensions (+2 new)
- ...

### Claude Code config synced
- 16 agents (2 new: ...)
- 24 skills (1 new: ...)
- settings.json updated
```

### Drift check (setup.sh vs data.js)

Before asking the user to review, cross-reference `setup.sh` against `data.js` to catch drift:

1. **Brew formulae** — Extract the package list from `setup.sh` line 20 (the `brew install ...` line). Compare against all items in `data.js` that have `installMethod: "brew"` and do **not** contain `--cask` in their `install` field. Flag mismatches.
2. **Brew casks** — Extract the cask list from `setup.sh` line 24 (the `brew install --cask ...` line). Compare against all items in `data.js` that contain `--cask` in their `install` field. Flag mismatches.
3. **npm/pnpm globals** — Extract the global package list from `setup.sh` line 68. Compare against all items in `data.js` with `installMethod` of `"npm"` or `"pnpm"`. Flag mismatches.
4. **VS Code extensions** — Extract extensions from `setup.sh` lines 134-143. Compare against all items in `data.js` with `category: "extensions"`. Flag mismatches.

For each comparison, report mismatches in this format:

```
### Drift: setup.sh vs data.js
- In setup.sh but not in data.js: tool-x, tool-y
- In data.js but not in setup.sh: tool-z
```

If there are any mismatches, ask the user if they want to update `setup.sh` to match `data.js` (since `data.js` is the source of truth).

Ask the user to review the changes before committing. Use `git diff` to show what changed.

## Notes

- This skill is meant to be run periodically (e.g., weekly) to keep the repo in sync
- It's a pull operation (machine → repo), not a push (repo → machine). For pushing, use `setup.sh`
- When in doubt, add to the summary and let the user decide rather than auto-removing
