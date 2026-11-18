# CLAUDE.md

Raccolta di esempi didattici di AlNao (Angular, React, Ionic, Next, Node, AWS/Azure, Copilot SDK). Licenza GPL v3. Documentazione e commenti sono in **italiano**.


## Hard rules (set by the repository owner)

- **Never run commands outside the workspace** `/mnt/Dati4/Workspace/AngularReactNodeExamples/`: no reading, writing or executing anything in other paths (the only exception is the session scratchpad provided by Claude Code for temporary files).
- **Cloud commands only after explicit confirmation**: before running `aws`, `az`, `cdk`, `sam`, `serverless` (and any other tool that acts on a cloud account, e.g. `gcloud`), show the exact command, say what it does (and whether it costs money or changes resources) and wait for the user's confirmation. Each command needs its own confirmation: a previous "yes" does not cover the next one. The same applies to running scripts or apps from this repo that call real cloud APIs through an SDK (boto3, Azure SDK), e.g. starting a Manager that queries AWS.
- **Never run git commands**, read-only ones included (`git status`, `git diff`, `git log`, ...). To know what changed, read the files; commits are made by the user.
- Every README.md must have two last sections:
  - changelog : add a row every time I ask you change code inside folder, the description must be max 10 worlds
  - "alnao footer" is always the same and never change it if there are not into readme file.


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
- I README nuovi o riscritti hanno il footer breve che rimanda al README principale e alla licenza, seguito dalle sezioni `## Changelog` e footer AlNao (vedi `archived/ES6Example/README.md`). Il changelog è una tabella `| Data | Descrizione |` con le righe in ordine cronologico.
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



## AWS Tagging convention (applies to every resource on AWS cloud)

Every resource created/managed in AWS that supports tags carries the standard tags of its example:
```
Name        = "aws-js-<Descrizione>"
Environment = "dev"
Project     = "Development.aws.js-<Descrizione>"
Owner       = "AlNao"
CostCenter  = "dev"
ManagedBy   = "Manual/Terraform/CloudFormation/Sh/CDK"
```
`ManagedBy` follows the tool that creates the resource: `Sh` for AWS CLI scripts/commands and Serverless Framework, `CDK` for CDK stacks, `Manual` for the console and for Python code using boto3 (AWS/SDK, AWS/Manager, scripts).
For the CDK examples (`AWS/CDK/cdk*`) `Name` is different for every resource and equals its name, `aws-py-cdkXX-<servizio>` (see the CDK section above); `Project` and the other tags stay as above.

In questo workspace i progetti sono cartelle di primo livello, quindi `Descrizione` è il nome della cartella: `AwsLambdaBooks` → `Name = aws-js-AwsLambdaBooks`, `Project = Development.aws.js-AwsLambdaBooks`.
- Stack AWS SAM (`AwsLambdaBooks`): `ManagedBy = CloudFormation`; i tag stanno una sola volta in `samconfig.toml` come tag dello stack, che CloudFormation propaga alle risorse.
- Regione predefinita `eu-central-1` (Francoforte), sempre parametrica. Il codice e i template di SAM/CloudFormation vanno nel bucket `alnao-dev-cloudformation` (parametrico: `s3_bucket` in `samconfig.toml`, mai `resolve_s3`), con un prefisso per progetto (`s3_prefix = "aws-js-<Descrizione>"`). Il bucket è condiviso, sta nella stessa regione dello stack e si crea una volta sola con AWS CLI (`ManagedBy = Sh`).
- Codice Node con AWS SDK che crea risorse (upload di `AwsS3Manager`): `ManagedBy = Manual`, tag passati nella chiamata (es. `Tagging` di `PutObjectCommand`).
- Azure (`AzureFunctionBooks`): stessi tag con `azure` al posto di `aws` (`Name = azure-js-<Descrizione>`, `Project = Development.azure.js-<Descrizione>`), `ManagedBy = Sh` per gli script Azure CLI. In Azure i tag del resource group non passano alle risorse: lo script li applica a ogni risorsa del gruppo (`az resource tag --is-incremental`), comprese quelle create in automatico.
