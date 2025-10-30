#!/bin/bash

processid=$$

function no_ctrlc()
{
    kill -3 $processid
    exit
}

trap no_ctrlc SIGINT

pretty_print() {
  printf "\n%b\n" "$1"
}
pretty_print "Installation du poste..."

# Installer brew
if ! command -v brew &>/dev/null; then
  pretty_print "Installation d'Homebrew"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  export PATH="/opt/homebrew/bin:$PATH"
  pretty_print "Brew installed ✔ "
fi

# Installer Oh My Zsh
if ! [ -d ~/.oh-my-zsh ]; then
  pretty_print "Il vaut mieux installer Oh My Zsh, après l'installation redémarrer le script"
  /bin/bash -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
  pretty_print "Oh My Zsh installed ✔ "
  exit 1
fi

if ! grep -q -m 1 'PATH="/opt/homebrew/bin' ~/.zshrc; then
  printf '\n# Recommended by brew doctor\n' >> ~/.zshrc
  printf 'export PATH="/opt/homebrew/bin:$PATH"\n' >> ~/.zshrc
fi

# Installer les logiciels
(brew list --cask rancher &>/dev/null || brew install --force --cask rancher) && pretty_print "rancher installed ✔ "
(brew list postico &>/dev/null || brew install --force postico) && pretty_print "postico installed ✔ "
(brew list pritunl &>/dev/null || brew install --force pritunl) && pretty_print "pritunl installed ✔ "
(brew list iterm2 &>/dev/null || brew install --force iterm2) && pretty_print "iterm2 installed ✔ "
(brew list google-chrome &>/dev/null || brew install --force google-chrome) && pretty_print "Chrome installed ✔ "
(brew list firefox &>/dev/null || brew install --force firefox) && pretty_print "Firefox installed ✔ "
(brew list figma &>/dev/null || brew install --force figma) && pretty_print "figma installed ✔ "
(brew list the-unarchiver &>/dev/null || brew install --force the-unarchiver) && pretty_print "the-unarchiver installed ✔ "
(brew list redisinsight &>/dev/null || brew install --force redisinsight) && pretty_print "RedisInsight installed ✔ "

pretty_print "Installation de l'IDE (Cursor / WebStorm / VSCode)"
if ! brew list cursor &>/dev/null; then
  read -p "Installer Cursor (y/n) [RECOMMENDED]? " -n 1 -r
  echo    # (optional) move to a new line
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    brew install --force cursor && pretty_print "Cursor installed ✔ "
  fi
fi
if ! brew list webstorm &>/dev/null; then
  read -p "Installer Webstorm (y/n)? " -n 1 -r
  echo    # (optional) move to a new line
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    brew install --force webstorm && pretty_print "Webstorm installed ✔ "
  fi
fi
if ! brew list visual-studio-code &>/dev/null; then
  read -p "Installer VSCode (y/n)? " -n 1 -r
  echo    # (optional) move to a new line
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    brew install --force visual-studio-code && pretty_print "VSCode installed ✔ "
  fi
fi

# Installer les utilitaires
(brew list redis &>/dev/null || brew install --force redis) && pretty_print "redis installed ✔ "
(brew list openssl &>/dev/null ||brew install --force openssl) && pretty_print "openssl installed ✔ "
(brew list wget &>/dev/null || brew install --force wget) && pretty_print "wget installed ✔ "
(brew list htop &>/dev/null ||brew install --force htop) && pretty_print "htop installed ✔ "
(brew list azure-cli &>/dev/null ||brew install --force azure-cli) && pretty_print "azure-cli installed ✔ "
(brew list jq &>/dev/null || brew install --force jq) && pretty_print "jq installed ✔ "
(brew list libpq &>/dev/null || brew install --force libpq || brew link --force libpq) && pretty_print "libpq installed ✔ "
(brew list fzf &>/dev/null || brew install --force fzf || brew link --force fzf) && pretty_print "fzf installed ✔ "
(brew list hashicorp/tap/vault &>/dev/null || (brew tap hashicorp/tap && brew install --force hashicorp/tap/vault) || brew link --force hashicorp/tap/vault) && pretty_print "vault installed ✔ "

# Alias DB
if ! grep -q -m 1 'db-save' ~/.zshrc; then
  echo 'alias db-save="dropdb --if-exist -U postgres -h localhost -p 5432 wellinjob-dump && createdb -U postgres -h localhost -p 5432 wellinjob-dump -T wellinjob"' >> ~/.zshrc
fi
if ! grep -q -m 1 'db-restore' ~/.zshrc; then
  echo 'alias db-restore="dropdb --if-exist -U postgres -h localhost -p 5432 wellinjob && createdb -U postgres -h localhost -p 5432 wellinjob -T wellinjob-dump"' >> ~/.zshrc
fi
if ! grep -q -m 1 'db-local-to-e2e' ~/.zshrc; then
  echo 'alias db-local-to-e2e="dropdb --if-exist -U postgres -h localhost -p 5434 wellinjob && dropdb --if-exists -U postgres -h localhost -p 5434 wellinjob-e2e  && createdb -U postgres -h localhost -p 5434 wellinjob && pg_dump -C -h localhost -p 5432 -U postgres wellinjob -f wellinjob.dump && psql -h localhost -p 5434 -U postgres -f wellinjob.dump && createdb -U postgres -h localhost -p 5434 wellinjob-e2e -T wellinjob && rm -f wellinjob.dump"' >> ~/.zshrc
fi
if ! grep -q -m 1 'db-save-e2e' ~/.zshrc; then
  echo 'alias db-save-e2e="dropdb --if-exist -U postgres -h localhost -p 5434 wellinjob-dump-e2e && createdb -U postgres -h localhost -p 5434 wellinjob-dump-e2e -T wellinjob-e2e"' >> ~/.zshrc
