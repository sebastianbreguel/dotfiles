# Setup Completo - PC de Seba Breguel
> Generado: 2026-03-14

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

# pnpm
npm install -g pnpm@10.30.3
```

---

## 2. Homebrew Formulae

```bash
brew install \
  ca-certificates ffmpeg fzf htop lame lazygit \
  mole ncdu nvm nvtop openssl@3 postgresql@15 \
  redis ripgrep sdl2 tmux zsh zsh-autosuggestions
```

## 3. Homebrew Casks

```bash
brew install --cask \
  1password-cli alt-tab betterdisplay cmux \
  font-meslo-lg-nerd-font jordanbaird-ice
```

---

## 4. Mac Apps (manual o via cask)

| App | Instalacion |
|-----|-------------|
| Brave Browser | `brew install --cask brave-browser` |
| Claude Desktop | `brew install --cask claude` |
| Cursor | `brew install --cask cursor` |
| Docker Desktop | `brew install --cask docker` |
| Ghostty | `brew install --cask ghostty` |
| iTerm2 | `brew install --cask iterm2` |
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
git config --global user.name "sebastianbreguel-vambe"
git config --global user.email "sebastian.breguel@vambe.ai"
```

### SSH Key

```bash
ssh-keygen -t ed25519 -C "sebastian.breguel@vambe.ai" -f ~/.ssh/gitVambe
```

`~/.ssh/config`:
```
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/gitVambe
```

---

## 7. Global NPM Packages

```bash
npm install -g \
  @google/gemini-cli \
  @openai/codex \
  @qwen-code/qwen-code \
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
# Ejecutar en terminal (Cursor usa mismo CLI `code`)
code --install-extension anthropic.claude-code
code --install-extension dbaeumer.vscode-eslint
code --install-extension eamodio.gitlens
code --install-extension gitpod.gitpod-theme
code --install-extension mechatroner.rainbow-csv
code --install-extension ms-python.debugpy
code --install-extension ms-python.python
code --install-extension ms-toolsai.jupyter
code --install-extension ms-toolsai.jupyter-renderers
code --install-extension ms-toolsai.vscode-jupyter-cell-tags
code --install-extension ms-toolsai.vscode-jupyter-slideshow
code --install-extension pkief.material-icon-theme
code --install-extension rvest.vs-code-prettier-eslint
```

---

## 10. Claude Code - Plugins

```bash
# Instalar Claude Code (si no viene con Claude Desktop)
# https://docs.anthropic.com/en/docs/claude-code

# Plugins habilitados (se activan desde Claude Code):
# 1. context-mode       (repo: mksglu/context-mode)
# 2. code-simplifier    (claude-plugins-official)
# 3. claude-mem          (repo: thedotmack/claude-mem)
# 4. skill-creator      (claude-plugins-official)
# 5. sanity-plugin      (claude-plugins-official)
```

### Settings (`~/.claude/settings.json`)

```json
{
  "enabledPlugins": {
    "context-mode@context-mode": true,
    "code-simplifier@claude-plugins-official": true,
    "claude-mem@thedotmack": true,
    "skill-creator@claude-plugins-official": true,
    "sanity-plugin@claude-plugins-official": true
  },
  "extraKnownMarketplaces": {
    "context-mode": {
      "source": { "source": "github", "repo": "mksglu/context-mode" }
    },
    "thedotmack": {
      "source": { "source": "github", "repo": "thedotmack/claude-mem" }
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
      "Bash(claude mcp:*)",
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

Skills incluidos: `browse`, `qa`, `review`, `ship`, `retro`, `plan-ceo-review`, `plan-eng-review`, `setup-browser-cookies`, `generate-readme`

---

## 12. Claude Code - Custom Agents (16 agentes)

Los agentes custom estan en `~/.claude/agents/`:

| Agente | Uso |
|--------|-----|
| ai-ml-expert | Arquitectura AI/ML, prompts, RAG, embeddings |
| code-explainer | Explicar y documentar codigo |
| code-modularizer | Refactorizar y modularizar archivos grandes |
| customer-success | Comunicaciones con clientes, onboarding |
| data-science-analytics | EDA, estadisticas, visualizacion |
| db-engineering | Esquemas DB, queries, migraciones |
| fullstack-refactor-architect | Arquitectura cross-stack |
| ops-impact-analyst | ROI, metricas de negocio |
| product-manager | Specs, user stories, priorizacion |
| qa-test-engineer | Tests, edge cases, QA |
| sales-engineer | Demos, propuestas tecnicas |
| scrum-planner | Sprint planning, estimaciones |
| tech-lead | Decisiones tecnicas cross-domain |
| ui-designer | Layouts, design systems, componentes |
| unit-economics-analyst | Unit economics, pricing |
| ux-designer | Flujos de usuario, friccion |

> Para copiar: `cp -r ~/.claude/agents/ <nuevo-pc>:~/.claude/agents/`

---

## 13. Claude Code - Custom Command

- `/redesign-ui` — Analiza y redisena componentes UI usando agentes ui-designer y ux-designer

---

## Script rapido de setup

```bash
#!/bin/bash
# setup.sh - Ejecutar en Mac nuevo

# 1. Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv)"

# 2. Formulae
brew install ca-certificates ffmpeg fzf htop lame lazygit mole ncdu nvm nvtop openssl@3 postgresql@15 redis ripgrep sdl2 tmux zsh zsh-autosuggestions

# 3. Casks
brew install --cask 1password-cli alt-tab betterdisplay cmux font-meslo-lg-nerd-font jordanbaird-ice brave-browser claude cursor docker ghostty iterm2 postman rectangle slack spotify stats datagrip macs-fan-control cloudflare-warp onyx

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
npm install -g pnpm@10.30.3 @google/gemini-cli @openai/codex @qwen-code/qwen-code vercel

# 8. Python packages
pip3 install anthropic beautifulsoup4 bertopic fastapi hdbscan httpx numpy pandas plotly pydantic requests rich scikit-learn scipy sentence-transformers torch transformers typer umap-learn uvicorn python-dotenv pyyaml

# 9. Git
git config --global user.name "sebastianbreguel-vambe"
git config --global user.email "sebastian.breguel@vambe.ai"

echo "Done! Ahora:"
echo "1. Copiar ~/.ssh/gitVambe y ~/.ssh/config"
echo "2. Copiar ~/.claude/ (agents, skills, settings, commands)"
echo "3. Instalar VS Code extensions (ver seccion 9)"
echo "4. Configurar p10k: p10k configure"
echo "5. Copiar ~/.secrets"
```
