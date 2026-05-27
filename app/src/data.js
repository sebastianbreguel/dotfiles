// app/src/data.js — generated from prior schema, shaped for dotfiles UI
// Categories: top-level sections in left nav.
// Each category groups tools by sub-section. Tools carry { id, name, desc, install, site, tags, badges, featured, note, related }.

export const DATA = {
  "Mac Apps": {
    "slug": "mac-apps",
    "catKey": "apps",
    "count": 31,
    "groups": {
      "Desarrollo": [
        {
          "id": "claude-desktop",
          "name": "Claude Desktop",
          "desc": "App de escritorio de Claude. Chat + Claude Code integrado.",
          "install": "brew install --cask claude",
          "site": "claude.ai",
          "tags": [
            "ai",
            "chat",
            "claude"
          ],
          "badges": [
            "Freemium"
          ],
          "featured": true,
          "note": "La uso para tareas de chat rapido y proyectos que no requieren la CLI. Tener Claude nativo en el escritorio cambia el workflow.",
          "related": [
            "Claude Code"
          ]
        },
        {
          "id": "docker",
          "name": "Docker Desktop",
          "desc": "Contenedores para ejecutar apps aisladas y dev environments.",
          "install": "brew install --cask docker",
          "site": "docker.com",
          "tags": [
            "containers",
            "devops"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Indispensable para levantar cualquier stack local sin contaminar el sistema. Sin Docker no trabajo.",
          "related": []
        },
        {
          "id": "datagrip",
          "name": "DataGrip",
          "desc": "IDE de JetBrains para bases de datos. SQL, PostgreSQL, Redis.",
          "install": "brew install --cask datagrip",
          "site": "www.jetbrains.com/datagrip",
          "tags": [
            "database",
            "sql",
            "jetbrains"
          ],
          "badges": [
            "Paid"
          ],
          "featured": true,
          "note": "El mejor cliente de DB que existe. El autocompletado de SQL y el diagrama de esquema me ahorran horas por semana.",
          "related": []
        },
        {
          "id": "postman",
          "name": "Postman",
          "desc": "Testing y documentacion de APIs. Collections, environments.",
          "install": "brew install --cask postman",
          "site": "postman.com",
          "tags": [
            "api",
            "testing"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para probar endpoints rapido y guardar collections de APIs del proyecto. No hay alternativa que se le acerque.",
          "related": []
        },
        {
          "id": "vscode",
          "name": "Visual Studio Code",
          "desc": "Editor de codigo open source de Microsoft. Extensions marketplace.",
          "install": "brew install --cask visual-studio-code",
          "site": "code.visualstudio.com",
          "tags": [
            "editor",
            "microsoft"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Mi editor principal. El ecosistema de extensions es imbatible.",
          "related": []
        },
        {
          "id": "xcode",
          "name": "Xcode",
          "desc": "IDE de Apple para desarrollo iOS/macOS.",
          "install": "App Store",
          "site": "developer.apple.com/xcode",
          "tags": [
            "ios",
            "macos",
            "apple"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Obligatorio si tocas algo de Apple. No me entusiasma, pero sin el simulador de iOS no puedo probar nada.",
          "related": []
        },
        {
          "id": "obsidian",
          "name": "Obsidian",
          "desc": "Editor de notas en Markdown. Plugins, graph view, vault local.",
          "install": "brew install --cask obsidian",
          "site": "obsidian.md",
          "tags": [
            "notes",
            "markdown"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Mi segundo cerebro. Todo lo que aprendo va ahi. El graph view de links entre notas es adictivo y util de verdad.",
          "related": []
        },
        {
          "id": "notion",
          "name": "Notion",
          "desc": "Workspace todo-en-uno. Notas, docs, wikis, bases de datos, kanban.",
          "install": "Download from notion.so",
          "site": "notion.so",
          "tags": [
            "notes",
            "workspace",
            "docs"
          ],
          "badges": [
            "Freemium"
          ],
          "featured": true,
          "note": "Para documentacion compartida del equipo. Obsidian es personal, Notion es el espacio colaborativo donde todos escriben.",
          "related": [
            "Obsidian"
          ]
        },
        {
          "id": "zotero",
          "name": "Zotero",
          "desc": "Gestor de referencias bibliograficas. Papers, PDFs, citas.",
          "install": "Download from zotero.org",
          "site": "www.zotero.org",
          "tags": [
            "academic",
            "references",
            "papers"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para organizar papers y referencias academicas. Cuando investigo un tema nuevo, todos los PDFs y citas quedan en un solo lugar.",
          "related": []
        },
        {
          "id": "conductor",
          "name": "Conductor",
          "desc": "Observabilidad y monitoreo de infraestructura.",
          "install": "Enterprise install",
          "tags": [
            "monitoring",
            "observability"
          ],
          "badges": [
            "Paid"
          ],
          "featured": true,
          "note": "Lo uso en el trabajo para monitorear pipelines en produccion. Cuando algo falla a las 2am, es lo primero que abro.",
          "related": []
        }
      ],
      "Utilidades": [
        {
          "id": "alttab",
          "name": "AltTab",
          "desc": "Window switcher estilo Windows con preview de ventanas.",
          "install": "brew install --cask alt-tab",
          "site": "alt-tab-macos.netlify.app",
          "tags": [
            "windows",
            "productivity"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "El switcher nativo de Mac es una basura para multitasking serio. AltTab te da preview real de cada ventana como en Windows.",
          "related": [
            "Rectangle"
          ]
        },
        {
          "id": "rectangle",
          "name": "Rectangle",
          "desc": "Window management con atajos de teclado. Snapping y splits.",
          "install": "brew install --cask rectangle",
          "site": "rectangleapp.com",
          "tags": [
            "windows",
            "productivity"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "No puedo vivir sin splits de terminal y editor en pantalla completa. Rectangle hace que Mac se comporte como deberia.",
          "related": [
            "AltTab"
          ]
        },
        {
          "id": "betterdisplay",
          "name": "BetterDisplay",
          "desc": "Control avanzado de monitores. Resoluciones custom, brightness.",
          "install": "brew install --cask betterdisplay",
          "site": "betterdisplay.pro",
          "tags": [
            "display",
            "monitor"
          ],
          "badges": [
            "Freemium"
          ],
          "featured": true,
          "note": "Para sacarle resoluciones custom al monitor externo sin que quede pixelado. Apple no da estas opciones de forma nativa.",
          "related": []
        },
        {
          "id": "ice",
          "name": "Ice",
          "desc": "Menu bar manager. Oculta iconos para mantener la barra limpia.",
          "install": "brew install --cask jordanbaird-ice",
          "site": "icemenubar.app",
          "tags": [
            "menubar",
            "productivity"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Con 20 apps abiertas la menu bar se convierte en un caos. Ice la mantiene limpia sin perder acceso a nada.",
          "related": [
            "Stats"
          ]
        },
        {
          "id": "stats",
          "name": "Stats",
          "desc": "Monitor del sistema en la menu bar. CPU, RAM, disco, red.",
          "install": "brew install --cask stats",
          "site": "github.com/exelban/stats",
          "tags": [
            "monitoring",
            "system"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Un vistazo rapido a CPU y RAM sin abrir Activity Monitor. Cuando el fan arranca solo miro la barra y ya se que esta quemando.",
          "related": [
            "htop",
            "Ice"
          ]
        },
        {
          "id": "macs-fan-control",
          "name": "Macs Fan Control",
          "desc": "Control manual de ventiladores y monitoreo de temperatura.",
          "install": "brew install --cask macs-fan-control",
          "site": "crystalidea.com/macs-fan-control",
          "tags": [
            "hardware",
            "temperature"
          ],
          "badges": [
            "Freemium"
          ],
          "featured": true,
          "note": "Cuando tengo modelos corriendo en local el Mac se convierte en una freidora. Esto me deja forzar el fan antes de que se queme.",
          "related": [
            "Stats"
          ]
        },
        {
          "id": "1password-cli",
          "name": "1Password CLI",
          "desc": "Acceso a passwords desde terminal. Secrets management.",
          "install": "brew install --cask 1password-cli",
          "site": "1password.com",
          "tags": [
            "security",
            "passwords"
          ],
          "badges": [
            "Paid"
          ],
          "featured": true,
          "note": "Para inyectar secrets en scripts sin hardcodearlos. `op run` es una de las mejores integraciones de seguridad que existen para devs.",
          "related": []
        },
        {
          "id": "cmux",
          "name": "cmux",
          "desc": "Multiplexor de sesiones Claude Code en paralelo.",
          "install": "brew install --cask cmux",
          "tags": [
            "claude",
            "multiplexor"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para correr multiples agentes de Claude Code en paralelo sin abrir 10 terminales. Multiplica la productividad cuando tenes tareas independientes.",
          "related": [
            "Claude Code"
          ]
        },
        {
          "id": "raycast",
          "name": "Raycast",
          "desc": "Launcher y productivity app. Reemplaza Spotlight con extensions, snippets, window management.",
          "install": "Download from raycast.com",
          "site": "raycast.com",
          "tags": [
            "launcher",
            "productivity",
            "automation"
          ],
          "badges": [
            "Freemium"
          ],
          "featured": true,
          "note": "Spotlight con esteroides. Extensions para todo: clipboard history, snippets, window management. Una vez que lo usas no hay vuelta atras.",
          "related": []
        },
        {
          "id": "basictex",
          "name": "BasicTeX",
          "desc": "Distribucion minima de TeX/LaTeX para macOS.",
          "install": "brew install --cask basictex",
          "site": "tug.org/mactex/morepackages.html",
          "tags": [
            "latex",
            "tex",
            "documents"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Lo necesito para compilar docs LaTeX sin instalar MacTeX entero. Funciona con tectonic cuando falta algun paquete.",
          "related": [
            "tectonic"
          ]
        }
      ],
      "Browsers": [
        {
          "id": "brave",
          "name": "Brave Browser",
          "desc": "Browser con bloqueo de ads y trackers integrado.",
          "install": "brew install --cask brave-browser",
          "site": "brave.com",
          "tags": [
            "browser",
            "privacy"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Mi browser principal. Sin ads nativos y mucho mas rapido que Chrome en sitios pesados. La privacidad es un bonus.",
          "related": [
            "Google Chrome"
          ]
        },
        {
          "id": "chrome",
          "name": "Google Chrome",
          "desc": "Browser de Google. Sync, extensions, DevTools.",
          "install": "brew install --cask google-chrome",
          "site": "www.google.com/chrome",
          "tags": [
            "browser",
            "google"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Lo tengo por los DevTools y para testing cross-browser. Cuando el cliente usa Chrome necesito reproducir exactamente su entorno.",
          "related": [
            "Brave Browser"
          ]
        }
      ],
      "Comunicacion": [
        {
          "id": "slack",
          "name": "Slack",
          "desc": "Mensajeria para equipos. Canales, threads, integraciones.",
          "install": "brew install --cask slack",
          "site": "slack.com",
          "tags": [
            "communication",
            "team"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "El estandar de facto en equipos tech. No me gusta mucho pero todos estan ahi, asi que no hay opcion.",
          "related": []
        },
        {
          "id": "beeper",
          "name": "Beeper",
          "desc": "Mensajeria unificada. iMessage, WhatsApp, Telegram, Discord en una app.",
          "install": "Download from beeper.com",
          "site": "beeper.com",
          "tags": [
            "messaging",
            "unified"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Tener iMessage, WhatsApp y Telegram en una sola ventana es un game changer para el foco. Menos cambios de contexto = mas productividad.",
          "related": [
            "Slack"
          ]
        },
        {
          "id": "spotify",
          "name": "Spotify",
          "desc": "Streaming de musica y podcasts.",
          "install": "brew install --cask spotify",
          "site": "spotify.com",
          "tags": [
            "music",
            "streaming"
          ],
          "badges": [
            "Freemium"
          ],
          "featured": true,
          "note": "No codifico sin musica. Playlists de lo-fi y electronic para entrar en flow. El algoritmo de discovery es bastante bueno.",
          "related": []
        }
      ],
      "Seguridad": [
        {
          "id": "cloudflare-warp",
          "name": "Cloudflare WARP",
          "desc": "VPN y DNS seguro. Encripta trafico de red.",
          "install": "brew install --cask cloudflare-warp",
          "site": "1.1.1.1",
          "tags": [
            "vpn",
            "security",
            "dns"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "DNS rapido y encriptado sin la complejidad de una VPN corporativa. Lo activo en redes publicas sin pensarlo dos veces.",
          "related": []
        },
        {
          "id": "drata",
          "name": "Drata Agent",
          "desc": "Agente de compliance (SOC2, ISO). Monitorea configuracion de seguridad.",
          "install": "Enterprise install",
          "site": "drata.com",
          "tags": [
            "compliance",
            "security"
          ],
          "badges": [
            "Paid"
          ],
          "featured": true,
          "note": "Requerimiento de la empresa para SOC2. No lo instale por gusto pero hace el compliance automatico en segundo plano sin molestar.",
          "related": []
        }
      ]
    }
  },
  "CLI Tools": {
    "slug": "cli-tools",
    "catKey": "cli",
    "count": 44,
    "groups": {
      "AI Coding Agents": [
        {
          "id": "gemini-cli",
          "name": "Gemini CLI",
          "desc": "CLI oficial de Google Gemini. Coding agent en terminal.",
          "install": "pnpm install -g @google/gemini-cli",
          "site": "github.com/google-gemini/gemini-cli",
          "tags": [
            "ai",
            "coding",
            "google"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Lo tengo para benchmarks y para tareas donde el contexto largo de Gemini importa. Util para comparar resultados con Claude Code.",
          "related": [
            "Claude Code",
            "OpenAI Codex"
          ]
        },
        {
          "id": "codex-cli",
          "name": "OpenAI Codex",
          "desc": "CLI de OpenAI. Coding agent en terminal.",
          "install": "brew install --cask codex",
          "site": "github.com/openai/codex",
          "tags": [
            "ai",
            "coding",
            "openai"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Alternativa a Claude Code para proyectos donde el cliente es fan de OpenAI. Lo mantengo instalado para no tener sorpresas.",
          "related": [
            "Claude Code",
            "Gemini CLI"
          ]
        },
        {
          "id": "kilo-code",
          "name": "Kilo Code",
          "desc": "CLI de Kilo Code. Coding agent en terminal.",
          "install": "pnpm install -g @kilocode/cli",
          "tags": [
            "ai",
            "coding"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Lo estoy explorando como alternativa open-source a los agents principales. Prometedor para workflows que necesitan mas control.",
          "related": [
            "Claude Code"
          ]
        },
        {
          "id": "agentmemory",
          "name": "Agent Memory",
          "desc": "CLI para gestionar memoria persistente de coding agents.",
          "install": "npm install -g @agentmemory/agentmemory",
          "site": "github.com/agentmemory/agentmemory",
          "tags": [
            "ai",
            "memory",
            "agents"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Agrega memoria persistente cross-session a Claude Code y otros agents. Util cuando quiero que el agent recuerde entre conversaciones.",
          "related": [
            "Claude Code"
          ]
        }
      ],
      "Browser & Automation": [
        {
          "id": "agent-browser",
          "name": "agent-browser",
          "desc": "Browser automation CLI para AI agents.",
          "install": "pnpm install -g agent-browser",
          "tags": [
            "browser",
            "automation"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para automatizar flujos web desde agentes AI sin levantar Playwright manual. Se integra directo con Claude Code.",
          "related": []
        }
      ],
      "Dev Tools": [
        {
          "id": "asciinema",
          "name": "asciinema",
          "desc": "Grabador de sesiones de terminal. Genera recordings reproducibles y compartibles.",
          "install": "brew install asciinema",
          "site": "asciinema.org",
          "tags": [
            "terminal",
            "recording",
            "demo"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para grabar demos de herramientas CLI. Mucho mejor que un GIF — se puede copiar texto del recording y pesa nada.",
          "related": [
            "tmux"
          ]
        },
        {
          "id": "imagemagick",
          "name": "ImageMagick",
          "desc": "Suite de procesamiento de imagenes desde CLI. Conversion, resize, composicion.",
          "install": "brew install imagemagick",
          "site": "imagemagick.org",
          "tags": [
            "images",
            "processing",
            "conversion"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "El ffmpeg de las imagenes. Batch resize, conversion entre formatos, watermarks — todo desde un script.",
          "related": [
            "ffmpeg"
          ]
        },
        {
          "id": "deno",
          "name": "Deno",
          "desc": "Runtime de JS/TS con seguridad por defecto. Alternativa moderna a Node.",
          "install": "brew install deno",
          "site": "deno.com",
          "tags": [
            "runtime",
            "javascript",
            "typescript"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Lo uso para scripts rapidos de TS sin config. Viene con formatter, linter y test runner built-in.",
          "related": [
            "pnpm"
          ]
        },
        {
          "id": "go",
          "name": "Go",
          "desc": "Lenguaje compilado de Google. Concurrente, tipado, rapido.",
          "install": "brew install go",
          "site": "go.dev",
          "tags": [
            "language",
            "compiled",
            "concurrency"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Necesario para compilar herramientas como mole y rtk. Tambien lo uso para CLIs rapidos.",
          "related": [
            "Deno"
          ]
        },
        {
          "id": "bats-core",
          "name": "bats-core",
          "desc": "Framework de testing para scripts Bash.",
          "install": "brew install bats-core",
          "site": "github.com/bats-core/bats-core",
          "tags": [
            "testing",
            "bash",
            "shell"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para testear scripts de shell de forma automatizada. Lo uso con shellcheck para CI de scripts.",
          "related": [
            "shellcheck"
          ]
        },
        {
          "id": "tectonic",
          "name": "tectonic",
          "desc": "Compilador de LaTeX moderno. Descarga paquetes automaticamente.",
          "install": "brew install tectonic",
          "site": "tectonic-typesetting.github.io",
          "tags": [
            "latex",
            "documents",
            "pdf"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Compila LaTeX sin necesitar una instalacion completa de TeX. Perfecto para papers y documentos academicos.",
          "related": []
        },
        {
          "id": "postgresql",
          "name": "PostgreSQL 15",
          "desc": "Base de datos relacional. El estandar de la industria.",
          "install": "brew install postgresql@15",
          "site": "www.postgresql.org",
          "tags": [
            "database",
            "sql",
            "relational"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Mi base de datos por defecto para cualquier proyecto serio. Con pgvector para embeddings es imbatible.",
          "related": [
            "Redis"
          ]
        },
        {
          "id": "redis",
          "name": "Redis",
          "desc": "Base de datos in-memory. Cache, queues, pub/sub.",
          "install": "brew install redis",
          "site": "redis.io",
          "tags": [
            "database",
            "cache",
            "in-memory"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Cache y queues. Lo uso para rate limiting, sesiones, y como broker de mensajes entre servicios.",
          "related": [
            "PostgreSQL 15"
          ]
        },
        {
          "id": "git-filter-repo",
          "name": "git-filter-repo",
          "desc": "Reescribir historial de git de forma segura. Reemplaza filter-branch.",
          "install": "brew install git-filter-repo",
          "site": "github.com/newren/git-filter-repo",
          "tags": [
            "git",
            "history",
            "cleanup"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para limpiar historiales de git cuando se filtra algo sensible o se necesita extraer un subdirectorio. Mucho mas seguro que filter-branch.",
          "related": [
            "gh"
          ]
        },
        {
          "id": "zig",
          "name": "Zig",
          "desc": "Lenguaje de programacion de sistemas. Compilador y build system.",
          "install": "brew install zig",
          "site": "ziglang.org",
          "tags": [
            "systems",
            "programming",
            "compiler"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para programacion de sistemas de bajo nivel. Build system excelente y buen complemento a Rust/Go.",
          "related": [
            "Go"
          ]
        },
        {
          "id": "ruff",
          "name": "Ruff",
          "desc": "Linter y formatter para Python. Ultra rapido, reemplaza flake8+isort+black.",
          "install": "uv tool install ruff",
          "site": "docs.astral.sh/ruff",
          "tags": [
            "python",
            "linter",
            "formatter"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Reemplaza 5 herramientas Python en una sola. Rapido porque esta en Rust. Lo uso en todos mis proyectos.",
          "related": [
            "uv",
            "pre-commit"
          ]
        },
        {
          "id": "pre-commit",
          "name": "pre-commit",
          "desc": "Framework de hooks para git. Ejecuta linters y checks antes de cada commit.",
          "install": "uv tool install pre-commit",
          "site": "pre-commit.com",
          "tags": [
            "git",
            "hooks",
            "linting",
            "ci"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Asegura que nunca hago commit de codigo roto. Corre ruff, shellcheck y mas automaticamente.",
          "related": [
            "Ruff",
            "shellcheck",
            "prek"
          ]
        },
        {
          "id": "prek",
          "name": "prek",
          "desc": "Wrapper de pre-commit mas rapido. Escrito en Go, cachea resultados.",
          "install": "brew install j178/tap/prek",
          "site": "github.com/j178/prek",
          "tags": [
            "git",
            "hooks",
            "linting"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Pre-commit pero rapido. Cachea resultados y solo corre hooks en archivos modificados. Lo uso en vez de pre-commit directo.",
          "related": [
            "pre-commit"
          ]
        },
        {
          "id": "complexipy",
          "name": "complexipy",
          "desc": "Analizador de complejidad cognitiva para Python. Detecta funciones dificiles de mantener.",
          "install": "uv tool install complexipy",
          "site": "github.com/rohaquinern/complexipy",
          "tags": [
            "python",
            "complexity",
            "code-quality"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Mi proyecto. Mide complejidad cognitiva de codigo Python para saber que refactorizar primero.",
          "related": [
            "Ruff"
          ]
        },
        {
          "id": "code-review-graph",
          "name": "code-review-graph",
          "desc": "MCP server para busqueda semantica de codigo. Grafo de dependencias y analisis de impacto.",
          "install": "uv tool install code-review-graph",
          "site": "github.com/sebastianbreguel/code-review-graph",
          "tags": [
            "mcp",
            "code-review",
            "semantic-search",
            "graph"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Mi proyecto. Busca codigo por semantica en vez de grep. get_impact_radius > 10 greps. Ahorra ~70% tokens.",
          "related": [
            "RTK (Rust Token Killer)",
            "Claude Code"
          ]
        },
        {
          "id": "pgvector",
          "name": "pgvector",
          "desc": "Extension de PostgreSQL para vectores y busqueda semantica.",
          "install": "brew install pgvector",
          "site": "github.com/pgvector/pgvector",
          "tags": [
            "postgres",
            "vectors",
            "ai"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para embeddings en Postgres sin levantar otra DB. Lo uso en pipelines RAG y busqueda semantica.",
          "related": [
            "postgresql"
          ]
        },
        {
          "id": "idb-companion",
          "name": "idb-companion",
          "desc": "Daemon de Facebook IDB para automatizar simuladores iOS desde CLI.",
          "install": "brew install facebook/fb/idb-companion",
          "site": "fbidb.io",
          "tags": [
            "ios",
            "mobile",
            "testing"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Companion del CLI fb-idb. Permite controlar simuladores y devices iOS desde scripts. Lo uso con pipx fb-idb.",
          "related": []
        },
        {
          "id": "maturin",
          "name": "maturin",
          "desc": "Build tool para Python + Rust. Compila PyO3 a wheels.",
          "install": "uv tool install maturin",
          "site": "github.com/PyO3/maturin",
          "tags": [
            "python",
            "rust",
            "build"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Para compilar extensiones Rust de Python. Lo uso cuando un proyecto mezcla PyO3 y necesito wheels locales.",
          "related": []
        },
        {
          "id": "vulture",
          "name": "vulture",
          "desc": "Detector de codigo Python muerto. Encuentra funciones y variables sin usar.",
          "install": "uv tool install vulture",
          "site": "github.com/jendrikseipp/vulture",
          "tags": [
            "python",
            "lint",
            "cleanup"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Para limpiar codebases Python. Reporta dead code que ruff no agarra. Lo corro antes de refactors grandes.",
          "related": [
            "ruff"
          ]
        },
        {
          "id": "pake-cli",
          "name": "Pake",
          "desc": "Convierte cualquier web en app de escritorio liviana via Tauri/Rust.",
          "install": "pnpm install -g pake-cli",
          "site": "github.com/tw93/Pake",
          "tags": [
            "desktop",
            "webview",
            "tauri"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Empaquetar webs como apps nativas sin Electron. Bundles de ~5MB en vez de 200MB.",
          "related": []
        },
        {
          "id": "defuddle",
          "name": "defuddle",
          "desc": "Extrae contenido limpio de paginas web. Convierte HTML a markdown legible.",
          "install": "npm install -g defuddle",
          "site": "github.com/kepano/defuddle",
          "tags": [
            "scraping",
            "markdown",
            "extraction"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Para limpiar HTML antes de feedearlo a LLMs. Mejor que readability en algunos casos.",
          "related": []
        },
        {
          "id": "engram",
          "name": "Engram",
          "desc": "Memoria persistente para Claude Code. Guarda decisiones, bugs, descubrimientos entre sesiones.",
          "install": "brew install gentleman-programming/tap/engram",
          "site": "github.com/gentleman-programming/engram",
          "tags": [
            "ai",
            "memory",
            "claude"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Memoria que sobrevive entre sesiones de Claude Code. Guarda decisiones y contexto sin tener que repetir todo.",
          "related": []
        },
        {
          "id": "libpq",
          "name": "libpq",
          "desc": "Libreria cliente de PostgreSQL. Provee psql y utilidades de conexion.",
          "install": "brew install libpq",
          "site": "postgresql.org/docs/current/libpq.html",
          "tags": [
            "database",
            "postgresql"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Necesario para conectar a Postgres desde la terminal. Trae psql sin instalar el server completo.",
          "related": [
            "postgresql"
          ]
        }
      ],
      "Package Managers & Deploy": [
        {
          "id": "pnpm",
          "name": "pnpm",
          "desc": "Package manager rapido y eficiente en disco.",
          "install": "npm install -g pnpm",
          "site": "pnpm.io",
          "tags": [
            "package-manager",
            "node"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "npm es lento y devora disco con node_modules duplicados. pnpm usa symlinks y es 2-3x mas rapido en installs. No vuelvo atras.",
          "related": [
            "uv"
          ]
        },
        {
          "id": "uv",
          "name": "uv",
          "desc": "Python package manager ultra rapido. Escrito en Rust.",
          "install": "curl -LsSf https://astral.sh/uv/install.sh | sh",
          "site": "docs.astral.sh/uv",
          "tags": [
            "package-manager",
            "python",
            "rust"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "pip es del siglo pasado. uv instala dependencias de Python en segundos, no minutos. Escrito en Rust, se nota.",
          "related": [
            "pnpm"
          ]
        },
        {
          "id": "vercel-cli",
          "name": "Vercel",
          "desc": "CLI para deploy de apps web.",
          "install": "pnpm install -g vercel",
          "site": "vercel.com",
          "tags": [
            "deploy",
            "hosting"
          ],
          "badges": [
            "Freemium"
          ],
          "featured": true,
          "note": "Deploy de frontend en segundos con `vercel`. Perfecto para probar cambios en produccion sin pipeline completo.",
          "related": []
        },
        {
          "id": "nvm",
          "name": "NVM",
          "desc": "Node Version Manager. Instalar y cambiar entre versiones de Node.js.",
          "install": "brew install nvm",
          "site": "github.com/nvm-sh/nvm",
          "tags": [
            "node",
            "version-manager",
            "javascript"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Indispensable para manejar multiples versiones de Node. Cada proyecto puede tener su version sin conflictos.",
          "related": [
            "pnpm"
          ]
        }
      ],
      "Terminal Tools": [
        {
          "id": "tmux",
          "name": "tmux",
          "desc": "Multiplexor de terminal. Sesiones persistentes, splits.",
          "install": "brew install tmux",
          "site": "github.com/tmux/tmux",
          "tags": [
            "terminal",
            "multiplexor"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "No abro terminal sin tmux. Splits + sesiones persistentes = productividad. Si se cae la SSH, la sesion sigue viva.",
          "related": [
            "pam-reattach"
          ]
        },
        {
          "id": "pam-reattach",
          "name": "pam-reattach",
          "desc": "Modulo PAM que permite Touch ID para sudo dentro de tmux/screen.",
          "install": "brew install pam-reattach",
          "site": "github.com/fabianishere/pam_reattach",
          "tags": [
            "security",
            "tmux",
            "touchid"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Sin esto, Touch ID no funciona para sudo dentro de tmux. Un fix chiquito que ahorra tipear el password 50 veces al dia.",
          "related": [
            "tmux"
          ]
        },
        {
          "id": "fzf",
          "name": "fzf",
          "desc": "Fuzzy finder. Ctrl+R mejorado, busqueda de archivos.",
          "install": "brew install fzf",
          "site": "github.com/junegunn/fzf",
          "tags": [
            "search",
            "fuzzy",
            "terminal"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Ctrl+R sin fzf es como buscar en Google sin autocompletado. Tambien lo uso para seleccionar branches y archivos en pipelines.",
          "related": []
        },
        {
          "id": "htop",
          "name": "htop",
          "desc": "Monitor de procesos interactivo. Mejor que top.",
          "install": "brew install htop",
          "site": "htop.dev",
          "tags": [
            "monitoring",
            "processes"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para ver que proceso esta comiendo CPU sin salir de la terminal. Mucho mas legible que top.",
          "related": [
            "Stats",
            "aitop"
          ]
        },
        {
          "id": "aitop",
          "name": "aitop",
          "desc": "Monitor del sistema con AI. Top-like con analisis inteligente.",
          "install": "brew install aitop",
          "tags": [
            "monitoring",
            "ai"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Lo probé porque la combinacion de AI + monitoreo me parecio curiosa. Util cuando queres que te explique por que algo esta lento.",
          "related": [
            "htop"
          ]
        },
        {
          "id": "awscli",
          "name": "AWS CLI",
          "desc": "CLI oficial de AWS. Manejo de servicios desde terminal.",
          "install": "brew install awscli",
          "site": "aws.amazon.com/cli",
          "tags": [
            "cloud",
            "aws"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para tocar S3, ECR y Lambda desde scripts. Lo uso para deploys y debugging de infra puntual.",
          "related": []
        },
        {
          "id": "pipx",
          "name": "pipx",
          "desc": "Instalador de apps Python en venvs aisladas.",
          "install": "brew install pipx",
          "site": "pipx.pypa.io",
          "tags": [
            "python",
            "cli"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Para CLIs Python que necesitan estar globales sin contaminar el system Python. uv tool me cubre la mayoria, pero pipx queda para casos que uv no soporta.",
          "related": [
            "uv"
          ]
        },
        {
          "id": "python-3-12",
          "name": "Python 3.12",
          "desc": "Runtime Python 3.12 instalado via Homebrew.",
          "install": "brew install python@3.12",
          "site": "python.org",
          "tags": [
            "python",
            "runtime"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Version pinneada para proyectos que aun no migran a 3.13. uv usa esta cuando lo pido explicito.",
          "related": [
            "uv",
            "pipx"
          ]
        },
        {
          "id": "ffmpeg",
          "name": "ffmpeg",
          "desc": "Procesamiento de audio/video. Conversion, encoding.",
          "install": "brew install ffmpeg",
          "site": "ffmpeg.org",
          "tags": [
            "media",
            "video",
            "audio"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para convertir videos de demos, recortar screencasts y comprimir grabaciones antes de compartir. Un one-liner reemplaza cualquier app GUI.",
          "related": []
        },
        {
          "id": "ncdu",
          "name": "ncdu",
          "desc": "Analizador de uso de disco con interfaz ncurses.",
          "install": "brew install ncdu",
          "site": "dev.yorhel.nl/ncdu",
          "tags": [
            "disk",
            "storage"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Cuando el disco esta lleno y no se que ocupa el espacio. ncdu me muestra exactamente donde esta el problema en segundos.",
          "related": []
        },
        {
          "id": "gh",
          "name": "gh",
          "desc": "CLI oficial de GitHub. PRs, issues, repos desde terminal.",
          "install": "brew install gh",
          "site": "cli.github.com",
          "tags": [
            "github",
            "git"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para crear PRs y revisar issues sin salir de la terminal. Lo uso constantemente con Claude Code para el ciclo completo de PR.",
          "related": []
        },
        {
          "id": "jq",
          "name": "jq",
          "desc": "Procesador de JSON en linea de comandos.",
          "install": "brew install jq",
          "site": "jqlang.github.io/jq",
          "tags": [
            "json",
            "parsing"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Parsear respuestas de APIs en scripts sin escribir Python. `curl ... | jq '.data[]'` es magia pura.",
          "related": []
        },
        {
          "id": "shellcheck",
          "name": "shellcheck",
          "desc": "Linter para scripts shell. Encuentra bugs y problemas.",
          "install": "brew install shellcheck",
          "site": "www.shellcheck.net",
          "tags": [
            "linter",
            "shell"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Los scripts bash son faciles de arruinar. shellcheck atrapa los errores clasicos antes de que los encuentres a las 3am en produccion.",
          "related": []
        },
        {
          "id": "nvtop",
          "name": "nvtop",
          "desc": "Monitor de GPU (similar a htop para GPUs).",
          "install": "brew install nvtop",
          "site": "github.com/Syllo/nvtop",
          "tags": [
            "gpu",
            "monitoring"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para monitorear VRAM y carga de GPU cuando entreno modelos localmente. El equivalente de htop pero para GPUs.",
          "related": [
            "htop"
          ]
        },
        {
          "id": "rtk",
          "name": "RTK (Rust Token Killer)",
          "desc": "Proxy CLI que ahorra 60-90% de tokens en operaciones de dev.",
          "install": "brew install rtk",
          "site": "github.com/nicholasgasior/rtk",
          "tags": [
            "cli",
            "tokens",
            "proxy",
            "optimization"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Reduce drasticamente el consumo de tokens en Claude Code. Se interpone como proxy en git, ls, etc. Imprescindible.",
          "related": [
            "Claude Code"
          ]
        },
        {
          "id": "sox",
          "name": "sox",
          "desc": "Procesamiento de audio en linea de comandos. Grabacion, conversion, efectos.",
          "install": "brew install sox",
          "site": "sox.sourceforge.net",
          "tags": [
            "audio",
            "processing",
            "cli"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "El ffmpeg del audio. Lo uso para procesar grabaciones y convertir formatos desde la terminal.",
          "related": [
            "ffmpeg"
          ]
        },
        {
          "id": "mole",
          "name": "mole",
          "desc": "SSH tunneling simplificado. Crea tunnels con un comando.",
          "install": "brew install mole",
          "site": "github.com/davrodpin/mole",
          "tags": [
            "ssh",
            "tunneling",
            "networking"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Hace SSH tunneling trivial. Un comando y tienes acceso a la DB de staging desde localhost.",
          "related": []
        },
        {
          "id": "glow",
          "name": "Glow",
          "desc": "Render de Markdown en la terminal con syntax highlighting y paginacion.",
          "install": "brew install glow",
          "site": "github.com/charmbracelet/glow",
          "tags": [
            "markdown",
            "terminal",
            "reader"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para leer READMEs y docs sin salir de la terminal. Render bonito de Markdown directo en zsh.",
          "related": [
            "jq"
          ]
        },
        {
          "id": "mas",
          "name": "mas",
          "desc": "CLI para Mac App Store. Instalar, actualizar y buscar apps desde la terminal.",
          "install": "brew install mas",
          "site": "github.com/mas-cli/mas",
          "tags": [
            "macos",
            "app-store",
            "cli"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Automatiza instalaciones del App Store. Lo uso en setup.sh para las apps que solo estan ahi.",
          "related": []
        },
        {
          "id": "yt-dlp",
          "name": "yt-dlp",
          "desc": "Descargador de video/audio de YouTube y +1000 sitios. Fork mejorado de youtube-dl.",
          "install": "uv tool install yt-dlp",
          "site": "github.com/yt-dlp/yt-dlp",
          "tags": [
            "video",
            "download",
            "youtube"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para descargar videos y audio de YouTube. Con ffmpeg convierte a cualquier formato.",
          "related": [
            "ffmpeg"
          ]
        }
      ]
    }
  },
  "Shell Setup": {
    "slug": "shell-setup",
    "catKey": "shell",
    "count": 4,
    "groups": {
      "Shell": [
        {
          "id": "oh-my-zsh",
          "name": "Oh My Zsh",
          "desc": "Framework para Zsh. Aliases, plugins, themes. La base de todo.",
          "install": "sh -c \"$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)\"",
          "site": "ohmyz.sh",
          "tags": [
            "shell",
            "zsh",
            "framework"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "La base de mi shell setup. Sin Oh My Zsh mi terminal se siente desnuda. Los aliases y plugins vienen solos.",
          "related": [
            "Powerlevel10k",
            "zsh-autosuggestions"
          ]
        },
        {
          "id": "powerlevel10k",
          "name": "Powerlevel10k",
          "desc": "Theme ultra rapido con prompt customizable y iconos.",
          "install": "git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM}/themes/powerlevel10k",
          "site": "github.com/romkatv/powerlevel10k",
          "tags": [
            "shell",
            "theme",
            "prompt"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "El prompt mas rapido y customizable que existe. Ver el git branch, estado de uv y tiempo de ejecucion en el prompt cambia la vida.",
          "related": [
            "Oh My Zsh"
          ]
        },
        {
          "id": "zsh-autosuggestions",
          "name": "zsh-autosuggestions",
          "desc": "Sugiere comandos del historial mientras escribes.",
          "install": "brew install zsh-autosuggestions",
          "site": "github.com/zsh-users/zsh-autosuggestions",
          "tags": [
            "shell",
            "zsh",
            "productivity"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Autocompletado de comandos del historial en tiempo real. Escribo las primeras letras y presiono la flecha. No vuelvo a una shell sin esto.",
          "related": [
            "Oh My Zsh",
            "fzf"
          ]
        },
        {
          "id": "font-meslo-nerd",
          "name": "Meslo LG Nerd Font",
          "desc": "Fuente patched con iconos para terminal y editores.",
          "install": "brew install --cask font-meslo-lg-nerd-font",
          "site": "github.com/ryanoasis/nerd-fonts",
          "tags": [
            "font",
            "terminal",
            "nerdfont"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Requerida por powerlevel10k para que los iconos del prompt se rendericen. Sin esto la shell se ve rota.",
          "related": [
            "powerlevel10k"
          ]
        },
        {
          "id": "zsh-brew",
          "name": "zsh (brew)",
          "desc": "Z shell instalado via Homebrew. Mas nuevo que el del sistema.",
          "install": "brew install zsh",
          "site": "zsh.sourceforge.io",
          "tags": [
            "shell",
            "zsh"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Uso el zsh de brew para tener version actualizada. macOS trae uno mas viejo. Combinar con oh-my-zsh + powerlevel10k.",
          "related": [
            "oh-my-zsh",
            "powerlevel10k"
          ]
        }
      ]
    }
  },
  "Claude Code": {
    "slug": "claude-code",
    "catKey": "claude-code",
    "count": 35,
    "groups": {
      "Plugins": [
        {
          "id": "plugin-context-mode",
          "name": "context-mode",
          "desc": "Optimiza el context window ejecutando comandos en sandbox. Ahorra ~80% de tokens.",
          "install": "Claude Code marketplace",
          "tags": [
            "claude",
            "optimization",
            "tokens"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "Lo construi para no quemar contexto en outputs largos. Ahorra ~80% de tokens reales en sesiones de trabajo intenso.",
          "related": [
            "superpowers"
          ]
        },
        {
          "id": "plugin-code-simplifier",
          "name": "code-simplifier",
          "desc": "Revisa codigo modificado para simplificar, mejorar calidad y encontrar issues.",
          "install": "Claude Code marketplace",
          "tags": [
            "claude",
            "code-quality"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "Lo configure para que Claude revise automaticamente el codigo que genera. Es como tener un code reviewer siempre activo.",
          "related": [
            "code-simplifier"
          ]
        },
        {
          "id": "plugin-context7",
          "name": "context7",
          "desc": "Context7 MCP server para busqueda de documentacion en tiempo real.",
          "install": "Claude Code marketplace",
          "tags": [
            "claude",
            "docs",
            "search"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "Claude deja de alucinar APIs cuando tiene docs reales. Context7 inyecta documentacion actualizada al contexto automaticamente.",
          "related": []
        },
        {
          "id": "plugin-frontend-design",
          "name": "frontend-design",
          "desc": "Herramientas de disenio frontend: componentes, layouts, CSS.",
          "install": "Claude Code marketplace",
          "tags": [
            "claude",
            "frontend",
            "design"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "Para construir componentes UI rapidamente con Claude. Le da contexto de disenio que mejora mucho la calidad del output visual.",
          "related": []
        },
        {
          "id": "plugin-playwright",
          "name": "playwright",
          "desc": "Browser automation via Playwright MCP. Testing, scraping, interaccion web.",
          "install": "Claude Code marketplace",
          "tags": [
            "claude",
            "browser",
            "testing"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "Le da ojos a Claude Code. Puede navegar, clickear y hacer screenshots sin que yo escriba una linea de Playwright.",
          "related": [
            "agent-browser"
          ]
        },
        {
          "id": "plugin-skill-creator",
          "name": "skill-creator",
          "desc": "Crea, modifica y mide rendimiento de skills custom para Claude Code.",
          "install": "Claude Code marketplace",
          "tags": [
            "claude",
            "skills"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "Lo uso para iterar en mis propios skills. Me permite medir si un skill nuevo realmente mejora los resultados antes de committear.",
          "related": []
        },
        {
          "id": "plugin-superpowers",
          "name": "superpowers",
          "desc": "Superpowers: writing-plans, executing-plans, brainstorming, systematic-debugging.",
          "install": "Claude Code marketplace",
          "tags": [
            "claude",
            "workflow",
            "planning"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "El plugin mas importante del toolkit. Estructura el workflow de Claude en fases: plan, ejecutar, verificar. Sin el, Claude improvisa demasiado.",
          "related": [
            "context-mode"
          ]
        },
        {
          "id": "plugin-claude-hud",
          "name": "claude-hud",
          "desc": "HUD (Heads-Up Display) para Claude Code. Status line con info en tiempo real.",
          "install": "Claude Code marketplace",
          "tags": [
            "claude",
            "ui",
            "monitoring"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "Ver tokens usados, costo de la sesion y status de herramientas en tiempo real. Antes lo corre a ciegas, ahora tengo datos.",
          "related": []
        },
        {
          "id": "plugin-caveman",
          "name": "caveman",
          "desc": "Modo cavernicola. Comprime respuestas 50-75% eliminando relleno, articulos y filler.",
          "install": "Claude Code marketplace (github:JuliusBrussee/caveman)",
          "site": "github.com/JuliusBrussee/caveman",
          "tags": [
            "claude",
            "tokens",
            "compression"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "Ahorra 50-75% de tokens en respuestas. Sin filler, sin articulos, solo sustancia. Parte clave del stack de optimizacion.",
          "related": [
            "RTK (Rust Token Killer)",
            "context-mode"
          ]
        },
        {
          "id": "plugin-code-review",
          "name": "code-review",
          "desc": "Plugin oficial de Anthropic para code review de PRs.",
          "install": "Claude Code marketplace (anthropics/claude-code)",
          "site": "github.com/anthropics/claude-code",
          "tags": [
            "claude",
            "code-review",
            "pr"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "Review automatizado de PRs con checklist de bugs, seguridad y convenciones del proyecto.",
          "related": [
            "superpowers"
          ]
        },
        {
          "id": "plugin-compound-engineering",
          "name": "compound-engineering",
          "desc": "Mega-plugin de Compound Engineering. Code review multi-agente, commits, PRs, debugging, planificacion, worktrees.",
          "install": "Claude Code marketplace (EveryInc/compound-engineering-plugin)",
          "site": "github.com/EveryInc/compound-engineering-plugin",
          "tags": [
            "claude",
            "workflow",
            "review",
            "planning"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "El plugin mas completo. Code review con agentes especializados, commits inteligentes, PRs con descripcion automatica. Reemplazo varios workflows manuales de un saque.",
          "related": [
            "superpowers",
            "code-review"
          ]
        },
        {
          "id": "plugin-codex",
          "name": "codex",
          "desc": "Integracion con OpenAI Codex CLI. Permite delegar tareas a Codex desde Claude Code.",
          "install": "Claude Code marketplace (openai/codex-plugin-cc)",
          "site": "github.com/openai/codex-plugin-cc",
          "tags": [
            "claude",
            "openai",
            "codex"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "Para tener Codex como fallback cuando necesito otra perspectiva o el modelo de OpenAI es mejor para una tarea especifica.",
          "related": [
            "OpenAI Codex"
          ]
        },
        {
          "id": "plugin-claude-code-setup",
          "name": "claude-code-setup",
          "desc": "Asistente de setup inicial de Claude Code. Genera CLAUDE.md, sugiere hooks y automatizaciones.",
          "install": "Claude Code marketplace (anthropics/claude-code)",
          "site": "github.com/anthropics/claude-code",
          "tags": [
            "claude",
            "setup",
            "onboarding"
          ],
          "badges": [
            "Free",
            "Marketplace"
          ],
          "featured": true,
          "note": "Para onboarding de nuevos repos. Genera configuracion inicial basada en el proyecto detectado.",
          "related": [
            "superpowers"
          ]
        }
      ],
      "Skills": [
        {
          "id": "skill-browser-automation",
          "name": "/browser-automation",
          "desc": "Browser automation CLI. Navegacion, forms, scraping, screenshots.",
          "install": "Built-in skill",
          "tags": [
            "claude",
            "browser",
            "automation"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para automatizar cualquier tarea web sin escribir Playwright manual. Lo construi para scraping y testing de flujos de usuario.",
          "related": [
            "agent-browser"
          ]
        },
        {
          "id": "skill-dream",
          "name": "/dream",
          "desc": "Consolidacion de memoria multi-fase. Merge updates, pruning.",
          "install": "Built-in skill",
          "tags": [
            "claude",
            "memory"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para consolidar y podar la memoria de Claude entre sesiones largas. Como un GC para el contexto acumulado.",
          "related": []
        },
        {
          "id": "skill-health",
          "name": "/health",
          "desc": "Diagnostico cuando Claude se siente lento o ignora reglas. Audita hooks y MCP.",
          "install": "Built-in skill",
          "tags": [
            "claude",
            "diagnostics"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Lo construi para cuando Claude empieza a portarse raro. Diagnostica hooks, MCPs y configuracion en un solo comando.",
          "related": []
        },
        {
          "id": "skill-panel",
          "name": "/panel",
          "desc": "Panel de 3 lentes: simplificacion, arquitectura, producto. Multi-perspectiva.",
          "install": "Built-in skill",
          "tags": [
            "claude",
            "review",
            "decision"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para evaluar decisiones desde 3 angulos antes de comprometerse. Simplifica, revisa estructura, y valida producto en una sola pasada.",
          "related": []
        },
        {
          "id": "skill-humanizer",
          "name": "/humanizer",
          "desc": "Elimina patrones de escritura AI del texto. Basado en la guia de Wikipedia.",
          "install": "Built-in skill",
          "tags": [
            "claude",
            "writing",
            "quality"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para que el texto no suene a robot. Detecta y corrige el lenguaje inflado tipico de AI antes de publicar cualquier cosa.",
          "related": []
        },
        {
          "id": "skill-usage",
          "name": "/usage",
          "desc": "Muestra conteos de invocaciones de agentes, skills y plugins.",
          "install": "Built-in skill",
          "tags": [
            "claude",
            "analytics",
            "usage"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para saber que herramientas uso mas y cuales estan juntando polvo. Datos reales sobre mi workflow con Claude.",
          "related": []
        },
        {
          "id": "skill-sync-dotfiles",
          "name": "Sync Dotfiles",
          "desc": "Sincroniza config de la maquina al repo. Detecta herramientas nuevas, actualiza data.js y regenera docs.",
          "install": "/sync-dotfiles",
          "tags": [
            "claude",
            "skill",
            "sync",
            "dotfiles"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "El inverso de setup.sh. Mantiene el repo actualizado con lo que realmente esta instalado. Single source of truth.",
          "related": []
        }
      ],
      "Agents": [
        {
          "id": "agent-tech-lead",
          "name": "tech-lead",
          "desc": "Decisiones tecnicas, coordinacion cross-domain.",
          "install": "Auto-dispatched by Claude Code",
          "tags": [
            "claude",
            "agent",
            "architecture"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "El coordinador principal para decisiones que cruzan multiples dominios. Lo despachamos cuando la decision es demasiado grande para un solo agente.",
          "related": []
        },
        {
          "id": "agent-code-simplifier",
          "name": "code-simplifier",
          "desc": "Simplificar, refactorizar y limpiar codigo.",
          "install": "Auto-dispatched by Claude Code",
          "tags": [
            "claude",
            "agent",
            "refactoring"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para eliminar complejidad innecesaria. Le paso codigo verboso y lo devuelve limpio sin perder funcionalidad.",
          "related": []
        },
        {
          "id": "agent-ai-ml-expert",
          "name": "ai-ml-expert",
          "desc": "Prompts, RAG, embeddings, model selection.",
          "install": "Auto-dispatched by Claude Code",
          "tags": [
            "claude",
            "agent",
            "ai",
            "ml"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para decisiones de arquitectura AI/ML: que modelo usar, como estructurar un RAG, que estrategia de embeddings. Mi experto interno.",
          "related": [
            "prompt-engineering"
          ]
        },
        {
          "id": "agent-prompt-engineering",
          "name": "prompt-engineering",
          "desc": "Craft y optimizar prompts para LLMs.",
          "install": "Auto-dispatched by Claude Code",
          "tags": [
            "claude",
            "agent",
            "prompts"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para iterar en prompts de manera sistematica. Analiza por que un prompt falla y sugiere variantes con razonamiento.",
          "related": [
            "ai-ml-expert"
          ]
        },
        {
          "id": "agent-data-science",
          "name": "data-science-analytics",
          "desc": "EDA, estadisticas, visualizacion, ML.",
          "install": "Auto-dispatched by Claude Code",
          "tags": [
            "claude",
            "agent",
            "data"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para analisis exploratorios rapidos. Le paso un dataset y me da EDA completo con estadisticas y visualizaciones listas.",
          "related": []
        },
        {
          "id": "agent-data-pipeline",
          "name": "data-pipeline-engineer",
          "desc": "ETL/ELT, orchestration, ML workflows, FastAPI + data stores.",
          "install": "Auto-dispatched by Claude Code",
          "tags": [
            "claude",
            "agent",
            "data",
            "pipeline"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para disenar y debuggear pipelines de datos. Entiende Prefect, FastAPI, y todo lo que conecta la ingesta con el modelo.",
          "related": [
            "data-science-analytics"
          ]
        },
        {
          "id": "agent-ceo-strategist",
          "name": "ceo-product-strategist",
          "desc": "Vision estrategica CEO, roadmap, impacto de producto.",
          "install": "Auto-dispatched by Claude Code",
          "tags": [
            "claude",
            "agent",
            "strategy"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para pensar en impacto de producto mas alla del codigo. Util para preparar pitches y decidir que features priorizar con logica de negocio.",
          "related": []
        },
        {
          "id": "agent-andrej-karpathy",
          "name": "andrej-karpathy",
          "desc": "Persona de Karpathy: implementaciones simples, first-principles, code review minimalista.",
          "install": "Auto-dispatched by Claude Code",
          "tags": [
            "claude",
            "agent",
            "ai",
            "persona"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para cuando necesito una opinion brutal sobre complejidad innecesaria. Karpathy siempre elige lo mas simple que funcione.",
          "related": [
            "ai-ml-expert"
          ]
        },
        {
          "id": "agent-ops-impact",
          "name": "ops-impact-analyst",
          "desc": "ROI de features, metricas de negocio, reportes ejecutivos.",
          "install": "Auto-dispatched by Claude Code",
          "tags": [
            "claude",
            "agent",
            "business"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para conectar metricas tecnicas con impacto de negocio. Convierte 'mejoramos latencia 200ms' en 'ahorramos $X/mes'.",
          "related": [
            "ceo-product-strategist"
          ]
        },
        {
          "id": "agent-tw93",
          "name": "tw93",
          "desc": "Gatekeeper de Mole: minimalismo, safety-first, scope discipline.",
          "install": "Auto-dispatched by Claude Code",
          "tags": [
            "claude",
            "agent",
            "review"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Simula al maintainer upstream de Mole para evaluar si un PR seria aceptado. Filtra scope creep antes de escribir codigo.",
          "related": []
        },
        {
          "id": "agent-database-engineer",
          "name": "database-engineer",
          "desc": "Disenio de esquemas, optimizacion de queries, modelado relacional.",
          "install": "Auto-dispatched by Claude Code",
          "tags": [
            "claude",
            "agent",
            "database"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para decisiones de disenio de base de datos: normalizacion, indices, relaciones. Mi experto en SQL y modelado.",
          "related": [
            "PostgreSQL 15"
          ]
        },
        {
          "id": "agent-coo",
          "name": "coo",
          "desc": "Perspectiva de scale-stage operator y customer-first product critique.",
          "install": "Auto-dispatched by Claude Code",
          "tags": [
            "claude",
            "agent",
            "product",
            "customer"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Evalua features desde la perspectiva del comprador: CCO, super-admin, owner. Si el cliente no lo pediria, no se construye.",
          "related": [
            "ceo-product-strategist",
            "ops-impact-analyst"
          ]
        }
      ],
      "Commands": [
        {
          "id": "cmd-redesign-ui",
          "name": "/redesign-ui",
          "desc": "Analiza componentes UI y los redisena usando ui-designer y ux-designer en paralelo.",
          "install": "Custom command",
          "tags": [
            "claude",
            "command",
            "ui"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Lo construi para iterar en UI rapido. Dos agentes de disenio en paralelo y me quedo con la mejor propuesta. Ahorra horas de iteracion manual.",
          "related": []
        },
        {
          "id": "cmd-lint",
          "name": "/lint",
          "desc": "Corre pre-commit suite completo: ruff, ty, isort, todos los hooks.",
          "install": "Custom command",
          "tags": [
            "claude",
            "command",
            "lint",
            "python"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Un comando para correr todo el linting de un saque. Sin excusas para mergear codigo con warnings.",
          "related": [
            "/test"
          ]
        },
        {
          "id": "cmd-test",
          "name": "/test",
          "desc": "Corre pytest con detalles de fallos y coverage opcional.",
          "install": "Custom command",
          "tags": [
            "claude",
            "command",
            "testing",
            "python"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Wrapper de pytest que formatea output para que Claude entienda los fallos y los arregle en el siguiente paso.",
          "related": [
            "/lint"
          ]
        }
      ]
    }
  },
  "VS Code Extensions": {
    "slug": "vscode-extensions",
    "catKey": "extensions",
    "count": 1,
    "groups": {
      "Extensions": [
        {
          "id": "ext-claude-code",
          "name": "Claude Code",
          "desc": "Integracion de Claude Code en el editor.",
          "install": "code --install-extension anthropic.claude-code",
          "tags": [
            "vscode",
            "ai",
            "claude"
          ],
          "badges": [
            "Free"
          ],
          "featured": true,
          "note": "Para usar Claude Code directamente dentro del editor sin cambiar de ventana. La integracion con el diff view es excelente.",
          "related": [
            "Claude Code"
          ]
        }
      ]
    }
  }
};

export const CATEGORIES = Object.keys(DATA);

export const ALL_TOOLS = [];
for (const [cat, data] of Object.entries(DATA)) {
  for (const [group, tools] of Object.entries(data.groups)) {
    for (const tool of tools) {
      ALL_TOOLS.push({ ...tool, category: cat, group });
    }
  }
}
