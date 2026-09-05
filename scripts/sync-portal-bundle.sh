#!/usr/bin/env bash
# Copy fixtures/portals → services/portal-gateway/portals for self-contained deploys.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/fixtures/portals"
DEST="$ROOT/services/portal-gateway/portals"
mkdir -p "$DEST"
rm -rf "$DEST"
cp -a "$SRC" "$DEST"
echo "Synced portal pack → services/portal-gateway/portals ($(find "$DEST" -type f | wc -l) files)"
