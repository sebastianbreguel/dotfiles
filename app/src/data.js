export const stats = [
  { number: "30+", label: "Mac Apps" },
  { number: "10", label: "CC Plugins" },
  { number: "16", label: "AI Agents" },
  { number: "21", label: "Skills" },
  { number: "21", label: "Extensions" },
];

export const navItems = [
  { id: "apps", label: "Apps" },
  { id: "plugins", label: "Plugins" },
  { id: "skills", label: "Skills" },
  { id: "agents", label: "Agents" },
  { id: "commands", label: "Commands" },
  { id: "extensions", label: "Extensions" },
  { id: "cli", label: "CLI Tools" },
  { id: "shell", label: "Shell" },
  { id: "quickstart", label: "Quick Start" },
];

export const apps = {
  Desarrollo: [
    { name: "Cursor", desc: "Editor de codigo con AI integrado (Claude, GPT). Basado en VS Code.", cost: "freemium" },
    { name: "Claude Desktop", desc: "App de escritorio de Claude. Chat + Claude Code integrado.", cost: "freemium" },
    { name: "Docker Desktop", desc: "Contenedores para ejecutar apps aisladas y dev environments.", cost: "free" },
    { name: "DataGrip", desc: "IDE de JetBrains para bases de datos. SQL, PostgreSQL, Redis.", cost: "paid" },
    { name: "Postman", desc: "Testing y documentacion de APIs. Collections, environments.", cost: "free" },
    { name: "Visual Studio Code", desc: "Editor de codigo open source de Microsoft. Extensions marketplace.", cost: "free" },
    { name: "Xcode", desc: "IDE de Apple para desarrollo iOS/macOS.", cost: "free" },
    { name: "Neo4j Desktop", desc: "Gestion de bases de datos de grafos Neo4j.", cost: "free" },
    { name: "Obsidian", desc: "Editor de notas en Markdown. Plugins, graph view, vault local.", cost: "free" },
    { name: "Conductor", desc: "Observabilidad y monitoreo de infraestructura.", cost: "enterprise" },
  ],
  Utilidades: [
    { name: "AltTab", desc: "Window switcher estilo Windows con preview de ventanas.", cost: "free" },
    { name: "Rectangle", desc: "Window management con atajos de teclado. Snapping y splits.", cost: "free" },
    { name: "BetterDisplay", desc: "Control avanzado de monitores. Resoluciones custom, brightness.", cost: "freemium" },
    { name: "Ice", desc: "Menu bar manager. Oculta iconos para mantener la barra limpia.", cost: "free" },
    { name: "Stats", desc: "Monitor del sistema en la menu bar. CPU, RAM, disco, red.", cost: "free" },
    { name: "Macs Fan Control", desc: "Control manual de ventiladores y monitoreo de temperatura.", cost: "freemium" },
    { name: "OnyX", desc: "Mantenimiento y optimizacion de macOS. Limpieza de cache.", cost: "free" },
    { name: "1Password CLI", desc: "Acceso a passwords desde terminal. Secrets management.", cost: "paid" },
    { name: "cmux", desc: "Multiplexor de sesiones Claude Code en paralelo.", cost: "free" },
    { name: "RightFont", desc: "Gestor de fuentes para macOS. Preview, activacion, organizacion.", cost: "freemium" },
  ],
  Browsers: [
    { name: "Brave Browser", desc: "Browser con bloqueo de ads y trackers integrado.", cost: "free" },
    { name: "Google Chrome", desc: "Browser de Google. Sync, extensions, DevTools.", cost: "free" },
  ],
  Comunicacion: [
    { name: "Slack", desc: "Mensajeria para equipos. Canales, threads, integraciones.", cost: "free" },
    { name: "Beeper", desc: "Mensajeria unificada. iMessage, WhatsApp, Telegram, Discord en una app.", cost: "free" },
    { name: "Spotify", desc: "Streaming de musica y podcasts.", cost: "freemium" },
  ],
  Seguridad: [
    { name: "Cloudflare WARP", desc: "VPN y DNS seguro. Encripta trafico de red.", cost: "free" },
    { name: "Drata Agent", desc: "Agente de compliance (SOC2, ISO). Monitorea configuracion de seguridad.", cost: "enterprise" },
  ],
};

