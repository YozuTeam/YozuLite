#!/usr/bin/env bash
set -euo pipefail

NC="\033[0m"; B="\033[1m"; G="\033[32m"; Y="\033[33m"; R="\033[31m"; C="\033[36m"

APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
POSTGRES_CONTAINER="yozu-postgres"
POSTGRES_USER="yozu_user"
POSTGRES_DB="yozu_db"

cd "$APP_ROOT"

echo -e "${C}${B}▶ Cleaning database${NC}"

if npx --yes prisma --version >/dev/null 2>&1; then
  echo -e "${G}Using Prisma reset (this will drop and re-apply migrations)${NC}"
  npx prisma migrate reset --force --skip-seed
else
  echo -e "${Y}Prisma CLI not found. Falling back to TRUNCATE via psql.${NC}"
  # Ajuste la liste des tables si tu en ajoutes
  SQL='TRUNCATE TABLE "CompanyProfile","StudentProfile","User" RESTART IDENTITY CASCADE;'
  docker exec -i "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -c "$SQL"
fi

echo -e "${C}${B}✔ DB cleaned.${NC}"
