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
