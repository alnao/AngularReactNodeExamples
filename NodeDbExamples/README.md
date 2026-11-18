# Node DB Examples

Esempi Node.js con MongoDB. L'app principale è un'applicazione Express + Handlebars per gestire note personali, con registrazione e login (Passport, password cifrate con bcrypt, sessioni e messaggi flash). Le sottocartelle contengono esercizi introduttivi.

| Scheda | |
|---|---|
| **Stack** | Node.js, Express 4, express-handlebars, Mongoose 4, Passport, driver MongoDB 3 |
| **Node** | 12 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && npm start` → http://localhost:4200 |
| **Backend** | MongoDB locale su `localhost:27017`, database `collectiondemo` (stringa di connessione in `app.js`); con `NODE_ENV=production` la stringa si passa nella variabile `MONGODB_URI` |
| **Stato** | In revisione |
| **Ultima verifica** | Non verificato di recente (progetto in revisione) |

## Struttura
- `app.js`: app delle note (lista, nuova, modifica, cancella, login, registrazione)
- `models/`: schemi Mongoose `note` e `utenti`
- `views/`: template Handlebars
- `passport.js`, `accesso_privato.js`: strategia di login e middleware per le pagine protette
- `0_inizio/`: primi esempi con Mongoose (schema e ricerca di un libro)
- `1_database/`: esempi di Node di base (`os`, `fs`, `process`, `command-line-args`) e driver MongoDB nativo (`serverDb.js`)

Le sottocartelle hanno un proprio `package.json`: eseguire `npm install` anche al loro interno.

---
Parte della raccolta [AngularReactNodeExamples](../README.md) di [AlNao](https://www.alnao.it) · Licenza [GPL v3](../LICENSE)

## Changelog

| Data | Descrizione |
|---|---|
| ≤ 2026-01-13 | Versione iniziale; storico precedente non ricostruito |
| 2026-11-11 | Aggiornato `app.js`; aggiunti `.nvmrc` e scheda README |


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
