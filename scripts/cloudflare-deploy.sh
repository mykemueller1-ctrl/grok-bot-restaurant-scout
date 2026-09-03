#!/usr/bin/env bash
# Deploy Never86 pain-leads API to Cloudflare Workers + D1.
# Requires: CLOUDFLARE_API_TOKEN (and optional CLOUDFLARE_ACCOUNT_ID)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API="$ROOT/services/pain-leads-api"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-722e0fcc05092bb2333396735d644d44}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "ERROR: Set CLOUDFLARE_API_TOKEN (fresh token from dash.cloudflare.com — do not reuse a screenshot token)."
  echo "Needed permissions: Account → Workers Scripts (Edit), Account → D1 (Edit), User → User Details (Read) optional."
  exit 1
fi

export CLOUDFLARE_API_TOKEN
export CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID"

cd "$API"

echo "==> Verifying Cloudflare token"
VERIFY=$(curl -sS -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" https://api.cloudflare.com/client/v4/user/tokens/verify)
echo "$VERIFY" | python3 -c "import json,sys;d=json.load(sys.stdin);assert d.get('success'), d; print('token ok:', d['result']['status'])"

echo "==> Ensuring D1 database never86-pain-leads"
DB_LIST=$(npx --yes wrangler d1 list --json 2>/dev/null || npx --yes wrangler d1 list)
DB_ID=$(python3 - <<'PY' "$DB_LIST"
import json,sys,re
raw=sys.argv[1]
try:
  data=json.loads(raw)
  rows=data if isinstance(data,list) else data.get('result') or data.get('databases') or []
except Exception:
  rows=[]
  for m in re.finditer(r'never86-pain-leads\s+([0-9a-f-]{36})', raw, re.I):
    print(m.group(1)); raise SystemExit
for r in rows:
  name=r.get('name') or r.get('database_name')
  if name=='never86-pain-leads':
    print(r.get('uuid') or r.get('id') or r.get('database_id') or '')
    break
PY
)

if [[ -z "${DB_ID}" ]]; then
  echo "Creating D1 database..."
  CREATE_OUT=$(npx --yes wrangler d1 create never86-pain-leads 2>&1)
  echo "$CREATE_OUT"
  DB_ID=$(echo "$CREATE_OUT" | python3 -c "import sys,re; t=sys.stdin.read(); m=re.search(r'database_id\s*=\s*\"([0-9a-f-]{36})\"', t) or re.search(r'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})', t); print(m.group(1) if m else '')")
fi

if [[ -z "${DB_ID}" ]]; then
  echo "ERROR: could not resolve D1 database_id"
  exit 1
fi

echo "D1 database_id=$DB_ID"
DB_ID="$DB_ID" python3 - <<'PY'
from pathlib import Path
import os, re
p = Path("wrangler.toml")
db_id = os.environ["DB_ID"]
text = p.read_text()
text2 = re.sub(r'database_id = ".*"', f'database_id = "{db_id}"', text, count=1)
p.write_text(text2)
print("updated wrangler.toml")
PY

echo "==> Apply D1 migrations (remote)"
npx --yes wrangler d1 migrations apply never86-pain-leads --remote

if [[ -z "${MCP_API_TOKEN:-}" ]]; then
  MCP_API_TOKEN=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
  echo "Generated MCP_API_TOKEN (store in GitHub/Codex secrets)"
fi

echo "==> Set Worker secret MCP_API_TOKEN"
printf '%s' "$MCP_API_TOKEN" | npx --yes wrangler secret put MCP_API_TOKEN

echo "==> Deploy Worker"
DEPLOY_OUT=$(npx --yes wrangler deploy 2>&1)
echo "$DEPLOY_OUT"

URL=$(echo "$DEPLOY_OUT" | python3 -c "import sys,re; t=sys.stdin.read(); m=re.search(r'https://[a-zA-Z0-9._-]+\.workers\.dev', t); print(m.group(0) if m else '')")
if [[ -z "$URL" ]]; then
  URL="https://never86-pain-leads-api.workers.dev"
fi

mkdir -p "$ROOT/stack"
python3 - <<PY
import json, os
from pathlib import Path
root = Path("$ROOT")
url = "$URL".rstrip("/")
token = """$MCP_API_TOKEN"""
out = {
  "host": "cloudflare",
  "NEVER86_API_URL": url,
  "MCP_API_TOKEN": token,
  "health": f"{url}/health",
  "CLOUDFLARE_ACCOUNT_ID": "$ACCOUNT_ID",
  "D1_DATABASE_ID": "$DB_ID",
  "grok_bot_secrets": {
    "COMMERCE_ENGINE_URL": url,
    "COMMERCE_ENGINE_TOKEN": token,
    "LEAD_SHOP_TOKEN": token,
    "COMPLAINT_SOURCES_TOKEN": token,
    "APPROVALS_TOKEN": token,
    "OWNER_EMAIL": "ops@never86.ai",
  },
}
(root / "stack" / "cloudflare-deployed.json").write_text(json.dumps(out, indent=2) + "\n")
print("Wrote stack/cloudflare-deployed.json")
print("API:", url)
print("Health:", f"{url}/health")
PY

# Smoke health (may need a few seconds)
sleep 2
curl -sS "$URL/health" || true
echo
echo "DONE — Cloudflare Worker deployed."
