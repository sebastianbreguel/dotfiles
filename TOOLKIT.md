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
| **[Claude Desktop](https://claude.ai)** | App de escritorio de Claude. Chat + Claude Code integrado. | `brew install --cask claude` | freemium |
| **[Docker Desktop](https://docker.com)** | Contenedores para ejecutar apps aisladas y dev environments. | `brew install --cask docker` | free |
| **[DataGrip](https://www.jetbrains.com/datagrip/)** | IDE de JetBrains para bases de datos. SQL, PostgreSQL, Redis. | `brew install --cask datagrip` | paid |
| **[Postman](https://postman.com)** | Testing y documentacion de APIs. Collections, environments. | `brew install --cask postman` | free |
| **[Visual Studio Code](https://code.visualstudio.com)** | Editor de codigo open source de Microsoft. Extensions marketplace. | `brew install --cask visual-studio-code` | free |
| **[Xcode](https://developer.apple.com/xcode/)** | IDE de Apple para desarrollo iOS/macOS. | `App Store` | free |
| **[Obsidian](https://obsidian.md)** | Editor de notas en Markdown. Plugins, graph view, vault local. | `brew install --cask obsidian` | free |
| **[Notion](https://notion.so)** | Workspace todo-en-uno. Notas, docs, wikis, bases de datos, kanban. | `Download from notion.so` | freemium |
| **[Zotero](https://www.zotero.org)** | Gestor de referencias bibliograficas. Papers, PDFs, citas. | `Download from zotero.org` | free |
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
| **[1Password CLI](https://1password.com)** | Acceso a passwords desde terminal. Secrets management. | `brew install --cask 1password-cli` | paid |
| **cmux** | Multiplexor de sesiones Claude Code en paralelo. | `brew install --cask cmux` | free |
| **[Raycast](https://raycast.com)** | Launcher y productivity app. Reemplaza Spotlight con extensions, snippets, window management. | `Download from raycast.com` | freemium |
| **[OnyX](https://titanium-software.fr/en/onyx.html)** | Utilidad de mantenimiento y optimizacion para macOS. Limpieza de cache, reparacion de permisos. | `Download from titanium-software.fr` | free |
| **[Orca](https://stably.ai)** | App de generacion de imagenes con AI. Stably AI. | `Download from stably.ai` | freemium |
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

### Browser & Automation

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **agent-browser** | Browser automation CLI para AI agents. | free |

### Dev Tools

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **OP** | CLI de OP. Herramienta de desarrollo. | free |
| **[asciinema](https://asciinema.org)** | Grabador de sesiones de terminal. Genera recordings reproducibles y compartibles. | free |
| **[ImageMagick](https://imagemagick.org)** | Suite de procesamiento de imagenes desde CLI. Conversion, resize, composicion. | free |
| **[Deno](https://deno.com)** | Runtime de JS/TS con seguridad por defecto. Alternativa moderna a Node. | free |
| **[Go](https://go.dev)** | Lenguaje compilado de Google. Concurrente, tipado, rapido. | free |
| **[bats-core](https://github.com/bats-core/bats-core)** | Framework de testing para scripts Bash. | free |
| **[tectonic](https://tectonic-typesetting.github.io)** | Compilador de LaTeX moderno. Descarga paquetes automaticamente. | free |
| **[PostgreSQL 15](https://www.postgresql.org)** | Base de datos relacional. El estandar de la industria. | free |
| **[Redis](https://redis.io)** | Base de datos in-memory. Cache, queues, pub/sub. | free |
| **[git-filter-repo](https://github.com/newren/git-filter-repo)** | Reescribir historial de git de forma segura. Reemplaza filter-branch. | free |
| **[Zig](https://ziglang.org)** | Lenguaje de programacion de sistemas. Compilador y build system. | free |
| **[Ruff](https://docs.astral.sh/ruff)** | Linter y formatter para Python. Ultra rapido, reemplaza flake8+isort+black. | free |
| **[pre-commit](https://pre-commit.com)** | Framework de hooks para git. Ejecuta linters y checks antes de cada commit. | free |
| **[complexipy](https://github.com/rohaquinern/complexipy)** | Analizador de complejidad cognitiva para Python. Detecta funciones dificiles de mantener. | free |
| **[code-review-graph](https://github.com/sebastianbreguel/code-review-graph)** | MCP server para busqueda semantica de codigo. Grafo de dependencias y analisis de impacto. | free |

### Package Managers & Deploy

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[pnpm](https://pnpm.io)** | Package manager rapido y eficiente en disco. | free |
| **[uv](https://docs.astral.sh/uv/)** | Python package manager ultra rapido. Escrito en Rust. | free |
| **[Vercel](https://vercel.com)** | CLI para deploy de apps web. | freemium |
| **[NVM](https://github.com/nvm-sh/nvm)** | Node Version Manager. Instalar y cambiar entre versiones de Node.js. | free |

### Terminal Tools

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[tmux](https://github.com/tmux/tmux)** | Multiplexor de terminal. Sesiones persistentes, splits. | free |
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
| **[Glow](https://github.com/charmbracelet/glow)** | Render de Markdown en la terminal con syntax highlighting y paginacion. | free |
| **[mas](https://github.com/mas-cli/mas)** | CLI para Mac App Store. Instalar, actualizar y buscar apps desde la terminal. | free |
| **[yt-dlp](https://github.com/yt-dlp/yt-dlp)** | Descargador de video/audio de YouTube y +1000 sitios. Fork mejorado de youtube-dl. | free |
| **[lean-ctx](https://github.com/yvgude/lean-ctx)** | Optimizador de contexto para LLMs. Comprime salida de comandos manteniendo informacion clave. | free |

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
| **[caveman](https://github.com/JuliusBrussee/caveman)** | Modo cavernicola. Comprime respuestas 50-75% eliminando relleno, articulos y filler. | free |
| **[code-review](https://github.com/anthropics/claude-code)** | Plugin oficial de Anthropic para code review de PRs. | free |
| **[compound-engineering](https://github.com/AustinKelsworthy/compound-engineering-plugin)** | Mega-plugin de Compound Engineering. Code review multi-agente, commits, PRs, debugging, planificacion, worktrees. | free |

### Skills

| Skill | Comando | Descripcion |
|-------|---------|-------------|
| **/browser-automation** | `Built-in skill` | Browser automation CLI. Navegacion, forms, scraping, screenshots. |
| **/dream** | `Built-in skill` | Consolidacion de memoria multi-fase. Merge updates, pruning. |
| **/health** | `Built-in skill` | Diagnostico cuando Claude se siente lento o ignora reglas. Audita hooks y MCP. |
| **/pre-merge-review** | `Built-in skill` | Review pre-landing de PRs. SQL safety, trust boundaries, side effects. |
| **/project-docs** | `Built-in skill` | Genera vambe.md y db.md como referencia de contexto para AI. |
| **/refactor-analysis** | `Built-in skill` | Analiza tech debt antes de refactorizar. Identifica code smells. |
| **/review-plan-engineering** | `Built-in skill` | Review de planes de ingenieria. Arquitectura, data flow, tests. |
| **/panel** | `Built-in skill` | Panel de 3 lentes: simplificacion, arquitectura, producto. Multi-perspectiva. |
| **/avoid-ai-writing** | `Built-in skill` | Detecta y reescribe patrones de escritura AI. Audita contenido para eliminar AI-isms. |
| **/humanizer** | `Built-in skill` | Elimina patrones de escritura AI del texto. Basado en la guia de Wikipedia. |
| **/usage** | `Built-in skill` | Muestra conteos de invocaciones de agentes, skills y plugins. |
| **Sync Dotfiles** | `/sync-dotfiles` | Sincroniza config de la maquina al repo. Detecta herramientas nuevas, actualiza data.js y regenera docs. |

### Agents

| Agent | Descripcion |
|-------|-------------|
| **tech-lead** | Decisiones tecnicas, coordinacion cross-domain. |
| **code-simplifier** | Simplificar, refactorizar y limpiar codigo. |
| **ai-ml-expert** | Prompts, RAG, embeddings, model selection. |
| **prompt-engineering** | Craft y optimizar prompts para LLMs. |
| **data-science-analytics** | EDA, estadisticas, visualizacion, ML. |
| **data-pipeline-engineer** | ETL/ELT, orchestration, ML workflows, FastAPI + data stores. |
| **thesis-reviewer** | Review de tesis, deteccion de texto AI, escritura academica. |
| **ceo-product-strategist** | Vision estrategica CEO, roadmap, impacto de producto. |
| **andrej-karpathy** | Persona de Karpathy: implementaciones simples, first-principles, code review minimalista. |
| **ops-impact-analyst** | ROI de features, metricas de negocio, reportes ejecutivos. |
| **tw93** | Gatekeeper de Mole: minimalismo, safety-first, scope discipline. |
| **manuel-ossa** | Perspectiva de scale-stage operator y customer-first product critique. |

### Commands

| Nombre | Descripcion |
|--------|-------------|
| **/redesign-ui** | Analiza componentes UI y los redisena usando ui-designer y ux-designer en paralelo. |
| **/python-review** | Revisa codigo Python para calidad, seguridad, type safety y mejores practicas. |
| **/security-scan** | Escaneo de seguridad. Busca vulnerabilidades, secretos hardcodeados, dependencias riesgosas. |
| **/lint** | Corre pre-commit suite completo: ruff, ty, isort, todos los hooks. |
| **/test** | Corre pytest con detalles de fallos y coverage opcional. |

## 5. VS Code Extensions

### Extensions

| Extension | ID | Descripcion | Costo |
|-----------|-----|-------------|-------|
| **Claude Code** | `ext-claude-code` | Integracion de Claude Code en el editor. | free |
| **GitHub Copilot Chat** | `ext-copilot-chat` | Chat de GitHub Copilot en el editor. | freemium |

---

> **119 herramientas** en total. 105 free, 10 freemium, 4 paid.
> Generado automaticamente desde `data.js` — no editar manualmente.
