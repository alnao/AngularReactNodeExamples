# CLAUDE.md

Raccolta di esempi didattici di AlNao (Angular, React, Ionic, Next, Node, AWS/Azure, Copilot SDK). Licenza GPL v3. Documentazione e commenti sono in **italiano**.


## Hard rules (set by the repository owner)

- **Never run commands outside the workspace** `/mnt/Dati4/Workspace/AngularReactNodeExamples/`: no reading, writing or executing anything in other paths (the only exception is the session scratchpad provided by Claude Code for temporary files).
- **Cloud commands only after explicit confirmation**: before running `aws`, `az`, `cdk`, `sam`, `serverless` (and any other tool that acts on a cloud account, e.g. `gcloud`), show the exact command, say what it does (and whether it costs money or changes resources) and wait for the user's confirmation. Each command needs its own confirmation: a previous "yes" does not cover the next one. The same applies to running scripts or apps from this repo that call real cloud APIs through an SDK (boto3, Azure SDK), e.g. starting a Manager that queries AWS.
- **Never run git commands**, read-only ones included (`git status`, `git diff`, `git log`, ...). To know what changed, read the files; commits are made by the user.

## Struttura
- Ogni cartella di primo livello è un **progetto indipendente**, con il proprio `package.json` e `package-lock.json`. Non è un monorepo: nella radice non ci sono `package.json`, workspace o CI. I comandi `npm` vanno lanciati sempre dentro la cartella del progetto.
- Le eccezioni sono `NodeDbExamples`, che ha `package.json` anche in `0_inizio/` e `1_database/`, e `AngularBookExample/server-php`, un backend PHP.
- Nella radice ci sono `README.md` (indice dei progetti), `REACT.md` e `ANGULAR.md` (appunti tecnici) e `LICENSE`.
- I backend Java/Spring Boot citati nei README (per esempio Annotazioni, AWS SDK, South African Mobile Numbers) stanno in altri repository e non sono qui.

## Versione di Node
- Ogni progetto ha un `.nvmrc` con la versione major consigliata. Prima di `npm install`, `npm start` o `npm run build` eseguire `nvm use` nella cartella del progetto.
- La versione è ricavata dagli `engines` del framework nel lockfile, non è stata provata su tutti i progetti. I progetti vecchi richiedono Node vecchio:
  - Angular 8, 9, 11: Node 12. Angular 12 / Ionic 5: Node 14. Angular 14: Node 16.
  - Create React App 3-4: Node 16, perché webpack 4 fallisce con Node 17 o superiori (errore OpenSSL).
- Se la versione cambia, aggiornare insieme il `.nvmrc`, la riga **Node** della scheda del README del progetto e il `README.md` principale: la voce `Node.js X` nelle *Tecnologie* della tabella, oppure il suffisso `· Node X` nell'elenco "in fase di revisione".

## README dei progetti: scheda standard
Ogni `<Progetto>/README.md` inizia con il titolo H1, eventuali badge o una breve descrizione, e subito dopo questa tabella:

```markdown
| Scheda | |
|---|---|
| **Stack** | framework e librerie principali con versione major |
| **Node** | 22 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && npm start` → http://localhost:4200 |
| **Backend** | cosa serve per funzionare (nessuno, API pubblica, altro progetto/repo, servizio cloud) |
| **Stato** | Attivo · In revisione |
| **Ultima verifica** | Mese anno + cosa è stato verificato davvero |
```

- **Ultima verifica** riporta solo verifiche fatte davvero, per esempio "Novembre 2026: `npm ci` e avvio con Node 22". Se non c'è nessuna verifica recente: "Non verificato di recente (progetto in revisione)".
- I README nuovi o riscritti terminano con il footer breve che rimanda al README principale e alla licenza (vedi `ES6Example/README.md`).
- Un nuovo progetto va aggiunto anche al `README.md` principale: nella tabella *Table of examples* se è attivo (colonne Section, Name, Description; nella Description la riga "Tecnologie" include `Node.js X` come nel `.nvmrc`), altrimenti nell'elenco "Esempi in fase di revisione".

## Segreti e configurazione
- Mai credenziali nel codice o nei file versionati. Usare file `.env` (ignorati da `.gitignore`) con un `.env.example` versionato che contiene solo segnaposto. Esempi: `ReactAnnotazioni/.env.example`, `NodeRestOnMongo/.env.example`, `AngularBookExample/server-php/.env.example`.
- Nei progetti Vite le variabili esposte al client hanno il prefisso `VITE_` e si leggono con `import.meta.env`.
- Le credenziali `localhost` nei vecchi esempi Mongo (`NodeDbExamples`) sono di sviluppo locale. Le stringhe di produzione vanno in variabili d'ambiente (`MONGODB_URI`).
- Le URL di API Gateway nei vecchi progetti (`environment.ts`, `DataConstants.js`) sono endpoint di esempio, probabilmente non più attivi.

## Progetti di riferimento
- **ReactAnnotazioni**: React 19 + TypeScript + Vite 8 + Redux Toolkit, il modello per i progetti React moderni.
  - Comandi: `npm run dev` (porta 3000), `npm run build`, `npm run lint`, `npm run typecheck`, `npm test` (Vitest).
  - Hook tipizzati in `src/app/hooks.ts`, tipi condivisi in `src/types.ts`, URL del backend da `VITE_API_BASE_URL`.
- **ViteBase**: Vite 8 + React 19 + TypeScript + Tailwind 3 + React-Bootstrap. `npm run dev`, `npm run build`, `npm run lint`.
- **AngularBookExample/server-php**: API PHP + MySQL. La configurazione sta in `server-php/.env` (`DB_*`, `JWT_SECRET` di almeno 32 caratteri).
  - Le query usano prepared statement.
  - Le password sono salvate solo come hash (`password_hash` / `password_verify`).
  - Il JWT contiene solo `sub`, `iat`, `exp`.
  - Per verificare la sintassi: `php -l <file>`.

## Verifiche
- Non c'è CI e la maggior parte dei progetti non ha test reali: gli spec generati dalle CLI sono boilerplate.
- Dopo una modifica, verificare nel progetto con la versione di `.nvmrc`. A seconda di cosa offre il progetto: `npm ci`, `npm run build`, `npm run lint`, `npm test`.

## Git
- Branch principale `master`. I messaggi di commit sono in italiano, brevi e descrittivi.
- Non versionare `node_modules/`, `dist/`, `build/`, `.env`, file di swap degli editor (già in `.gitignore`).
