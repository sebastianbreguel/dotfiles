#!/bin/bash
set -e

echo "=============================="
echo "  Dotfiles Setup Script"
echo "=============================="
echo ""

# 1. Homebrew
if ! command -v brew &>/dev/null; then
  echo "[1/9] Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$(/opt/homebrew/bin/brew shellenv)"
else
  echo "[1/9] Homebrew already installed, skipping..."
fi

# 2. Homebrew Formulae
echo "[2/9] Installing Homebrew formulae..."
brew install aitop bats-core ca-certificates deno ffmpeg fzf gh git-filter-repo glow go htop jq lame lean-ctx mas mole ncdu nvm nvtop openssl@3 postgresql@15 redis ripgrep rtk sdl2 shellcheck sox tectonic tmux zig zsh zsh-autosuggestions 2>/dev/null || true

# 3. Homebrew Casks
echo "[3/9] Installing Homebrew casks..."
brew install --cask 1password-cli alt-tab basictex betterdisplay cmux codex font-meslo-lg-nerd-font jordanbaird-ice brave-browser claude cursor docker postman rectangle slack spotify stats datagrip macs-fan-control cloudflare-warp 2>/dev/null || true

# 4. Oh My Zsh + Powerlevel10k
if [ ! -d "$HOME/.oh-my-zsh" ]; then
  echo "[4/9] Installing Oh My Zsh..."
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
else
  echo "[4/9] Oh My Zsh already installed, skipping..."
fi

