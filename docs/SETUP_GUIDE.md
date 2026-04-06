# Setup Completo
---

## Indice

0. [Primeros pasos (Mac nuevo)](#0-primeros-pasos-mac-nuevo)
1. [Runtimes & Package Managers](#1-runtimes--package-managers)
2. [Homebrew Formulae](#2-homebrew-formulae)
3. [Homebrew Casks](#3-homebrew-casks)
4. [Mac Apps](#4-mac-apps-manual-o-via-cask)
5. [Shell: Oh My Zsh + Powerlevel10k](#5-shell-oh-my-zsh--powerlevel10k)
6. [Git Config](#6-git-config)
7. [Global NPM Packages](#7-global-npm-packages)
8. [Python Packages](#8-python-packages-pip)
9. [VS Code / Cursor Extensions](#9-vs-code--cursor-extensions)
10. [Claude Code - Plugins](#10-claude-code---plugins)
11. [Claude Code - Skills (gstack)](#11-claude-code---skills-gstack)
12. [Claude Code - Custom Agents](#12-claude-code---custom-agents-16-agentes)
13. [Claude Code - Custom Command](#13-claude-code---custom-command)
14. [Script rapido de setup](#script-rapido-de-setup)

---

## 0. Primeros pasos (Mac nuevo)

Antes de instalar cualquier cosa, sigue estos pasos en orden en una Mac recien formateada:

### 0.1 Actualizaciones del sistema

```bash
# Actualizar macOS a la ultima version
softwareupdate --install --all
```

### 0.2 Xcode Command Line Tools

```bash
# Necesario para git, compiladores, y Homebrew
xcode-select --install
```

### 0.3 Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Agregar Homebrew al PATH (Apple Silicon)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### 0.4 Clonar este repo

```bash
# Crear SSH key para GitHub (o copiar la existente)
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519

# Copiar la key publica y agregarla a GitHub > Settings > SSH Keys
cat ~/.ssh/id_ed25519.pub

# Configurar SSH
mkdir -p ~/.ssh && cat > ~/.ssh/config << 'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
EOF

# Clonar dotfiles
git clone git@github.com:<your-user>/dotfiles.git ~/dotfiles
cd ~/dotfiles
```

### 0.5 Copiar archivos de configuracion

```bash
# Claude Code config (agentes, skills, commands, settings)
cp -r ~/dotfiles/.claude/ ~/.claude/

# Si tienes backup de estos archivos, copiarlos tambien:
# ~/.secrets          (variables de entorno privadas)
# ~/.p10k.zsh         (config de Powerlevel10k)
# ~/.ssh/gitVambe     (SSH key privada)
```

### 0.6 Orden de instalacion recomendado

| Paso | Seccion | Que instala | Tiempo aprox |
|------|---------|-------------|--------------|
| 1 | [Sec. 1](#1-runtimes--package-managers) | Homebrew, NVM, Node, Python, Bun | 10 min |
| 2 | [Sec. 2-3](#2-homebrew-formulae) | Formulae + Casks | 15 min |
| 3 | [Sec. 4](#4-mac-apps-manual-o-via-cask) | Apps de Mac | 20 min |
| 4 | [Sec. 5](#5-shell-oh-my-zsh--powerlevel10k) | Oh My Zsh + P10k + aliases | 5 min |
| 5 | [Sec. 6](#6-git-config) | Git + SSH (si no se hizo en paso 0.4) | 2 min |
| 6 | [Sec. 7-8](#7-global-npm-packages) | NPM global + Python packages | 10 min |
| 7 | [Sec. 9](#9-vs-code--cursor-extensions) | VS Code / Cursor extensions | 5 min |
| 8 | [Sec. 10-13](#10-claude-code---plugins) | Claude Code completo | 10 min |

> **Tip**: O simplemente ejecuta el [script de setup](#script-rapido-de-setup) del final para automatizar pasos 1-8.

---

## 1. Runtimes & Package Managers

```bash
# Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# NVM + Node v25
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 25
nvm use 25

# Python 3.14 (descargar desde python.org o brew)
# https://www.python.org/downloads/

# Bun
curl -fsSL https://bun.sh/install | bash

# uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# pnpm
npm install -g pnpm@10.30.3
```

---

## 2. Homebrew Formulae

```bash
brew install \
  aitop \
  bats-core \
  deno \
  ffmpeg \
  fzf \
  gh \
  go \
  htop \
  jq \
  mole \
  ncdu \
  nvtop \
  postgresql@15 \
  redis \
  ripgrep \
  rtk \
  shellcheck \
  sox \
  tectonic \
  tmux \
  zsh-autosuggestions
```

## 3. Homebrew Casks

```bash
brew install --cask \
  1password-cli \
  alt-tab \
  betterdisplay \
  brave-browser \
  claude \
  cloudflare-warp \
  cmux \
  cursor \
  datagrip \
  docker \
  google-chrome \
  jordanbaird-ice \
  macs-fan-control \
  obsidian \
  onyx \
  postman \
  rectangle \
  slack \
  spotify \
  stats \
  visual-studio-code
```

---

## 4. Mac Apps (manual o via cask)

| App | Instalacion |
|-----|-------------|
| Brave Browser | `brew install --cask brave-browser` |
| Claude Desktop | `brew install --cask claude` |
| Cursor | `brew install --cask cursor` |
| Docker Desktop | `brew install --cask docker` |
| Postman | `brew install --cask postman` |
| Rectangle | `brew install --cask rectangle` |
| Slack | `brew install --cask slack` |
| Spotify | `brew install --cask spotify` |
| Stats | `brew install --cask stats` |
| DataGrip | `brew install --cask datagrip` |
| Macs Fan Control | `brew install --cask macs-fan-control` |
| Cloudflare WARP | `brew install --cask cloudflare-warp` |
| Drata Agent | Manual (empresa) |
| Neo4j Desktop | Manual |
| OnyX | `brew install --cask onyx` |

---

## 5. Shell: Oh My Zsh + Powerlevel10k

```bash
# Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Powerlevel10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# zsh-autosuggestions plugin
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# En ~/.zshrc:
# ZSH_THEME="powerlevel10k/powerlevel10k"
# plugins=(git zsh-autosuggestions)
```

### PATH exports (agregar a ~/.zshrc)

```bash
export PATH="$HOME/.local/bin:$PATH"
export PATH="/Applications/Cursor.app/Contents/Resources/app/bin:$PATH"
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
export PATH="/opt/homebrew/opt/libpq/bin:$PATH"
export PATH="$BUN_INSTALL/bin:$PATH"
# fzf
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
```

---

## 6. Git Config

```bash
git config --global user.name "your-username"
git config --global user.email "your_email@example.com"
```

### SSH Key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519
```

`~/.ssh/config`:
```
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
```

---

## 7. Global NPM Packages

```bash
pnpm add -g \
  @anthropic-ai/claude-code \
  @cubic-dev-ai/cli \
  @google/gemini-cli \
  @kilocode/cli \
  @openai/codex \
  @probelabs/probe \
  @qwen-code/qwen-code \
  agent-browser \
  mint \
  op \
  openclaw \
  pnpm \
  puzldai \
  vercel
```

---

## 8. Python Packages (pip)

```bash
pip3 install \
  anthropic beautifulsoup4 bertopic fastapi hdbscan \
  httpx huggingface_hub joblib numpy pandas plotly \
  pydantic requests rich scikit-learn scipy \
  sentence-transformers torch transformers typer \
  umap-learn uvicorn python-dotenv pyyaml
```

---

## 9. VS Code / Cursor Extensions

```bash
code --install-extension ext-claude-code
code --install-extension ext-copilot-chat
code --install-extension ext-eslint
code --install-extension ext-git-ai
code --install-extension ext-git-graph
code --install-extension ext-gitlens
code --install-extension ext-gitpod-theme
code --install-extension ext-jupyter
code --install-extension ext-jupyter-cell-tags
code --install-extension ext-jupyter-keymap
code --install-extension ext-jupyter-renderers
code --install-extension ext-jupyter-slideshow
code --install-extension ext-markdown-preview
code --install-extension ext-material-icons
code --install-extension ext-prettier
code --install-extension ext-prettier-eslint
code --install-extension ext-pylance
code --install-extension ext-python
code --install-extension ext-python-debugger
code --install-extension ext-python-envs
code --install-extension ext-rainbow-csv
```

---

## 10. Claude Code - Plugins

```bash
# Instalar Claude Code (si no viene con Claude Desktop)
# https://docs.anthropic.com/en/docs/claude-code

# Plugins habilitados (se activan desde Claude Code):
# 1. code-simplifier      (claude-plugins-official)
# 2. context-mode         (context-mode)
# 3. context7             (claude-plugins-official)
# 4. frontend-design      (claude-plugins-official)
# 5. playwright           (claude-plugins-official)
# 6. skill-creator        (claude-plugins-official)
# 7. superpowers          (claude-plugins-official)
# 8. claude-hud           (claude-hud)
# 9. feature-dev          (claude-plugins-official)
# 10. claude-subconscious (claude-subconscious)
```

### Settings (`~/.claude/settings.json`)

```json
{
  "enabledPlugins": {
    "code-simplifier@claude-plugins-official": true,
    "context-mode@context-mode": true,
    "context7@claude-plugins-official": true,
    "frontend-design@claude-plugins-official": true,
    "playwright@claude-plugins-official": true,
    "skill-creator@claude-plugins-official": true,
    "superpowers@claude-plugins-official": true,
    "claude-hud@claude-hud": true,
    "feature-dev@claude-plugins-official": true,
    "claude-subconscious@claude-subconscious": true
  },
  "extraKnownMarketplaces": {
    "context-mode": {
      "source": { "source": "github", "repo": "mksglu/context-mode" }
    },
    "thedotmack": {
      "source": { "source": "github", "repo": "thedotmack/claude-mem" }
    },
    "claude-hud": {
      "source": { "source": "github", "repo": "jarrodwatts/claude-hud" }
    },
    "socraticode": {
      "source": { "source": "github", "repo": "giancarloerra/socraticode" }
    },
    "claude-subconscious": {
      "source": { "source": "github", "repo": "letta-ai/claude-subconscious" }
    }
  },
  "effortLevel": "medium",
  "voiceEnabled": true
}
```

### Permissions (`~/.claude/settings.local.json`)

```json
{
  "permissions": {
    "allow": [
      "Bash(claude --version)",
      "Bash(npm list:*)",
      "mcp__plugin_context-mode_context-mode__ctx_fetch_and_index",
      "mcp__plugin_context-mode_context-mode__ctx_search",
      "Bash(git clone:*)",
      "Bash(cd:*)",
      "Bash(ls:*)",
      "mcp__plugin_context-mode_context-mode__ctx_batch_execute"
    ]
  }
}
```

---

## 11. Claude Code - Skills (gstack)

```bash
# Clonar gstack skills de Garry Tan
mkdir -p ~/.claude/skills
cd ~/.claude/skills
git clone https://github.com/garrytan/gstack.git
cd gstack && bun install && bun run build
```

Skills incluidos: `browse`, `browser-automation`, `cross-ai-debate`, `doc-sync`, `dream`, `electron`, `explore-app`, `fastAPI-standards`, `generate-readme`, `health`, `pipeline-review`, `pre-merge-review`, `project-docs`, `refactor-analysis`, `review-plan-engineering`, `setup-browser-cookies`, `ship-pr`, `slack`, `test-and-fix`, `vercel-sandbox`, `weekly-retro`

---

## 12. Claude Code - Custom Agents (16 agentes)

Los agentes custom estan en `~/.claude/agents/`:

| Agente | Uso |
|--------|-----|
| ai-ml-expert | Arquitectura AI/ML, prompts, RAG, embeddings |
| ai-researcher | Papers, experimentos, metodologia, escritura cientifica |
| architecture-reference | Patrones de arquitectura para pipelines FastAPI |
| ceo-product-strategist | Vision estrategica CEO, roadmap, impacto de producto |
| code-modularizer | Refactorizar y modularizar archivos grandes |
| code-simplifier | Simplificar y limpiar codigo |
| data-science-analytics | EDA, estadisticas, visualizacion |
| db-engineering | Esquemas DB, queries, migraciones |
| fullstack-refactor-architect | Arquitectura cross-stack |
| neuroai-research-director | Metodologia NeuroAI, disenio de experimentos |
| neuroscience-ai-expert | Neurociencia, brain-computer interfaces, neuro-AI |
| prompt-engineering | Craft y optimizar prompts para LLMs |
| qa-test-engineer | Tests, edge cases, QA |
| skeptical-reviewer | Devil's advocate, stress-test decisiones |
| tech-lead | Decisiones tecnicas cross-domain |
| thesis-reviewer | Review de tesis, deteccion texto AI |

> Para copiar: `cp -r ~/.claude/agents/ <nuevo-pc>:~/.claude/agents/`

---

## 13. Claude Code - Custom Command

- `/redesign-ui` — Analiza y redisena componentes UI usando agentes ui-designer y ux-designer
- `/python-review` — Revisa codigo Python para calidad, seguridad y mejores practicas
- `/security-scan` — Escaneo de seguridad del proyecto. Vulnerabilidades, secretos, dependencias

---

## Script rapido de setup

```bash
#!/bin/bash
# setup.sh - Ejecutar en Mac nuevo

# 1. Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv)"

# 2. Formulae
brew install ca-certificates ffmpeg fzf htop lame mole ncdu nvm nvtop openssl@3 postgresql@15 redis ripgrep sdl2 tmux zsh zsh-autosuggestions

# 3. Casks
brew install --cask 1password-cli alt-tab betterdisplay cmux font-meslo-lg-nerd-font jordanbaird-ice brave-browser claude cursor docker postman rectangle slack spotify stats datagrip macs-fan-control cloudflare-warp onyx

# 4. Oh My Zsh + P10k
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# 5. Node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 25

# 6. Bun
curl -fsSL https://bun.sh/install | bash

# 7. Global npm
npm install -g pnpm@10.30.3 @anthropic-ai/claude-code @google/gemini-cli @openai/codex @kilocode/cli @qwen-code/qwen-code @cubic-dev-ai/cli @probelabs/probe agent-browser mint openclaw op puzldai vercel

# 8. Python packages
uv pip install anthropic beautifulsoup4 bertopic fastapi hdbscan httpx numpy pandas plotly pydantic requests rich scikit-learn scipy sentence-transformers torch transformers typer umap-learn uvicorn python-dotenv pyyaml

# 9. Git
git config --global user.name "your-username"
git config --global user.email "your_email@example.com"

echo "Done! Ahora:"
echo "1. Copiar ~/.ssh/ keys y ~/.ssh/config"
echo "2. Copiar ~/.claude/ (agents, skills, settings, commands)"
echo "3. Instalar VS Code extensions (ver seccion 9)"
echo "4. Configurar p10k: p10k configure"
echo "5. Copiar ~/.secrets"
```
