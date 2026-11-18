// Avvia la Angular CLI del progetto passando gli stessi argomenti (es. `node scripts/ng.js serve`).
// Angular 9 usa webpack 4, che con Node 17 o superiori fallisce con l'errore OpenSSL
// ERR_OSSL_EVP_UNSUPPORTED: in quel caso si aggiunge --openssl-legacy-provider.
// Con Node 12-16 l'opzione non esiste (e bloccherebbe l'avvio), quindi non si aggiunge.
// Scritto in JavaScript compatibile con Node 12.
const { spawnSync } = require('child_process');

const major = Number(process.versions.node.split('.')[0]);
const env = Object.assign({}, process.env);
const nodeOptions = env.NODE_OPTIONS || '';
if (major >= 17 && nodeOptions.indexOf('--openssl-legacy-provider') === -1) {
  env.NODE_OPTIONS = (nodeOptions + ' --openssl-legacy-provider').trim();
}
env.NG_CLI_ANALYTICS = env.NG_CLI_ANALYTICS || 'false';

const ngBin = require.resolve('@angular/cli/bin/ng');
const result = spawnSync(process.execPath, [ngBin].concat(process.argv.slice(2)), { stdio: 'inherit', env: env });
process.exit(result.status === null ? 1 : result.status);
