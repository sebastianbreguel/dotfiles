# README Template for Python Projects

Use this template as a guide. Include only sections that are relevant and have real content. Remove placeholder text before writing.

---

```markdown
# {Project Name}

> {One-line description of what it does and why it exists}

{2-4 sentence overview: what problem it solves, who uses it, and the approach it takes. Keep this grounded in what the code actually does.}

## Table of Contents
<!-- Include only if README has 5+ sections -->
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Architecture](#architecture)
- [Development](#development)
- [License](#license)

---

## Features
<!-- List real features visible in the codebase. Use bullet points. No future roadmap here. -->
- {Feature 1 — be specific, e.g. "Clusters customer feedback using k-means on sentence embeddings"}
- {Feature 2}
- {Feature 3}

---

## Requirements

- Python {version} (from pyproject.toml / setup.cfg)
- {External service if any, e.g., "OpenAI API key", "PostgreSQL 14+"}
<!-- Omit this section if requirements are trivial -->

---

## Installation

```bash
# Clone
git clone {repo-url}
cd {project-name}

# Create virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -e .
# OR: pip install -r requirements.txt
```

<!-- If there are optional dependency groups, list them:
pip install -e ".[dev]"  # development dependencies
-->

---

## Configuration

Copy the example environment file and fill in required values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `{VAR_NAME}` | Yes | {What it does} |
| `{VAR_NAME}` | No | {What it does, and the default value} |

<!-- Omit this section if the project has no configuration -->

---

## Usage

### {Primary Use Case}

```bash
{actual command to run the project}
```

### {Secondary Use Case / API Example}
<!-- Include only if there's a meaningful programmatic API -->

```python
from {module} import {Class}

instance = {Class}(...)
result = instance.{method}(...)
```

<!-- For web services, include: how to start, default port, key endpoints -->
<!-- For CLI tools, show real flag examples from argparse/click/typer definitions -->
<!-- For notebooks, show how to launch and which notebook to start with -->

---

## Architecture
<!-- Include this section only for non-trivial projects (>3 modules or a pipeline) -->

```
{project-name}/
├── {module}/          # {What this module is responsible for}
│   ├── {file.py}      # {Purpose}
│   └── ...
├── {module}/          # {Purpose}
├── tests/
└── {config file}
```

{1-3 sentences describing the data flow or main abstractions, e.g. "Data flows from X → Y → Z. The {Class} is the central coordinator."}

---

## Development

### Running Tests

```bash
pytest
# OR: pytest tests/ -v
```

### Code Quality

```bash
# Linting
{ruff check . / flake8 / etc.}

# Formatting
{black . / ruff format . / etc.}

# Type checking (if mypy configured)
mypy {src_dir}
```

### Pre-commit Hooks
<!-- Include only if .pre-commit-config.yaml exists -->

```bash
pre-commit install
pre-commit run --all-files
```

---

## License

{License name} — see [LICENSE](LICENSE) for details.
<!-- If no LICENSE file: "License not specified." -->
```

---

## Section Inclusion Guide

| Section | Include when |
|---------|-------------|
| Features | Project has 3+ distinct capabilities |
| Requirements | Non-standard Python version or external services needed |
| Configuration | Any environment variables or config files required |
| Architecture | Project has pipeline structure, multiple interacting modules, or non-obvious data flow |
| Development | Test suite exists, or linting/formatting tools are configured |
| Table of Contents | README has 5+ sections |

## Common Mistakes to Avoid

- **Don't copy the description from pyproject.toml verbatim** if it's too terse — expand it
- **Don't list dependencies as features** (e.g., "Uses OpenAI" is not a feature)
- **Don't invent CLI flags** — read the actual argparse/click/typer code
- **Don't include a "Contributing" section** unless there's a CONTRIBUTING.md already
- **Don't add badges** unless the CI/CD pipelines and package registries are confirmed present
