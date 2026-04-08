#!/bin/bash
set -e

# Headless server setup — adaptive for macOS (Mac mini) and Debian/Ubuntu Linux.
# CLI only. No GUI casks, no VS Code, no macOS UI prefs.

echo "=============================="
echo "  Dotfiles Server Setup"
echo "=============================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OS="$(uname -s)"

install_pkgs_mac() {
  if ! command -v brew &>/dev/null; then
    echo "[1/7] Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null || eval "$(/usr/local/bin/brew shellenv)" 2>/dev/null || true
  fi
  echo "[1/7] Installing brew formulae (CLI only, no casks)..."
  brew install \
    bats-core ca-certificates deno ffmpeg fzf gh git glow go htop jq \
    ncdu nvm openssl@3 postgresql@15 redis ripgrep shellcheck sox tmux \
    zsh zsh-autosuggestions 2>/dev/null || true
}

install_pkgs_linux() {
  echo "[1/7] Installing apt packages..."
  sudo apt-get update -y
  sudo apt-get install -y \
    build-essential ca-certificates curl wget git gnupg lsb-release \
    zsh tmux htop jq ripgrep fzf unzip \
    python3 python3-pip python3-venv \
    postgresql-client redis-tools \
    ffmpeg sox
  if ! command -v gh &>/dev/null; then
    echo "[1b/7] Installing gh..."
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list
    sudo apt-get update -y && sudo apt-get install -y gh
  fi
}

case "$OS" in
  Darwin)
    echo "Detected: macOS"
    install_pkgs_mac
    ;;
  Linux)
    if ! command -v apt-get &>/dev/null; then
      echo "ERROR: only Debian/Ubuntu Linux is supported."
      exit 1
    fi
    echo "Detected: Linux (Debian/Ubuntu)"
    install_pkgs_linux
    ;;
  *)
    echo "ERROR: unsupported OS '$OS'"
    exit 1
    ;;
esac

# 2. Oh My Zsh + Powerlevel10k
if [ ! -d "$HOME/.oh-my-zsh" ]; then
  echo "[2/7] Installing Oh My Zsh..."
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi
[ ! -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k" ] && \
  git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
[ ! -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions" ] && \
  git clone https://github.com/zsh-users/zsh-autosuggestions "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"

# 3. Node via NVM
echo "[3/7] Setting up Node..."
export NVM_DIR="$HOME/.nvm"
if ! [ -s "$NVM_DIR/nvm.sh" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
fi
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 25 || true
nvm use 25 || true

# 4. Bun + uv
echo "[4/7] Installing Bun and uv..."
command -v bun &>/dev/null || curl -fsSL https://bun.sh/install | bash
command -v uv  &>/dev/null || curl -LsSf https://astral.sh/uv/install.sh | sh

# 5. Global CLI tools
echo "[5/7] Installing CLIs..."
npm install -g pnpm@10.30.3 2>/dev/null || true
export PNPM_HOME="$HOME/.local/share/pnpm"
mkdir -p "$PNPM_HOME"
export PATH="$PNPM_HOME:$PATH"
pnpm setup 2>/dev/null || true
pnpm install -g @anthropic-ai/claude-code @google/gemini-cli @openai/codex 2>/dev/null || true
uv tool install ruff pre-commit yt-dlp 2>/dev/null || true

# 6. Claude Code config
echo "[6/7] Copying Claude Code config..."
mkdir -p ~/.claude/agents ~/.claude/skills ~/.claude/commands ~/.claude/hooks
cp -r "$SCRIPT_DIR/.claude/agents/"*   ~/.claude/agents/   2>/dev/null || true
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

# 7. Shell + git + ssh dotfiles
echo "[7/7] Copying dotfiles..."
cp "$SCRIPT_DIR/shell/.zshrc"    ~/.zshrc     2>/dev/null || true
cp "$SCRIPT_DIR/shell/.p10k.zsh" ~/.p10k.zsh  2>/dev/null || true
cp "$SCRIPT_DIR/git/.gitconfig"  ~/.gitconfig 2>/dev/null || true
mkdir -p ~/.config/git ~/.config/gh
cp "$SCRIPT_DIR/git/ignore"      ~/.config/git/ignore    2>/dev/null || true
cp "$SCRIPT_DIR/gh/config.yml"   ~/.config/gh/config.yml 2>/dev/null || true
mkdir -p ~/.ssh && chmod 700 ~/.ssh
cp "$SCRIPT_DIR/ssh/config"      ~/.ssh/config 2>/dev/null || true
chmod 600 ~/.ssh/config 2>/dev/null || true

# Default shell → zsh
if [ "$(basename "$SHELL")" != "zsh" ] && command -v zsh &>/dev/null; then
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
