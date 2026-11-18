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

## Changelog

| Data | Descrizione |
|---|---|
| ≤ 2026-01-13 | Versione iniziale; storico precedente non ricostruito |
| 2026-11-11 | Spostato in `archived`; aggiunti `.nvmrc` e scheda README |


# &lt; AlNao /&gt;
Tutti i codici sorgente e le informazioni presenti in questo repository sono frutto di un attento e paziente lavoro di sviluppo da parte di AlNao, che si è impegnato a verificarne la correttezza nella misura massima possibile. Qualora parte del codice o dei contenuti sia stato tratto da fonti esterne, la relativa provenienza viene sempre citata, nel rispetto della trasparenza e della proprietà intellettuale. 


Alcuni contenuti e porzioni di codice presenti in questo repository sono stati realizzati anche grazie al supporto di strumenti di intelligenza artificiale, il cui contributo ha permesso di arricchire e velocizzare la produzione del materiale. Ogni informazione e frammento di codice è stato comunque attentamente verificato e validato, con l’obiettivo di garantire la massima qualità e affidabilità dei contenuti offerti. 


Per ulteriori dettagli, approfondimenti o richieste di chiarimento, si invita a consultare il sito [AlNao.it](https://www.alnao.it/).


## License
Made with ❤️ by [@alnao](https://github.com/alnao)
&bull; 
Public projects 
<a href="https://www.gnu.org/licenses/gpl-3.0"  valign="middle"> <img src="https://img.shields.io/badge/License-GPL%20v3-blue?style=plastic" alt="GPL v3" valign="middle" /></a>
*Free Software!*


Il software è distribuito secondo i termini della GNU General Public License v3.0. L'uso, la modifica e la ridistribuzione sono consentiti, a condizione che ogni copia o lavoro derivato sia rilasciato con la stessa licenza. Il contenuto è fornito "così com'è", senza alcuna garanzia, esplicita o implicita.


The software is distributed under the terms of the GNU General Public License v3.0. Use, modification, and redistribution are permitted, provided that any copy or derivative work is released under the same license. The content is provided "as is", without any warranty, express or implied.
