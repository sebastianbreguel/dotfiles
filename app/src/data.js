export const stats = [
  { number: "20+", label: "Mac Apps" },
  { number: "5", label: "CC Plugins" },
  { number: "16", label: "AI Agents" },
  { number: "9", label: "Skills" },
  { number: "14", label: "Extensions" },
];

export const navItems = [
  { id: "apps", label: "Apps" },
  { id: "plugins", label: "Plugins" },
  { id: "skills", label: "Skills" },
  { id: "agents", label: "Agents" },
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
    { name: "Ghostty", desc: "Terminal moderna, rapida y GPU-accelerated. Escrita en Zig.", cost: "free" },
    { name: "iTerm2", desc: "Terminal avanzada para macOS. Splits, profiles, triggers.", cost: "free" },
    { name: "Neo4j Desktop", desc: "Gestion de bases de datos de grafos Neo4j.", cost: "free" },
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
  ],
  Otros: [
    { name: "Brave Browser", desc: "Browser con bloqueo de ads y trackers integrado.", cost: "free" },
    { name: "Slack", desc: "Mensajeria para equipos. Canales, threads, integraciones.", cost: "free" },
    { name: "Spotify", desc: "Streaming de musica y podcasts.", cost: "freemium" },
    { name: "Cloudflare WARP", desc: "VPN y DNS seguro. Encripta trafico de red.", cost: "free" },
  ],
};

export const plugins = [
  { name: "context-mode", desc: "Optimiza el context window ejecutando comandos en sandbox. Ahorra ~80% de tokens.", source: "mksglu/context-mode" },
  { name: "claude-mem", desc: "Memoria persistente cross-session. Guarda observaciones y decisiones entre conversaciones.", source: "thedotmack/claude-mem" },
  { name: "code-simplifier", desc: "Revisa codigo modificado para simplificar, mejorar calidad y encontrar issues.", source: "claude-plugins-official" },
  { name: "skill-creator", desc: "Crea, modifica y mide rendimiento de skills custom para Claude Code.", source: "claude-plugins-official" },
  { name: "sanity-plugin", desc: "Best practices, schema design, GROQ y guias de integracion para Sanity CMS.", source: "claude-plugins-official" },
];

export const skills = [
  { name: "/browse", desc: "Headless browser para QA testing. Navega URLs, toma screenshots. ~100ms." },
  { name: "/qa", desc: "Testing sistematico de web apps. Modos: diff-aware, full, quick, regression." },
  { name: "/review", desc: "Review pre-landing de PRs. SQL safety, trust boundaries, side effects." },
  { name: "/ship", desc: "Workflow completo: merge, tests, review, bump version, changelog, PR." },
  { name: "/retro", desc: "Retrospectiva semanal. Commits, patrones de trabajo, metricas de calidad." },
  { name: "/plan-ceo-review", desc: "Review modo CEO/founder. Repensar el problema, encontrar el producto 10-star." },
  { name: "/plan-eng-review", desc: "Review modo Eng Manager. Arquitectura, edge cases, test coverage." },
  { name: "/setup-browser-cookies", desc: "Importa cookies de tu browser real al headless para testing autenticado." },
  { name: "/generate-readme", desc: "Genera README preciso analizando el codigo fuente del proyecto." },
];

export const agents = {
  "Desarrollo & Arquitectura": [
    { name: "tech-lead", desc: "Decisiones tecnicas, coordinacion cross-domain" },
    { name: "fullstack-refactor-architect", desc: "Arquitectura, APIs, refactoring de monolitos" },
    { name: "db-engineering", desc: "Schemas, queries, migraciones, indexing" },
    { name: "code-modularizer", desc: "Romper archivos grandes, extraer duplicados" },
    { name: "code-explainer", desc: "Explicar y documentar codigo existente" },
  ],
  "AI & Data": [
    { name: "ai-ml-expert", desc: "Prompts, RAG, embeddings, model selection" },
    { name: "data-science-analytics", desc: "EDA, estadisticas, visualizacion, ML" },
  ],
  "QA & Testing": [
    { name: "qa-test-engineer", desc: "Test strategies, edge cases, automation" },
  ],
  "Producto & Negocio": [
    { name: "product-manager", desc: "Specs, user stories, priorizacion" },
    { name: "scrum-planner", desc: "Sprint planning, estimaciones, timelines" },
    { name: "ops-impact-analyst", desc: "ROI, metricas de negocio, reportes" },
    { name: "unit-economics-analyst", desc: "Unit economics, pricing, profitabilidad" },
    { name: "sales-engineer", desc: "Demos, propuestas tecnicas, RFPs" },
    { name: "customer-success", desc: "Onboarding, QBRs, churn risk" },
  ],
  "Diseno": [
    { name: "ui-designer", desc: "Layouts, design systems, componentes" },
    { name: "ux-designer", desc: "Flujos de usuario, friction points" },
  ],
};

