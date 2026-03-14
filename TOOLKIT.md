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
| **[Slack](https://slack.com/)** | Mensajeria para equipos. Canales, threads, integraciones. | `brew install --cask slack` | Free (Pro opcional) |

### Desarrollo

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[Cursor](https://cursor.sh/)** | Editor de codigo basado en VS Code con AI integrado (Claude, GPT). | `brew install --cask cursor` | Free (Pro $20/mes) |
| **[Claude Desktop](https://claude.ai/)** | App de escritorio de Claude. Chat + Claude Code integrado. | `brew install --cask claude` | Free (Pro $20/mes) |
| **[Docker Desktop](https://www.docker.com/)** | Contenedores. Ejecuta apps aisladas, dev environments, bases de datos. | `brew install --cask docker` | Free (Pro opcional) |
| **[DataGrip](https://www.jetbrains.com/datagrip/)** | IDE de JetBrains para bases de datos. SQL, PostgreSQL, Redis, etc. | `brew install --cask datagrip` | Paid ($9.90/mes) |
| **[Postman](https://www.postman.com/)** | Testing y documentacion de APIs. Collections, environments, mock servers. | `brew install --cask postman` | Free (Pro opcional) |
| **[Neo4j Desktop](https://neo4j.com/)** | Gestion de bases de datos de grafos Neo4j. | Manual | Free |
| **[Ghostty](https://ghostty.org/)** | Terminal rapida y moderna escrita en Zig. GPU-accelerated. | `brew install --cask ghostty` | Free |
| **[iTerm2](https://iterm2.com/)** | Terminal avanzada para macOS. Splits, profiles, triggers. | `brew install --cask iterm2` | Free |

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
| **claude-mem** | Memoria persistente cross-session. Guarda observaciones, decisiones y contexto entre conversaciones. | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | Free |
| **code-simplifier** | Revisa codigo modificado para simplificar, mejorar calidad y encontrar issues. | claude-plugins-official | Free |
| **skill-creator** | Crea, modifica y mide rendimiento de skills custom para Claude Code. | claude-plugins-official | Free |
| **sanity-plugin** | Best practices, schema design, GROQ, Visual Editing, y guias de integracion para Sanity CMS. | claude-plugins-official | Free |

---

## 3. Claude Code - Skills

Skills instalados via [gstack](https://github.com/garrytan/gstack) (Garry Tan) y custom. Se invocan con `/skill-name`.

| Skill | Comando | Descripcion | Costo |
|-------|---------|-------------|-------|
| **Browse** | `/browse` | Headless browser para QA testing y dogfooding. Navega URLs, interactua con elementos, toma screenshots. ~100ms por comando. | Free |
| **QA** | `/qa` | Testing sistematico de web apps. Modos: diff-aware, full, quick, regression. Genera reporte con health score. | Free |
| **Review** | `/review` | Review pre-landing de PRs. Analiza SQL safety, LLM trust boundaries, side effects. | Free |
| **Ship** | `/ship` | Workflow de deploy: merge main, tests, review diff, bump version, changelog, commit, push, crear PR. | Free |
| **Retro** | `/retro` | Retrospectiva semanal. Analiza commits, patrones de trabajo, metricas de calidad. Team-aware. | Free |
| **Plan CEO Review** | `/plan-ceo-review` | Review modo CEO/founder. Repensar el problema, encontrar el producto 10-star, desafiar premisas. | Free |
| **Plan Eng Review** | `/plan-eng-review` | Review modo Eng Manager. Arquitectura, data flow, edge cases, test coverage, performance. | Free |
| **Setup Browser Cookies** | `/setup-browser-cookies` | Importa cookies de tu browser real (Chrome, Arc, Brave) al headless browser para testing autenticado. | Free |
| **Generate README** | `/generate-readme` | Genera README preciso para proyectos Python analizando el codigo fuente. | Free |

---

## 4. Claude Code - Custom Agents

Agentes especializados que se lanzan automaticamente segun el tipo de tarea. Ubicados en `~/.claude/agents/`.

### Desarrollo & Arquitectura

| Agente | Descripcion | Modelo | Costo |
|--------|-------------|--------|-------|
| **tech-lead** | Decisiones tecnicas de alto nivel, coordinacion cross-domain, descomposicion de problemas. | opus | Free (usa tu plan Claude) |
| **fullstack-refactor-architect** | Cambios arquitectonicos mayores, disenar APIs, refactorizar monolitos, patrones cross-stack. | opus | Free |
| **db-engineering** | Disenar tablas, optimizar queries, indexing, migraciones, elegir entre patrones PostgreSQL. | opus | Free |
| **code-modularizer** | Romper archivos grandes, extraer logica duplicada, preparar code para escalar equipo. | opus | Free |
| **code-explainer** | Explicar y documentar codigo existente, onboarding, walkthroughs. | opus | Free |

### AI & Data

| Agente | Descripcion | Modelo | Costo |
|--------|-------------|--------|-------|
| **ai-ml-expert** | Arquitectura AI/ML, seleccion de modelos, prompt engineering, RAG, embeddings, eval frameworks. | opus | Free |
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

---

## 6. VS Code / Cursor - Extensions

| Extension | ID | Descripcion | Costo |
|-----------|----|-------------|-------|
| **Claude Code** | `anthropic.claude-code` | Integracion de Claude Code en el editor. | Free (requiere plan Claude) |
| **Cursor Pyright** | `anysphere.cursorpyright` | Type checking para Python en Cursor. | Free |
| **ESLint** | `dbaeumer.vscode-eslint` | Linting de JavaScript/TypeScript. | Free |
| **GitLens** | `eamodio.gitlens` | Git supercharged: blame, history, comparisons. | Free (Pro opcional) |
| **Gitpod Theme** | `gitpod.gitpod-theme` | Color theme de Gitpod. | Free |
| **Rainbow CSV** | `mechatroner.rainbow-csv` | Colorea columnas de CSV/TSV para lectura facil. | Free |
| **Python Debugger** | `ms-python.debugpy` | Debugger para Python. | Free |
| **Python** | `ms-python.python` | Soporte completo de Python: IntelliSense, linting, formatting. | Free |
| **Jupyter** | `ms-toolsai.jupyter` | Soporte para notebooks Jupyter. | Free |
| **Jupyter Renderers** | `ms-toolsai.jupyter-renderers` | Renderers adicionales para outputs de Jupyter. | Free |
| **Jupyter Cell Tags** | `ms-toolsai.vscode-jupyter-cell-tags` | Tags para celdas de Jupyter notebooks. | Free |
| **Jupyter Slideshow** | `ms-toolsai.vscode-jupyter-slideshow` | Slideshow mode para Jupyter notebooks. | Free |
| **Material Icon Theme** | `pkief.material-icon-theme` | Iconos Material Design para archivos y carpetas. | Free |
| **Prettier ESLint** | `rvest.vs-code-prettier-eslint` | Formatea con Prettier y luego aplica ESLint fixes. | Free |

---

## 7. CLI Tools (npm global)

Herramientas de linea de comando instaladas globalmente via npm.

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[@google/gemini-cli](https://github.com/google-gemini/gemini-cli)** | CLI oficial de Google Gemini. Coding agent en terminal. | Free |
| **[@openai/codex](https://github.com/openai/codex)** | CLI de OpenAI Codex. Coding agent en terminal. | Free (requiere API key) |
| **[vercel](https://vercel.com/docs/cli)** | CLI de Vercel para deploy de apps web. | Free (Pro opcional) |
| **[pnpm](https://pnpm.io/)** | Package manager rapido y eficiente en disco. | Free |
| **[uv](https://github.com/astral-sh/uv)** | Package manager y project manager para Python. Ultra rapido (escrito en Rust). Reemplaza pip, venv, pyenv. | Free |
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
| **[ffmpeg](https://ffmpeg.org/)** | Procesamiento de audio/video. Conversion, streaming, encoding. | Free |
| **[htop](https://htop.dev/)** | Monitor de procesos interactivo (mejor que `top`). | Free |
| **[lazygit](https://github.com/jesseduffield/lazygit)** | TUI para Git. Commits, branches, stash con interfaz visual. | Free |
| **[tmux](https://github.com/tmux/tmux)** | Multiplexor de terminal. Sesiones persistentes, splits, tabs. | Free |
| **[ripgrep](https://github.com/BurntSushi/ripgrep)** | Busqueda de texto ultra rapida (reemplaza grep). | Free |
| **[ncdu](https://dev.yorhel.nl/ncdu)** | Analizador de uso de disco con interfaz ncurses. | Free |
| **[nvtop](https://github.com/Syllo/nvtop)** | Monitor de GPU (similar a htop para GPUs). | Free |
| **[mole](https://github.com/davrodpin/mole)** | SSH tunneling simplificado. | Free |
| **[nvm](https://github.com/nvm-sh/nvm)** | Node Version Manager. Multiples versiones de Node. | Free |
| **[postgresql@15](https://www.postgresql.org/)** | Base de datos relacional. | Free |
| **[redis](https://redis.io/)** | Base de datos in-memory. Cache, queues, pub/sub. | Free |

---

> **Nota**: Todos los plugins y tools son gratuitos. El unico costo es el plan de Claude (para Claude Code y los agentes custom) y opcionalmente Vercel Pro / GitLens Pro.