fi
if ! grep -q -m 1 'db-restore-e2e' ~/.zshrc; then
  echo 'alias db-restore-e2e="dropdb --if-exist -U postgres -h localhost -p 5434 wellinjob-e2e && createdb -U postgres -h localhost -p 5434 wellinjob-e2e -T wellinjob-dump-e2e"\n' >> ~/.zshrc
fi
pretty_print "db aliases installed ✔ "

if ! grep -q -m 1 'ipv4first' ~/.zshrc; then
  echo 'export NODE_OPTIONS=--dns-result-order=ipv4first' >> ~/.zshrc
fi
pretty_print "NODEOPTIONS ipv4first installed ✔ "

# NVM
if ! brew list nvm &>/dev/null; then
  brew install --force nvm
  if ! grep -q -m 1 'NVM_DIR' ~/.zshrc; then
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
  fi
  if ! grep -q -m 1 'brew --prefix nvm' ~/.zshrc; then
    echo '. $(brew --prefix nvm)/nvm.sh' >> ~/.zshrc
    . $(brew --prefix nvm)/nvm.sh
  fi
  nvm install v18.15
  nvm alias default v18.15

  cat ./templates/.zshrc.tmpl >> ~/.zshrc
  source ~/.zshrc
fi
pretty_print "nvm installed ✔ "

# Git setup
flag_git_config_moved=false
flag_git_message_moved=false
timestamp=$(date +%s)
if [ -f ~/.gitmessage ]; then
  flag_git_message_moved=true
  mv ~/.gitmessage ~/.gitmessage-$timestamp.old
fi
echo '[Fix: X| Feat | Tech | Other](Integration | MDE | SRE | Previsite | Employer | Health | Convoc | Tooling | Other) <Subject>' > ~/.gitmessage


if [ -f ~/.gitconfig ]; then
  flag_git_config_moved=true
  mv ~/.gitconfig ~/.gitconfig-$timestamp.old
fi
echo '[commit]' >> ~/.gitconfig
echo '	template = ~/.gitmessage' >> ~/.gitconfig
echo '[fetch]' >> ~/.gitconfig
echo '	prune = true' >> ~/.gitconfig
echo '[push]' >> ~/.gitconfig
echo '	default = simple' >> ~/.gitconfig
echo '[pull]' >> ~/.gitconfig
echo '	rebase = true' >> ~/.gitconfig
echo '[branch]' >> ~/.gitconfig
echo '	autosetuprebase = always' >> ~/.gitconfig
echo '[alias]' >> ~/.gitconfig
echo '	sinit = submodule init' >> ~/.gitconfig
echo '	sreset = "!f() { \
                    git submodule foreach --recursive git reset --hard && git submodule update --init --recursive; \
                  }; f"' >> ~/.gitconfig
echo '	please = push --force-with-lease' >> ~/.gitconfig
echo '	tree = log --pretty=format:"%C(Yellow)%h%Creset -%C(auto)%d%C(reset) %s%x09 %C(magenta blink bold)<%an>%Creset %C(blue)(%cr)%Creset %C(blue dim)%ad%Creset" --graph --all' >> ~/.gitconfig

# Config git
pretty_print "Let's set your git username & email. Please enter your github username :"
read gitusername
git config --global user.name "$gitusername"
pretty_print "Now your github email :"
read gitemail
git config --global user.email $gitemail
pretty_print "Git configured"

# Logiciels / utilitaires optionnels
read -p "Installations optionnelles (y/n)? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]; then
  read -p "Install Cocadmin fast dock (Accélère la disparition du dock si l'option Masquer/afficher le dock est activé) (y/n)? " -n 1 -r
  echo    # (optional) move to a new line
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    `defaults write com.apple.dock autohide-delay -float 0`
    `defaults write com.apple.dock autohide-time-modifier -float 0.4; killall Dock`
  fi
  if ! brew list stats &>/dev/null; then
    read -p "Install Stats (https://github.com/exelban/stats) (y/n)? " -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      brew install --force stats
    fi
  fi
  if ! brew list copyq &>/dev/null; then
    read -p "Install CopyQ (gestionnaire de presse papier) (y/n)? " -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      brew install --force copyq
    fi
  fi
  if ! brew list devtoys &>/dev/null; then
    read -p "Install Devtoys (pleiiin d'outils de devs !) (y/n)? " -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      brew install --force devtoys
    fi
  fi
fi


if [ $flag_git_config_moved == true ]; then
  pretty_print "\033[33mExisting git config moved to ~/.gitconfig-$timestamp.old\033[0m"
fi
if [ $flag_git_message_moved == true ]; then
  pretty_print "\033[33mExisting git message moved to ~/.gitmessage-$timestamp.old\033[0m"
fi

# Must stay at the end: this ensures libpq binaries take precedence over postgres if installed
last_path_line=$(grep '^[[:space:]]*export PATH=' ~/.zshrc | tail -n 1)
target_line='export PATH="/opt/homebrew/opt/libpq/bin:$PATH"'

if [ "$last_path_line" != "$target_line" ]; then
  if grep -qF "$target_line" ~/.zshrc; then
    sed -i '' "\|$target_line|d" ~/.zshrc
  fi
  printf '\n# Must stay at the end: this ensures libpq binaries take precedence over postgres if installed\n' >> ~/.zshrc
  printf 'export PATH="/opt/homebrew/opt/libpq/bin:$PATH"\n' >> ~/.zshrc
fi

pretty_print "Installation terminée ! ✨"
