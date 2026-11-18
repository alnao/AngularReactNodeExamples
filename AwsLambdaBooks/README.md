# AWS Lambda Books CRUD

| Scheda | |
|---|---|
| **Stack** | TypeScript 5, AWS SAM, Lambda Node.js 22 (arm64), API Gateway REST con API key, DynamoDB, Vitest |
| **Node** | 22 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | In locale: `npm install && npm run local:db && npm run local:seed && npm run local` → http://localhost:3001/books · Su AWS: `npm run deploy` |
| **Backend** | È il backend di [AngularBookExample](../AngularBookExample/README.md). In locale serve Docker (DynamoDB Local); su AWS servono un account e la [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) |
| **Stato** | Attivo |
| **Ultima verifica** | Novembre 2026: `npm install`, typecheck, 19 test Vitest, build esbuild e risposte del server locale (senza database) con Node 22. Deploy su AWS e prova con DynamoDB Local non ancora eseguiti |

API REST CRUD per la gestione di libri: cinque funzioni AWS Lambda in TypeScript esposte da API Gateway, con i dati su DynamoDB. L'infrastruttura è descritta in [`template.yaml`](./template.yaml) con **AWS SAM** (un'estensione di CloudFormation) ed è pensata come backend del frontend [`AngularBookExample`](../AngularBookExample/README.md).

```
Browser (Angular, :4200)
   │  HTTPS + header x-api-key
   ▼
API Gateway REST (stage dev, usage plan: 5 req/s, 1000 req/giorno)
   │  integrazione proxy
   ▼
5 Lambda Node.js 22 ──► DynamoDB (tabella aws-js-AwsLambdaBooks-dev, on-demand)
   │
   └──► CloudWatch Logs (retention 14 giorni)
```

