# Toolkit

Catalogo completo de apps, plugins, extensiones y herramientas instaladas.

---

## Indice

1. [Mac Apps](#1-mac-apps)
2. [Claude Code - Plugins](#2-claude-code---plugins)
3. [Claude Code - Skills](#3-claude-code---skills)
4. [Claude Code - Custom Agents](#4-claude-code---custom-agents)
5. [Claude Code - Custom Commands](#5-claude-code---custom-commands)
6. [VS Code / Cursor - Extensions](#6-vs-code--cursor---extensions)
7. [CLI Tools (npm global)](#7-cli-tools-npm-global)
8. [Shell Plugins](#8-shell-plugins)
9. [Homebrew CLI Tools](#9-homebrew-cli-tools)

---

## 1. Mac Apps

### Browsers & Comunicacion

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[Brave Browser](https://brave.com/)** | Browser basado en Chromium con bloqueo de ads y trackers integrado. | `brew install --cask brave-browser` | Free |
| **[Google Chrome](https://www.google.com/chrome/)** | Browser de Google. Sync, extensions, DevTools. | `brew install --cask google-chrome` | Free |
| **[Slack](https://slack.com/)** | Mensajeria para equipos. Canales, threads, integraciones. | `brew install --cask slack` | Free (Pro opcional) |
| **[Beeper](https://www.beeper.com/)** | Mensajeria unificada. iMessage, WhatsApp, Telegram, Discord, etc en una app. | `brew install --cask beeper` | Free |

### Desarrollo

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[Cursor](https://cursor.sh/)** | Editor de codigo basado en VS Code con AI integrado (Claude, GPT). | `brew install --cask cursor` | Free (Pro $20/mes) |
| **[Claude Desktop](https://claude.ai/)** | App de escritorio de Claude. Chat + Claude Code integrado. | `brew install --cask claude` | Free (Pro $20/mes) |
| **[Docker Desktop](https://www.docker.com/)** | Contenedores. Ejecuta apps aisladas, dev environments, bases de datos. | `brew install --cask docker` | Free (Pro opcional) |
| **[DataGrip](https://www.jetbrains.com/datagrip/)** | IDE de JetBrains para bases de datos. SQL, PostgreSQL, Redis, etc. | `brew install --cask datagrip` | Paid ($9.90/mes) |
| **[Postman](https://www.postman.com/)** | Testing y documentacion de APIs. Collections, environments, mock servers. | `brew install --cask postman` | Free (Pro opcional) |
| **[Neo4j Desktop](https://neo4j.com/)** | Gestion de bases de datos de grafos Neo4j. | Manual | Free |
| **[RightFont](https://rightfontapp.com/)** | Gestor de fuentes para macOS. Preview, activacion, organizacion. | Manual | Free (Pro opcional) |
| **[Visual Studio Code](https://code.visualstudio.com/)** | Editor de codigo open source de Microsoft. Extensions marketplace. | `brew install --cask visual-studio-code` | Free |
| **[Xcode](https://developer.apple.com/xcode/)** | IDE de Apple para desarrollo iOS/macOS. | Mac App Store | Free |
| **[Obsidian](https://obsidian.md/)** | Editor de notas en Markdown. Plugins, graph view, vault local. | `brew install --cask obsidian` | Free |
| **[Conductor](https://www.conductor.dev/)** | Observabilidad y monitoreo de infraestructura. | Manual | Enterprise |

### Utilidades del Sistema

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[1Password CLI](https://1password.com/)** | Acceso a passwords desde terminal. Secrets management. | `brew install --cask 1password-cli` | Paid ($2.99/mes) |
| **[AltTab](https://alt-tab-macos.netlify.app/)** | Window switcher estilo Windows. Preview de ventanas con Alt+Tab. | `brew install --cask alt-tab` | Free |
| **[BetterDisplay](https://betterdisplay.pro/)** | Control avanzado de monitores. Resoluciones custom, brightness, HDR. | `brew install --cask betterdisplay` | Free (Pro $18) |
| **[Ice](https://github.com/jordanbaird/Ice)** | Menu bar manager. Oculta iconos para mantener la barra limpia. | `brew install --cask jordanbaird-ice` | Free |
| **[Rectangle](https://rectangleapp.com/)** | Window management con atajos de teclado. Snapping, splits. | `brew install --cask rectangle` | Free |
| **[Stats](https://github.com/exelban/stats)** | Monitor del sistema en la menu bar. CPU, RAM, disco, red, bateria. | `brew install --cask stats` | Free |
| **[Macs Fan Control](https://crystalidea.com/macs-fan-control)** | Control manual de ventiladores y monitoreo de temperatura. | `brew install --cask macs-fan-control` | Free (Pro $14.95) |
| **[OnyX](https://www.titanium-software.fr/en/onyx.html)** | Mantenimiento y optimizacion de macOS. Limpieza de cache, permisos. | `brew install --cask onyx` | Free |
| **[cmux](https://github.com/nicholasgasior/cmux)** | Multiplexor de sesiones Claude Code. Multiples sesiones en paralelo. | `brew install --cask cmux` | Free |

### Seguridad & Enterprise

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[Cloudflare WARP](https://1.1.1.1/)** | VPN y DNS seguro de Cloudflare. Encripta trafico de red. | `brew install --cask cloudflare-warp` | Free |
| **[Drata Agent](https://drata.com/)** | Agente de compliance (SOC2, ISO). Monitorea configuracion de seguridad. | Manual (empresa) | Enterprise |

### Media

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[Spotify](https://spotify.com/)** | Streaming de musica y podcasts. | `brew install --cask spotify` | Free (Premium $10.99/mes) |

---

## 2. Claude Code - Plugins

Plugins del marketplace de Claude Code. Se activan desde `settings.json`.

| Plugin | Descripcion | Source | Costo |
|--------|-------------|--------|-------|
| **context-mode** | Optimiza el context window ejecutando comandos en sandbox y devolviendo solo resumenes. Ahorra ~80% de tokens. | [mksglu/context-mode](https://github.com/mksglu/context-mode) | Free |
| **code-simplifier** | Revisa codigo modificado para simplificar, mejorar calidad y encontrar issues. | claude-plugins-official | Free |
| **context7** | Context7 MCP server para busqueda de documentacion en tiempo real. | claude-plugins-official | Free |
| **frontend-design** | Herramientas de disenio frontend: componentes, layouts, CSS. | claude-plugins-official | Free |
| **playwright** | Browser automation via Playwright MCP. Testing, scraping, interaccion web. | claude-plugins-official | Free |
| **skill-creator** | Crea, modifica y mide rendimiento de skills custom para Claude Code. | claude-plugins-official | Free |
| **superpowers** | Superpowers: writing-plans, executing-plans, brainstorming, systematic-debugging. | claude-plugins-official | Free |
| **claude-hud** | HUD (Heads-Up Display) para Claude Code. Status line con info en tiempo real. | [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) | Free |
| **feature-dev** | Asistente de desarrollo de features. Planificacion, implementacion, testing. | claude-plugins-official | Free |
| **socraticode** | Metodo socratico para code review. Preguntas que mejoran la calidad del codigo. | [giancarloerra/socraticode](https://github.com/giancarloerra/socraticode) | Free |

---

## 3. Claude Code - Skills

Skills instalados via [gstack](https://github.com/garrytan/gstack) (Garry Tan) y custom. Se invocan con `/skill-name`.

| Skill | Comando | Descripcion | Costo |
|-------|---------|-------------|-------|
| **Ask** | `/ask` | Pregunta al AI que escribio el codigo. Ayuda a entender codigo existente, onboarding, walkthroughs. | Free |
| **Browse** | `/browse` | Headless browser para QA testing y dogfooding. Navega URLs, interactua con elementos, toma screenshots. ~100ms por comando. | Free |
| **Browser Automation** | `/browser-automation` | Browser automation CLI para AI agents. Navegacion, forms, scraping, screenshots. | Free |
| **Cross-AI Debate** | `/cross-ai-debate` | Debate adversarial entre Claude Code, Codex CLI y Gemini CLI. Analisis multi-perspectiva. | Free |
| **Doc Sync** | `/doc-sync` | Auditoria y sincronizacion de CLAUDE.md y README.md. Detecta drift en documentacion. | Free |
| **Dream** | `/dream` | Consolidacion de memoria multi-fase. Orienta memorias, merge updates, pruning. | Free |
| **Electron** | `/electron` | Automatiza apps Electron (VS Code, Slack, Discord, Figma) via Chrome DevTools Protocol. | Free |
| **Explore App** | `/explore-app` | Exploracion sistematica de web apps para encontrar bugs y UX issues. Reporte con screenshots. | Free |
| **FastAPI Standards** | `/fastAPI-standards` | Guia para construir/refactorizar pipelines FastAPI + Prefect + PostgreSQL/pgvector. | Free |
| **Generate README** | `/generate-readme` | Genera README preciso para proyectos Python analizando el codigo fuente. | Free |
| **Git AI Search** | `/git-ai-search` | Busca y restaura contexto de conversaciones AI desde el historial de git. | Free |
| **Pipeline Review** | `/pipeline-review` | Auditoria full-stack de codigo de pipelines. Agentes paralelos especializados. | Free |
| **Plan CEO Review** | `/plan-ceo-review` | Review modo CEO/founder. Repensar el problema, encontrar el producto 10-star, desafiar premisas. | Free |
| **Plan Eng Review** | `/plan-eng-review` | Review modo Eng Manager. Arquitectura, data flow, edge cases, test coverage, performance. | Free |
| **Pre-Merge Review** | `/pre-merge-review` | Review pre-landing de PRs. Analiza SQL safety, LLM trust boundaries, side effects. | Free |
| **Project Docs** | `/project-docs` | Genera vambe.md y db.md como referencia de contexto para AI. | Free |
| **Prompt Analysis** | `/prompt-analysis` | Analiza patrones de prompting AI y tasas de aceptacion. | Free |
| **QA** | `/qa` | Testing sistematico de web apps. Modos: diff-aware, full, quick, regression. Genera reporte con health score. | Free |
| **Refactor Analysis** | `/refactor-analysis` | Analiza tech debt antes de refactorizar. Identifica code smells y friccion. | Free |
| **Retro** | `/retro` | Retrospectiva semanal. Analiza commits, patrones de trabajo, metricas de calidad. Team-aware. | Free |
| **Setup Browser Cookies** | `/setup-browser-cookies` | Importa cookies de tu browser real (Chrome, Arc, Brave) al headless browser para testing autenticado. | Free |
| **Ship** | `/ship` | Workflow de deploy: merge main, tests, review diff, bump version, changelog, commit, push, crear PR. | Free |
| **Ship PR** | `/ship-pr` | Workflow de PR: merge main, tests, review diff, bump VERSION, changelog, commit, push, crear PR. | Free |
| **Slack** | `/slack` | Interactua con workspaces Slack via browser automation. Check channels, send messages, search. | Free |
| **Test & Fix** | `/test-and-fix` | QA testing sistematico de web apps. Modos: diff-aware, full, quick, regression. | Free |
| **Vercel Sandbox** | `/vercel-sandbox` | Browser automation en Vercel Sandbox microVMs. Chrome headless para apps Vercel. | Free |
| **Weekly Retro** | `/weekly-retro` | Retrospectiva semanal de ingenieria. Analiza commits, metricas de calidad, contribuciones por persona. | Free |

---

## 4. Claude Code - Custom Agents

Agentes especializados que se lanzan automaticamente segun el tipo de tarea. Ubicados en `~/.claude/agents/`.

### Desarrollo & Arquitectura

| Agente | Descripcion | Modelo | Costo |
|--------|-------------|--------|-------|
| **tech-lead** | Decisiones tecnicas de alto nivel, coordinacion cross-domain, descomposicion de problemas. | opus | Free (usa tu plan Claude) |
| **fullstack-refactor-architect** | Cambios arquitectonicos mayores, disenar APIs, refactorizar monolitos, patrones cross-stack. | opus | Free |
| **architecture-reference** | Patrones de arquitectura, implementacion, estructura de codigo para pipelines FastAPI. | opus | Free |
| **db-engineering** | Disenar tablas, optimizar queries, indexing, migraciones, elegir entre patrones PostgreSQL. | opus | Free |
| **code-modularizer** | Romper archivos grandes, extraer logica duplicada, preparar code para escalar equipo. | opus | Free |
| **code-simplifier** | Simplificar, refactorizar y limpiar codigo. Reducir complejidad sin cambiar comportamiento. | opus | Free |
| **code-explainer** | Explicar y documentar codigo existente, onboarding, walkthroughs. | opus | Free |
| **skeptical-reviewer** | Devil's advocate. Desafia suposiciones, presenta contra-argumentos antes de tomar decisiones. | opus | Free |

### AI & Data

| Agente | Descripcion | Modelo | Costo |
|--------|-------------|--------|-------|
| **ai-ml-expert** | Arquitectura AI/ML, seleccion de modelos, prompt engineering, RAG, embeddings, eval frameworks. | opus | Free |
| **ai-researcher** | Analisis de papers, disenio de experimentos, revision de metodologia, escritura cientifica. | opus | Free |
| **prompt-engineering** | Craft, refinar y optimizar prompts para LLMs. System prompts, few-shot, templates. | opus | Free |
| **data-science-analytics** | EDA, statistical testing, metricas, visualizacion, modelos predictivos (sklearn, XGBoost). | opus | Free |

### QA & Testing

| Agente | Descripcion | Modelo | Costo |
|--------|-------------|--------|-------|
| **qa-test-engineer** | Estrategias de testing, edge cases, tests automatizados, cobertura, load testing. | opus | Free |

### Producto & Negocio

| Agente | Descripcion | Modelo | Costo |
|--------|-------------|--------|-------|
| **product-manager** | Specs de features, user stories, priorizacion de backlog, criterios de aceptacion. | opus | Free |
| **scrum-planner** | Sprint planning, estimacion de esfuerzo, dependencias, timelines de ejecucion. | opus | Free |
| **ops-impact-analyst** | ROI de features, reportes ejecutivos, metricas de negocio, performance de AI agents. | opus | Free |
| **unit-economics-analyst** | Unit economics, pricing, profitabilidad por cliente, proyecciones de costos API. | opus | Free |
| **sales-engineer** | Demos, propuestas tecnicas, RFP responses, ROI projections, objeciones tecnicas. | opus | Free |
| **customer-success** | Comunicaciones con clientes, onboarding, QBRs, churn risk, playbooks de soporte. | opus | Free |

### Diseno

| Agente | Descripcion | Modelo | Costo |
|--------|-------------|--------|-------|
| **ui-designer** | Dashboards, component libraries, design systems, interfaces data-dense. | opus | Free |
| **ux-designer** | Flujos de usuario, onboarding, friction points, error states, configuracion. | opus | Free |

---

## 5. Claude Code - Custom Commands

Comandos personalizados invocables con `/command-name`.

| Comando | Descripcion | Costo |
|---------|-------------|-------|
| **`/redesign-ui`** | Analiza componentes/paginas UI y los redisena usando los agentes ui-designer y ux-designer en paralelo. | Free |
| **`/python-review`** | Revisa codigo Python para calidad, seguridad, type safety y mejores practicas. | Free |
| **`/security-scan`** | Escaneo de seguridad del proyecto. Busca vulnerabilidades, secretos hardcodeados, dependencias riesgosas. | Free |

---

## 6. VS Code / Cursor - Extensions

| Extension | ID | Descripcion | Costo |
|-----------|----|-------------|-------|
| **Claude Code** | `anthropic.claude-code` | Integracion de Claude Code en el editor. | Free (requiere plan Claude) |
| **ESLint** | `dbaeumer.vscode-eslint` | Linting de JavaScript/TypeScript. | Free |
| **GitLens** | `eamodio.gitlens` | Git supercharged: blame, history, comparisons. | Free (Pro opcional) |
| **Prettier** | `esbenp.prettier-vscode` | Code formatter. Soporte para JS, TS, CSS, HTML, JSON, etc. | Free |
| **Git AI** | `git-ai.git-ai-vscode` | Integracion de git-ai en VS Code. | Free |
| **GitHub Copilot Chat** | `github.copilot-chat` | Chat de GitHub Copilot en el editor. | Free (Pro opcional) |
| **Gitpod Theme** | `gitpod.gitpod-theme` | Color theme de Gitpod. | Free |
| **Material Theme Icons** | `kd3n1z.vscode-material-theme-icons` | Iconos Material Design para archivos y carpetas. | Free |
| **Rainbow CSV** | `mechatroner.rainbow-csv` | Colorea columnas de CSV/TSV para lectura facil. | Free |
| **Git Graph** | `mhutchie.git-graph` | Visualizacion de grafos Git en VS Code. | Free |
| **Python Debugger** | `ms-python.debugpy` | Debugger para Python. | Free |
| **Python** | `ms-python.python` | Soporte completo de Python: IntelliSense, linting, formatting. | Free |
| **Python Pylance** | `ms-python.vscode-pylance` | Language server de Python con type checking avanzado. | Free |
| **Python Environments** | `ms-python.vscode-python-envs` | Gestor de entornos Python en VS Code. | Free |
| **Jupyter** | `ms-toolsai.jupyter` | Soporte para notebooks Jupyter. | Free |
| **Jupyter Keymap** | `ms-toolsai.jupyter-keymap` | Atajos de teclado de Jupyter en VS Code. | Free |
| **Jupyter Renderers** | `ms-toolsai.jupyter-renderers` | Renderers adicionales para outputs de Jupyter. | Free |
| **Jupyter Cell Tags** | `ms-toolsai.vscode-jupyter-cell-tags` | Tags para celdas de Jupyter notebooks. | Free |
| **Jupyter Slideshow** | `ms-toolsai.vscode-jupyter-slideshow` | Slideshow mode para Jupyter notebooks. | Free |
| **Prettier ESLint** | `rvest.vs-code-prettier-eslint` | Formatea con Prettier y luego aplica ESLint fixes. | Free |
| **Markdown Preview Enhanced** | `shd101wyy.markdown-preview-enhanced` | Preview avanzado de Markdown con soporte LaTeX, diagrams, etc. | Free |

---

## 7. CLI Tools (npm global)

Herramientas de linea de comando instaladas globalmente via npm.

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[Claude Code](https://github.com/anthropics/claude-code)** | CLI de Claude Code. Coding agent en terminal. | Free (requiere plan Claude) |
| **[@google/gemini-cli](https://github.com/google-gemini/gemini-cli)** | CLI oficial de Google Gemini. Coding agent en terminal. | Free |
| **[@openai/codex](https://github.com/openai/codex)** | CLI de OpenAI Codex. Coding agent en terminal. | Free (requiere API key) |
| **[Kilo Code](https://github.com/kilocode/kilocode)** | CLI de Kilo Code. Coding agent en terminal. | Free |
| **[Qwen Code](https://github.com/QwenLM/qwen-code)** | CLI de Qwen para coding. | Free |
| **[Cubic Dev AI](https://github.com/cubic-dev-ai/cli)** | CLI de Cubic Dev AI para coding. | Free |
| **[Probe](https://github.com/probelabs/probe)** | CLI de Probe Labs. Herramienta de coding. | Free |
| **[agent-browser](https://github.com/nicepkg/agent-browser)** | Browser automation CLI para AI agents. | Free |
| **[Mint](https://github.com/nicepkg/mint)** | CLI de Mint. Herramienta de desarrollo. | Free |
| **[OpenClaw](https://github.com/nicepkg/openclaw)** | CLI de OpenClaw. Herramienta de desarrollo. | Free |
| **[OP](https://github.com/nicepkg/op)** | CLI de OP. Herramienta de desarrollo. | Free |
| **[Puzld AI](https://github.com/nicepkg/puzldai)** | CLI de Puzld AI. Herramienta de desarrollo. | Free |
| **[vercel](https://vercel.com/docs/cli)** | CLI de Vercel para deploy de apps web. | Free (Pro opcional) |
| **[pnpm](https://pnpm.io/)** | Package manager rapido y eficiente en disco. | Free |
| **[context-mode](https://github.com/mksglu/context-mode)** | Plugin de Claude Code (instalado via npm link). | Free |

---

## 8. Shell Plugins

| Plugin | Descripcion | Costo |
|--------|-------------|-------|
| **[Oh My Zsh](https://ohmyzsh.sh/)** | Framework para gestionar config de Zsh. Aliases, plugins, themes. | Free |
| **[Powerlevel10k](https://github.com/romkatv/powerlevel10k)** | Theme de Zsh ultra rapido con prompt customizable. | Free |
| **[zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)** | Sugiere comandos basados en historial mientras escribes. | Free |
| **[fzf](https://github.com/junegunn/fzf)** | Fuzzy finder para terminal. Ctrl+R mejorado, busqueda de archivos. | Free |

---

## 9. Homebrew CLI Tools

Herramientas de terminal instaladas via Homebrew (no librerias/dependencias).

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[aitop](https://github.com/nicholasgasior/aitop)** | Monitor del sistema con AI. Top-like con analisis inteligente. | Free |
| **[ffmpeg](https://ffmpeg.org/)** | Procesamiento de audio/video. Conversion, streaming, encoding. | Free |
| **[gh](https://cli.github.com/)** | CLI oficial de GitHub. PRs, issues, repos, releases desde terminal. | Free |
| **[go](https://go.dev/)** | Lenguaje de programacion Go. Compilado, concurrente, tipado. | Free |
| **[htop](https://htop.dev/)** | Monitor de procesos interactivo (mejor que `top`). | Free |
| **[jq](https://jqlang.github.io/jq/)** | Procesador de JSON en linea de comandos. Filtrar, transformar, consultar. | Free |
| **[tmux](https://github.com/tmux/tmux)** | Multiplexor de terminal. Sesiones persistentes, splits, tabs. | Free |
| **[ripgrep](https://github.com/BurntSushi/ripgrep)** | Busqueda de texto ultra rapida (reemplaza grep). | Free |
| **[ncdu](https://dev.yorhel.nl/ncdu)** | Analizador de uso de disco con interfaz ncurses. | Free |
| **[nvtop](https://github.com/Syllo/nvtop)** | Monitor de GPU (similar a htop para GPUs). | Free |
| **[mole](https://github.com/davrodpin/mole)** | SSH tunneling simplificado. | Free |
| **[nvm](https://github.com/nvm-sh/nvm)** | Node Version Manager. Multiples versiones de Node. | Free |
| **[postgresql@15](https://www.postgresql.org/)** | Base de datos relacional. | Free |
| **[redis](https://redis.io/)** | Base de datos in-memory. Cache, queues, pub/sub. | Free |
| **[shellcheck](https://www.shellcheck.net/)** | Linter para scripts shell. Encuentra bugs y problemas de estilo. | Free |

---

> **Nota**: Todos los plugins y tools son gratuitos. El unico costo es el plan de Claude (para Claude Code y los agentes custom) y opcionalmente Vercel Pro / GitLens Pro.
