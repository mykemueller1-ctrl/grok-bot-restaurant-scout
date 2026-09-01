#!/usr/bin/env bash
# Wave 1 pain-shopper agents — import these first in Grok Bot desktop.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
node -e "
const w = require('$ROOT/stack/wiring.json');
console.log('# Never86 Pain Shopper — Wave 1 import list');
console.log('# Plugins on each: complaint-sources, lead-shop, approvals, social-trends');
console.log('');
w.import_waves.wave_1.forEach((f, i) => console.log((i+1) + '. ' + f));
"