## Prerequisiti
- Node.js 22 (`nvm use`)
- Per la prova in locale: Docker, per avviare [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
- Per il deploy su AWS:
  - un account AWS e un profilo configurato con `aws configure` (SAM usa il profilo `default` o quello indicato in `AWS_PROFILE`)
  - la [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) (`sam --version`)
  - il bucket S3 per il codice, `alnao-dev-cloudformation` nella stessa regione dello stack (vedi [Bucket per il codice](#bucket-per-il-codice))

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm install` | Installa le dipendenze |
| `npm run typecheck` | Controllo dei tipi TypeScript |
| `npm test` | Test unitari degli handler con Vitest (DynamoDB simulato, nessun accesso ad AWS) |
| `npm run build` | Compila ogni Lambda con esbuild in `dist/<funzione>/index.js` |
| `npm run local:db` / `local:db:stop` | Avvia / ferma DynamoDB Local in Docker (porta 8000) |
| `npm run local:seed` | Crea la tabella locale e carica tre libri di esempio |
| `npm run local` | Avvia l'API in locale su http://localhost:3001/books |
| `npm run deploy` | `build` + `sam deploy`: crea o aggiorna lo stack su AWS (**crea risorse sull'account**); regione e bucket del codice si cambiano con `-- --region ... --s3-bucket ...` |
| `npm run delete` | `sam delete`: cancella lo stack e tutte le sue risorse, dati compresi |

## Modello dati

```json
{
  "id": "uuid generato dal backend",
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

La validazione sta in [`src/models/Book.ts`](./src/models/Book.ts) ed è la stessa per POST e PUT. Accetta i form di Angular così come arrivano: i campi vuoti (`null` o `''`) prendono il valore di default, un prezzo numerico in forma di stringa viene convertito e i campi in più, come `id`, vengono ignorati.

## Endpoint

| Metodo | Percorso | Risposta |
|---|---|---|
| `POST` | `/books` | 201 con il libro creato · 400 se il JSON non è valido o mancano `title`/`author` |
| `GET` | `/books` | 200 con `{ "books": [...] }` (legge tutte le pagine dello Scan) |
| `GET` | `/books/{id}` | 200 con il libro · 404 se non esiste |
| `PUT` | `/books/{id}` | 200 con il libro aggiornato · 400 se i dati non sono validi · 404 se non esiste (non crea libri nuovi) |
| `DELETE` | `/books/{id}` | 200 con `{ "message", "id" }` · 404 se non esiste |

Su AWS ogni chiamata richiede l'header `x-api-key`: senza, API Gateway risponde 403; oltre i limiti dell'usage plan risponde 429. La API key serve a limitare l'uso dell'API pubblica, ma non autentica gli utenti: chi apre il frontend può leggerla negli strumenti del browser. Per un'autenticazione vera servirebbe un authorizer, per esempio Cognito.

## Esecuzione in locale

Lo script [`scripts/local-server.ts`](./scripts/local-server.ts) simula API Gateway: riceve le richieste HTTP, costruisce l'evento e chiama **gli stessi handler** delle Lambda, che leggono e scrivono su DynamoDB Local. Non serve un account AWS, e in locale l'header `x-api-key` non viene controllato.

```bash
nvm use
npm install
npm run local:db      # DynamoDB Local in Docker, dati in memoria
npm run local:seed    # tabella aws-js-AwsLambdaBooks-local + 3 libri di esempio
npm run local         # API su http://localhost:3001/books
```

Prova rapida da un altro terminale:
```bash
curl http://localhost:3001/books
curl -X POST http://localhost:3001/books -H "Content-Type: application/json" \
  -d '{"title":"Il nome della rosa","author":"Umberto Eco","price":20,"type":"storic"}'
```

Gli script locali rifiutano un `DYNAMODB_ENDPOINT` che non punti a `localhost`, così non possono scrivere per errore sulla tabella su AWS.

## Deploy su AWS

> ⚠️ Questi comandi creano risorse sull'account AWS. I costi di questo esempio rientrano di solito nel free tier (Lambda, API Gateway e DynamoDB a consumo, log con retention di 14 giorni), ma conviene cancellare lo stack quando non serve più.

```bash
REGION=eu-central-1   # Francoforte, la regione predefinita
npm run deploy        # build + sam deploy con i parametri di samconfig.toml
```

[`samconfig.toml`](./samconfig.toml) imposta lo stack `aws-js-AwsLambdaBooks-dev`, la regione `eu-central-1` (Francoforte), il bucket del codice `alnao-dev-cloudformation`, l'origine CORS `http://localhost:4200` e i tag standard. SAM mostra il change set e chiede conferma prima di applicarlo.

Regione e bucket sono parametri. Gli argomenti scritti dopo `--` arrivano a `sam` e hanno la precedenza su `samconfig.toml`:
```bash
npm run deploy -- --region eu-west-1 --s3-bucket alnao-dev-cloudformation-eu-west-1
npm run delete -- --region eu-west-1
```
Nei comandi `aws` qui sotto la regione è nella variabile `$REGION`.

### Bucket per il codice
`sam deploy` comprime il codice di ogni Lambda (`dist/<funzione>/`) e lo carica, insieme al template, nel bucket `alnao-dev-cloudformation` sotto il prefisso `aws-js-AwsLambdaBooks/`. CloudFormation poi crea le Lambda leggendo da lì.

- Il bucket non fa parte dello stack: è condiviso tra i progetti SAM e CloudFormation e va creato una volta sola.
- Deve trovarsi nella **stessa regione** dello stack. Siccome i nomi dei bucket sono unici in tutto il mondo, per deployare in un'altra regione serve un altro bucket, per esempio `alnao-dev-cloudformation-eu-west-1`.
- `sam delete` chiede se cancellare anche i file caricati nel bucket; il bucket invece resta.

Per verificare che esista e, se manca, crearlo con i tag standard (`ManagedBy=Sh`, perché nasce da comandi AWS CLI):
```bash
BUCKET=alnao-dev-cloudformation
aws s3api head-bucket --bucket $BUCKET --region $REGION        # nessun output = esiste

aws s3api create-bucket --bucket $BUCKET --region $REGION \
  --create-bucket-configuration LocationConstraint=$REGION
aws s3api put-bucket-tagging --bucket $BUCKET --region $REGION --tagging 'TagSet=[
  {Key=Name,Value=alnao-dev-cloudformation},{Key=Environment,Value=dev},
  {Key=Project,Value=Development.aws.js-AwsLambdaBooks},{Key=Owner,Value=AlNao},
  {Key=CostCenter,Value=dev},{Key=ManagedBy,Value=Sh}]'
```
I bucket nuovi hanno già l'accesso pubblico bloccato e la cifratura SSE-S3 attiva. I file che SAM carica nel bucket non hanno tag, perché `sam deploy` non permette di assegnarli.

Al termine il comando stampa gli output dello stack. Per rileggerli e per ottenere il valore della API key:
```bash
STACK_NAME="aws-js-AwsLambdaBooks-dev"
API_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION \
  --query "Stacks[0].Outputs[?OutputKey=='BooksApiUrl'].OutputValue" --output text)
API_KEY_ID=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION \
  --query "Stacks[0].Outputs[?OutputKey=='ApiKeyId'].OutputValue" --output text)
API_KEY=$(aws apigateway get-api-key --api-key $API_KEY_ID --include-value --region $REGION \
  --query value --output text)
echo $API_URL
```

Operazioni CRUD con curl:
```bash
# Crea
curl -X POST $API_URL -H "x-api-key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"title":"Il nome della rosa","author":"Umberto Eco","price":20,"isbn":"DEMO-0001","description":"Giallo storico","type":"storic"}'
# Elenco
curl -H "x-api-key: $API_KEY" $API_URL
# Dettaglio, modifica, cancellazione (sostituire <id>)
curl -H "x-api-key: $API_KEY" $API_URL/<id>
curl -X PUT $API_URL/<id> -H "x-api-key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"title":"Titolo aggiornato","author":"Umberto Eco","price":25,"type":"storic"}'
curl -X DELETE -H "x-api-key: $API_KEY" $API_URL/<id>
# Senza API key: 403
curl -i $API_URL
```

Log di una funzione (i log group hanno nomi fissi):
```bash
aws logs tail /aws/lambda/aws-js-AwsLambdaBooks-dev-createBook --follow --region $REGION
```

### Tag delle risorse
Tutte le risorse dello stack hanno i tag standard del repository (vedi la sezione *AWS Tagging convention* di [`CLAUDE.md`](../CLAUDE.md)). Sono definiti una sola volta come tag dello stack in `samconfig.toml`, e CloudFormation li propaga a Lambda, ruoli IAM, API Gateway, API key, usage plan, tabella e log group:

```
Name        = "aws-js-AwsLambdaBooks"
Environment = "dev"
Project     = "Development.aws.js-AwsLambdaBooks"
Owner       = "AlNao"
CostCenter  = "dev"
ManagedBy   = "CloudFormation"
```

Il bucket del codice `alnao-dev-cloudformation` non fa parte dello stack: i suoi tag si impostano quando lo si crea (vedi [Bucket per il codice](#bucket-per-il-codice)).

Per controllare quali risorse hanno i tag:
```bash
aws resourcegroupstaggingapi get-resources --region $REGION \
  --tag-filters Key=Project,Values=Development.aws.js-AwsLambdaBooks \
  --query "ResourceTagMappingList[].ResourceARN"
```

## Test completo con il frontend

La prova end-to-end usa [AngularBookExample](../AngularBookExample/README.md) con `tipoApi: "AWS"`, in due varianti: con il backend in locale (nessun costo) oppure con lo stack su AWS.

### A. Backend in locale
1. Terminale 1, in `AwsLambdaBooks` (Node 22):
   ```bash
   nvm use && npm install
   npm run local:db && npm run local:seed && npm run local
   ```
2. Terminale 2, in `AngularBookExample`, con Node 12 (`nvm use`) oppure con Node 22 (lo script `npm start` gestisce l'errore OpenSSL di webpack 4, vedi il README del progetto):
   ```bash
   npm install
   npm start             # usa src/environments/environment.ts → http://localhost:3001/books
   ```
3. Aprire http://localhost:4200 e seguire la checklist qui sotto.
4. Alla fine: `Ctrl+C` sul server e `npm run local:db:stop`, che cancella anche i dati in memoria.

### B. Backend su AWS
1. In `AwsLambdaBooks`: `npm run deploy` e recuperare `API_URL` e `API_KEY` come descritto in [Deploy su AWS](#deploy-su-aws).
2. Caricare i dati di esempio con la `curl` di creazione, oppure direttamente dal frontend.
3. In `AngularBookExample`:
   ```bash
   cp src/environments/environment.aws.example.ts src/environments/environment.aws.ts
   # inserire in environment.aws.ts urlApiAws = $API_URL e apiKeyAws = $API_KEY
   npm run start:aws
   ```
   `environment.aws.ts` è ignorato da git perché contiene la API key.
4. Aprire http://localhost:4200 e seguire la checklist. Se il frontend gira su un'origine diversa da `http://localhost:4200`, cambiare `AllowedOrigin` in `samconfig.toml` e rifare il deploy.
5. Alla fine: `npm run delete` in `AwsLambdaBooks`.

### Checklist
| # | Azione nel frontend | Risultato atteso |
|---|---|---|
| 1 | Aprire la pagina | Compare l'elenco dei libri (i 3 di esempio in locale) |
| 2 | Aggiungere un libro dal form | Il libro compare nell'elenco con un id UUID |
| 3 | Modificarlo dal form (pulsante modifica) | L'elenco mostra i nuovi valori |
| 4 | Aprire il dettaglio, cambiare il titolo e salvare | Torna all'elenco con il titolo aggiornato |
| 5 | Cancellarlo | Sparisce dall'elenco; ricaricando la pagina non torna |
| 6 | Strumenti del browser → Rete | Le chiamate rispondono 200/201; su AWS hanno l'header `x-api-key` |
| 7 | Solo AWS: svuotare `apiKeyAws` e ricaricare | Le chiamate falliscono con 403, senza errori CORS in console |

Nei log del server locale (variante A) o in CloudWatch (variante B) si vede ogni chiamata con il suo codice di risposta.

## Rimozione
```bash
npm run delete        # sam delete: cancella lo stack, la tabella con i dati e i log group
```

### Migrazione dalla versione Serverless Framework
Fino a novembre 2026 il progetto usava Serverless Framework 3, con lo stack `aws-lambda-books-crud-dev` in `eu-central-1`. Se quello stack è ancora presente sull'account, va rimosso a mano perché `serverless.yml` non esiste più. La tabella aveva `DeletionPolicy: Retain`, quindi resta anche dopo la cancellazione dello stack:
```bash
aws cloudformation describe-stacks --stack-name aws-lambda-books-crud-dev --region eu-central-1   # esiste ancora?
# svuotare il bucket di deploy di Serverless (output ServerlessDeploymentBucketName), poi:
aws cloudformation delete-stack --stack-name aws-lambda-books-crud-dev --region eu-central-1
aws dynamodb delete-table --table-name aws-lambda-books-crud-dev --region eu-central-1
```
La cartella locale `.serverless/`, ignorata da git, si può cancellare.

## Struttura del progetto

```
AwsLambdaBooks/
├── src/
│   ├── handlers/           # una Lambda per operazione
│   │   ├── createBook.ts
│   │   ├── listBooks.ts
│   │   ├── getBook.ts
│   │   ├── updateBook.ts
│   │   └── deleteBook.ts
│   ├── models/Book.ts      # tipo Book e validazione dell'input
│   └── utils/
│       ├── db.ts           # client DynamoDB condiviso
│       └── response.ts     # risposte JSON, header CORS, parsing del body
├── scripts/
│   ├── local-env.ts        # variabili per DynamoDB Local
│   ├── local-server.ts     # API Gateway simulato su :3001
│   └── seed.ts             # tabella locale + dati di esempio
├── tests/handlers.test.ts  # test Vitest con aws-sdk-client-mock
├── template.yaml           # infrastruttura AWS SAM
├── samconfig.toml          # parametri di deploy e tag
├── docker-compose.yml      # DynamoDB Local
├── tsconfig.json
└── package.json
```

## Note
- Ogni Lambda ha solo i permessi che le servono: lettura per `get`/`list`, scrittura per `create`, CRUD per `update`/`delete`.
- Le Lambda girano su arm64 (Graviton), che a parità di prestazioni costa meno di x86.
- Il bundle di esbuild include l'AWS SDK, quindi la versione usata è quella del `package-lock.json` e non quella del runtime.
- Il CORS ammette una sola origine, `AllowedOrigin`, sia nelle risposte delle Lambda sia negli errori generati da API Gateway.
- REST API invece di HTTP API: costa un po' di più, ma solo la REST API supporta API key e usage plan.

Fonti: [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) · [Lambda con Node.js](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html) · [API key e usage plan](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html)

---
Parte della raccolta [AngularReactNodeExamples](../README.md) di [AlNao](https://www.alnao.it) · Licenza [GPL v3](../LICENSE)

## Changelog

| Data | Descrizione |
|---|---|
| ≤ 2026-01-13 | Versione iniziale; storico precedente non ricostruito |
| 2026-03-11 | Test esempi books: aggiornati `serverless.yml` e dipendenze |
| 2026-11-11 | Aggiunti `.nvmrc` e scheda standard nel README |
| 2026-11-18 | Migrazione a SAM e Node 22; API key e tag |
| 2026-11-18 | Correzioni handler, test Vitest, server locale e DynamoDB Local |
| 2026-11-18 | Bucket del codice parametrico `alnao-dev-cloudformation`, regione Francoforte |


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