export const plugins = [
  { name: "context-mode", desc: "Optimiza el context window ejecutando comandos en sandbox. Ahorra ~80% de tokens.", source: "mksglu/context-mode" },
  { name: "code-simplifier", desc: "Revisa codigo modificado para simplificar, mejorar calidad y encontrar issues.", source: "claude-plugins-official" },
  { name: "context7", desc: "Context7 MCP server para busqueda de documentacion en tiempo real.", source: "claude-plugins-official" },
  { name: "frontend-design", desc: "Herramientas de disenio frontend: componentes, layouts, CSS.", source: "claude-plugins-official" },
  { name: "playwright", desc: "Browser automation via Playwright MCP. Testing, scraping, interaccion web.", source: "claude-plugins-official" },
  { name: "skill-creator", desc: "Crea, modifica y mide rendimiento de skills custom para Claude Code.", source: "claude-plugins-official" },
  { name: "superpowers", desc: "Superpowers: writing-plans, executing-plans, brainstorming, systematic-debugging.", source: "claude-plugins-official" },
  { name: "claude-hud", desc: "HUD (Heads-Up Display) para Claude Code. Status line con info en tiempo real.", source: "jarrodwatts/claude-hud" },
  { name: "feature-dev", desc: "Asistente de desarrollo de features. Planificacion, implementacion, testing.", source: "claude-plugins-official" },
  { name: "claude-subconscious", desc: "Agente subconsciente de Letta AI. Memoria persistente entre sesiones.", source: "letta-ai/claude-subconscious" },
];

export const skills = [
  { name: "/browser-automation", desc: "Browser automation CLI. Navegacion, forms, scraping, screenshots." },
  { name: "/cross-ai-debate", desc: "Debate adversarial entre Claude Code, Codex CLI y Gemini CLI." },
  { name: "/doc-sync", desc: "Auditoria y sincronizacion de CLAUDE.md y README.md. Detecta drift." },
  { name: "/dream", desc: "Consolidacion de memoria multi-fase. Merge updates, pruning." },
  { name: "/electron", desc: "Automatiza apps Electron (VS Code, Slack, Discord) via Chrome DevTools." },
  { name: "/explore-app", desc: "Exploracion sistematica de web apps. Reporte con screenshots." },
  { name: "/fastAPI-standards", desc: "Guia para construir/refactorizar pipelines FastAPI + Prefect + pgvector." },
  { name: "/generate-readme", desc: "Genera README preciso analizando el codigo fuente del proyecto." },
  { name: "/health", desc: "Diagnostico cuando Claude se siente lento o ignora reglas. Audita hooks y MCP." },
  { name: "/pipeline-review", desc: "Auditoria full-stack de codigo de pipelines. Agentes paralelos." },
  { name: "/pre-merge-review", desc: "Review pre-landing de PRs. SQL safety, trust boundaries, side effects." },
  { name: "/project-docs", desc: "Genera vambe.md y db.md como referencia de contexto para AI." },
  { name: "/refactor-analysis", desc: "Analiza tech debt antes de refactorizar. Identifica code smells." },
  { name: "/review-plan-engineering", desc: "Review de planes de ingenieria. Arquitectura, data flow, tests." },
  { name: "/setup-browser-cookies", desc: "Importa cookies de tu browser real al headless para testing autenticado." },
  { name: "/ship-pr", desc: "Workflow de PR: merge main, tests, review diff, bump VERSION, changelog, commit, push, crear PR." },
  { name: "/slack", desc: "Interactua con workspaces Slack via browser automation." },
  { name: "/test-and-fix", desc: "QA testing sistematico de web apps. Modos: diff-aware, full, quick, regression." },
  { name: "/vercel-sandbox", desc: "Browser automation en Vercel Sandbox microVMs. Chrome headless." },
  { name: "/weekly-retro", desc: "Retrospectiva semanal de ingenieria. Analiza commits, metricas por persona." },
];

