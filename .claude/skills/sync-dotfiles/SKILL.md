---
name: sync-dotfiles
description: Sync the current machine's configuration into the dotfiles repo and update the React showcase page. Use this skill whenever the user says "sync dotfiles", "update dotfiles", "sync config", "actualizar dotfiles", "sincronizar config", "update the repo with my current setup", or anything about pulling their current machine state into the dotfiles repo. Also trigger when the user mentions updating the toolkit page, adding new tools to the page, syncing Claude Code or Codex config (AGENTS.md, codex agents/skills/hooks), or keeping the dotfiles repo in sync with what's actually installed.
---

# Sync Dotfiles

This skill does a **full replace sync** — it deletes stale state in the repo and rebuilds from the machine's current configuration. It is NOT append-only; tools, configs, agents, and skills that no longer exist on the machine get removed from the repo.

The dotfiles repo lives at `~/personal/dotfiles` (or wherever the current working directory is if it contains `setup.sh` and `app/src/data.js`).

## Philosophy: Delete + Recreate, Not Append

Every sync is a clean mirror of the machine. The repo should reflect **exactly** what's installed right now:
- Tool uninstalled → removed from `data.js`, `setup.sh`, and generated docs
- Agent/skill/command deleted from `~/.claude/` → deleted from repo's `.claude/`
- Config file changed → overwritten in repo
- Config file removed from machine → removed from repo

## Overview

There are four layers to sync:
1. **Config files** — copy actual dotfiles from the machine into the repo (overwrite)
2. **Installed tools** — detect what's installed, rebuild `data.js` (add new + remove missing), update `setup.sh` + generated docs
3. **Claude Code config** — clean repo dirs then copy fresh from machine
4. **Codex config** — clean repo dirs then copy fresh portable Codex config (`AGENTS.md`, agents, skills, hooks, tools, rules)

Run all four layers every time. Show a summary at the end.

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
- Only copy if the source exists on the machine
- If a repo destination exists but the source is gone from the machine → **delete** it from the repo and flag in summary
- After copying, run a quick diff to track what changed
- **Never copy secrets** — skip files that contain tokens, passwords, or API keys. If `.gitconfig` has credential helpers with inline tokens, strip those lines before copying.

## Step 2: Detect Installed Tools & Rebuild data.js

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

### Updating data.js — Full Sync (add + remove)

Compare detected tools against `app/src/data.js` (the `items` array). Two operations:

#### Adding new items

For tools detected on the machine but not in data.js:
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

#### Removing uninstalled items

For items in data.js whose corresponding tool is **no longer detected** on the machine:
- **Auto-remove** the entry from data.js
- Also clean up any `related` references to the removed item's ID in other entries
- Log each removal in the summary

This ensures data.js is always a 1:1 mirror of what's actually installed.

### Updating setup.sh — Full Rebuild of Package Lists

Replace (not append to) the hardcoded package lists in `setup.sh` with the current machine state:

1. **Brew formulae** — replace the `brew install ...` line with current `brew leaves` output
2. **Brew casks** — replace the `brew install --cask ...` line with current `brew list --cask` output
3. **npm/pnpm globals** — replace the global package install line with current globals
4. **VS Code extensions** — replace the extension install lines with current `code --list-extensions` output

Keep the script structure and surrounding logic intact — only replace the package list values.

### Regenerating TOOLKIT.md and docs

**Do not manually edit TOOLKIT.md or README install sections.** After updating `data.js`, run the generator script:

```bash
node scripts/generate-docs.js
```

This script reads `data.js` (the single source of truth) and:
- Regenerates `TOOLKIT.md` completely (all tables, all categories)
- Updates docs/SETUP_GUIDE.md sections 2, 3, 7, 8, and 9 (brew, casks, npm, pip, vscode) in-place

## Step 3: Sync Claude Code Config — Clean + Copy

**Delete first, then copy.** This ensures removed agents/skills/commands/hooks don't linger in the repo.

