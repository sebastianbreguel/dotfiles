---
allowed-tools: Bash(uv:*), Bash(cat:*), Read, Glob
description: Run full pre-commit suite (ruff, ty, isort, all hooks)
---

Run the full pre-commit pipeline on the current project.

1. Verify `pyproject.toml` or `.pre-commit-config.yaml` exists
2. Run `uv run pre-commit run --all-files`
3. If pre-commit not configured, fall back to: `uv run ruff check --fix . && uv run ruff format . && uv run ty check`
4. Report: total files checked, pass/fail per hook, any auto-fixed files
