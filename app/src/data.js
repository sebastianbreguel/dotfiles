// app/src/data.js — generated from prior schema, shaped for dotfiles UI
// Categories: top-level sections in left nav.
// Each category groups tools by sub-section. Tools carry { id, name, desc, install, site, tags, badges, featured, note, related }.

export const DATA = {
  "Mac Apps": {
    "slug": "mac-apps",
    "catKey": "apps",
    "count": 26,
    "groups": {
      "Desarrollo": [
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
        },
        {
          "id": "softfocus",
          "name": "SoftFocus",
          "desc": "Atenua y desenfoca las ventanas inactivas para enfocarte en la activa.",
          "install": "brew install --cask softfocus",
          "site": "github.com/waydabber/SoftFocus",
          "tags": [
            "focus",
            "productivity",
            "menubar"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Lo uso para no distraerme con las ventanas de fondo cuando estoy programando.",
          "related": []
        },
        {
          "site": "github.com/chattymin/poke",
          "tags": [
            "menubar",
            "claude",
            "tokens"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "poke-token-bar",
          "name": "Poke Token Bar",
          "desc": "Menu bar app que muestra uso de tokens de Claude.",
          "install": "brew install --cask poke-token-bar",
          "note": "Para ver de un vistazo cuanto token budget me queda en la sesion de Claude sin salir de lo que estoy haciendo."
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
    "count": 63,
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
          "id": "pi-coding-agent",
          "name": "Pi Coding Agent",
          "desc": "CLI coding agent de Earendil. Agente de terminal alternativo.",
          "install": "pnpm install -g @earendil-works/pi-coding-agent",
          "site": "www.npmjs.com/package/@earendil-works/pi-coding-agent",
          "tags": [
            "ai",
            "coding",
            "agents"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Lo tengo instalado para probar agentes de coding fuera del set principal. Util para comparar enfoques distintos en terminal.",
          "related": [
            "Claude Code"
          ]
        },
        {
          "site": "npmjs.com/package/prime-agent",
          "tags": [
            "ai",
            "coding",
            "agent"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "prime-agent",
          "name": "Prime Agent",
          "desc": "Coding agent de terminal, alternativa open a Claude Code.",
          "install": "npm install -g prime-agent",
          "note": "Otro coding agent para comparar contra Claude Code y Codex en tareas puntuales."
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
        },
        {
          "id": "cmake",
          "name": "CMake",
          "desc": "Sistema de build multiplataforma para C/C++.",
          "install": "brew install cmake",
          "site": "cmake.org",
          "tags": [
            "build",
            "c++"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Lo necesito para compilar dependencias nativas de C/C++.",
          "related": []
        },
        {
          "id": "ninja",
          "name": "Ninja",
          "desc": "Build system minimalista y rapido, backend comun de CMake.",
          "install": "brew install ninja",
          "site": "ninja-build.org",
          "tags": [
            "build",
            "c++"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Backend de builds de CMake: compila mucho mas rapido que make.",
          "related": []
        },
        {
          "id": "llvm",
          "name": "LLVM",
          "desc": "Toolchain de compiladores: clang, lld, herramientas de analisis.",
          "install": "brew install llvm",
          "site": "llvm.org",
          "tags": [
            "compiler",
            "c++"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Toolchain para compilar proyectos nativos que piden clang moderno.",
          "related": []
        },
        {
          "id": "rbenv",
          "name": "rbenv",
          "desc": "Manejador de versiones de Ruby por proyecto.",
          "install": "brew install rbenv",
          "site": "github.com/rbenv/rbenv",
          "tags": [
            "ruby",
            "version-manager"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Para tener versiones de Ruby por proyecto sin tocar el Ruby del sistema.",
          "related": []
        },
        {
          "id": "pango",
          "name": "pango",
          "desc": "Libreria de renderizado de texto (dependencia de herramientas graficas).",
          "install": "brew install pango",
          "site": "pango.gnome.org",
          "tags": [
            "library",
            "text"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Dependencia de tooling grafico; instalada explicitamente para builds.",
          "related": []
        },
        {
          "id": "poppler",
          "name": "poppler",
          "desc": "Libreria y utilidades para PDFs (pdftotext, pdfinfo).",
          "install": "brew install poppler",
          "site": "poppler.freedesktop.org",
          "tags": [
            "pdf",
            "library"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Por pdftotext/pdfinfo: extraer texto y metadata de PDFs desde la terminal.",
          "related": []
        },
        {
          "id": "tbb",
          "name": "tbb",
          "desc": "Libreria de paralelismo de Intel (oneTBB) para C++.",
          "install": "brew install tbb",
          "site": "github.com/uxlfoundation/oneTBB",
          "tags": [
            "library",
            "c++",
            "parallel"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Dependencia de builds nativos que usan paralelismo con oneTBB.",
          "related": []
        },
        {
          "site": "github.com/BurntSushi/ripgrep",
          "tags": [
            "search",
            "rust",
            "cli"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "ripgrep",
          "name": "ripgrep",
          "desc": "Grep ultrarapido escrito en Rust. El `rg` que usan todos los editores.",
          "install": "brew install ripgrep",
          "note": "Busqueda en codebases grandes. Ordenes de magnitud mas rapido que grep y respeta .gitignore por default."
        },
        {
          "site": "github.com/ggml-org/llama.cpp",
          "tags": [
            "llm",
            "local",
            "inference"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "llama-cpp",
          "name": "llama.cpp",
          "desc": "Inferencia de LLMs local en C/C++. Corre modelos GGUF en la Mac.",
          "install": "brew install llama.cpp",
          "note": "Para correr modelos locales sin depender de APIs. Util para experimentar con modelos chicos en la Mac."
        },
        {
          "site": "lld.llvm.org",
          "tags": [
            "llvm",
            "linker",
            "build"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [
            "LLVM"
          ],
          "id": "lld",
          "name": "lld",
          "desc": "Linker de LLVM, mucho mas rapido que el linker del sistema.",
          "install": "brew install lld@21",
          "note": "Acelera builds de proyectos nativos (Rust, C++). Lo instale como parte del toolchain de LLVM."
        },
        {
          "site": "nlnetlabs.nl/projects/unbound",
          "tags": [
            "dns",
            "network"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "unbound",
          "name": "Unbound",
          "desc": "DNS resolver local con validacion DNSSEC y cache.",
          "install": "brew install unbound",
          "note": "Resolver DNS local con cache. Lo uso para debugging de red y resolucion mas rapida."
        },
        {
          "site": "docs.aws.amazon.com/systems-manager",
          "tags": [
            "aws",
            "ssm",
            "devops"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [
            "AWS CLI"
          ],
          "id": "session-manager-plugin",
          "name": "AWS Session Manager Plugin",
          "desc": "Plugin de AWS CLI para abrir sesiones SSM a instancias EC2 sin SSH.",
          "install": "brew install --cask session-manager-plugin",
          "note": "Para entrar a instancias EC2 via SSM sin manejar llaves SSH. Acompana a awscli."
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
            "Stats"
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
        },
        {
          "id": "glances",
          "name": "glances",
          "desc": "Monitor de sistema en terminal: CPU, RAM, disco, red en una vista.",
          "install": "brew install glances",
          "site": "nicolargo.github.io/glances",
          "tags": [
            "monitoring",
            "terminal"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Alternativa a htop con mas info en una sola pantalla.",
          "related": []
        },
        {
          "id": "vhs",
          "name": "vhs",
          "desc": "Graba demos de terminal como GIF/video desde un script.",
          "install": "brew install vhs",
          "site": "github.com/charmbracelet/vhs",
          "tags": [
            "terminal",
            "recording",
            "demo"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Para grabar demos de CLIs reproducibles: escribis un script y sale el GIF.",
          "related": []
        },
        {
          "id": "watch",
          "name": "watch",
          "desc": "Re-ejecuta un comando cada N segundos y muestra el output.",
          "install": "brew install watch",
          "site": "gitlab.com/procps-ng/procps",
          "tags": [
            "terminal",
            "monitoring"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Para mirar como cambia el output de un comando en vivo (watch kubectl get pods).",
          "related": []
        }
      ]
    }
  },
  "Shell Setup": {
    "slug": "shell-setup",
    "catKey": "shell",
    "count": 5,
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
    "count": 43,
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
          "related": []
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
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "plugin"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "plugin-serena",
          "name": "Serena",
          "desc": "Lenguaje de simbolos para codigo: find_symbol, references, rename via LSP.",
          "install": "Claude Code marketplace",
          "note": "Navegacion semantica de codigo. En vez de grep, busco simbolos y referencias exactas."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "plugin"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "plugin-datadog",
          "name": "Datadog",
          "desc": "MCP de Datadog: logs, metricas, traces, monitors desde Claude.",
          "install": "Claude Code marketplace",
          "note": "Para investigar incidentes de prod sin salir de la terminal."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "plugin"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "plugin-posthog",
          "name": "PostHog",
          "desc": "MCP de PostHog: analytics, feature flags, errores, insights.",
          "install": "Claude Code marketplace",
          "note": "Consulto analytics y errores de producto directo desde Claude."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "plugin"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "plugin-figma",
          "name": "Figma",
          "desc": "MCP de Figma para leer disenos desde Claude.",
          "install": "Claude Code marketplace",
          "note": "Para implementar UI contra el diseno real de Figma."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "plugin"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "plugin-feature-dev",
          "name": "Feature Dev",
          "desc": "Workflow guiado para desarrollar features completas.",
          "install": "Claude Code marketplace",
          "note": "Workflow estructurado cuando la feature es grande."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "plugin"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "plugin-slack",
          "name": "Slack",
          "desc": "MCP de Slack: leer y buscar mensajes del workspace.",
          "install": "Claude Code marketplace",
          "note": "Contexto organizacional: decisiones que viven en Slack y no en docs."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "plugin"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "plugin-coding-tutor",
          "name": "Coding Tutor",
          "desc": "Tutor de programacion paso a paso.",
          "install": "Claude Code marketplace",
          "note": "Para aprender conceptos nuevos con scaffolding en vez de respuestas directas."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "plugin"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "plugin-complexity-optimizer",
          "name": "Complexity Optimizer",
          "desc": "Encuentra y arregla bottlenecks de performance y algoritmos ineficientes.",
          "install": "Claude Code marketplace",
          "note": "Audita O(n^2), N+1 queries y awaits secuenciales antes de que lleguen a prod."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "plugin"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "plugin-understand-anything",
          "name": "Understand Anything",
          "desc": "Explica cualquier codebase o concepto desde cero.",
          "install": "Claude Code marketplace",
          "note": "Para onboardearme rapido en repos que no conozco."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "plugin"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "plugin-vercel",
          "name": "Vercel",
          "desc": "Plugin oficial de Vercel: deploys y proyectos desde Claude.",
          "install": "Claude Code marketplace",
          "note": "Manejo deploys de Vercel sin abrir el dashboard."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "plugin"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "plugin-engram",
          "name": "Engram",
          "desc": "Memoria persistente para Claude Code via SQLite + FTS5.",
          "install": "Claude Code marketplace",
          "note": "Guarda decisiones, bugs y descubrimientos entre sesiones. La memoria que Claude no tiene por default."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "plugin"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "plugin-ponytail",
          "name": "Ponytail",
          "desc": "Fuerza la solucion mas lazy que funciona: YAGNI, stdlib antes que deps.",
          "install": "Claude Code marketplace",
          "note": "El contrapeso al over-engineering. Review de \"que podemos borrar\"."
        }
      ],
      "Skills": [
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
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-brand-format",
          "name": "brand-format",
          "desc": "Aplica branding de Vambe a PPTX, DOCX, XLSX y HTML.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Presentaciones y docs con identidad visual de la empresa sin armar templates a mano."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-codebase-design",
          "name": "codebase-design",
          "desc": "Vocabulario compartido para disenar modulos profundos.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Para decidir donde va un seam y como hacer codigo mas testeable."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-domain-modeling",
          "name": "domain-modeling",
          "desc": "Construye el modelo de dominio: glosario y ADRs.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Mantiene la terminologia del proyecto consistente y las decisiones documentadas."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-generate-github-coder-profile",
          "name": "generate-github-coder-profile",
          "desc": "Genera un perfil de coder a partir de la actividad de GitHub.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Para armar un resumen de mi actividad y estilo de contribucion."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-grilling",
          "name": "grilling",
          "desc": "Interroga sin piedad un plan o decision para stress-testearla.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Antes de comprometerme con un diseno, lo hago defender cada rama de la decision."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-handoff",
          "name": "handoff",
          "desc": "Prepara un handoff privado para continuar una tarea en otro agente.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Para pasar trabajo entre Claude Code y Codex sin perder contexto."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-hunt",
          "name": "hunt",
          "desc": "Encuentra la causa raiz de errores y regresiones antes de cualquier fix.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Debugging sistematico: primero entender por que se rompio, despues arreglar."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-improve-codebase-architecture",
          "name": "improve-codebase-architecture",
          "desc": "Encuentra oportunidades de consolidacion de modulos acoplados.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Refactors guiados por el modelo de dominio, no por intuicion."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-pr-checkpoint",
          "name": "pr-checkpoint",
          "desc": "Revisa el diff contra mis reglas antes de push o PR.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Mi checklist personal automatizado: atrapa los errores que ya cometi antes."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-query-perf-review",
          "name": "query-perf-review",
          "desc": "Revisa cambios de performance de queries ClickHouse y Postgres.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Aprende de errores pasados de queries lentas y los aplica al review."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-retro",
          "name": "retro",
          "desc": "Retrospectiva de la sesion de trabajo.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Para cerrar sesiones largas extrayendo lecciones antes de que se pierdan."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-synced",
          "name": "synced",
          "desc": "Skills sincronizadas entre maquinas.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Punto de sync de skills compartidas."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "skill"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "skill-writing-for-agents",
          "name": "writing-for-agents",
          "desc": "Escribir docs e instrucciones optimizadas para agentes.",
          "install": "Custom skill (~/.claude/skills)",
          "note": "Para que CLAUDE.md y skills sean precisas y no ambiguas para el modelo."
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
          "site": "",
          "tags": [
            "claude-code",
            "agent",
            "planning"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "agent-planner",
          "name": "planner",
          "desc": "Disena el plan de implementacion antes de escribir codigo, anclado al codigo real.",
          "install": "Custom agent (~/.claude/agents)",
          "note": "Nunca edita codigo: produce un plan markdown + un HTML visual. Lo invoco para toda tarea no trivial."
        },
        {
          "site": "",
          "tags": [
            "claude-code",
            "agent",
            "ml"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "related": [],
          "id": "agent-yuyo",
          "name": "yuyo",
          "desc": "Reviewer tecnico de NLP, ML y sistemas LLM: prompts, evals, RAG, embeddings.",
          "install": "Custom agent (~/.claude/agents)",
          "note": "Mi reviewer de todo lo que toca LLMs: prompts, evals y decisiones de modelo."
        }
      ]
    }
  },
  "VS Code Extensions": {
    "slug": "vscode-extensions",
    "catKey": "extensions",
    "count": 3,
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
        },
        {
          "id": "ext-edit-csv",
          "name": "Edit CSV",
          "desc": "Editar archivos CSV en una tabla dentro del editor.",
          "install": "code --install-extension janisdd.vscode-edit-csv",
          "site": "marketplace.visualstudio.com/items?itemName=janisdd.vscode-edit-csv",
          "tags": [
            "vscode",
            "csv",
            "data"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Para editar CSVs como si fueran una hoja de calculo sin salir del editor. Comodo cuando reviso datasets chicos.",
          "related": [
            "Rainbow CSV"
          ]
        },
        {
          "id": "ext-rainbow-csv",
          "name": "Rainbow CSV",
          "desc": "Colorea columnas de archivos CSV/TSV y permite queries tipo SQL sobre ellos.",
          "install": "code --install-extension mechatroner.rainbow-csv",
          "site": "marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv",
          "tags": [
            "vscode",
            "csv",
            "data"
          ],
          "badges": [
            "Free"
          ],
          "featured": false,
          "note": "Hace los CSV legibles de un vistazo coloreando cada columna. Lo uso siempre que abro datos crudos.",
          "related": [
            "Edit CSV"
          ]
        }
      ]
    }
  }
};
