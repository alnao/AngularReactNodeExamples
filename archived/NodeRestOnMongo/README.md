# Node REST on Mongo

Espone un'API REST generica sopra MongoDB senza scrivere codice, usando il pacchetto [rest-on-mongo](https://www.npmjs.com/package/rest-on-mongo).

| Scheda | |
|---|---|
| **Stack** | Node.js, rest-on-mongo 2, MongoDB |
| **Node** | 22 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && cp .env.example .env && ./runRestOnMongo.sh` → http://localhost:3000 |
| **Backend** | MongoDB: stringhe di connessione `SERVER_*` nel file `.env` |
| **Stato** | In revisione |
| **Ultima verifica** | Novembre 2026: `npm ci` con Node 22 (avvio non provato: serve MongoDB) |

## Configurazione
`rest-on-mongo` legge il file `.env` (con dotenv) dalla cartella da cui viene avviato. Partire da [`.env.example`](./.env.example):
- `PORT`: porta HTTP
- `PREFIXES`: elenco di prefissi separati da virgola; per ognuno vengono esposte le rotte `/<prefisso>/<collection>` e `/<prefisso>/<collection>/<id>`
- `SERVER_<prefisso>` e `DB_<prefisso>`: server MongoDB e database usati da quel prefisso
- `AUTH_TOKEN` (facoltativo): se presente, le richieste devono includere questo token

Il file `.env` contiene credenziali e non va committato.

---
Parte della raccolta [AngularReactNodeExamples](../README.md) di [AlNao](https://www.alnao.it) · Licenza [GPL v3](../LICENSE)

## Changelog

| Data | Descrizione |
|---|---|
| ≤ 2026-01-13 | Versione iniziale; storico precedente non ricostruito |
| 2026-11-11 | Spostato in `archived`; aggiunti `.env.example`, `.nvmrc`, scheda |


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
