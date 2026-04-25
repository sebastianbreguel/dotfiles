---
allowed-tools: Bash(uv:*), Bash(pytest:*), Read, Glob
argument-hint: [path-or-pattern] [--coverage]
description: Run pytest with failure details and optional coverage
---

Run the test suite for the current project.

1. Detect test directory (`tests/`, `test/`, or files matching `test_*.py`)
2. If $ARGUMENTS provided, run `uv run pytest $ARGUMENTS`
3. If no arguments: `uv run pytest -v --tb=short`
4. If `--coverage` in arguments: `uv run pytest --cov --cov-report=term-missing`
5. Report: total tests, passed, failed, skipped, duration
6. For failures: show file:line, test name, assertion error
