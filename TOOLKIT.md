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
| **[Docker Desktop](https://docker.com)** | Contenedores para ejecutar apps aisladas y dev environments. | `brew install --cask docker` | Free |
| **[DataGrip](https://www.jetbrains.com/datagrip)** | IDE de JetBrains para bases de datos. SQL, PostgreSQL, Redis. | `brew install --cask datagrip` | Paid |
| **[Postman](https://postman.com)** | Testing y documentacion de APIs. Collections, environments. | `brew install --cask postman` | Free |
| **[Visual Studio Code](https://code.visualstudio.com)** | Editor de codigo open source de Microsoft. Extensions marketplace. | `brew install --cask visual-studio-code` | Free |
| **[Xcode](https://developer.apple.com/xcode)** | IDE de Apple para desarrollo iOS/macOS. | `App Store` | Free |
| **[Obsidian](https://obsidian.md)** | Editor de notas en Markdown. Plugins, graph view, vault local. | `brew install --cask obsidian` | Free |
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
| **[BasicTeX](https://tug.org/mactex/morepackages.html)** | Distribucion minima de TeX/LaTeX para macOS. | `brew install --cask basictex` | Free |
| **[SoftFocus](https://github.com/waydabber/SoftFocus)** | Atenua y desenfoca las ventanas inactivas para enfocarte en la activa. | `brew install --cask softfocus` | Free |
| **[Poke Token Bar](https://github.com/chattymin/poke)** | Menu bar app que muestra uso de tokens de Claude. | `brew install --cask poke-token-bar` | Free |

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
| **[Prime Agent](https://npmjs.com/package/prime-agent)** | Coding agent de terminal, alternativa open a Claude Code. | Free |

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
| **[pgvector](https://github.com/pgvector/pgvector)** | Extension de PostgreSQL para vectores y busqueda semantica. | Free |
| **[maturin](https://github.com/PyO3/maturin)** | Build tool para Python + Rust. Compila PyO3 a wheels. | Free |
| **[vulture](https://github.com/jendrikseipp/vulture)** | Detector de codigo Python muerto. Encuentra funciones y variables sin usar. | Free |
| **[Pake](https://github.com/tw93/Pake)** | Convierte cualquier web en app de escritorio liviana via Tauri/Rust. | Free |
| **[defuddle](https://github.com/kepano/defuddle)** | Extrae contenido limpio de paginas web. Convierte HTML a markdown legible. | Free |
| **[Engram](https://github.com/gentleman-programming/engram)** | Memoria persistente para Claude Code. Guarda decisiones, bugs, descubrimientos entre sesiones. | Free |
| **[libpq](https://postgresql.org/docs/current/libpq.html)** | Libreria cliente de PostgreSQL. Provee psql y utilidades de conexion. | Free |
| **[CMake](https://cmake.org)** | Sistema de build multiplataforma para C/C++. | Free |
| **[Ninja](https://ninja-build.org)** | Build system minimalista y rapido, backend comun de CMake. | Free |
| **[LLVM](https://llvm.org)** | Toolchain de compiladores: clang, lld, herramientas de analisis. | Free |
| **[rbenv](https://github.com/rbenv/rbenv)** | Manejador de versiones de Ruby por proyecto. | Free |
| **[pango](https://pango.gnome.org)** | Libreria de renderizado de texto (dependencia de herramientas graficas). | Free |
| **[poppler](https://poppler.freedesktop.org)** | Libreria y utilidades para PDFs (pdftotext, pdfinfo). | Free |
| **[tbb](https://github.com/uxlfoundation/oneTBB)** | Libreria de paralelismo de Intel (oneTBB) para C++. | Free |
| **[ripgrep](https://github.com/BurntSushi/ripgrep)** | Grep ultrarapido escrito en Rust. El `rg` que usan todos los editores. | Free |
| **[llama.cpp](https://github.com/ggml-org/llama.cpp)** | Inferencia de LLMs local en C/C++. Corre modelos GGUF en la Mac. | Free |
| **[lld](https://lld.llvm.org)** | Linker de LLVM, mucho mas rapido que el linker del sistema. | Free |
| **[Unbound](https://nlnetlabs.nl/projects/unbound)** | DNS resolver local con validacion DNSSEC y cache. | Free |
| **[AWS Session Manager Plugin](https://docs.aws.amazon.com/systems-manager)** | Plugin de AWS CLI para abrir sesiones SSM a instancias EC2 sin SSH. | Free |

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
| **[AWS CLI](https://aws.amazon.com/cli)** | CLI oficial de AWS. Manejo de servicios desde terminal. | Free |
| **[pipx](https://pipx.pypa.io)** | Instalador de apps Python en venvs aisladas. | Free |
| **[Python 3.12](https://python.org)** | Runtime Python 3.12 instalado via Homebrew. | Free |
| **[ffmpeg](https://ffmpeg.org)** | Procesamiento de audio/video. Conversion, encoding. | Free |
| **[ncdu](https://dev.yorhel.nl/ncdu)** | Analizador de uso de disco con interfaz ncurses. | Free |
| **[gh](https://cli.github.com)** | CLI oficial de GitHub. PRs, issues, repos desde terminal. | Free |
| **[jq](https://jqlang.github.io/jq)** | Procesador de JSON en linea de comandos. | Free |
| **[shellcheck](https://www.shellcheck.net)** | Linter para scripts shell. Encuentra bugs y problemas. | Free |
| **[nvtop](https://github.com/Syllo/nvtop)** | Monitor de GPU (similar a htop para GPUs). | Free |
| **[sox](https://sox.sourceforge.net)** | Procesamiento de audio en linea de comandos. Grabacion, conversion, efectos. | Free |
| **[mole](https://github.com/davrodpin/mole)** | SSH tunneling simplificado. Crea tunnels con un comando. | Free |
| **[Glow](https://github.com/charmbracelet/glow)** | Render de Markdown en la terminal con syntax highlighting y paginacion. | Free |
| **[mas](https://github.com/mas-cli/mas)** | CLI para Mac App Store. Instalar, actualizar y buscar apps desde la terminal. | Free |
| **[yt-dlp](https://github.com/yt-dlp/yt-dlp)** | Descargador de video/audio de YouTube y +1000 sitios. Fork mejorado de youtube-dl. | Free |
| **[glances](https://nicolargo.github.io/glances)** | Monitor de sistema en terminal: CPU, RAM, disco, red en una vista. | Free |
| **[vhs](https://github.com/charmbracelet/vhs)** | Graba demos de terminal como GIF/video desde un script. | Free |
| **[watch](https://gitlab.com/procps-ng/procps)** | Re-ejecuta un comando cada N segundos y muestra el output. | Free |

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
| **[code-review](https://github.com/anthropics/claude-code)** | Plugin oficial de Anthropic para code review de PRs. | Free |
| **[compound-engineering](https://github.com/EveryInc/compound-engineering-plugin)** | Mega-plugin de Compound Engineering. Code review multi-agente, commits, PRs, debugging, planificacion, worktrees. | Free |
| **[codex](https://github.com/openai/codex-plugin-cc)** | Integracion con OpenAI Codex CLI. Permite delegar tareas a Codex desde Claude Code. | Free |
| **[claude-code-setup](https://github.com/anthropics/claude-code)** | Asistente de setup inicial de Claude Code. Genera CLAUDE.md, sugiere hooks y automatizaciones. | Free |
| **Serena** | Lenguaje de simbolos para codigo: find_symbol, references, rename via LSP. | Free |
| **Datadog** | MCP de Datadog: logs, metricas, traces, monitors desde Claude. | Free |
| **PostHog** | MCP de PostHog: analytics, feature flags, errores, insights. | Free |
| **Figma** | MCP de Figma para leer disenos desde Claude. | Free |
| **Feature Dev** | Workflow guiado para desarrollar features completas. | Free |
| **Slack** | MCP de Slack: leer y buscar mensajes del workspace. | Free |
| **Coding Tutor** | Tutor de programacion paso a paso. | Free |
| **Complexity Optimizer** | Encuentra y arregla bottlenecks de performance y algoritmos ineficientes. | Free |
| **Understand Anything** | Explica cualquier codebase o concepto desde cero. | Free |
| **Vercel** | Plugin oficial de Vercel: deploys y proyectos desde Claude. | Free |
| **Engram** | Memoria persistente para Claude Code via SQLite + FTS5. | Free |
| **Ponytail** | Fuerza la solucion mas lazy que funciona: YAGNI, stdlib antes que deps. | Free |

### Skills

| Skill | Comando | Descripcion |
|-------|---------|-------------|
| **/dream** | `Built-in skill` | Consolidacion de memoria multi-fase. Merge updates, pruning. |
| **Sync Dotfiles** | `/sync-dotfiles` | Sincroniza config de la maquina al repo. Detecta herramientas nuevas, actualiza data.js y regenera docs. |
| **brand-format** | `Custom skill (~/.claude/skills)` | Aplica branding de Vambe a PPTX, DOCX, XLSX y HTML. |
| **codebase-design** | `Custom skill (~/.claude/skills)` | Vocabulario compartido para disenar modulos profundos. |
| **domain-modeling** | `Custom skill (~/.claude/skills)` | Construye el modelo de dominio: glosario y ADRs. |
| **generate-github-coder-profile** | `Custom skill (~/.claude/skills)` | Genera un perfil de coder a partir de la actividad de GitHub. |
| **grilling** | `Custom skill (~/.claude/skills)` | Interroga sin piedad un plan o decision para stress-testearla. |
| **handoff** | `Custom skill (~/.claude/skills)` | Prepara un handoff privado para continuar una tarea en otro agente. |
| **hunt** | `Custom skill (~/.claude/skills)` | Encuentra la causa raiz de errores y regresiones antes de cualquier fix. |
| **improve-codebase-architecture** | `Custom skill (~/.claude/skills)` | Encuentra oportunidades de consolidacion de modulos acoplados. |
| **pr-checkpoint** | `Custom skill (~/.claude/skills)` | Revisa el diff contra mis reglas antes de push o PR. |
| **query-perf-review** | `Custom skill (~/.claude/skills)` | Revisa cambios de performance de queries ClickHouse y Postgres. |
| **retro** | `Custom skill (~/.claude/skills)` | Retrospectiva de la sesion de trabajo. |
| **synced** | `Custom skill (~/.claude/skills)` | Skills sincronizadas entre maquinas. |
| **writing-for-agents** | `Custom skill (~/.claude/skills)` | Escribir docs e instrucciones optimizadas para agentes. |

### Agents

| Agent | Descripcion |
|-------|-------------|
| **tech-lead** | Decisiones tecnicas, coordinacion cross-domain. |
| **code-simplifier** | Simplificar, refactorizar y limpiar codigo. |
| **planner** | Disena el plan de implementacion antes de escribir codigo, anclado al codigo real. |
| **yuyo** | Reviewer tecnico de NLP, ML y sistemas LLM: prompts, evals, RAG, embeddings. |

## 5. VS Code Extensions

### Extensions

| Extension | ID | Descripcion | Costo |
|-----------|-----|-------------|-------|
| **Claude Code** | `ext-claude-code` | Integracion de Claude Code en el editor. | Free |
| **[Edit CSV](https://marketplace.visualstudio.com/items?itemName=janisdd.vscode-edit-csv)** | `ext-edit-csv` | Editar archivos CSV en una tabla dentro del editor. | Free |
| **[Rainbow CSV](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv)** | `ext-rainbow-csv` | Colorea columnas de archivos CSV/TSV y permite queries tipo SQL sobre ellos. | Free |

---

> **140 herramientas** en total. 132 free, 4 freemium, 4 paid.
> Generado automaticamente desde `data.js` — no editar manualmente.
