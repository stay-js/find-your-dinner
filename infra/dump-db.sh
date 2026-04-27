#!/bin/sh
set -e

. "$(pwd)/.env"

DUMP_DIR="dump"

mkdir -p "$DUMP_DIR"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%SZ")
OUT="$DUMP_DIR/dump-$TIMESTAMP.sql"

echo "⏳ Dumping database to $OUT..."
docker compose exec postgres \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$OUT"
echo "✅ Done."
