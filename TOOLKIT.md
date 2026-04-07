# Toolkit

> Mi setup completo de desarrollo. Cada herramienta esta aqui porque la uso — no es una lista de "cosas cool", es lo que realmente corre en mi maquina.

## Indice

1. [Mac Apps](#1-apps)
2. [CLI Tools](#2-cli)
3. [Shell Setup](#3-shell)
4. [Claude Code](#4-claude-code)
5. [VS Code Extensions](#5-extensions)

## 1. Mac Apps

### Desarrollo

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[Cursor](https://cursor.com)** | Editor de codigo con AI integrado (Claude, GPT). Basado en VS Code. | `brew install --cask cursor` | freemium |
| **[Claude Desktop](https://claude.ai)** | App de escritorio de Claude. Chat + Claude Code integrado. | `brew install --cask claude` | freemium |
| **[Docker Desktop](https://docker.com)** | Contenedores para ejecutar apps aisladas y dev environments. | `brew install --cask docker` | free |
| **[DataGrip](https://www.jetbrains.com/datagrip/)** | IDE de JetBrains para bases de datos. SQL, PostgreSQL, Redis. | `brew install --cask datagrip` | paid |
| **[Postman](https://postman.com)** | Testing y documentacion de APIs. Collections, environments. | `brew install --cask postman` | free |
| **[Visual Studio Code](https://code.visualstudio.com)** | Editor de codigo open source de Microsoft. Extensions marketplace. | `brew install --cask visual-studio-code` | free |
| **[Xcode](https://developer.apple.com/xcode/)** | IDE de Apple para desarrollo iOS/macOS. | `App Store` | free |
| **[Neo4j Desktop](https://neo4j.com)** | Gestion de bases de datos de grafos Neo4j. | `Download from neo4j.com` | free |
| **[Obsidian](https://obsidian.md)** | Editor de notas en Markdown. Plugins, graph view, vault local. | `brew install --cask obsidian` | free |
| **Conductor** | Observabilidad y monitoreo de infraestructura. | `Enterprise install` | paid |

### Utilidades

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[AltTab](https://alt-tab-macos.netlify.app)** | Window switcher estilo Windows con preview de ventanas. | `brew install --cask alt-tab` | free |
| **[Rectangle](https://rectangleapp.com)** | Window management con atajos de teclado. Snapping y splits. | `brew install --cask rectangle` | free |
| **[BetterDisplay](https://betterdisplay.pro)** | Control avanzado de monitores. Resoluciones custom, brightness. | `brew install --cask betterdisplay` | freemium |
| **[Ice](https://icemenubar.app)** | Menu bar manager. Oculta iconos para mantener la barra limpia. | `brew install --cask jordanbaird-ice` | free |
| **[Stats](https://github.com/exelban/stats)** | Monitor del sistema en la menu bar. CPU, RAM, disco, red. | `brew install --cask stats` | free |
| **[Macs Fan Control](https://crystalidea.com/macs-fan-control)** | Control manual de ventiladores y monitoreo de temperatura. | `brew install --cask macs-fan-control` | freemium |
| **[OnyX](https://www.titanium-software.fr/en/onyx.html)** | Mantenimiento y optimizacion de macOS. Limpieza de cache. | `brew install --cask onyx` | free |
| **[1Password CLI](https://1password.com)** | Acceso a passwords desde terminal. Secrets management. | `brew install --cask 1password-cli` | paid |
| **cmux** | Multiplexor de sesiones Claude Code en paralelo. | `brew install --cask cmux` | free |
| **[RightFont](https://rightfontapp.com)** | Gestor de fuentes para macOS. Preview, activacion, organizacion. | `Manual download` | freemium |

### Browsers

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[Brave Browser](https://brave.com)** | Browser con bloqueo de ads y trackers integrado. | `brew install --cask brave-browser` | free |
| **[Google Chrome](https://www.google.com/chrome/)** | Browser de Google. Sync, extensions, DevTools. | `brew install --cask google-chrome` | free |

### Comunicacion

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[Slack](https://slack.com)** | Mensajeria para equipos. Canales, threads, integraciones. | `brew install --cask slack` | free |
| **[Beeper](https://beeper.com)** | Mensajeria unificada. iMessage, WhatsApp, Telegram, Discord en una app. | `Download from beeper.com` | free |
| **[Spotify](https://spotify.com)** | Streaming de musica y podcasts. | `brew install --cask spotify` | freemium |

### Seguridad

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[Cloudflare WARP](https://1.1.1.1)** | VPN y DNS seguro. Encripta trafico de red. | `brew install --cask cloudflare-warp` | free |
| **[Drata Agent](https://drata.com)** | Agente de compliance (SOC2, ISO). Monitorea configuracion de seguridad. | `Enterprise install` | paid |

## 2. CLI Tools

### AI Coding Agents

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** | CLI de Claude Code. Coding agent en terminal. | free |
| **[Gemini CLI](https://github.com/google-gemini/gemini-cli)** | CLI oficial de Google Gemini. Coding agent en terminal. | free |
| **[OpenAI Codex](https://github.com/openai/codex)** | CLI de OpenAI. Coding agent en terminal. | free |
| **Kilo Code** | CLI de Kilo Code. Coding agent en terminal. | free |
| **Qwen Code** | CLI de Qwen para coding. | free |
| **Cubic Dev AI** | CLI de Cubic Dev AI para coding. | free |
| **Probe** | CLI de Probe Labs. | free |

### Browser & Automation

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **agent-browser** | Browser automation CLI para AI agents. | free |

### Dev Tools

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **Mint** | CLI de Mint. Herramienta de desarrollo. | free |
| **OpenClaw** | CLI de OpenClaw. Herramienta de desarrollo. | free |
| **Puzld AI** | CLI de Puzld AI. Herramienta de desarrollo. | free |
| **OP** | CLI de OP. Herramienta de desarrollo. | free |
| **[Deno](https://deno.com)** | Runtime de JS/TS con seguridad por defecto. Alternativa moderna a Node. | free |
| **[Go](https://go.dev)** | Lenguaje compilado de Google. Concurrente, tipado, rapido. | free |
| **[bats-core](https://github.com/bats-core/bats-core)** | Framework de testing para scripts Bash. | free |
| **[tectonic](https://tectonic-typesetting.github.io)** | Compilador de LaTeX moderno. Descarga paquetes automaticamente. | free |
| **[PostgreSQL 15](https://www.postgresql.org)** | Base de datos relacional. El estandar de la industria. | free |
| **[Redis](https://redis.io)** | Base de datos in-memory. Cache, queues, pub/sub. | free |

### Package Managers & Deploy

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[pnpm](https://pnpm.io)** | Package manager rapido y eficiente en disco. | free |
| **[uv](https://docs.astral.sh/uv/)** | Python package manager ultra rapido. Escrito en Rust. | free |
| **[Vercel](https://vercel.com)** | CLI para deploy de apps web. | freemium |

### Terminal Tools

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[tmux](https://github.com/tmux/tmux)** | Multiplexor de terminal. Sesiones persistentes, splits. | free |
| **[ripgrep](https://github.com/BurntSushi/ripgrep)** | Busqueda de texto ultra rapida. Reemplaza grep. | free |
| **[fzf](https://github.com/junegunn/fzf)** | Fuzzy finder. Ctrl+R mejorado, busqueda de archivos. | free |
| **[htop](https://htop.dev)** | Monitor de procesos interactivo. Mejor que top. | free |
| **aitop** | Monitor del sistema con AI. Top-like con analisis inteligente. | free |
| **[ffmpeg](https://ffmpeg.org)** | Procesamiento de audio/video. Conversion, encoding. | free |
| **[ncdu](https://dev.yorhel.nl/ncdu)** | Analizador de uso de disco con interfaz ncurses. | free |
| **[gh](https://cli.github.com)** | CLI oficial de GitHub. PRs, issues, repos desde terminal. | free |
| **[jq](https://jqlang.github.io/jq/)** | Procesador de JSON en linea de comandos. | free |
| **[shellcheck](https://www.shellcheck.net)** | Linter para scripts shell. Encuentra bugs y problemas. | free |
| **[nvtop](https://github.com/Syllo/nvtop)** | Monitor de GPU (similar a htop para GPUs). | free |
| **[RTK (Rust Token Killer)](https://github.com/nicholasgasior/rtk)** | Proxy CLI que ahorra 60-90% de tokens en operaciones de dev. | free |
| **[sox](https://sox.sourceforge.net)** | Procesamiento de audio en linea de comandos. Grabacion, conversion, efectos. | free |
| **[mole](https://github.com/davrodpin/mole)** | SSH tunneling simplificado. Crea tunnels con un comando. | free |

## 3. Shell Setup

### Shell

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[Oh My Zsh](https://ohmyz.sh)** | Framework para Zsh. Aliases, plugins, themes. La base de todo. | free |
| **[Powerlevel10k](https://github.com/romkatv/powerlevel10k)** | Theme ultra rapido con prompt customizable y iconos. | free |
| **[zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)** | Sugiere comandos del historial mientras escribes. | free |
| **[fzf (shell integration)](https://github.com/junegunn/fzf)** | Fuzzy finder integrado en la shell. Ctrl+R mejorado. | free |

## 4. Claude Code

### Plugins

| Plugin | Descripcion | Costo |
|--------|-------------|-------|
| **context-mode** | Optimiza el context window ejecutando comandos en sandbox. Ahorra ~80% de tokens. | free |
| **code-simplifier** | Revisa codigo modificado para simplificar, mejorar calidad y encontrar issues. | free |
| **context7** | Context7 MCP server para busqueda de documentacion en tiempo real. | free |
| **frontend-design** | Herramientas de disenio frontend: componentes, layouts, CSS. | free |
| **playwright** | Browser automation via Playwright MCP. Testing, scraping, interaccion web. | free |
| **skill-creator** | Crea, modifica y mide rendimiento de skills custom para Claude Code. | free |
| **superpowers** | Superpowers: writing-plans, executing-plans, brainstorming, systematic-debugging. | free |
| **claude-hud** | HUD (Heads-Up Display) para Claude Code. Status line con info en tiempo real. | free |
| **feature-dev** | Asistente de desarrollo de features. Planificacion, implementacion, testing. | free |
| **claude-subconscious** | Agente subconsciente de Letta AI. Memoria persistente entre sesiones. | free |

### Skills

| Skill | Comando | Descripcion |
|-------|---------|-------------|
| **/browser-automation** | `Built-in skill` | Browser automation CLI. Navegacion, forms, scraping, screenshots. |
| **/cross-ai-debate** | `Built-in skill` | Debate adversarial entre Claude Code, Codex CLI y Gemini CLI. |
| **/doc-sync** | `Built-in skill` | Auditoria y sincronizacion de CLAUDE.md y README.md. Detecta drift. |
| **/dream** | `Built-in skill` | Consolidacion de memoria multi-fase. Merge updates, pruning. |
| **/electron** | `Built-in skill` | Automatiza apps Electron (VS Code, Slack, Discord) via Chrome DevTools. |
| **/explore-app** | `Built-in skill` | Exploracion sistematica de web apps. Reporte con screenshots. |
| **/fastAPI-standards** | `Built-in skill` | Guia para construir/refactorizar pipelines FastAPI + Prefect + pgvector. |
| **/generate-readme** | `Built-in skill` | Genera README preciso analizando el codigo fuente del proyecto. |
| **/health** | `Built-in skill` | Diagnostico cuando Claude se siente lento o ignora reglas. Audita hooks y MCP. |
| **/pipeline-review** | `Built-in skill` | Auditoria full-stack de codigo de pipelines. Agentes paralelos. |
| **/pre-merge-review** | `Built-in skill` | Review pre-landing de PRs. SQL safety, trust boundaries, side effects. |
| **/project-docs** | `Built-in skill` | Genera vambe.md y db.md como referencia de contexto para AI. |
| **/refactor-analysis** | `Built-in skill` | Analiza tech debt antes de refactorizar. Identifica code smells. |
| **/review-plan-engineering** | `Built-in skill` | Review de planes de ingenieria. Arquitectura, data flow, tests. |
| **/setup-browser-cookies** | `Built-in skill` | Importa cookies de tu browser real al headless para testing autenticado. |
| **/ship-pr** | `Built-in skill` | Workflow de PR: merge main, tests, review diff, bump VERSION, changelog, commit, push, crear PR. |
| **/slack** | `Built-in skill` | Interactua con workspaces Slack via browser automation. |
| **/test-and-fix** | `Built-in skill` | QA testing sistematico de web apps. Modos: diff-aware, full, quick, regression. |
| **/vercel-sandbox** | `Built-in skill` | Browser automation en Vercel Sandbox microVMs. Chrome headless. |
| **/weekly-retro** | `Built-in skill` | Retrospectiva semanal de ingenieria. Analiza commits, metricas por persona. |
| **/panel** | `Built-in skill` | Panel de 3 lentes: simplificacion, arquitectura, producto. Multi-perspectiva. |
| **/simplify** | `Built-in skill` | Revisa codigo cambiado para simplificar, mejorar calidad y eficiencia. |
| **/loop** | `Built-in skill` | Ejecuta un prompt o slash command en intervalo recurrente. |
| **/schedule** | `Built-in skill` | Crea agentes remotos que ejecutan en cron schedule. |
| **/claude-api** | `Built-in skill` | Guia para construir apps con Claude API y Anthropic SDK. |
| **Sync Dotfiles** | `/sync-dotfiles` | Sincroniza config de la maquina al repo. Detecta herramientas nuevas, actualiza data.js y regenera docs. |
| **Browser (headless)** | `/browser` | Headless browser para QA testing. Screenshots, navegacion, verificacion de estado. |

### Agents

| Agent | Descripcion |
|-------|-------------|
| **tech-lead** | Decisiones tecnicas, coordinacion cross-domain. |
| **fullstack-refactor-architect** | Arquitectura, APIs, refactoring de monolitos. |
| **architecture-reference** | Patrones de arquitectura para pipelines FastAPI. |
| **db-engineering** | Schemas, queries, migraciones, indexing. |
| **code-modularizer** | Romper archivos grandes, extraer duplicados. |
| **code-simplifier** | Simplificar, refactorizar y limpiar codigo. |
| **skeptical-reviewer** | Devil's advocate. Desafia suposiciones antes de decidir. |
| **ai-ml-expert** | Prompts, RAG, embeddings, model selection. |
| **ai-researcher** | Papers, experimentos, metodologia, escritura cientifica. |
| **prompt-engineering** | Craft y optimizar prompts para LLMs. |
| **data-science-analytics** | EDA, estadisticas, visualizacion, ML. |
| **neuroscience-ai-expert** | Neurociencia, mecanismos neurales, brain-computer interfaces. |
| **neuroai-research-director** | Metodologia de investigacion, NeuroAI, disenio de experimentos. |
| **thesis-reviewer** | Review de tesis, deteccion de texto AI, escritura academica. |
| **ceo-product-strategist** | Vision estrategica CEO, roadmap, impacto de producto. |
| **qa-test-engineer** | Test strategies, edge cases, automation. |
| **andrej-karpathy** | Persona de Karpathy: implementaciones simples, first-principles, code review minimalista. |
| **ilya-sutskever** | Persona de Sutskever: scaling laws, safety, convicciones profundas sobre AI. |
| **leonardo-da-vinci** | Persona de Da Vinci: pensamiento polimata, patrones cross-domain, arte + ciencia. |
| **yann-lecun** | Persona de LeCun: world models, critica contrarian, rigor cientifico combativo. |
| **paul-graham** | Persona de PG: evaluacion de startups first-principles, escritura clara, contrarian product thinking. |
| **steve-jobs** | Persona de Jobs: vision de producto, obsesion por el diseno, simplicidad por sustraccion. |
| **ops-impact-analyst** | ROI de features, metricas de negocio, reportes ejecutivos. |
| **tw93** | Gatekeeper de Mole: minimalismo, safety-first, scope discipline. |
| **Paul Graham** | Piensa como Paul Graham: startups, simplicidad, growth, y ensayos claros. |

### Commands

| Nombre | Descripcion |
|--------|-------------|
| **/redesign-ui** | Analiza componentes UI y los redisena usando ui-designer y ux-designer en paralelo. |
| **/python-review** | Revisa codigo Python para calidad, seguridad, type safety y mejores practicas. |
| **/security-scan** | Escaneo de seguridad. Busca vulnerabilidades, secretos hardcodeados, dependencias riesgosas. |

## 5. VS Code Extensions

### Extensions

| Extension | ID | Descripcion | Costo |
|-----------|-----|-------------|-------|
| **Claude Code** | `ext-claude-code` | Integracion de Claude Code en el editor. | free |
| **ESLint** | `ext-eslint` | Linting de JavaScript/TypeScript. | free |
| **GitLens** | `ext-gitlens` | Git supercharged: blame, history, comparisons. | freemium |
| **Prettier** | `ext-prettier` | Code formatter. JS, TS, CSS, HTML, JSON. | free |
| **Git AI** | `ext-git-ai` | Integracion de git-ai en VS Code. | free |
| **GitHub Copilot Chat** | `ext-copilot-chat` | Chat de GitHub Copilot en el editor. | freemium |
| **Gitpod Theme** | `ext-gitpod-theme` | Color theme de Gitpod. | free |
| **Material Theme Icons** | `ext-material-icons` | Iconos Material Design para archivos y carpetas. | free |
| **Rainbow CSV** | `ext-rainbow-csv` | Colorea columnas de CSV/TSV para lectura facil. | free |
| **Git Graph** | `ext-git-graph` | Visualizacion de grafos Git en VS Code. | free |
| **Python Debugger** | `ext-python-debugger` | Debugger para Python. | free |
| **Python** | `ext-python` | Soporte completo: IntelliSense, linting, formatting. | free |
| **Python Pylance** | `ext-pylance` | Language server de Python con type checking avanzado. | free |
| **Python Environments** | `ext-python-envs` | Gestor de entornos Python en VS Code. | free |
| **Jupyter** | `ext-jupyter` | Soporte para notebooks Jupyter en el editor. | free |
| **Jupyter Keymap** | `ext-jupyter-keymap` | Atajos de teclado de Jupyter en VS Code. | free |
| **Jupyter Renderers** | `ext-jupyter-renderers` | Renderers adicionales para outputs de Jupyter. | free |
| **Jupyter Cell Tags** | `ext-jupyter-cell-tags` | Tags para celdas de Jupyter notebooks. | free |
| **Jupyter Slideshow** | `ext-jupyter-slideshow` | Slideshow mode para Jupyter notebooks. | free |
| **Prettier ESLint** | `ext-prettier-eslint` | Formatea con Prettier y aplica ESLint fixes. | free |
| **Markdown Preview Enhanced** | `ext-markdown-preview` | Preview avanzado de Markdown con soporte LaTeX, diagrams. | free |

---

> **152 herramientas** en total. 139 free, 9 freemium, 4 paid.
> Generado automaticamente desde `data.js` — no editar manualmente.
