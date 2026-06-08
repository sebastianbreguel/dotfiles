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
| **[Claude Desktop](https://claude.ai)** | App de escritorio de Claude. Chat + Claude Code integrado. | `brew install --cask claude` | Freemium |
| **[Docker Desktop](https://docker.com)** | Contenedores para ejecutar apps aisladas y dev environments. | `brew install --cask docker` | Free |
| **[DataGrip](https://www.jetbrains.com/datagrip)** | IDE de JetBrains para bases de datos. SQL, PostgreSQL, Redis. | `brew install --cask datagrip` | Paid |
| **[Postman](https://postman.com)** | Testing y documentacion de APIs. Collections, environments. | `brew install --cask postman` | Free |
| **[Visual Studio Code](https://code.visualstudio.com)** | Editor de codigo open source de Microsoft. Extensions marketplace. | `brew install --cask visual-studio-code` | Free |
| **[Xcode](https://developer.apple.com/xcode)** | IDE de Apple para desarrollo iOS/macOS. | `App Store` | Free |
| **[Obsidian](https://obsidian.md)** | Editor de notas en Markdown. Plugins, graph view, vault local. | `brew install --cask obsidian` | Free |
| **[Notion](https://notion.so)** | Workspace todo-en-uno. Notas, docs, wikis, bases de datos, kanban. | `Download from notion.so` | Freemium |
| **[Zotero](https://www.zotero.org)** | Gestor de referencias bibliograficas. Papers, PDFs, citas. | `Download from zotero.org` | Free |
| **Conductor** | Observabilidad y monitoreo de infraestructura. | `Enterprise install` | Paid |

### Utilidades

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[AltTab](https://alt-tab-macos.netlify.app)** | Window switcher estilo Windows con preview de ventanas. | `brew install --cask alt-tab` | Free |
| **[Rectangle](https://rectangleapp.com)** | Window management con atajos de teclado. Snapping y splits. | `brew install --cask rectangle` | Free |
| **[BetterDisplay](https://betterdisplay.pro)** | Control avanzado de monitores. Resoluciones custom, brightness. | `brew install --cask betterdisplay` | Freemium |
| **[Ice](https://icemenubar.app)** | Menu bar manager. Oculta iconos para mantener la barra limpia. | `brew install --cask jordanbaird-ice` | Free |
| **[Stats](https://github.com/exelban/stats)** | Monitor del sistema en la menu bar. CPU, RAM, disco, red. | `brew install --cask stats` | Free |
| **[Macs Fan Control](https://crystalidea.com/macs-fan-control)** | Control manual de ventiladores y monitoreo de temperatura. | `brew install --cask macs-fan-control` | Freemium |
| **[1Password CLI](https://1password.com)** | Acceso a passwords desde terminal. Secrets management. | `brew install --cask 1password-cli` | Paid |
| **cmux** | Multiplexor de sesiones Claude Code en paralelo. | `brew install --cask cmux` | Free |
| **[Raycast](https://raycast.com)** | Launcher y productivity app. Reemplaza Spotlight con extensions, snippets, window management. | `Download from raycast.com` | Freemium |
| **[BasicTeX](https://tug.org/mactex/morepackages.html)** | Distribucion minima de TeX/LaTeX para macOS. | `brew install --cask basictex` | Free |

### Browsers

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[Brave Browser](https://brave.com)** | Browser con bloqueo de ads y trackers integrado. | `brew install --cask brave-browser` | Free |
| **[Google Chrome](https://www.google.com/chrome)** | Browser de Google. Sync, extensions, DevTools. | `brew install --cask google-chrome` | Free |

### Comunicacion

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[Slack](https://slack.com)** | Mensajeria para equipos. Canales, threads, integraciones. | `brew install --cask slack` | Free |
| **[Beeper](https://beeper.com)** | Mensajeria unificada. iMessage, WhatsApp, Telegram, Discord en una app. | `Download from beeper.com` | Free |
| **[Spotify](https://spotify.com)** | Streaming de musica y podcasts. | `brew install --cask spotify` | Freemium |

### Seguridad

| App | Descripcion | Instalacion | Costo |
|-----|-------------|-------------|-------|
| **[Cloudflare WARP](https://1.1.1.1)** | VPN y DNS seguro. Encripta trafico de red. | `brew install --cask cloudflare-warp` | Free |
| **[Drata Agent](https://drata.com)** | Agente de compliance (SOC2, ISO). Monitorea configuracion de seguridad. | `Enterprise install` | Paid |

## 2. CLI Tools

### AI Coding Agents

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[Gemini CLI](https://github.com/google-gemini/gemini-cli)** | CLI oficial de Google Gemini. Coding agent en terminal. | Free |
| **[OpenAI Codex](https://github.com/openai/codex)** | CLI de OpenAI. Coding agent en terminal. | Free |
| **Kilo Code** | CLI de Kilo Code. Coding agent en terminal. | Free |
| **[Pi Coding Agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent)** | CLI coding agent de Earendil. Agente de terminal alternativo. | Free |

### Browser & Automation

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **agent-browser** | Browser automation CLI para AI agents. | Free |

### Dev Tools

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[asciinema](https://asciinema.org)** | Grabador de sesiones de terminal. Genera recordings reproducibles y compartibles. | Free |
| **[ImageMagick](https://imagemagick.org)** | Suite de procesamiento de imagenes desde CLI. Conversion, resize, composicion. | Free |
| **[Deno](https://deno.com)** | Runtime de JS/TS con seguridad por defecto. Alternativa moderna a Node. | Free |
| **[Go](https://go.dev)** | Lenguaje compilado de Google. Concurrente, tipado, rapido. | Free |
| **[bats-core](https://github.com/bats-core/bats-core)** | Framework de testing para scripts Bash. | Free |
| **[tectonic](https://tectonic-typesetting.github.io)** | Compilador de LaTeX moderno. Descarga paquetes automaticamente. | Free |
| **[PostgreSQL 15](https://www.postgresql.org)** | Base de datos relacional. El estandar de la industria. | Free |
| **[Redis](https://redis.io)** | Base de datos in-memory. Cache, queues, pub/sub. | Free |
| **[git-filter-repo](https://github.com/newren/git-filter-repo)** | Reescribir historial de git de forma segura. Reemplaza filter-branch. | Free |
| **[Zig](https://ziglang.org)** | Lenguaje de programacion de sistemas. Compilador y build system. | Free |
| **[Ruff](https://docs.astral.sh/ruff)** | Linter y formatter para Python. Ultra rapido, reemplaza flake8+isort+black. | Free |
| **[pre-commit](https://pre-commit.com)** | Framework de hooks para git. Ejecuta linters y checks antes de cada commit. | Free |
| **[prek](https://github.com/j178/prek)** | Wrapper de pre-commit mas rapido. Escrito en Go, cachea resultados. | Free |
| **[complexipy](https://github.com/rohaquinern/complexipy)** | Analizador de complejidad cognitiva para Python. Detecta funciones dificiles de mantener. | Free |
| **[code-review-graph](https://github.com/sebastianbreguel/code-review-graph)** | MCP server para busqueda semantica de codigo. Grafo de dependencias y analisis de impacto. | Free |
| **[pgvector](https://github.com/pgvector/pgvector)** | Extension de PostgreSQL para vectores y busqueda semantica. | Free |
| **[idb-companion](https://fbidb.io)** | Daemon de Facebook IDB para automatizar simuladores iOS desde CLI. | Free |
| **[maturin](https://github.com/PyO3/maturin)** | Build tool para Python + Rust. Compila PyO3 a wheels. | Free |
| **[vulture](https://github.com/jendrikseipp/vulture)** | Detector de codigo Python muerto. Encuentra funciones y variables sin usar. | Free |
| **[Pake](https://github.com/tw93/Pake)** | Convierte cualquier web en app de escritorio liviana via Tauri/Rust. | Free |
| **[defuddle](https://github.com/kepano/defuddle)** | Extrae contenido limpio de paginas web. Convierte HTML a markdown legible. | Free |
| **[Engram](https://github.com/gentleman-programming/engram)** | Memoria persistente para Claude Code. Guarda decisiones, bugs, descubrimientos entre sesiones. | Free |
| **[libpq](https://postgresql.org/docs/current/libpq.html)** | Libreria cliente de PostgreSQL. Provee psql y utilidades de conexion. | Free |

### Package Managers & Deploy

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[pnpm](https://pnpm.io)** | Package manager rapido y eficiente en disco. | Free |
| **[uv](https://docs.astral.sh/uv)** | Python package manager ultra rapido. Escrito en Rust. | Free |
| **[Vercel](https://vercel.com)** | CLI para deploy de apps web. | Freemium |
| **[NVM](https://github.com/nvm-sh/nvm)** | Node Version Manager. Instalar y cambiar entre versiones de Node.js. | Free |

### Terminal Tools

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[tmux](https://github.com/tmux/tmux)** | Multiplexor de terminal. Sesiones persistentes, splits. | Free |
| **[pam-reattach](https://github.com/fabianishere/pam_reattach)** | Modulo PAM que permite Touch ID para sudo dentro de tmux/screen. | Free |
| **[fzf](https://github.com/junegunn/fzf)** | Fuzzy finder. Ctrl+R mejorado, busqueda de archivos. | Free |
| **[htop](https://htop.dev)** | Monitor de procesos interactivo. Mejor que top. | Free |
| **aitop** | Monitor del sistema con AI. Top-like con analisis inteligente. | Free |
| **[AWS CLI](https://aws.amazon.com/cli)** | CLI oficial de AWS. Manejo de servicios desde terminal. | Free |
| **[pipx](https://pipx.pypa.io)** | Instalador de apps Python en venvs aisladas. | Free |
| **[Python 3.12](https://python.org)** | Runtime Python 3.12 instalado via Homebrew. | Free |
| **[ffmpeg](https://ffmpeg.org)** | Procesamiento de audio/video. Conversion, encoding. | Free |
| **[ncdu](https://dev.yorhel.nl/ncdu)** | Analizador de uso de disco con interfaz ncurses. | Free |
| **[gh](https://cli.github.com)** | CLI oficial de GitHub. PRs, issues, repos desde terminal. | Free |
| **[jq](https://jqlang.github.io/jq)** | Procesador de JSON en linea de comandos. | Free |
| **[shellcheck](https://www.shellcheck.net)** | Linter para scripts shell. Encuentra bugs y problemas. | Free |
| **[nvtop](https://github.com/Syllo/nvtop)** | Monitor de GPU (similar a htop para GPUs). | Free |
| **[RTK (Rust Token Killer)](https://github.com/nicholasgasior/rtk)** | Proxy CLI que ahorra 60-90% de tokens en operaciones de dev. | Free |
| **[sox](https://sox.sourceforge.net)** | Procesamiento de audio en linea de comandos. Grabacion, conversion, efectos. | Free |
| **[mole](https://github.com/davrodpin/mole)** | SSH tunneling simplificado. Crea tunnels con un comando. | Free |
| **[Glow](https://github.com/charmbracelet/glow)** | Render de Markdown en la terminal con syntax highlighting y paginacion. | Free |
| **[mas](https://github.com/mas-cli/mas)** | CLI para Mac App Store. Instalar, actualizar y buscar apps desde la terminal. | Free |
| **[yt-dlp](https://github.com/yt-dlp/yt-dlp)** | Descargador de video/audio de YouTube y +1000 sitios. Fork mejorado de youtube-dl. | Free |

## 3. Shell Setup

### Shell

| Tool | Descripcion | Costo |
|------|-------------|-------|
| **[Oh My Zsh](https://ohmyz.sh)** | Framework para Zsh. Aliases, plugins, themes. La base de todo. | Free |
| **[Powerlevel10k](https://github.com/romkatv/powerlevel10k)** | Theme ultra rapido con prompt customizable y iconos. | Free |
| **[zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)** | Sugiere comandos del historial mientras escribes. | Free |
| **[Meslo LG Nerd Font](https://github.com/ryanoasis/nerd-fonts)** | Fuente patched con iconos para terminal y editores. | Free |
| **[zsh (brew)](https://zsh.sourceforge.io)** | Z shell instalado via Homebrew. Mas nuevo que el del sistema. | Free |

## 4. Claude Code

### Plugins

| Plugin | Descripcion | Costo |
|--------|-------------|-------|
| **context-mode** | Optimiza el context window ejecutando comandos en sandbox. Ahorra ~80% de tokens. | Free |
| **code-simplifier** | Revisa codigo modificado para simplificar, mejorar calidad y encontrar issues. | Free |
| **context7** | Context7 MCP server para busqueda de documentacion en tiempo real. | Free |
| **frontend-design** | Herramientas de disenio frontend: componentes, layouts, CSS. | Free |
| **playwright** | Browser automation via Playwright MCP. Testing, scraping, interaccion web. | Free |
| **skill-creator** | Crea, modifica y mide rendimiento de skills custom para Claude Code. | Free |
| **superpowers** | Superpowers: writing-plans, executing-plans, brainstorming, systematic-debugging. | Free |
| **claude-hud** | HUD (Heads-Up Display) para Claude Code. Status line con info en tiempo real. | Free |
| **[caveman](https://github.com/JuliusBrussee/caveman)** | Modo cavernicola. Comprime respuestas 50-75% eliminando relleno, articulos y filler. | Free |
| **[code-review](https://github.com/anthropics/claude-code)** | Plugin oficial de Anthropic para code review de PRs. | Free |
| **[compound-engineering](https://github.com/EveryInc/compound-engineering-plugin)** | Mega-plugin de Compound Engineering. Code review multi-agente, commits, PRs, debugging, planificacion, worktrees. | Free |
| **[codex](https://github.com/openai/codex-plugin-cc)** | Integracion con OpenAI Codex CLI. Permite delegar tareas a Codex desde Claude Code. | Free |
| **[claude-code-setup](https://github.com/anthropics/claude-code)** | Asistente de setup inicial de Claude Code. Genera CLAUDE.md, sugiere hooks y automatizaciones. | Free |

### Skills

| Skill | Comando | Descripcion |
|-------|---------|-------------|
| **/browser-automation** | `Built-in skill` | Browser automation CLI. Navegacion, forms, scraping, screenshots. |
| **/dream** | `Built-in skill` | Consolidacion de memoria multi-fase. Merge updates, pruning. |
| **/health** | `Built-in skill` | Diagnostico cuando Claude se siente lento o ignora reglas. Audita hooks y MCP. |
| **/panel** | `Built-in skill` | Panel de 3 lentes: simplificacion, arquitectura, producto. Multi-perspectiva. |
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
| **ceo-product-strategist** | Vision estrategica CEO, roadmap, impacto de producto. |
| **andrej-karpathy** | Persona de Karpathy: implementaciones simples, first-principles, code review minimalista. |
| **ops-impact-analyst** | ROI de features, metricas de negocio, reportes ejecutivos. |
| **tw93** | Gatekeeper de Mole: minimalismo, safety-first, scope discipline. |
| **database-engineer** | Disenio de esquemas, optimizacion de queries, modelado relacional. |
| **coo** | Perspectiva de scale-stage operator y customer-first product critique. |

### Commands

| Nombre | Descripcion |
|--------|-------------|
| **/redesign-ui** | Analiza componentes UI y los redisena usando ui-designer y ux-designer en paralelo. |
| **/lint** | Corre pre-commit suite completo: ruff, ty, isort, todos los hooks. |
| **/test** | Corre pytest con detalles de fallos y coverage opcional. |

## 5. VS Code Extensions

### Extensions

| Extension | ID | Descripcion | Costo |
|-----------|-----|-------------|-------|
| **Claude Code** | `ext-claude-code` | Integracion de Claude Code en el editor. | Free |
| **[Edit CSV](https://marketplace.visualstudio.com/items?itemName=janisdd.vscode-edit-csv)** | `ext-edit-csv` | Editar archivos CSV en una tabla dentro del editor. | Free |
| **[Rainbow CSV](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv)** | `ext-rainbow-csv` | Colorea columnas de archivos CSV/TSV y permite queries tipo SQL sobre ellos. | Free |

---

> **122 herramientas** en total. 111 free, 7 freemium, 4 paid.
> Generado automaticamente desde `data.js` — no editar manualmente.
