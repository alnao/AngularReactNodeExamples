# ES6 Example

Piccoli script per provare la sintassi ES6+ (template literal, parametri di default, destrutturazione, composizione di funzioni), eseguiti con Babel.

| Scheda | |
|---|---|
| **Stack** | Node.js, Babel 7 (`@babel/node`, `@babel/preset-env`) |
| **Node** | 22 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && npx babel-node index.js` |
| **Backend** | Nessuno |
| **Stato** | In revisione |
| **Ultima verifica** | Novembre 2026: `npm ci` ed esecuzione di `index.js` e `comp.js` con Node 22 |

## File
- `index.js`: template literal e parametri di default
- `comp.js`: funzioni che compongono un oggetto (link e avatar di un profilo)
- `des.js`: destrutturazione con valori di default (esempi commentati: togliere il commento per provarli)
- `.babelrc`: configurazione di Babel con `@babel/preset-env`

Per vedere il codice trasformato da Babel: `npx babel index.js`

---
Parte della raccolta [AngularReactNodeExamples](../README.md) di [AlNao](https://www.alnao.it) · Licenza [GPL v3](../LICENSE)
