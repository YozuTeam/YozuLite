#!/usr/bin/env bash

set -e

echo "🚀 Initialisation de l'environnement de développement..."

# =============================
# 🧠 UTILITAIRES DE BASE
# =============================

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

OS="$(uname -s)"
USER_SHELL=$(basename "$SHELL")

# =============================
# ⚙️ INSTALLATIONS DE BASE
# =============================

install_git() {
  if ! command_exists git; then
    echo "📦 Installation de Git..."
    if command_exists brew; then
      brew install git
    else
      sudo apt-get update -y && sudo apt-get install -y git
    fi
  else
    echo "✅ Git déjà installé ($(git --version))"
  fi
}

install_zsh() {
  if ! command_exists zsh; then
    echo "🐚 Installation de Zsh..."
    if command_exists brew; then
      brew install zsh
    else
      sudo apt-get install -y zsh
    fi
  else
    echo "✅ Zsh déjà installé ($(zsh --version))"
  fi
}

install_ohmyzsh() {
  if [ ! -d "$HOME/.oh-my-zsh" ]; then
    echo "✨ Installation de oh-my-zsh..."
    RUNZSH=no CHSH=no KEEP_ZSHRC=yes sh -c \
      "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
  else
    echo "✅ oh-my-zsh déjà installé."
  fi
}

install_zsh_plugins() {
  ZSH_CUSTOM=${ZSH_CUSTOM:-~/.oh-my-zsh/custom}

  echo "🧩 Installation des plugins oh-my-zsh..."
  mkdir -p "$ZSH_CUSTOM/plugins"

  if [ ! -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ]; then
    git clone https://github.com/zsh-users/zsh-autosuggestions "$ZSH_CUSTOM/plugins/zsh-autosuggestions"
  fi

  if [ ! -d "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting" ]; then
    git clone https://github.com/zsh-users/zsh-syntax-highlighting "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting"
  fi

  if [ ! -d "$ZSH_CUSTOM/plugins/zsh-completions" ]; then
    git clone https://github.com/zsh-users/zsh-completions "$ZSH_CUSTOM/plugins/zsh-completions"
  fi

  echo "✅ Plugins oh-my-zsh installés."
}

configure_zshrc() {
  echo "⚙️ Configuration du ~/.zshrc..."
  if ! grep -q "zsh-autosuggestions" ~/.zshrc; then
    sed -i.bak 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting zsh-completions)/' ~/.zshrc || true
    echo 'source $ZSH_CUSTOM/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh' >>~/.zshrc
    echo 'source $ZSH_CUSTOM/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh' >>~/.zshrc
    echo 'source $ZSH_CUSTOM/plugins/zsh-completions/zsh-completions.plugin.zsh' >>~/.zshrc
  fi
  echo "✅ ~/.zshrc configuré."
}

install_docker_mac() {
  if ! command_exists docker; then
    echo "🐳 Installation de Rancher Desktop (Docker)..."
    brew install --cask rancher
    echo "✅ Rancher Desktop installé. Démarre-le une première fois manuellement."
  else
    echo "✅ Docker déjà installé."
  fi
}

install_docker_linux() {
  if ! command_exists docker; then
    echo "🐳 Installation de Docker..."
    sudo apt-get update -y
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" |
      sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker "$USER"
    echo "✅ Docker installé. Déconnecte-toi/reconnecte-toi pour activer le groupe docker."
  else
    echo "✅ Docker déjà installé."
  fi
}

install_node() {
  if ! command_exists node; then
    echo "📦 Installation de Node.js (LTS) et npm..."
    if command_exists brew; then
      brew install node
    else
      curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
      sudo apt-get install -y nodejs
    fi
  else
    echo "✅ Node.js déjà installé ($(node -v))"
  fi
}

install_yarn() {
  if ! command_exists yarn; then
    echo "📦 Installation de Yarn..."
    npm install -g yarn
  else
    echo "✅ Yarn déjà installé ($(yarn -v))"
  fi
}

install_psql() {
  if ! command_exists psql; then
    echo "🐘 Installation du client PostgreSQL..."
    if command_exists brew; then
      brew install libpq
      brew link --force libpq
    else
      sudo apt-get install -y postgresql-client
    fi
  else
    echo "✅ psql déjà installé ($(psql --version))"
  fi
}

# =============================
# 🧰 INSTALLATION PRINCIPALE
# =============================

case "$OS" in
  "Darwin")
    echo "🧠 Système détecté : macOS"
    install_git
    install_zsh
    install_ohmyzsh
    install_zsh_plugins
    configure_zshrc
    install_docker_mac
    install_node
    install_yarn
    install_psql
    ;;
  "Linux")
    echo "🐧 Système détecté : Linux"
    sudo apt-get update -y
    install_git
    install_zsh
    install_ohmyzsh
    install_zsh_plugins
    configure_zshrc
    install_docker_linux
    install_node
    install_yarn
    install_psql
    ;;
  *)
    echo "⚠️ Système non pris en charge automatiquement. Installe manuellement : Docker, Node.js, npm, Yarn, psql, oh-my-zsh."
    ;;
esac

# =============================
# 🧩 FIN
# =============================

echo "✅ Tous les prérequis sont installés !"
echo "💡 Relance ton terminal ou exécute 'zsh' pour activer oh-my-zsh 🎉"

