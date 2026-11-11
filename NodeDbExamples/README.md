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
