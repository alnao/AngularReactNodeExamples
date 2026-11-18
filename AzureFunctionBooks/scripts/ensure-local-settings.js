// Crea local.settings.json (ignorato da git) copiando local.settings.example.json, se manca.
// func start lo legge per le variabili d'ambiente e per il CORS locale.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const target = path.join(root, 'local.settings.json');
if (fs.existsSync(target)) {
  console.log('local.settings.json già presente');
} else {
  fs.copyFileSync(path.join(root, 'local.settings.example.json'), target);
  console.log('Creato local.settings.json da local.settings.example.json');
}