```bash
# Settings (but NOT settings.local.json — that's per-project)
cp ~/.claude/settings.json .claude/settings.json

# CLAUDE.md and referenced files
cp ~/.claude/CLAUDE.md .claude/CLAUDE.md
cp ~/.claude/RTK.md .claude/RTK.md 2>/dev/null

# Agents — delete repo dir contents, then copy fresh
rm -f .claude/agents/*.md
cp ~/.claude/agents/*.md .claude/agents/ 2>/dev/null

# Commands — delete repo dir contents, then copy fresh
rm -f .claude/commands/*.md
mkdir -p .claude/commands
cp ~/.claude/commands/*.md .claude/commands/ 2>/dev/null

# Hooks — delete repo dir contents, then copy fresh
rm -rf .claude/hooks/*
mkdir -p .claude/hooks
cp ~/.claude/hooks/* .claude/hooks/ 2>/dev/null

# Skills — delete all non-git-managed skill dirs, then copy fresh
# Preserve: sync-dotfiles (this skill), any .git-managed dirs
for skill_dir in .claude/skills/*/; do
  skill_name=$(basename "$skill_dir")
  [[ "$skill_name" == "sync-dotfiles" ]] && continue
  [[ -d "$skill_dir/.git" ]] && continue
  rm -rf "$skill_dir"
done

for skill_dir in ~/.claude/skills/*/; do
  skill_name=$(basename "$skill_dir")
  [[ "$skill_name" == "gstack" ]] && continue
  [[ -d "$skill_dir/.git" ]] && continue
  # Use mkdir + cp contents to avoid trailing-slash flattening
  mkdir -p ".claude/skills/$skill_name"
  cp -r "$skill_dir"* ".claude/skills/$skill_name/" 2>/dev/null
done
```

**Important**: Don't copy `~/.claude/settings.local.json` — that's per-project. Don't copy marketplace plugins (they live in `~/.claude/plugins/marketplaces/`). Don't copy the `memory/` directory.

## Step 4: Sync Codex Config — Clean + Copy

Codex (the CLI) keeps its config in `~/.codex/`, mixed with a lot of runtime state. **Only the portable config gets synced** — everything else is machine-local junk or secrets and must NEVER be copied.

Same **delete-first-then-copy** discipline as Step 3 so removed agents/skills don't linger.

### What to sync (portable config)