export const extensions = [
  { name: "Claude Code", id: "anthropic.claude-code", desc: "Integracion de Claude Code en el editor.", cost: "free" },
  { name: "ESLint", id: "dbaeumer.vscode-eslint", desc: "Linting de JavaScript/TypeScript.", cost: "free" },
  { name: "GitLens", id: "eamodio.gitlens", desc: "Git supercharged: blame, history, comparisons.", cost: "freemium" },
  { name: "Python", id: "ms-python.python", desc: "Soporte completo: IntelliSense, linting, formatting.", cost: "free" },
  { name: "Jupyter", id: "ms-toolsai.jupyter", desc: "Soporte para notebooks Jupyter en el editor.", cost: "free" },
  { name: "Material Icon Theme", id: "pkief.material-icon-theme", desc: "Iconos Material Design para archivos y carpetas.", cost: "free" },
  { name: "Prettier ESLint", id: "rvest.vs-code-prettier-eslint", desc: "Formatea con Prettier y aplica ESLint fixes.", cost: "free" },
  { name: "Rainbow CSV", id: "mechatroner.rainbow-csv", desc: "Colorea columnas de CSV/TSV para lectura facil.", cost: "free" },
];

export const cliTools = {
  "AI Coding Agents": [
    { name: "Gemini CLI", desc: "CLI oficial de Google Gemini. Coding agent en terminal.", install: "npm i -g @google/gemini-cli", cost: "free" },
    { name: "OpenAI Codex", desc: "CLI de OpenAI. Coding agent en terminal.", install: "npm i -g @openai/codex", cost: "free" },
  ],
  "Package Managers & Deploy": [
    { name: "pnpm", desc: "Package manager rapido y eficiente en disco.", install: "npm i -g pnpm", cost: "free" },
    { name: "uv", desc: "Python package manager ultra rapido. Escrito en Rust.", install: "curl -LsSf https://astral.sh/uv/install.sh | sh", cost: "free" },
    { name: "Vercel", desc: "CLI para deploy de apps web.", install: "npm i -g vercel", cost: "freemium" },
  ],
  "Terminal Tools": [
    { name: "lazygit", desc: "TUI para Git. Commits, branches, stash con interfaz visual.", cost: "free" },
    { name: "tmux", desc: "Multiplexor de terminal. Sesiones persistentes, splits.", cost: "free" },
    { name: "ripgrep", desc: "Busqueda de texto ultra rapida. Reemplaza grep.", cost: "free" },
    { name: "fzf", desc: "Fuzzy finder. Ctrl+R mejorado, busqueda de archivos.", cost: "free" },
    { name: "htop", desc: "Monitor de procesos interactivo. Mejor que top.", cost: "free" },
    { name: "ffmpeg", desc: "Procesamiento de audio/video. Conversion, encoding.", cost: "free" },
    { name: "ncdu", desc: "Analizador de uso de disco con interfaz ncurses.", cost: "free" },
  ],
};

export const shellTools = [
  { name: "Oh My Zsh", desc: "Framework para Zsh. Aliases, plugins, themes. La base de todo.", cost: "free" },
  { name: "Powerlevel10k", desc: "Theme ultra rapido con prompt customizable y iconos.", cost: "free" },
  { name: "zsh-autosuggestions", desc: "Sugiere comandos del historial mientras escribes.", cost: "free" },
  { name: "fzf", desc: "Fuzzy finder integrado en la shell. Ctrl+R mejorado.", cost: "free" },
];