export const agents = {
  "Desarrollo & Arquitectura": [
    { name: "tech-lead", desc: "Decisiones tecnicas, coordinacion cross-domain" },
    { name: "fullstack-refactor-architect", desc: "Arquitectura, APIs, refactoring de monolitos" },
    { name: "architecture-reference", desc: "Patrones de arquitectura para pipelines FastAPI" },
    { name: "db-engineering", desc: "Schemas, queries, migraciones, indexing" },
    { name: "code-modularizer", desc: "Romper archivos grandes, extraer duplicados" },
    { name: "code-simplifier", desc: "Simplificar, refactorizar y limpiar codigo" },
    { name: "skeptical-reviewer", desc: "Devil's advocate. Desafia suposiciones antes de decidir" },
  ],
  "AI & Data": [
    { name: "ai-ml-expert", desc: "Prompts, RAG, embeddings, model selection" },
    { name: "ai-researcher", desc: "Papers, experimentos, metodologia, escritura cientifica" },
    { name: "prompt-engineering", desc: "Craft y optimizar prompts para LLMs" },
    { name: "data-science-analytics", desc: "EDA, estadisticas, visualizacion, ML" },
  ],
  "Neurociencia & Academia": [
    { name: "neuroscience-ai-expert", desc: "Neurociencia, mecanismos neurales, brain-computer interfaces" },
    { name: "neuroai-research-director", desc: "Metodologia de investigacion, NeuroAI, disenio de experimentos" },
    { name: "thesis-reviewer", desc: "Review de tesis, deteccion de texto AI, escritura academica" },
    { name: "ceo-product-strategist", desc: "Vision estrategica CEO, roadmap, impacto de producto" },
  ],
  "QA & Testing": [
    { name: "qa-test-engineer", desc: "Test strategies, edge cases, automation" },
  ],
};

export const commands = [
  { name: "/redesign-ui", desc: "Analiza componentes UI y los redisena usando ui-designer y ux-designer en paralelo." },
  { name: "/python-review", desc: "Revisa codigo Python para calidad, seguridad, type safety y mejores practicas." },
  { name: "/security-scan", desc: "Escaneo de seguridad. Busca vulnerabilidades, secretos hardcodeados, dependencias riesgosas." },
];

export const extensions = [
  { name: "Claude Code", id: "anthropic.claude-code", desc: "Integracion de Claude Code en el editor.", cost: "free" },
  { name: "ESLint", id: "dbaeumer.vscode-eslint", desc: "Linting de JavaScript/TypeScript.", cost: "free" },
  { name: "GitLens", id: "eamodio.gitlens", desc: "Git supercharged: blame, history, comparisons.", cost: "freemium" },
  { name: "Prettier", id: "esbenp.prettier-vscode", desc: "Code formatter. JS, TS, CSS, HTML, JSON.", cost: "free" },
  { name: "Git AI", id: "git-ai.git-ai-vscode", desc: "Integracion de git-ai en VS Code.", cost: "free" },
  { name: "GitHub Copilot Chat", id: "github.copilot-chat", desc: "Chat de GitHub Copilot en el editor.", cost: "freemium" },
  { name: "Gitpod Theme", id: "gitpod.gitpod-theme", desc: "Color theme de Gitpod.", cost: "free" },
  { name: "Material Theme Icons", id: "kd3n1z.vscode-material-theme-icons", desc: "Iconos Material Design para archivos y carpetas.", cost: "free" },
  { name: "Rainbow CSV", id: "mechatroner.rainbow-csv", desc: "Colorea columnas de CSV/TSV para lectura facil.", cost: "free" },
  { name: "Git Graph", id: "mhutchie.git-graph", desc: "Visualizacion de grafos Git en VS Code.", cost: "free" },
  { name: "Python Debugger", id: "ms-python.debugpy", desc: "Debugger para Python.", cost: "free" },
  { name: "Python", id: "ms-python.python", desc: "Soporte completo: IntelliSense, linting, formatting.", cost: "free" },
  { name: "Python Pylance", id: "ms-python.vscode-pylance", desc: "Language server de Python con type checking avanzado.", cost: "free" },
  { name: "Python Environments", id: "ms-python.vscode-python-envs", desc: "Gestor de entornos Python en VS Code.", cost: "free" },
  { name: "Jupyter", id: "ms-toolsai.jupyter", desc: "Soporte para notebooks Jupyter en el editor.", cost: "free" },
  { name: "Jupyter Keymap", id: "ms-toolsai.jupyter-keymap", desc: "Atajos de teclado de Jupyter en VS Code.", cost: "free" },
  { name: "Jupyter Renderers", id: "ms-toolsai.jupyter-renderers", desc: "Renderers adicionales para outputs de Jupyter.", cost: "free" },
  { name: "Jupyter Cell Tags", id: "ms-toolsai.vscode-jupyter-cell-tags", desc: "Tags para celdas de Jupyter notebooks.", cost: "free" },
  { name: "Jupyter Slideshow", id: "ms-toolsai.vscode-jupyter-slideshow", desc: "Slideshow mode para Jupyter notebooks.", cost: "free" },
  { name: "Prettier ESLint", id: "rvest.vs-code-prettier-eslint", desc: "Formatea con Prettier y aplica ESLint fixes.", cost: "free" },
  { name: "Markdown Preview Enhanced", id: "shd101wyy.markdown-preview-enhanced", desc: "Preview avanzado de Markdown con soporte LaTeX, diagrams.", cost: "free" },
];

