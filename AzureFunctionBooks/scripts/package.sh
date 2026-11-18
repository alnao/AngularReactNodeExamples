#!/usr/bin/env bash
# Prepara in .deploy/ il pacchetto da pubblicare su Azure:
# JavaScript compilato (dist/), host.json e solo le dipendenze di produzione.
# Così il pacchetto è piccolo e non dipende da una build remota su Azure.
# Non contatta Azure: scarica solo i pacchetti npm.
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build

rm -rf .deploy
mkdir .deploy
cp -r dist host.json package-lock.json .deploy/

# package.json senza "scripts": su Azure non deve partire nessuna build
node -e "
const p = require('./package.json');
delete p.scripts;
require('fs').writeFileSync('.deploy/package.json', JSON.stringify(p, null, 2));
"

(cd .deploy && npm ci --omit=dev --ignore-scripts --no-audit --no-fund)

# Serve solo a func per riconoscere il linguaggio; func non lo pubblica
echo '{ "IsEncrypted": false, "Values": { "FUNCTIONS_WORKER_RUNTIME": "node" } }' > .deploy/local.settings.json

echo "Pacchetto pronto in .deploy/ ($(du -sh .deploy | cut -f1))"
