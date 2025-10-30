#!/usr/bin/env bash
set -euo pipefail

# ===== Colors =====
NC="\033[0m"
B="\033[1m"
G="\033[32m"
Y="\033[33m"
R="\033[31m"
C="\033[36m"

# ===== Config (adapt if needed) =====
APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SEED_SCRIPT_REL="scripts/seed.ts"
POSTGRES_CONTAINER="yozu-postgres"
POSTGRES_USER="yozu_user"
POSTGRES_DB="yozu_db"
DOCKER_COMPOSE_CMD="docker compose" # fallback handled below

cd "$APP_ROOT"

echo -e "${C}${B}▶ Setup started${NC}"

# ---- Check commands
need() { command -v "$1" >/dev/null 2>&1 || { echo -e "${R}Missing: $1${NC}"; exit 1; }; }

need docker
need npm
need npx

if ! docker compose version >/dev/null 2>&1; then
  if command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
  else
    echo -e "${R}Neither 'docker compose' nor 'docker-compose' is available.${NC}"
    exit 1
  fi
fi

# ---- Install deps
if [[ -f package-lock.json ]]; then
  echo -e "${G}npm ci${NC}"
  npm ci
else
  echo -e "${G}npm install${NC}"
  npm install
fi

# ---- Docker up
echo -e "${G}${B}Starting Docker services...${NC}"
$DOCKER_COMPOSE_CMD up -d

# ---- Wait for postgres healthy
echo -e "${G}Waiting for Postgres ($POSTGRES_CONTAINER) to be healthy...${NC}"
MAX_WAIT=120
SLEEP=3
ELAPSED=0

is_healthy() {
  local status
  status="$(docker inspect -f '{{.State.Health.Status}}' "$POSTGRES_CONTAINER" 2>/dev/null || echo "unknown")"
  [[ "$status" == "healthy" ]]
}

until is_healthy; do
  if (( ELAPSED >= MAX_WAIT )); then
    echo -e "${R}Timeout waiting for Postgres healthcheck.${NC}"
    docker logs "$POSTGRES_CONTAINER" || true
    exit 1
  fi
  echo -e "${Y}...still waiting (${ELAPSED}s)${NC}"
  sleep "$SLEEP"
  ELAPSED=$((ELAPSED + SLEEP))
done
echo -e "${G}Postgres is healthy.${NC}"

# ---- Prisma generate + migrate
if npx --yes prisma --version >/dev/null 2>&1; then
  echo -e "${G}npx prisma generate${NC}"
  npx prisma generate

  # apply migrations if any (no prompts)
  echo -e "${G}npx prisma migrate deploy${NC}"
  npx prisma migrate deploy
else
  echo -e "${Y}Prisma CLI not found. Skipping generate/migrate.${NC}"
fi

# ---- Seed
if [[ -f "$SEED_SCRIPT_REL" ]]; then
  echo -e "${G}${B}Seeding database...${NC}"
  npx ts-node "$SEED_SCRIPT_REL"
else
  echo -e "${Y}Seed script not found at ${SEED_SCRIPT_REL}. Skipping seeding.${NC}"
fi

echo -e "${C}${B}✔ Setup completed successfully.${NC}"
