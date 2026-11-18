# Alphashop - Angular corso completo

Applicazione Angular 8 sviluppata seguendo un corso: catalogo articoli con paginazione, modifica articolo, login con token JWT, route protette da guard, interceptor HTTP che aggiunge il token alle richieste e pagina di errore per le route inesistenti.

| Scheda | |
|---|---|
| **Stack** | Angular 8, TypeScript, Bootstrap 4, Font Awesome, @auth0/angular-jwt, ngx-pagination |
| **Node** | 12 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && npm start` → http://localhost:4200 |
| **Backend** | Servizi REST esterni non inclusi: articoli su `http://localhost:5051`, autenticazione JWT su `http://localhost:9100/auth`, saluti su `http://localhost:8050` (vedi `src/app/app.constant.ts` e `src/app/services/`) |
| **Stato** | In revisione |
| **Ultima verifica** | Non verificato di recente (progetto in revisione) |

## Struttura
- `src/app/articoli`, `editart`: elenco e modifica articoli
- `src/app/login`, `logout`, `welcome`: autenticazione e pagina di benvenuto
- `src/app/navbar`, `footer`, `jumbotron`: layout
- `src/app/error-routing`: pagina per le route non trovate
- `src/app/services`: autenticazione (`authapp`, `authtoken`), `auth-interceptor`, `route-guard`, servizi dati
- `prova/`: piccoli esempi TypeScript/JavaScript eseguibili a parte

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
