#!/usr/bin/env bash
set -euo pipefail

# Quick register LP positions to local dev server
# Usage:
#   bash scripts/register_positions_local.sh
# Env:
#   API (default: http://localhost:3001/api/positions)

API="${API:-http://localhost:3001/api/positions}"

echo "== Posting positions to: $API"

# Discover LPs under products/2-validation/*/lp
mapfile -t LP_DIRS < <(find products/2-validation -maxdepth 2 -type d -name lp -print | sort)

if [ ${#LP_DIRS[@]} -eq 0 ]; then
  echo "No LP directories found under products/2-validation" >&2
  exit 1
fi

for lp in "${LP_DIRS[@]}"; do
  parent="$(dirname "$lp")"
  base="$(basename "$parent")"
  # slug after first two hyphens: YYYY-MM-NNN-<slug>
  slug="${base#*-}"
  slug="${slug#*-}"
  id="$slug"
  name=$(echo "$slug" | tr '[:lower:]' '[:upper:]')
  url="https://$slug.unson.jp"

  payload=$(jq -n \
    --arg id "$id" \
    --arg name "$name" \
    --arg lpUrl "$url" \
    '{id: $id, name: $name, lpUrl: $lpUrl, status: "active", targetCvr: 5, targetCpa: 2000, minSessions: 100}')

  echo "-- Registering $id ($url)"
  curl -fsS -X POST "$API" \
    -H 'Content-Type: application/json' \
    -d "$payload" >/dev/null || {
      echo "  !! Failed to register $id" >&2
    }
done

echo "Done."

