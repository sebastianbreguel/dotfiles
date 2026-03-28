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
brew install aitop ca-certificates ffmpeg fzf gh go htop jq lame lazygit mole ncdu nvm nvtop openssl@3 postgresql@15 redis ripgrep sdl2 shellcheck tmux zsh zsh-autosuggestions 2>/dev/null || true

# 3. Homebrew Casks
echo "[3/9] Installing Homebrew casks..."
brew install --cask 1password-cli alt-tab betterdisplay cmux font-meslo-lg-nerd-font jordanbaird-ice brave-browser claude cursor docker ghostty iterm2 postman rectangle slack spotify stats datagrip macs-fan-control cloudflare-warp onyx 2>/dev/null || true

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

# 7. Global npm packages
echo "[7/9] Installing global npm packages..."
npm install -g pnpm@10.30.3 @anthropic-ai/claude-code @google/gemini-cli @openai/codex @kilocode/cli @qwen-code/qwen-code @cubic-dev-ai/cli @probelabs/probe agent-browser mint openclaw op puzldai vercel 2>/dev/null || true

# 8. Python packages
echo "[8/9] Installing Python packages..."
pip3 install anthropic beautifulsoup4 bertopic fastapi hdbscan httpx numpy pandas plotly pydantic requests rich scikit-learn scipy sentence-transformers torch transformers typer umap-learn uvicorn python-dotenv pyyaml 2>/dev/null || true

# 9. Claude Code config
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "[9/9] Copying Claude Code config..."
mkdir -p ~/.claude/agents ~/.claude/skills ~/.claude/commands
cp -r "$SCRIPT_DIR/.claude/agents/"* ~/.claude/agents/ 2>/dev/null || true
cp -r "$SCRIPT_DIR/.claude/skills/"* ~/.claude/skills/ 2>/dev/null || true
cp -r "$SCRIPT_DIR/.claude/commands/"* ~/.claude/commands/ 2>/dev/null || true
cp "$SCRIPT_DIR/.claude/settings.json" ~/.claude/settings.json 2>/dev/null || true
cp "$SCRIPT_DIR/.claude/settings.local.json" ~/.claude/settings.local.json 2>/dev/null || true

# gstack skills
if [ ! -d ~/.claude/skills/gstack ]; then
  echo "       Installing gstack skills..."
  cd ~/.claude/skills
  git clone https://github.com/garrytan/gstack.git
  cd gstack && bun install && bun run build
fi

echo ""
echo "=============================="
echo "  Setup complete!"
echo "=============================="
echo ""
echo "Manual steps remaining:"
echo "  1. Copy your SSH keys to ~/.ssh/"
echo "  2. Copy ~/.secrets (env vars)"
echo "  3. Copy ~/.p10k.zsh (or run: p10k configure)"
echo "  4. Install VS Code extensions:"
echo "     code --install-extension anthropic.claude-code"
echo "     code --install-extension dbaeumer.vscode-eslint"
echo "     code --install-extension eamodio.gitlens"
echo "     code --install-extension ms-python.python"
echo "     code --install-extension ms-toolsai.jupyter"
echo "     code --install-extension pkief.material-icon-theme"
echo "     code --install-extension rvest.vs-code-prettier-eslint"
echo "     code --install-extension mechatroner.rainbow-csv"
echo "  5. Configure git:"
echo "     git config --global user.name \"your-username\""
echo "     git config --global user.email \"your_email@example.com\""
echo ""