export const cliTools = {
  "AI Coding Agents": [
    { name: "Claude Code", desc: "CLI de Claude Code. Coding agent en terminal.", install: "npm i -g @anthropic-ai/claude-code", cost: "free" },
    { name: "Gemini CLI", desc: "CLI oficial de Google Gemini. Coding agent en terminal.", install: "npm i -g @google/gemini-cli", cost: "free" },
    { name: "OpenAI Codex", desc: "CLI de OpenAI. Coding agent en terminal.", install: "npm i -g @openai/codex", cost: "free" },
    { name: "Kilo Code", desc: "CLI de Kilo Code. Coding agent en terminal.", install: "npm i -g @kilocode/cli", cost: "free" },
    { name: "Qwen Code", desc: "CLI de Qwen para coding.", install: "npm i -g @qwen-code/qwen-code", cost: "free" },
    { name: "Cubic Dev AI", desc: "CLI de Cubic Dev AI para coding.", install: "npm i -g @cubic-dev-ai/cli", cost: "free" },
    { name: "Probe", desc: "CLI de Probe Labs.", install: "npm i -g @probelabs/probe", cost: "free" },
  ],
  "Browser & Automation": [
    { name: "agent-browser", desc: "Browser automation CLI para AI agents.", install: "npm i -g agent-browser", cost: "free" },
  ],
  "Dev Tools": [
    { name: "Mint", desc: "CLI de Mint. Herramienta de desarrollo.", install: "npm i -g mint", cost: "free" },
    { name: "OpenClaw", desc: "CLI de OpenClaw. Herramienta de desarrollo.", install: "npm i -g openclaw", cost: "free" },
    { name: "Puzld AI", desc: "CLI de Puzld AI. Herramienta de desarrollo.", install: "npm i -g puzldai", cost: "free" },
    { name: "OP", desc: "CLI de OP. Herramienta de desarrollo.", install: "npm i -g op", cost: "free" },
  ],
  "Package Managers & Deploy": [
    { name: "pnpm", desc: "Package manager rapido y eficiente en disco.", install: "npm i -g pnpm", cost: "free" },
    { name: "uv", desc: "Python package manager ultra rapido. Escrito en Rust.", install: "curl -LsSf https://astral.sh/uv/install.sh | sh", cost: "free" },
    { name: "Vercel", desc: "CLI para deploy de apps web.", install: "npm i -g vercel", cost: "freemium" },
  ],
  "Terminal Tools": [
    { name: "tmux", desc: "Multiplexor de terminal. Sesiones persistentes, splits.", cost: "free" },
    { name: "ripgrep", desc: "Busqueda de texto ultra rapida. Reemplaza grep.", cost: "free" },
    { name: "fzf", desc: "Fuzzy finder. Ctrl+R mejorado, busqueda de archivos.", cost: "free" },
    { name: "htop", desc: "Monitor de procesos interactivo. Mejor que top.", cost: "free" },
    { name: "aitop", desc: "Monitor del sistema con AI. Top-like con analisis inteligente.", cost: "free" },
    { name: "ffmpeg", desc: "Procesamiento de audio/video. Conversion, encoding.", cost: "free" },
    { name: "ncdu", desc: "Analizador de uso de disco con interfaz ncurses.", cost: "free" },
    { name: "gh", desc: "CLI oficial de GitHub. PRs, issues, repos desde terminal.", cost: "free" },
    { name: "jq", desc: "Procesador de JSON en linea de comandos.", cost: "free" },
    { name: "shellcheck", desc: "Linter para scripts shell. Encuentra bugs y problemas.", cost: "free" },
    { name: "nvtop", desc: "Monitor de GPU (similar a htop para GPUs).", cost: "free" },
  ],
};

export const shellTools = [
  { name: "Oh My Zsh", desc: "Framework para Zsh. Aliases, plugins, themes. La base de todo.", cost: "free" },
  { name: "Powerlevel10k", desc: "Theme ultra rapido con prompt customizable y iconos.", cost: "free" },
  { name: "zsh-autosuggestions", desc: "Sugiere comandos del historial mientras escribes.", cost: "free" },
  { name: "fzf", desc: "Fuzzy finder integrado en la shell. Ctrl+R mejorado.", cost: "free" },
];