if [ ! -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k" ]; then
  echo "       Installing Powerlevel10k..."
  git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
fi

if [ ! -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions" ]; then
  echo "       Installing zsh-autosuggestions..."
  git clone https://github.com/zsh-users/zsh-autosuggestions "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"
fi

# 5. Node via NVM
echo "[5/9] Setting up Node..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
if ! command -v nvm &>/dev/null; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
fi
nvm install 25 2>/dev/null || true
nvm use 25 2>/dev/null || true

# 6. Bun + uv
echo "[6/9] Installing Bun and uv..."
if ! command -v bun &>/dev/null; then
  curl -fsSL https://bun.sh/install | bash
fi
if ! command -v uv &>/dev/null; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi

# 7. Global npm packages (pnpm first, then use pnpm for the rest)
echo "[7/9] Installing global npm packages..."
npm install -g pnpm@10.30.3 2>/dev/null || true
pnpm install -g @anthropic-ai/claude-code @google/gemini-cli @openai/codex @kilocode/cli @qwen-code/qwen-code @cubic-dev-ai/cli @probelabs/probe agent-browser mint openclaw op puzldai vercel 2>/dev/null || true

# 8. Python packages
echo "[8/9] Installing Python packages..."
uv tool install ruff pre-commit complexipy code-review-graph yt-dlp 2>/dev/null || true

# 8b. Python packages
echo "[8b/9] Installing Python packages..."
uv pip install --system anthropic beautifulsoup4 bertopic fastapi hdbscan httpx numpy pandas plotly pydantic requests rich scikit-learn scipy sentence-transformers torch transformers typer umap-learn uvicorn python-dotenv pyyaml 2>/dev/null || true

# 9. Claude Code config
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "[9/9] Copying Claude Code config..."
mkdir -p ~/.claude/agents ~/.claude/skills ~/.claude/commands ~/.claude/hooks
cp -r "$SCRIPT_DIR/.claude/agents/"* ~/.claude/agents/ 2>/dev/null || true
# Copy skills except gstack (cloned separately from git)
for skill_dir in "$SCRIPT_DIR/.claude/skills/"*/; do
  [ "$(basename "$skill_dir")" = "gstack" ] && continue
  cp -r "$skill_dir" ~/.claude/skills/ 2>/dev/null || true
done
cp -r "$SCRIPT_DIR/.claude/commands/"* ~/.claude/commands/ 2>/dev/null || true
cp -r "$SCRIPT_DIR/.claude/hooks/"* ~/.claude/hooks/ 2>/dev/null || true
chmod +x ~/.claude/hooks/*.sh 2>/dev/null || true
cp "$SCRIPT_DIR/.claude/settings.json" ~/.claude/settings.json 2>/dev/null || true
cp "$SCRIPT_DIR/.claude/CLAUDE.md" ~/.claude/CLAUDE.md 2>/dev/null || true
cp "$SCRIPT_DIR/.claude/RTK.md" ~/.claude/RTK.md 2>/dev/null || true
cp "$SCRIPT_DIR/.mcp.json" ~/.mcp.json 2>/dev/null || true
# settings.local.json is per-project, not copied globally

# gstack skills (git clone, not copied from dotfiles)
if [ ! -d ~/.claude/skills/gstack/.git ]; then
  echo "       Cloning gstack skills..."
  git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack 2>/dev/null || true
fi

# Shell configs
echo "[+] Copying shell configs..."
cp "$SCRIPT_DIR/shell/.zshrc" ~/.zshrc
cp "$SCRIPT_DIR/shell/.p10k.zsh" ~/.p10k.zsh

# Git config
echo "[+] Copying git config..."
cp "$SCRIPT_DIR/git/.gitconfig" ~/.gitconfig
mkdir -p ~/.config/git
cp "$SCRIPT_DIR/git/ignore" ~/.config/git/ignore

# GitHub CLI config
echo "[+] Copying gh config..."
mkdir -p ~/.config/gh
cp "$SCRIPT_DIR/gh/config.yml" ~/.config/gh/config.yml

# SSH config
echo "[+] Copying SSH config..."
mkdir -p ~/.ssh && chmod 700 ~/.ssh
cp "$SCRIPT_DIR/ssh/config" ~/.ssh/config
chmod 600 ~/.ssh/config

# cmux config
echo "[+] Copying cmux config..."
mkdir -p ~/.config/cmux
cp "$SCRIPT_DIR/settings.json" ~/.config/cmux/settings.json 2>/dev/null || true

# VS Code settings
echo "[+] Copying VS Code settings..."
VSCODE_DIR="$HOME/Library/Application Support/Code/User"
mkdir -p "$VSCODE_DIR"
cp "$SCRIPT_DIR/vscode/settings.json" "$VSCODE_DIR/settings.json" 2>/dev/null || true

# VS Code extensions
echo "[+] Installing VS Code extensions..."
if command -v code &>/dev/null; then
  EXTENSIONS=(
    anthropic.claude-code dbaeumer.vscode-eslint eamodio.gitlens
    esbenp.prettier-vscode git-ai.git-ai-vscode github.copilot-chat
    gitpod.gitpod-theme kd3n1z.vscode-material-theme-icons
    mechatroner.rainbow-csv mhutchie.git-graph ms-python.debugpy
    ms-python.python ms-python.vscode-pylance ms-python.vscode-python-envs
    ms-toolsai.jupyter ms-toolsai.jupyter-keymap ms-toolsai.jupyter-renderers
    ms-toolsai.vscode-jupyter-cell-tags ms-toolsai.vscode-jupyter-slideshow
    rvest.vs-code-prettier-eslint shd101wyy.markdown-preview-enhanced
  )
  for ext in "${EXTENSIONS[@]}"; do
    code --install-extension "$ext" --force 2>/dev/null || true
  done
else
  echo "       'code' CLI not found, skipping VS Code extensions"
fi

# macOS system preferences
echo "[+] Applying macOS preferences..."
bash "$SCRIPT_DIR/macos.sh"

echo ""
echo "=============================="
echo "  Setup complete!"
echo "=============================="
echo ""
echo "Manual steps remaining:"
echo "  1. Copy your SSH keys to ~/.ssh/ (id_ed25519 + id_ed25519.pub)"
echo "  2. Copy ~/.secrets (env vars)"
echo "  3. Run: gh auth login"
echo "  4. Run: op account add  (1Password CLI)"
echo "  5. VS Code extensions will be installed if 'code' CLI is available"
echo "  6. Install rtk: cargo install rtk  (for Claude Code token savings hook)"
echo ""
