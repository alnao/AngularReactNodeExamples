# AWS Lambda Books CRUD

Serverless CRUD API per la gestione di libri usando AWS Lambda, API Gateway e DynamoDB con TypeScript.

Questo mini-progetto è studiato per lavorare con l'esempio disponibile nella cartella `AngularBookExample`.

## Prerequisiti
- Node.js 18+
- AWS CLI configurato con le credenziali e region di default Francoforte!
- Serverless Framework `npm install serverless -g`
    ```bash
    $ npm install -g serverless
    $ serverless config credentials --provider aws --key <key> --secret <secret> --profile serverless-admin
    $ servless
    $ sls
    ```
- Profilo AWS chiamato `default` (o modificare in `serverless.yml`, per esempio `serverless-admin`)

## Installazione
```bash
npm install
```

## Modello Dati Book

```json
{
  "id": "uuid",
  "title": "string",
  "author": "string",
  "price": "number",
  "isbn": "string",
  "description": "string",
  "type": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Deploy

```bash
npm run deploy
# oppure
serverless deploy
```

Il deploy creerà:
- Tabella DynamoDB: `aws-lambda-books-crud-dev`
- 5 Lambda Functions per il CRUD
- API Gateway con endpoint REST

## Endpoint API

Dopo il deploy, otterrai un URL base come: `https://xxxxxx.execute-api.eu-west-1.amazonaws.com/dev`

### Operazioni CRUD


1. **Create Book** - POST `/books`
   ```bash
   curl -X POST https://your-api-url/dev/books \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Il nome della rosa",
       "author": "Umberto Eco",
       "price": 20,
       "isbn": "978-81-7525-766-5",
       "description": "Il nome della rosa",
       "type": "storic"
     }'
   ```

2. **List Books** - GET `/books`
   ```bash
   curl https://your-api-url/dev/books
   ```

3. **Get Book** - GET `/books/{id}`
   ```bash
   curl https://your-api-url/dev/books/{book-id}
   ```

4. **Update Book** - PUT `/books/{id}`
   ```bash
   curl -X PUT https://your-api-url/dev/books/{book-id} \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Updated Title",
       "author": "Updated Author",
       "price": 25,
       "isbn": "978-81-7525-766-5",
       "description": "Updated description",
       "type": "updated"
     }'
   ```

5. **Delete Book** - DELETE `/books/{id}`
   ```bash
   curl -X DELETE https://your-api-url/dev/books/{book-id}
   ```

## Dati di esempio

```json
{
  "books": [
    {
      "id": "1",
      "title": "Il nome della rosa",
      "author": "Umberto Eco",
      "price": 20,
      "isbn": "978-81-7525-766-5",
      "description": "Il nome della rosa",
      "type": "storic"
    },
    {
      "id": "2",
      "title": "Il Diario di Anna Frank",
      "author": "Anna Frank",
      "price": 12,
      "isbn": "978-81-7525-766-5",
      "description": "Diario di Anna Frank",
      "type": "storic"
    },
    {
      "id": "3",
      "title": "Gli arancini di Montalbano",
      "author": "Andrea Camilleri",
      "price": 11,
      "isbn": "978-81-7525-766-5",
      "description": "Gli arancini di Montalbano",
      "type": "yellow"
    }
  ]
}
```

## Rimozione

```bash
npm run remove
# oppure
serverless remove
```

## Logs

```bash
# Logs per una specifica funzione
serverless logs -f createBook
serverless logs -f listBooks
```

## Struttura Progetto

```
AWSLambdaBooks/
├── src/
│   ├── handlers/
│   │   ├── createBook.ts
│   │   ├── listBooks.ts
│   │   ├── getBook.ts
│   │   ├── updateBook.ts
│   │   └── deleteBook.ts
│   ├── models/
│   │   └── Book.ts
│   └── utils/
│       └── response.ts
├── serverless.yml
├── tsconfig.json
├── package.json
└── README.md
```

## Note
- Tutte le API hanno CORS abilitato per permettere chiamate da AngularBookExample.
- La tabella DynamoDB usa `PAY_PER_REQUEST` billing mode
- Gli ID dei libri sono generati automaticamente con UUID v4
- Tutti gli errori ritornano risposte JSON strutturate




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


