# Azure Function Books CRUD

Azure Functions CRUD API per la gestione di libri usando TypeScript e Azure Cosmos DB.

Questo mini-progetto è studiato per lavorare con l'esempio disponibile nella cartella `AngularBookExample`.


## Prerequisiti

- Node.js 20+
- Azure CLI
- Azure Functions Core Tools v4
- Account Azure con Cosmos DB

## Installazione

```bash
npm install
```

## 🚀 Deploy su Azure

### Metodo 1: Script Automatico (Consigliato)

Gli script `start-all.sh` e `stop-all.sh` gestiscono automaticamente tutto il ciclo di vita delle risorse Azure.

#### Configurazione Variabili

Le variabili sono configurabili all'inizio di `start-all.sh`:

```bash
RESOURCE_GROUP="rg-books-functions"
LOCATION="westeurope"
STORAGE_ACCOUNT="stbooksapi$(date +%s)"
COSMOSDB_ACCOUNT="cosmos-books-api"
COSMOSDB_DATABASE="BooksDB"
COSMOSDB_CONTAINER="Books"
FUNCTION_APP="func-books-api-$(date +%s)"
```

#### Deploy completo

```bash
# Deploy di tutte le risorse e dell'applicazione
./start-all.sh
```

Lo script eseguirà automaticamente:
1. ✅ Verifica prerequisiti (Azure CLI, Functions Core Tools, Node.js)
2. ✅ Login Azure
3. ✅ Crea Resource Group
4. ✅ Crea Storage Account
5. ✅ Crea Cosmos DB Account (database + container)
6. ✅ Crea Function App
7. ✅ Configura App Settings
8. ✅ Build e deploy dell'applicazione
9. ✅ Mostra URL API

#### Eliminazione risorse

```bash
# Elimina tutte le risorse Azure
./stop-all.sh
```

Lo script:
- Carica la configurazione da `.azure-config`
- Chiede conferma prima di eliminare
- Elimina il Resource Group e tutte le risorse
- Supporta eliminazione sincrona o asincrona

### Metodo 2: Manuale

```bash
# Creare Function App
az functionapp create \
  --resource-group books-rg \
  --consumption-plan-location westeurope \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name books-functions-app \
  --storage-account <storage-account-name>

# Deploy
func azure functionapp publish books-functions-app

# Configurare le variabili d'ambiente
az functionapp config appsettings set \
  --name books-functions-app \
  --resource-group books-rg \
  --settings \
    COSMOS_DB_CONNECTION_STRING="your-connection-string" \
    COSMOS_DB_DATABASE="BooksDB" \
    COSMOS_DB_CONTAINER="Books"
```

## Endpoint API

### Local
Base URL: `http://localhost:7071/api`

### Azure
Base URL: `https://books-functions-app.azurewebsites.net/api`

### Operazioni CRUD

1. **Create Book** - POST `/books`
   ```bash
   curl -X POST http://localhost:7071/api/books \
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
   curl http://localhost:7071/api/books
   ```

3. **Get Book** - GET `/books/{id}`
   ```bash
   curl http://localhost:7071/api/books/{book-id}
   ```

4. **Update Book** - PUT `/books/{id}`
   ```bash
   curl -X PUT http://localhost:7071/api/books/{book-id} \
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
   curl -X DELETE http://localhost:7071/api/books/{book-id}
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

## Logs

```bash
# Logs in tempo reale
func azure functionapp logstream books-functions-app

# Oppure tramite Azure Portal
# Application Insights > Logs
```

## Struttura Progetto

```
AzureFunctionBooks/
├── src/
│   ├── functions/
│   │   ├── createBook.ts
│   │   ├── listBooks.ts
│   │   ├── getBook.ts
│   │   ├── updateBook.ts
│   │   └── deleteBook.ts
│   ├── models/
│   │   └── Book.ts
│   └── utils/
│       ├── cosmosClient.ts
│       └── response.ts
├── host.json
├── local.settings.json
├── tsconfig.json
├── package.json
└── README.md
```

## Note
- CORS è configurato automaticamente nelle risposte per permettere chiamate da AngularBookExample.
- Cosmos DB usa partition key `/id`
- Gli ID dei libri sono generati automaticamente con UUID v4
- Tutti gli errori ritornano risposte JSON strutturate
- Le Azure Functions usano il modello v4 (Programming Model v4)




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


