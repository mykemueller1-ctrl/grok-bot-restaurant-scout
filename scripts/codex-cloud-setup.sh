#!/usr/bin/env bash
# Codex Cloud / CI setup script — install deps the agent needs before work starts.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Never86 Codex setup"

if command -v node >/dev/null 2>&1; then
  echo "Node $(node -v)"
  if [[ -f services/pain-leads-api/package-lock.json ]]; then
    (cd services/pain-leads-api && npm ci --ignore-scripts)
  fi
else
  echo "warn: node not found; skip API install"
fi

if command -v python3 >/dev/null 2>&1; then
  python3 -c "import json; print('swarm agents:', json.load(open('agent/pain-shoppers/family.json'))['agent_count'])"
else
  echo "warn: python3 not found"
fi

# Materialize MCP resolve output when secrets are present (setup-phase only in Codex Cloud).
if [[ -n "${MCP_API_TOKEN:-}" || -n "${NEVER86_API_URL:-}" ]]; then
  node scripts/resolve-mcp-config.mjs || true
fi

echo "==> Setup complete"
echo "Next (human, once): connect Codex → GitHub for this repo — see docs/CODEX-CLOUD.md"
