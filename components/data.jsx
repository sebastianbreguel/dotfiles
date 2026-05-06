// dotfiles — catalog data
// Grouped by top-level section (matches left-nav)

const DATA = {
  "Mac Apps": {
    slug: "mac-apps",
    count: 26,
    groups: {
      "Development": [
        { name: "Claude Desktop", badges: ["Freemium", "Homebrew"], desc: "Desktop app for Claude. Chat + Claude Code integrated.", install: "brew install --cask claude", site: "claude.ai/download", tags: ["ai", "chat"], featured: true, note: "My daily driver for AI pair-programming. Claude Code inside Claude Desktop is how I ship now." },
        { name: "Docker Desktop", badges: ["Homebrew"], desc: "Containers for running isolated apps and dev environments.", install: "brew install --cask docker", site: "docker.com", tags: ["containers", "infra"] },
        { name: "DataGrip", badges: ["Paid", "Homebrew"], desc: "JetBrains IDE for databases. SQL, PostgreSQL, Redis.", install: "brew install --cask datagrip", site: "jetbrains.com/datagrip", tags: ["database", "sql"] },
        { name: "Postman", badges: ["Homebrew"], desc: "API testing and documentation. Collections, environments.", install: "brew install --cask postman", site: "postman.com", tags: ["api", "testing"] },
        { name: "Visual Studio Code", badges: ["Homebrew"], desc: "Microsoft's open-source code editor. Extensions marketplace.", install: "brew install --cask visual-studio-code", site: "code.visualstudio.com", tags: ["editor"] },
        { name: "Xcode", badges: [], desc: "Apple IDE for iOS/macOS development.", install: "mas install 497799835", site: "developer.apple.com/xcode", tags: ["ios", "macos"] },
        { name: "Neo4j Desktop", badges: ["Homebrew"], desc: "Graph database management for Neo4j.", install: "brew install --cask neo4j", site: "neo4j.com", tags: ["database", "graph"] },
        { name: "Obsidian", badges: ["Homebrew"], desc: "Markdown notes. Plugins, graph view, local vault.", install: "brew install --cask obsidian", site: "obsidian.md", tags: ["notes", "markdown"] },
        { name: "Conductor", badges: ["Paid"], desc: "Infrastructure observability and monitoring.", install: "# via web installer", site: "conductor.dev", tags: ["observability"] },
      ],
      "Utilities": [
        { name: "AltTab", badges: ["Homebrew"], desc: "Windows-style window switcher with per-window previews.", install: "brew install --cask alt-tab", site: "alt-tab-macos.netlify.app", tags: ["windows", "productivity"], note: "Mac's native switcher is unusable for real multitasking. AltTab gives real per-window previews like Windows.", related: ["Rectangle"], featured: true },
        { name: "Rectangle", badges: ["Homebrew"], desc: "Keyboard-driven window management. Snapping and splits.", install: "brew install --cask rectangle", site: "rectangleapp.com", tags: ["windows", "productivity"] },
        { name: "BetterDisplay", badges: ["Freemium", "Homebrew"], desc: "Advanced display control. Custom resolutions, brightness.", install: "brew install --cask betterdisplay", site: "betterdisplay.pro", tags: ["display"] },
        { name: "Ice", badges: ["Homebrew"], desc: "Menu bar manager. Hide icons to keep the bar clean.", install: "brew install --cask ice", site: "icemenubar.app", tags: ["menubar"] },
        { name: "Stats", badges: ["Homebrew"], desc: "Menu-bar system monitor. CPU, RAM, disk, network.", install: "brew install --cask stats", site: "github.com/exelban/stats", tags: ["monitoring"] },
        { name: "Macs Fan Control", badges: ["Freemium", "Homebrew"], desc: "Manual fan control and temperature monitoring.", install: "brew install --cask macs-fan-control", site: "crystalidea.com", tags: ["system"] },
        { name: "1Password CLI", badges: ["Paid", "Homebrew"], desc: "Password access from the terminal. Secrets management.", install: "brew install --cask 1password-cli", site: "1password.com/downloads/command-line", tags: ["security"] },
        { name: "cmux", badges: ["Homebrew"], desc: "Multiplex parallel Claude Code sessions.", install: "brew install cmux", site: "github.com/cmux", tags: ["claude", "terminal"] },
        { name: "RightFont", badges: ["Freemium"], desc: "Font manager for macOS. Preview, activation, organization.", install: "# app store", site: "rightfontapp.com", tags: ["fonts"] },
      ],
      "Browsers": [
        { name: "Brave Browser", badges: ["Homebrew"], desc: "Browser with built-in ad and tracker blocking.", install: "brew install --cask brave-browser", site: "brave.com", tags: ["browser"] },
        { name: "Google Chrome", badges: ["Homebrew"], desc: "Google's browser. Sync, extensions, DevTools.", install: "brew install --cask google-chrome", site: "google.com/chrome", tags: ["browser"] },
      ],
      "Communication": [
        { name: "Slack", badges: ["Homebrew"], desc: "Team messaging. Channels, threads, integrations.", install: "brew install --cask slack", site: "slack.com", tags: ["chat"] },
        { name: "Beeper", badges: ["Homebrew"], desc: "Unified messaging. iMessage, WhatsApp, Telegram, Discord.", install: "brew install --cask beeper", site: "beeper.com", tags: ["chat"] },
        { name: "Spotify", badges: ["Freemium", "Homebrew"], desc: "Music and podcast streaming.", install: "brew install --cask spotify", site: "spotify.com", tags: ["audio"] },
      ],
      "Security": [
        { name: "Cloudflare WARP", badges: ["Homebrew"], desc: "Secure VPN/DNS. Encrypts network traffic.", install: "brew install --cask cloudflare-warp", site: "1.1.1.1", tags: ["vpn"] },
        { name: "Drata Agent", badges: ["Paid"], desc: "Compliance agent (SOC2, ISO). Monitors security config.", install: "# via Drata dashboard", site: "drata.com", tags: ["compliance"] },
      ],
    },
  },
  "CLI Tools": {
    slug: "cli-tools",
    count: 46,
    groups: {
      "Shell & Prompt": [
        { name: "starship", badges: ["Homebrew"], desc: "Cross-shell prompt. Fast, customizable, context-aware.", install: "brew install starship", site: "starship.rs", tags: ["shell"], featured: true, note: "Replaces oh-my-zsh themes. Git status, language versions, directory context — all in one line." },
        { name: "zoxide", badges: ["Homebrew"], desc: "Smarter cd. Jumps to directories by frecency.", install: "brew install zoxide", site: "github.com/ajeetdsouza/zoxide", tags: ["navigation"] },
        { name: "fzf", badges: ["Homebrew"], desc: "Fuzzy finder for the terminal. Ctrl-R, file picker, more.", install: "brew install fzf", site: "github.com/junio-ohno/fzf", tags: ["search"] },
        { name: "atuin", badges: ["Homebrew"], desc: "Magical shell history. Searchable, syncable.", install: "brew install atuin", site: "atuin.sh", tags: ["shell"] },
      ],
      "File & Text": [
        { name: "eza", badges: ["Homebrew"], desc: "Modern ls replacement. Icons, tree, git integration.", install: "brew install eza", site: "eza.rocks", tags: ["files"] },
        { name: "bat", badges: ["Homebrew"], desc: "cat with syntax highlighting and git integration.", install: "brew install bat", site: "github.com/sharkdp/bat", tags: ["files"] },
        { name: "ripgrep", badges: ["Homebrew"], desc: "Ridiculously fast grep. Respects .gitignore.", install: "brew install ripgrep", site: "github.com/BurntSushi/ripgrep", tags: ["search"] },
        { name: "fd", badges: ["Homebrew"], desc: "User-friendly find. Simpler syntax, faster defaults.", install: "brew install fd", site: "github.com/sharkdp/fd", tags: ["search"] },
        { name: "jq", badges: ["Homebrew"], desc: "Command-line JSON processor.", install: "brew install jq", site: "jqlang.github.io/jq", tags: ["data"] },
        { name: "yq", badges: ["Homebrew"], desc: "jq for YAML. Also handles JSON and XML.", install: "brew install yq", site: "github.com/mikefarah/yq", tags: ["data"] },
      ],
      "Git & Dev": [
        { name: "gh", badges: ["Homebrew"], desc: "GitHub's official CLI. PRs, issues, releases from the terminal.", install: "brew install gh", site: "cli.github.com", tags: ["git"] },
        { name: "lazygit", badges: ["Homebrew"], desc: "Terminal UI for git. Stage hunks, rebase, cherry-pick visually.", install: "brew install lazygit", site: "github.com/jesseduffield/lazygit", tags: ["git"] },
        { name: "delta", badges: ["Homebrew"], desc: "Syntax-highlighting pager for git diffs.", install: "brew install git-delta", site: "github.com/dandavison/delta", tags: ["git"] },
        { name: "mise", badges: ["Homebrew"], desc: "Runtime version manager. Replaces nvm, pyenv, rbenv.", install: "brew install mise", site: "mise.jdx.dev", tags: ["versions"] },
      ],
      "System": [
        { name: "btop", badges: ["Homebrew"], desc: "Resource monitor. Pretty, keyboard-driven top.", install: "brew install btop", site: "github.com/aristocratos/btop", tags: ["monitoring"] },
        { name: "httpie", badges: ["Homebrew"], desc: "curl for humans. Intuitive HTTP syntax.", install: "brew install httpie", site: "httpie.io", tags: ["http"] },
      ],
    },
  },
  "Shell Setup": {
    slug: "shell-setup",
    count: 4,
    groups: {
      "Core": [
        { name: "zsh + zinit", badges: ["Config"], desc: "Z-shell with zinit plugin manager. Turbo-loaded, async.", install: "sh -c \"$(curl -fsSL https://git.io/zinit-install)\"", site: "github.com/zdharma-continuum/zinit", tags: ["shell"], featured: true, note: "Zinit turbo mode keeps shell startup under 50ms even with 30+ plugins." },
        { name: ".zshrc", badges: ["Config"], desc: "Personal shell config. Aliases, PATH, hooks.", install: "ln -s ~/dotfiles/.zshrc ~/.zshrc", site: "github.com/me/dotfiles", tags: ["shell"] },
        { name: "starship.toml", badges: ["Config"], desc: "Starship prompt configuration.", install: "ln -s ~/dotfiles/starship.toml ~/.config/starship.toml", site: "#", tags: ["prompt"] },
        { name: "alacritty.toml", badges: ["Config"], desc: "Alacritty terminal emulator config.", install: "ln -s ~/dotfiles/alacritty.toml ~/.config/alacritty/alacritty.toml", site: "alacritty.org", tags: ["terminal"] },
      ],
    },
  },
  "Claude Code": {
    slug: "claude-code",
    count: 68,
    groups: {
      "Plugins": [
        { name: "context-mode", badges: ["Marketplace"], desc: "Switch between context profiles per task.", install: "claude plugin install context-mode", site: "#", tags: ["plugin"], featured: true, note: "Lets me scope Claude's context to exactly one subsystem. Big win on monorepos." },
        { name: "code-simplifier", badges: ["Marketplace"], desc: "Audits and simplifies code after feature pushes.", install: "claude plugin install code-simplifier", site: "#", tags: ["plugin", "quality"] },
        { name: "context7", badges: ["Marketplace"], desc: "Long-context search across codebase history.", install: "claude plugin install context7", site: "#", tags: ["plugin"] },
        { name: "frontend-design", badges: ["Marketplace"], desc: "Aesthetic direction for UI work.", install: "claude plugin install frontend-design", site: "#", tags: ["plugin", "design"] },
        { name: "playwright", badges: ["Marketplace"], desc: "Browser automation in Claude Code.", install: "claude plugin install playwright", site: "#", tags: ["plugin", "testing"] },
      ],
      "Slash Commands": [
        { name: "/simplify", badges: ["Free"], desc: "Audit changed code. Check reuse, quality, fix issues.", install: "# auto-registered", site: "#", tags: ["claude", "refactor"], note: "Run after every big feature push. Finds redundancy and sneaky complexity." },
        { name: "/review", badges: ["Free"], desc: "Pre-PR review. Flags risks, missing tests, style drift.", install: "# auto-registered", site: "#", tags: ["claude"] },
        { name: "/plan", badges: ["Free"], desc: "Break a feature into a todo list before coding.", install: "# auto-registered", site: "#", tags: ["claude"] },
      ],
      "Skills": [
        { name: "frontend-design", badges: ["Skill"], desc: "Committed aesthetic direction for designs.", install: "# skill file at ~/.claude/skills/", site: "#", tags: ["skill"] },
        { name: "read-pdf", badges: ["Skill"], desc: "Extract text and images from PDF files.", install: "# skill file at ~/.claude/skills/", site: "#", tags: ["skill"] },
      ],
      "Hooks": [
        { name: "pre-commit-lint", badges: ["Hook"], desc: "Run linter before any commit command.", install: "# in ~/.claude/hooks/", site: "#", tags: ["hook"] },
        { name: "post-edit-format", badges: ["Hook"], desc: "Auto-format files after Claude edits them.", install: "# in ~/.claude/hooks/", site: "#", tags: ["hook"] },
      ],
      "Agents": [
        { name: "verifier", badges: ["Agent"], desc: "Background agent checks work before handoff.", install: "# agent config", site: "#", tags: ["agent"] },
        { name: "researcher", badges: ["Agent"], desc: "Pulls docs and references for ambiguous tasks.", install: "# agent config", site: "#", tags: ["agent"] },
      ],
    },
  },
  "VS Code Extensions": {
    slug: "vscode-extensions",
    count: 21,
    groups: {
      "Core": [
        { name: "GitLens", badges: ["Marketplace"], desc: "Git supercharged. Blame, history, inline hints.", install: "code --install-extension eamodio.gitlens", site: "gitlens.amod.io", tags: ["git"], featured: true, note: "Blame annotations + file history are now reflexes." },
        { name: "Error Lens", badges: ["Marketplace"], desc: "Inline diagnostics. Errors and warnings next to code.", install: "code --install-extension usernamehw.errorlens", site: "#", tags: ["diagnostics"] },
        { name: "Prettier", badges: ["Marketplace"], desc: "Opinionated code formatter.", install: "code --install-extension esbenp.prettier-vscode", site: "prettier.io", tags: ["format"] },
        { name: "ESLint", badges: ["Marketplace"], desc: "JavaScript linter integration.", install: "code --install-extension dbaeumer.vscode-eslint", site: "eslint.org", tags: ["lint"] },
      ],
      "Language": [
        { name: "Tailwind CSS IntelliSense", badges: ["Marketplace"], desc: "Autocomplete, linting, hover for Tailwind classes.", install: "code --install-extension bradlc.vscode-tailwindcss", site: "tailwindcss.com", tags: ["css"] },
        { name: "Rust Analyzer", badges: ["Marketplace"], desc: "Rust language server. Inlay hints, refactors.", install: "code --install-extension rust-lang.rust-analyzer", site: "rust-analyzer.github.io", tags: ["rust"] },
      ],
    },
  },
};

// Flat list for search
const ALL_TOOLS = [];
for (const [cat, data] of Object.entries(DATA)) {
  for (const [group, tools] of Object.entries(data.groups)) {
    for (const tool of tools) {
      ALL_TOOLS.push({ ...tool, category: cat, group });
    }
  }
}

const CATEGORIES = Object.keys(DATA);

Object.assign(window, { DATA, ALL_TOOLS, CATEGORIES });
