#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
ENV_FILE="$ROOT_DIR/env.local"

if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi

: "${DATABASE_CONNECTION_STRING:?Need to set DATABASE_CONNECTION_STRING in env.local or env}"

BACKUP_DIR="$ROOT_DIR/backups"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/db-backup-$(date +%Y%m%dT%H%M%S).dump"

echo "Creating DB backup to $BACKUP_FILE ..."
# pg_dump accepts a connection string via --dbname
pg_dump --format=custom --file="$BACKUP_FILE" --dbname="$DATABASE_CONNECTION_STRING"

echo "Backup created. Checking for duplicate active transactions..."

PSQL_CMD=(psql "$DATABASE_CONNECTION_STRING" -At -F '|' -c)

DUP_QUERY="SELECT product_id, count(*) FROM \"transaction\" WHERE status IN ('pending','processing','paid') GROUP BY product_id HAVING count(*) > 1;"

DUPLICATES=$(${PSQL_CMD[@]} "$DUP_QUERY")

CLEAN=false
if [ "${1-}" = "--clean" ]; then
  CLEAN=true
fi

if [ -n "$DUPLICATES" ]; then
  echo "Found products with multiple active transactions (product_id|count):"
  echo "$DUPLICATES"
  echo
  if [ "$CLEAN" = true ]; then
    echo "--clean provided: applying cleanup_duplicates.sql to expire older transactions"
    CLEANUP_SQL="$ROOT_DIR/prisma/migrations/20260605120000_add_transaction_rls/cleanup_duplicates.sql"
    if [ ! -f "$CLEANUP_SQL" ]; then
      echo "Cleanup SQL not found at $CLEANUP_SQL"
      exit 1
    fi
    psql "$DATABASE_CONNECTION_STRING" -f "$CLEANUP_SQL"
    echo "Cleanup executed. Re-checking duplicates..."
    DUPLICATES=$(${PSQL_CMD[@]} "$DUP_QUERY")
    if [ -n "$DUPLICATES" ]; then
      echo "Duplicates still present after cleanup. Aborting."
      exit 1
    fi
    echo "No duplicates remain. Proceeding."
  else
    echo "If you want to auto-clean duplicates (mark older ones as 'expired'), re-run this script with --clean."
    echo "Running migration without cleaning may fail due to unique partial index." 
    echo "Aborting."
    exit 1
  fi
fi

MIGRATION_SQL="$ROOT_DIR/prisma/migrations/20260605120000_add_transaction_rls/migration.sql"
if [ ! -f "$MIGRATION_SQL" ]; then
  echo "Migration SQL not found at $MIGRATION_SQL"
  exit 1
fi

echo "Applying migration SQL..."
psql "$DATABASE_CONNECTION_STRING" -f "$MIGRATION_SQL"

echo "Migration applied. Verifying policies and index..."

psql "$DATABASE_CONNECTION_STRING" -c "\d POLICY transaction_select_policy" || true
psql "$DATABASE_CONNECTION_STRING" -c "SELECT indexname, indexdef FROM pg_indexes WHERE tablename='transaction' AND indexname='unique_active_transaction_per_product';" || true

echo "Done."
