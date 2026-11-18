import { Container, CosmosClient } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';

/**
 * Due modi di collegarsi a Cosmos DB:
 * - COSMOS_DB_CONNECTION_STRING: endpoint + chiave. Si usa in locale con l'emulatore
 *   (vedi local.settings.example.json).
 * - COSMOS_DB_ENDPOINT senza connection string: identità gestita della Function App su Azure
 *   (DefaultAzureCredential), autorizzata con un ruolo RBAC di Cosmos DB. Nessuna chiave
 *   salvata nelle impostazioni dell'app.
 */
export const createCosmosClient = (): CosmosClient => {
  const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
  if (connectionString) {
    return new CosmosClient(connectionString);
  }
  const endpoint = process.env.COSMOS_DB_ENDPOINT;
  if (!endpoint) {
    throw new Error('Impostare COSMOS_DB_CONNECTION_STRING (locale) oppure COSMOS_DB_ENDPOINT (Azure)');
  }
  return new CosmosClient({ endpoint, aadCredentials: new DefaultAzureCredential() });
};

export const databaseId = (): string => process.env.COSMOS_DB_DATABASE || 'BooksDB';
export const containerId = (): string => process.env.COSMOS_DB_CONTAINER || 'Books';

// Creato alla prima richiesta e poi riusato finché l'istanza della Function App resta attiva
let container: Container | undefined;

export const getContainer = (): Container => {
  if (!container) {
    container = createCosmosClient().database(databaseId()).container(containerId());
  }
  return container;
};

/** Gli errori del SDK Cosmos hanno lo status HTTP in `code` (e in `statusCode`). */
export const hasStatus = (error: unknown, status: number): boolean => {
  if (typeof error !== 'object' || error === null) return false;
  const e = error as { code?: unknown; statusCode?: unknown };
  return e.code === status || e.statusCode === status;
};
