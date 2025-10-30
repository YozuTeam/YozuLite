#!/usr/bin/env bash
set -euo pipefail

NC="\033[0m"; B="\033[1m"; G="\033[32m"; Y="\033[33m"; R="\033[31m"; C="\033[36m"

APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCKER_COMPOSE_CMD="docker compose"
NUKE=0

cd "$APP_ROOT"

if ! docker compose version >/dev/null 2>&1; then
  if command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
  else
    echo -e "${R}Neither 'docker compose' nor 'docker-compose' is available.${NC}"
    exit 1
  fi
fi

if [[ "${1:-}" == "--nuke" ]]; then
  NUKE=1
fi

echo -e "${C}${B}▶ Stopping docker services${NC}"
if (( NUKE == 1 )); then
  echo -e "${R}${B}Removing containers, networks and VOLUMES (-v) ... (this deletes DB data)${NC}"
  $DOCKER_COMPOSE_CMD down -v --remove-orphans
else
  echo -e "${G}Removing containers and networks (volumes kept)${NC}"
  $DOCKER_COMPOSE_CMD down --remove-orphans
fi

echo -e "${C}${B}✔ Docker services stopped.${NC}"
