import { CosmosClient, Database, Container } from '@azure/cosmos';

let cosmosClient: CosmosClient;
let database: Database;
let container: Container;

export const getCosmosContainer = (): Container => {
  if (!container) {
    const connectionString = process.env.COSMOS_DB_CONNECTION_STRING!;
    const databaseId = process.env.COSMOS_DB_DATABASE || 'BooksDB';
    const containerId = process.env.COSMOS_DB_CONTAINER || 'Books';

    cosmosClient = new CosmosClient(connectionString);
    database = cosmosClient.database(databaseId);
    container = database.container(containerId);
  }

  return container;
};
