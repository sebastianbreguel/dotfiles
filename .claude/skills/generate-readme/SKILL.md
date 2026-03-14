---
name: generate-readme
description: This skill should be used when the user asks to "generate a README", "create a README", "write a README for this project", "document this project", "create project documentation", "generate a README.md", or wants an accurate README for a Python project. Also triggers when the user says "this project needs a README" or "document what this repo does".
tools: Read, Glob, Grep, Bash, Write, Edit
---

# Generate README for Python Projects

Analyze a Python project thoroughly and generate an accurate, professional README.md.

**This skill writes files.** It produces a README.md at the project root after a complete analysis pass.

## Workflow

### Phase 1: Project Discovery

Run these commands to map the project structure:

```bash
# Overall layout
find . -maxdepth 3 -not -path "./.git/*" -not -path "./__pycache__/*" -not -path "./.venv/*" -not -path "./node_modules/*" | sort

# Python package metadata
cat pyproject.toml 2>/dev/null || cat setup.py 2>/dev/null || cat setup.cfg 2>/dev/null

# Dependency info
cat requirements.txt 2>/dev/null || cat requirements/*.txt 2>/dev/null || cat Pipfile 2>/dev/null

# Environment variables
cat .env.example 2>/dev/null || cat .env.sample 2>/dev/null
```

**Capture from metadata:**
- Project name, version, description
- Author(s) and license
- Python version requirement
- All dependencies (with their purpose)

---

### Phase 2: Understand the Codebase

Read entry points and core modules to understand what the project actually does:

```bash
# Identify entry points
grep -r "if __name__" . --include="*.py" -l
grep -r "def main" . --include="*.py" -l

# CLI interfaces
cat cli.py 2>/dev/null
grep -r "@click\|argparse\|typer" . --include="*.py" -l | head -5

# FastAPI / Flask / Django routers
grep -r "@app\.\|router\.\|urlpatterns" . --include="*.py" -l | head -5
```

Read the top-level entry point files fully. For each core module, read enough to understand its purpose and public interface (functions, classes, endpoints). Do not skip this step — the README accuracy depends entirely on reading the actual code.

**Key things to capture per module:**
- What it does (one sentence)
- Public functions/classes exposed
- Any notable algorithms or techniques

---

### Phase 3: Configuration & Environment

```bash
# Docker setup
cat Dockerfile 2>/dev/null
cat docker-compose.yml 2>/dev/null || cat docker-compose.yaml 2>/dev/null

# CI/CD
ls .github/workflows/ 2>/dev/null

# Config files
ls config/ 2>/dev/null
cat config.py 2>/dev/null || cat settings.py 2>/dev/null
```

Note every required environment variable and configuration option.

---

### Phase 4: Tests & Dev Tooling

```bash
# Test framework
cat pytest.ini 2>/dev/null || cat pyproject.toml | grep -A 20 "\[tool.pytest"
ls tests/ 2>/dev/null

# Linting / formatting
cat .pre-commit-config.yaml 2>/dev/null
grep -E "ruff|black|flake8|mypy|isort" pyproject.toml 2>/dev/null
```

Identify how to run tests and any dev-only setup steps.

---

### Phase 5: Generate the README

Write the README.md using only verified facts gathered above. Follow the structure in [references/readme-template.md](references/readme-template.md).

**Rules:**
- Never invent features or capabilities not seen in the code
- Use the actual project name from metadata (not the directory name unless they match)
- Every command in the README must be real and runnable
- If something is unclear from the code, omit it rather than guess
- Prefer concrete examples over abstract descriptions

**Tone:** Professional, concise, developer-focused. Use active voice.

After writing the file, output a short summary of:
- What the project does (2-3 sentences)
- Sections included in the README
- Any gaps noticed (missing .env.example, no test suite, etc.)

## Additional Resources

- **`references/readme-template.md`** — Full README template with all sections and guidance on when to include each
