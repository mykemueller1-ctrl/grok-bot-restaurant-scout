#!/usr/bin/env bash
# Ship / restart Never86 secure venue portals locally.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${PORTAL_SESSION_SECRET:-}" ]]; then
  export PORTAL_SESSION_SECRET="$(openssl rand -base64 48)"
  echo "Generated PORTAL_SESSION_SECRET for this session (not printed)."
fi

python3 scripts/validate-portal-isolation.py
( cd services/portal-gateway && npm test )

PORT="${PORT:-5174}"
# Stop prior listener if any
if command -v fuser >/dev/null 2>&1; then
  fuser -k "${PORT}/tcp" 2>/dev/null || true
fi
pkill -f 'services/portal-gateway/src/server.mjs' 2>/dev/null || true
sleep 0.4

nohup node services/portal-gateway/src/server.mjs > /tmp/never86-portal-gateway.log 2>&1 &
sleep 0.8
curl -sf "http://127.0.0.1:${PORT}/healthz" >/dev/null

cat <<EOF
Portal gateway is up.

  Directory:  http://127.0.0.1:${PORT}/
  Community:  http://127.0.0.1:${PORT}/community-pizza/login.html
  Logins:     docs/CTAP-PORTAL-LOGINS.md
  Security:   docs/PORTAL-SECURITY.md
EOF
