#!/bin/bash
set -e

# Headless Linux server setup (Ubuntu/Debian).
# Installs CLI essentials, shell, runtimes, and Claude Code config.
# No GUI apps, no macOS tooling.

echo "=============================="
echo "  Dotfiles Server Setup (Linux)"
echo "=============================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if ! command -v apt-get &>/dev/null; then
  echo "ERROR: this script targets Debian/Ubuntu (apt-get)."
  exit 1
fi

# 1. APT packages
echo "[1/7] Installing apt packages..."
sudo apt-get update -y
sudo apt-get install -y \
  build-essential ca-certificates curl wget git gnupg lsb-release \
  zsh tmux htop jq ripgrep fzf unzip \
  python3 python3-pip python3-venv \
  postgresql-client redis-tools \
  ffmpeg sox

# 2. GitHub CLI
if ! command -v gh &>/dev/null; then
  echo "[2/7] Installing gh..."
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list
  sudo apt-get update -y && sudo apt-get install -y gh
else
  echo "[2/7] gh already installed"
fi

# 3. Oh My Zsh + Powerlevel10k
if [ ! -d "$HOME/.oh-my-zsh" ]; then
  echo "[3/7] Installing Oh My Zsh..."
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi
[ ! -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k" ] && \
  git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
[ ! -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions" ] && \
  git clone https://github.com/zsh-users/zsh-autosuggestions "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"

# 4. Node via NVM
echo "[4/7] Setting up Node..."
export NVM_DIR="$HOME/.nvm"
if ! [ -s "$NVM_DIR/nvm.sh" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
fi
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 25 || true
nvm use 25 || true

# 5. Bun + uv
echo "[5/7] Installing Bun and uv..."
command -v bun &>/dev/null || curl -fsSL https://bun.sh/install | bash
command -v uv  &>/dev/null || curl -LsSf https://astral.sh/uv/install.sh | sh

# 6. Global CLI tools
echo "[6/7] Installing CLIs (npm + uv)..."
npm install -g pnpm@10.30.3 || true
pnpm install -g @anthropic-ai/claude-code @google/gemini-cli @openai/codex || true
uv tool install ruff pre-commit yt-dlp || true

# 7. Dotfiles + Claude Code config
echo "[7/7] Copying configs..."
mkdir -p ~/.claude/agents ~/.claude/skills ~/.claude/commands ~/.claude/hooks
cp -r "$SCRIPT_DIR/.claude/agents/"* ~/.claude/agents/ 2>/dev/null || true
for skill_dir in "$SCRIPT_DIR/.claude/skills/"*/; do
  [ "$(basename "$skill_dir")" = "gstack" ] && continue
  cp -r "$skill_dir" ~/.claude/skills/ 2>/dev/null || true
done
cp -r "$SCRIPT_DIR/.claude/commands/"* ~/.claude/commands/ 2>/dev/null || true
cp -r "$SCRIPT_DIR/.claude/hooks/"*    ~/.claude/hooks/    2>/dev/null || true
chmod +x ~/.claude/hooks/*.sh 2>/dev/null || true
cp "$SCRIPT_DIR/.claude/settings.json" ~/.claude/settings.json 2>/dev/null || true
cp "$SCRIPT_DIR/.claude/CLAUDE.md"     ~/.claude/CLAUDE.md     2>/dev/null || true
cp "$SCRIPT_DIR/.claude/RTK.md"        ~/.claude/RTK.md        2>/dev/null || true
cp "$SCRIPT_DIR/.mcp.json"             ~/.mcp.json             2>/dev/null || true

cp "$SCRIPT_DIR/shell/.zshrc"   ~/.zshrc   2>/dev/null || true
cp "$SCRIPT_DIR/shell/.p10k.zsh" ~/.p10k.zsh 2>/dev/null || true
cp "$SCRIPT_DIR/git/.gitconfig" ~/.gitconfig 2>/dev/null || true
mkdir -p ~/.config/git ~/.config/gh
cp "$SCRIPT_DIR/git/ignore"     ~/.config/git/ignore     2>/dev/null || true
cp "$SCRIPT_DIR/gh/config.yml"  ~/.config/gh/config.yml  2>/dev/null || true
mkdir -p ~/.ssh && chmod 700 ~/.ssh
cp "$SCRIPT_DIR/ssh/config"     ~/.ssh/config 2>/dev/null || true
chmod 600 ~/.ssh/config 2>/dev/null || true

# Default shell → zsh
if [ "$(basename "$SHELL")" != "zsh" ]; then
  chsh -s "$(command -v zsh)" || true
fi

echo ""
echo "=============================="
echo "  Server setup complete!"
echo "=============================="
echo "Manual steps:"
echo "  1. Copy SSH keys to ~/.ssh/"
echo "  2. gh auth login"
echo "  3. Set ANTHROPIC_API_KEY in ~/.secrets"
echo "  4. Log out / back in for zsh to take effect"