| Source (machine) | Destination (repo) |
|---|---|
| `~/.codex/AGENTS.md` | `AGENTS.md` (repo root — Codex's equivalent of CLAUDE.md) |
| `~/.codex/config.toml` | `.codex/config.toml` (**secret-scan first**, see below) |
| `~/.codex/hooks.json` | `.codex/hooks.json` |
| `~/.codex/agents/*.toml` | `.codex/agents/` |
| `~/.codex/skills/*/` | `.codex/skills/` |
| `~/.codex/rules/` | `.codex/rules/` |
| `~/.codex/tools/` | `.codex/tools/` (hook scripts referenced by `hooks.json`, e.g. `wherewasi.py`) |
| `~/.codex/engram-instructions.md` | `.codex/engram-instructions.md` |
| `~/.codex/engram-compact-prompt.md` | `.codex/engram-compact-prompt.md` |

### What to NEVER sync (runtime state + secrets)

These are machine-local or contain credentials — exclude them all:

- **Secrets**: `auth.json` (OAuth tokens), `.codex-global-state.json*`
- **Databases**: `*.sqlite`, `*.sqlite-shm`, `*.sqlite-wal` (goals, logs, memories, state)
- **History/sessions**: `history.jsonl`, `session_index.jsonl`, `sessions/`, `external_agent_session_imports.json`, `log/`, `logs*`
- **Caches/temp**: `cache/`, `models_cache.json`, `.tmp/`, `tmp/`, `shell_snapshots/`
- **Other runtime**: `plugins/`, `vendor_imports/`, `computer-use/`, `process_manager/`, `ambient-suggestions/`, `memories/`, `context-mode/`, `chrome-native-hosts-v2.json`, `installation_id`, `version.json`, `.personality_migration`, `*.bak*`

### config.toml secret scan (mandatory)

`config.toml` may reference env vars by **name** (e.g. `"AGENTMEMORY_SECRET"` inside an `env_vars = [...]` array) — those are safe (just names, values come from the environment). But before copying, scan for **inline** secret values and strip/skip if found:

```bash
grep -inE '(token|secret|password|api[_-]?key|bearer)\s*=\s*["'\'']' ~/.codex/config.toml
```

If that matches an actual assigned value (not an array of names), do NOT copy that line — flag it in the summary so the user can move it to an env var.

### Commands

```bash
# AGENTS.md (repo root) + engram prompt files
cp ~/.codex/AGENTS.md AGENTS.md 2>/dev/null
cp ~/.codex/engram-instructions.md .codex/engram-instructions.md 2>/dev/null
cp ~/.codex/engram-compact-prompt.md .codex/engram-compact-prompt.md 2>/dev/null

# config.toml (AFTER secret scan above) + hooks.json
cp ~/.codex/config.toml .codex/config.toml
cp ~/.codex/hooks.json .codex/hooks.json 2>/dev/null

# Remove the stale .codex/hooks/ dir — it was wrongly copied from ~/.claude/hooks
# in an earlier manual sync. Codex's real hook scripts live in ~/.codex/tools/.
rm -rf .codex/hooks

# Agents — delete repo dir contents, then copy fresh
rm -f .codex/agents/*.toml
mkdir -p .codex/agents
cp ~/.codex/agents/*.toml .codex/agents/ 2>/dev/null

# Skills — delete repo dir, then copy fresh
rm -rf .codex/skills
mkdir -p .codex/skills
cp -r ~/.codex/skills/* .codex/skills/ 2>/dev/null

# Rules — delete repo dir, then copy fresh
rm -rf .codex/rules
mkdir -p .codex/rules
cp -r ~/.codex/rules/* .codex/rules/ 2>/dev/null

# Tools — delete repo dir, then copy fresh (hook scripts)
rm -rf .codex/tools
mkdir -p .codex/tools
cp -r ~/.codex/tools/* .codex/tools/ 2>/dev/null
```

**Do NOT sync `~/.agents/skills/`** — that's a large shared skill store (mostly marketplace-installed). This skill leaves it untouched, same as it skips Claude marketplace plugins.

## Step 5: Regenerate Docs

After updating `data.js`, run the generator:

```bash
node scripts/generate-docs.js
```

This regenerates `TOOLKIT.md` and updates setup guide sections automatically. Never edit those files by hand.

## Step 6: Summary

After syncing, print a clear summary:

```
## Sync Summary

### Config files
- shell/.zshrc (updated — 3 lines changed)
- git/.gitconfig (no changes)
- ssh/config (REMOVED — no longer exists on machine)
- ...

### Tools added to data.js
- deno (cli/dev-tools) — JS/TS runtime
- shellcheck (cli/dev-tools) — shell script linter

### Tools removed from data.js
- neo4j — uninstalled from machine
- cursor — no longer detected

### setup.sh package lists rebuilt
- Brew formulae: 45 packages (was 43)
- Brew casks: 12 packages (was 14, removed: neo4j, cursor)
- npm globals: 8 packages (no change)
- VS Code extensions: 22 (was 20)

### Claude Code config synced
- 16 agents (2 new, 1 removed: old-agent)
- 24 skills (1 new, 0 removed)
- 3 commands (no change)
- settings.json updated

### Codex config synced
- AGENTS.md updated
- config.toml updated (no inline secrets found)
- 18 agents (.toml)
- 2 skills
- hooks.json + tools/ synced (stale .codex/hooks/ removed)
- rules/ synced

### Docs regenerated
- TOOLKIT.md ✓
- docs/SETUP_GUIDE.md ✓
```

### Drift check (setup.sh vs data.js)

After rebuilding both, cross-reference to verify they're in sync:

1. **Brew formulae** — Extract the package list from `setup.sh`. Compare against all items in `data.js` with `installMethod: "brew"` (no `--cask`). Flag mismatches.
2. **Brew casks** — Extract the cask list from `setup.sh`. Compare against items with `--cask` in `install` field. Flag mismatches.
3. **npm/pnpm globals** — Extract global packages from `setup.sh`. Compare against `installMethod: "npm"` or `"pnpm"`. Flag mismatches.
4. **VS Code extensions** — Extract extensions from `setup.sh`. Compare against `category: "extensions"`. Flag mismatches.

If any mismatches remain after rebuild, fix them (data.js is source of truth) and report in summary.

Ask the user to review the changes before committing. Use `git diff` to show what changed.

## Notes

- This skill is meant to be run periodically (e.g., weekly) to keep the repo in sync
- It's a **destructive pull** operation (machine → repo): what's on the machine wins, what's not gets deleted
- For pushing (repo → machine), use `setup.sh`
- The only things preserved during cleanup: this skill itself (`sync-dotfiles`), git-managed skill dirs, and marketplace plugins
- Codex sync only mirrors **portable** config from `~/.codex/` (AGENTS.md, agents, skills, hooks.json, tools, rules, config.toml). Runtime state, databases, sessions, and `auth.json` are never copied. The shared `~/.agents/skills/` store is left untouched.
