# Azure Function Books CRUD

| Scheda | |
|---|---|
| **Stack** | Azure Functions v4 (modello di programmazione v4), TypeScript 5, Node.js 22, Azure Cosmos DB serverless, Vitest |
| **Node** | 22 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | In locale: `npm install && npm run local:db && npm run local:seed && npm start` → http://localhost:7071/api/books · Su Azure: `./start-all.sh` |
| **Backend** | È il backend di [AngularBookExample](../AngularBookExample/README.md). Servono [Azure Functions Core Tools v4](https://learn.microsoft.com/azure/azure-functions/functions-run-local); in locale anche Docker (emulatore Cosmos DB); su Azure la [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) e un abbonamento |
| **Stato** | Attivo |
| **Ultima verifica** | Novembre 2026: `npm install`, typecheck, 14 test Vitest, build, avvio dell'host locale con Core Tools 4.7 (5 funzioni, CORS, validazione) e pacchetto di deploy, con Node 22. Emulatore Cosmos DB e deploy su Azure non ancora eseguiti |

API REST CRUD per la gestione di libri: cinque Azure Functions HTTP in TypeScript con i dati su Azure Cosmos DB. È la versione Azure di [AwsLambdaBooks](../AwsLambdaBooks/README.md): stesse rotte, stesso formato delle risposte e stessa validazione, quindi il frontend [AngularBookExample](../AngularBookExample/README.md) le usa allo stesso modo.

```
Browser (Angular, :4200)
   │  HTTPS + header x-functions-key      (CORS gestito dalla piattaforma)
   ▼
Function App "Flex Consumption" (Node.js 22, 5 funzioni HTTP)
   │  identità gestita + ruolo RBAC "Data Contributor" (nessuna chiave salvata)
   ▼
Cosmos DB serverless  (BooksDB / Books, partition key /id)

Log: Application Insights → workspace Log Analytics (retention 30 giorni)
```

## Prerequisiti
- Node.js 22 (`nvm use`)
- [Azure Functions Core Tools v4](https://learn.microsoft.com/azure/azure-functions/functions-run-local) (`func --version`), installati a parte: `npm install -g azure-functions-core-tools@4`
- Per la prova in locale: Docker, per avviare l'[emulatore di Cosmos DB](https://learn.microsoft.com/azure/cosmos-db/emulator-linux)
- Per il deploy: la [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) (`az login`) e un abbonamento Azure

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm install` | Installa le dipendenze |
| `npm run typecheck` | Controllo dei tipi TypeScript (codice, script e test) |
| `npm test` | Test unitari delle funzioni con Vitest (Cosmos DB simulato, nessun accesso ad Azure) |
| `npm run build` | Compila TypeScript in `dist/` |
| `npm run local:db` / `local:db:stop` | Avvia / ferma l'emulatore Cosmos DB in Docker (porte 8081 e 1234) |
| `npm run local:seed` | Crea database e container sull'emulatore e carica tre libri di esempio |
| `npm start` | Crea `local.settings.json` se manca, compila e avvia l'host locale (`func start`) su http://localhost:7071 |
| `./start-all.sh` (`npm run deploy`) | Crea le risorse su Azure e pubblica il codice (**crea risorse sull'abbonamento**) |
| `./stop-all.sh` (`npm run destroy`) | Cancella il resource group con tutte le risorse e i dati |

## Modello dati

```json
{
  "id": "uuid generato dal backend (è anche la partition key)",
  "title": "string, obbligatorio",
  "author": "string, obbligatorio",
  "price": "number >= 0, default 0",
  "isbn": "string, default ''",
  "description": "string, default ''",
  "type": "string, default 'general'",
  "createdAt": "timestamp in millisecondi",
  "updatedAt": "timestamp in millisecondi"
}
```

La validazione sta in [`src/models/Book.ts`](./src/models/Book.ts) ed è la stessa di AwsLambdaBooks. Accetta i form di Angular così come arrivano: i campi vuoti prendono il valore di default e il prezzo in forma di stringa viene convertito. Le risposte non includono i campi di sistema che Cosmos DB aggiunge ai documenti (`_rid`, `_etag`, `_ts`, ...).

## Endpoint

| Metodo | Percorso | Risposta |
|---|---|---|
| `POST` | `/api/books` | 201 con il libro creato · 400 se il JSON non è valido o mancano `title`/`author` |
| `GET` | `/api/books` | 200 con `{ "books": [...] }` |
| `GET` | `/api/books/{id}` | 200 con il libro · 404 se non esiste |
| `PUT` | `/api/books/{id}` | 200 con il libro aggiornato · 400 se i dati non sono validi · 404 se non esiste · 409 se nel frattempo qualcuno l'ha modificato |
| `DELETE` | `/api/books/{id}` | 200 con `{ "message", "id" }` · 404 se non esiste |

Le funzioni hanno `authLevel: 'function'`: su Azure ogni chiamata richiede l'header `x-functions-key` con una chiave della Function App, altrimenti la piattaforma risponde 401. In locale `func start` non controlla le chiavi. Come la API key di AWS, la chiave limita l'uso dell'API pubblica ma non autentica gli utenti: chi apre il frontend può leggerla nel browser.

Il CORS lo gestisce la piattaforma: su Azure con `az functionapp cors add`, eseguito da `start-all.sh`, e in locale con `Host.CORS` in `local.settings.json`. La piattaforma risponde anche alla preflight `OPTIONS` del browser, quindi le funzioni registrano solo i propri metodi.

## Esecuzione in locale

`npm start` avvia il vero host delle Azure Functions (Core Tools), che legge le impostazioni da `local.settings.json`. Il file è ignorato da git e viene creato da [`local.settings.example.json`](./local.settings.example.json) se manca. In locale i dati stanno sull'emulatore Linux di Cosmos DB in Docker.

```bash
nvm use
npm install
npm run local:db      # emulatore Cosmos DB (attendere qualche secondo che sia pronto)
npm run local:seed    # database BooksDB, container Books e 3 libri di esempio
npm start             # API su http://localhost:7071/api/books
```

Prova rapida da un altro terminale:
```bash
curl http://localhost:7071/api/books
curl -X POST http://localhost:7071/api/books -H "Content-Type: application/json" \
  -d '{"title":"Il nome della rosa","author":"Umberto Eco","price":20,"type":"storic"}'
```

- Il Data Explorer dell'emulatore è su http://localhost:1234.
- La chiave in `local.settings.example.json` è quella fissa e pubblica dell'emulatore, non una credenziale.
- Lo script di seed rifiuta qualsiasi endpoint che non sia `localhost`.

## Deploy su Azure

> ⚠️ `start-all.sh` crea risorse sull'abbonamento Azure. Sono tutte a consumo (Function App Flex Consumption, Cosmos DB serverless, Storage, Log Analytics), quindi con l'uso di una demo il costo è di pochi centesimi; conviene comunque cancellarle con `./stop-all.sh` quando non servono.

```bash
az login
./start-all.sh
```

Lo script si può rilanciare: le risorse già presenti non vengono ricreate. Esegue questi passi:
1. controlla `az`, `func` e `node`, e installa l'estensione `application-insights` della Azure CLI;
2. crea il resource group `azure-js-AzureFunctionBooks` in `northeurope`;
3. crea il workspace Log Analytics e Application Insights, per i log;
4. crea lo Storage account richiesto dalla Function App;
5. crea l'account Cosmos DB **serverless** con il database `BooksDB` e il container `Books` (partition key `/id`);
6. crea la Function App sul piano **Flex Consumption**, con Node.js 22;
7. assegna alla Function App un'**identità gestita** e le dà il ruolo *Cosmos DB Built-in Data Contributor*: la Function App accede ai dati senza chiavi né connection string nelle impostazioni;
8. imposta le variabili dell'app (`COSMOS_DB_ENDPOINT`, database, container) e il CORS per `http://localhost:4200`;
9. applica i tag standard a tutte le risorse del resource group;
10. con [`scripts/package.sh`](./scripts/package.sh) prepara in `.deploy/` il JavaScript compilato con le sole dipendenze di produzione, poi lo pubblica con `func azure functionapp publish --no-build`.

Alla fine salva URL e chiave in `.azure-config`, un file ignorato da git:
```bash
source .azure-config
curl -H "x-functions-key: $API_KEY" $API_URL
curl -X POST $API_URL -H "x-functions-key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"title":"Il nome della rosa","author":"Umberto Eco","price":20,"isbn":"DEMO-0001","type":"storic"}'
curl -i $API_URL      # senza chiave: 401
```

Tutti i nomi, la regione e l'origine CORS si possono cambiare con variabili d'ambiente. I nomi di Storage, Cosmos DB e Function App devono essere unici in tutto Azure:
```bash
LOCATION=westeurope FUNCTION_APP=mio-nome-func ALLOWED_ORIGIN=http://localhost:4200 ./start-all.sh
```
Il piano Flex Consumption non è disponibile in tutte le regioni: `az functionapp list-flexconsumption-locations -o table` le elenca.

Log in tempo reale: `func azure functionapp logstream alnao-books-func-api`, oppure da Application Insights nel portale.

### Tag delle risorse
Le risorse hanno i tag standard del repository nella variante Azure (vedi *AWS Tagging convention* in [`CLAUDE.md`](../CLAUDE.md)):

```
Name        = "azure-js-AzureFunctionBooks"
Environment = "dev"
Project     = "Development.azure.js-AzureFunctionBooks"
Owner       = "AlNao"
CostCenter  = "dev"
ManagedBy   = "Sh"
```

In Azure i tag del resource group non passano alle risorse, quindi `start-all.sh` li applica a ogni risorsa. Al passo 9 tagga anche quelle che Azure crea da solo, come il piano Flex e le regole di avviso di Application Insights. Per controllarli:
```bash
az resource list --tag Project=Development.azure.js-AzureFunctionBooks --query "[].{Nome:name, Tipo:type}" -o table
```

## Test completo con il frontend

La prova end-to-end usa [AngularBookExample](../AngularBookExample/README.md) con `tipoApi: "Azure"`, in due varianti: con il backend in locale (nessun costo) oppure su Azure.

### A. Backend in locale
1. Terminale 1, in `AzureFunctionBooks` (Node 22):
   ```bash
   npm install
   npm run local:db && npm run local:seed && npm start
   ```
2. Terminale 2, in `AngularBookExample`: in `src/environments/environment.ts` impostare `tipoApi: "Azure"`, che punta già a `http://localhost:7071/api/books`, poi:
   ```bash
   npm install
   npm start
   ```
3. Aprire http://localhost:4200 e seguire la checklist qui sotto.
4. Alla fine: `Ctrl+C` sull'host, `npm run local:db:stop` (cancella anche i dati dell'emulatore) e rimettere `tipoApi: "AWS"` se serve.

### B. Backend su Azure
1. In `AzureFunctionBooks`: `./start-all.sh`.
2. In `AngularBookExample`:
   ```bash
   cp src/environments/environment.azure.example.ts src/environments/environment.azure.ts
   # inserire in environment.azure.ts urlApiAzure = API_URL e apiKeyAzure = API_KEY presi da AzureFunctionBooks/.azure-config
   npm run start:azure
   ```
   `environment.azure.ts` è ignorato da git perché contiene la chiave.
3. Aprire http://localhost:4200 e seguire la checklist. Al primo avvio la lista è vuota: si può aggiungere un libro dal form o con la `curl` di creazione.
4. Alla fine: `./stop-all.sh` in `AzureFunctionBooks`.

### Checklist
| # | Azione nel frontend | Risultato atteso |
|---|---|---|
| 1 | Aprire la pagina | Compare l'elenco dei libri (i 3 di esempio in locale) |
| 2 | Aggiungere un libro dal form | Il libro compare nell'elenco con un id UUID |
| 3 | Modificarlo dal form (pulsante modifica) | L'elenco mostra i nuovi valori |
| 4 | Aprire il dettaglio, cambiare il titolo e salvare | Torna all'elenco con il titolo aggiornato |
| 5 | Cancellarlo | Sparisce dall'elenco; ricaricando la pagina non torna |
| 6 | Strumenti del browser → Rete | Le chiamate rispondono 200/201; su Azure hanno l'header `x-functions-key` |
| 7 | Solo Azure: svuotare `apiKeyAzure` e ricaricare | Le chiamate falliscono con 401, senza errori CORS in console |

Nel terminale di `func start` (variante A) o in Application Insights (variante B) si vede ogni chiamata.

## Rimozione
```bash
./stop-all.sh         # mostra le risorse, chiede di scrivere il nome del resource group e lo cancella
```

### Migrazione dalla versione precedente
Fino a novembre 2026 lo script creava il resource group `alnao-books-functions` in `northeurope`, con Cosmos DB a throughput fisso (400 RU/s, a pagamento anche da fermo) e la Function App `alnao-book-functions-api` su Linux Consumption con Node 20. Se quelle risorse esistono ancora, conviene cancellarle:
```bash
az group exists --name alnao-books-functions          # true = esiste ancora
RESOURCE_GROUP=alnao-books-functions ./stop-all.sh
```

## Struttura del progetto

```
AzureFunctionBooks/
├── src/
│   ├── index.ts                # punto di ingresso: registra le funzioni
│   ├── functions/              # una funzione HTTP per operazione
│   │   ├── createBook.ts
│   │   ├── listBooks.ts
│   │   ├── getBook.ts
│   │   ├── updateBook.ts
│   │   └── deleteBook.ts
│   ├── models/Book.ts          # tipo Book, validazione, rimozione dei campi di sistema
│   └── utils/
│       ├── cosmosClient.ts     # client Cosmos DB (chiave in locale, identità gestita su Azure)
│       └── response.ts         # risposte JSON e parsing del body
├── scripts/
│   ├── ensure-local-settings.js
│   ├── seed.ts                 # database, container e dati di esempio sull'emulatore
│   └── package.sh              # pacchetto di deploy in .deploy/
├── tests/handlers.test.ts      # test Vitest
├── start-all.sh / stop-all.sh  # creazione e cancellazione delle risorse Azure
├── host.json
├── local.settings.example.json # modello di local.settings.json (ignorato da git)
├── docker-compose.yml          # emulatore Cosmos DB
├── .funcignore
├── tsconfig.json / tsconfig.check.json
└── package.json
```

## Note
- **Flex Consumption** è il piano a consumo che Microsoft consiglia per le nuove Function App; il vecchio Linux Consumption è in dismissione.
- **Cosmos DB serverless** si paga per richiesta e per spazio occupato. Il vecchio throughput fisso di 400 RU/s costava circa 20 € al mese anche senza traffico.
- **Accesso ai dati:** la Function App usa la propria identità gestita, quindi nelle impostazioni dell'app non c'è nessuna chiave Cosmos DB. È l'equivalente del ruolo IAM delle Lambda.
- **PUT:** usa l'`_etag` del documento (concorrenza ottimistica). Se due utenti modificano lo stesso libro, il secondo riceve 409 invece di sovrascrivere il primo.
- **Pacchetto di deploy:** contiene solo `dist/`, `host.json` e le dipendenze di produzione, circa 86 MB non compressi, quasi tutti dovuti agli SDK Azure. Prima dell'aggiornamento il pacchetto includeva anche `node_modules` di sviluppo e gli stessi Core Tools.
- **Limiti di traffico:** le Azure Functions non hanno l'equivalente dell'usage plan di API Gateway. Per un limite di richieste serve Azure API Management, che è a pagamento.

Fonti: [Azure Functions Node.js v4](https://learn.microsoft.com/azure/azure-functions/functions-reference-node) · [Flex Consumption](https://learn.microsoft.com/azure/azure-functions/flex-consumption-plan) · [Cosmos DB serverless](https://learn.microsoft.com/azure/cosmos-db/serverless) · [RBAC su Cosmos DB](https://learn.microsoft.com/azure/cosmos-db/how-to-setup-rbac)

---
Parte della raccolta [AngularReactNodeExamples](../README.md) di [AlNao](https://www.alnao.it) · Licenza [GPL v3](../LICENSE)

## Changelog

| Data | Descrizione |
|---|---|
| ≤ 2026-01-13 | Versione iniziale; storico precedente non ricostruito |
| 2026-11-11 | Aggiunti `.nvmrc` e scheda standard nel README |
| 2026-11-18 | Flex Consumption, Node 22, Cosmos serverless, identità gestita, tag |
| 2026-11-18 | Correzioni CORS e funzioni, test Vitest, emulatore Cosmos DB |


# &lt; AlNao /&gt;
Tutti i codici sorgente e le informazioni presenti in questo repository sono frutto di un attento e paziente lavoro di sviluppo da parte di AlNao, che si è impegnato a verificarne la correttezza nella misura massima possibile. Qualora parte del codice o dei contenuti sia stato tratto da fonti esterne, la relativa provenienza viene sempre citata, nel rispetto della trasparenza e della proprietà intellettuale. 


Alcuni contenuti e porzioni di codice presenti in questo repository sono stati realizzati anche grazie al supporto di strumenti di intelligenza artificiale, il cui contributo ha permesso di arricchire e velocizzare la produzione del materiale. Ogni informazione e frammento di codice è stato comunque attentamente verificato e validato, con l’obiettivo di garantire la massima qualità e affidabilità dei contenuti offerti. 


Per ulteriori dettagli, approfondimenti o richieste di chiarimento, si invita a consultare il sito [AlNao.it](https://www.alnao.it/).


## License
Made with ❤️ by <a href="https://www.alnao.it">AlNao</a>
&bull; 
Public projects 
<a href="https://www.gnu.org/licenses/gpl-3.0"  valign="middle"> <img src="https://img.shields.io/badge/License-GPL%20v3-blue?style=plastic" alt="GPL v3" valign="middle" /></a>
*Free Software!*


Il software è distribuito secondo i termini della GNU General Public License v3.0. L'uso, la modifica e la ridistribuzione sono consentiti, a condizione che ogni copia o lavoro derivato sia rilasciato con la stessa licenza. Il contenuto è fornito "così com'è", senza alcuna garanzia, esplicita o implicita.


The software is distributed under the terms of the GNU General Public License v3.0. Use, modification, and redistribution are permitted, provided that any copy or derivative work is released under the same license. The content is provided "as is", without any warranty, express or implied.


