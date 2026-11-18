/**
 * Crea la tabella su DynamoDB Local (se non esiste) e carica i libri di esempio.
 * Gli id sono fissi, quindi rilanciare lo script non crea duplicati.
 * Lavora solo in locale (vedi il controllo in local-env.ts): su AWS i dati si caricano
 * con le chiamate curl descritte nel README.
 */
import './local-env';
import { CreateTableCommand, DescribeTableCommand, ResourceNotFoundException } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import type { Book } from '../src/models/Book';
import { dynamoDb, dynamoDbClient, tableName } from '../src/utils/db';

const now = Date.now();
const sampleBooks: Book[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    title: 'Il nome della rosa',
    author: 'Umberto Eco',
    price: 20,
    isbn: 'DEMO-0001',
    description: 'Giallo storico ambientato in un monastero nel 1327',
    type: 'storic',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    title: 'Il Diario di Anna Frank',
    author: 'Anna Frank',
    price: 12,
    isbn: 'DEMO-0002',
    description: 'Diario scritto durante la Seconda guerra mondiale',
    type: 'storic',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    title: 'Gli arancini di Montalbano',
    author: 'Andrea Camilleri',
    price: 11,
    isbn: 'DEMO-0003',
    description: 'Racconti del commissario Montalbano',
    type: 'yellow',
    createdAt: now,
    updatedAt: now,
  },
];

const ensureTable = async (name: string): Promise<void> => {
  try {
    await dynamoDbClient.send(new DescribeTableCommand({ TableName: name }));
    console.log(`Tabella ${name} già presente`);
  } catch (error) {
    if (!(error instanceof ResourceNotFoundException)) throw error;
    // Stessa chiave e modalità di billing della tabella definita in template.yaml
    await dynamoDbClient.send(
      new CreateTableCommand({
        TableName: name,
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      }),
    );
    console.log(`Tabella ${name} creata`);
  }
};

const main = async (): Promise<void> => {
  const name = tableName();
  await ensureTable(name);
  for (const book of sampleBooks) {
    await dynamoDb.send(new PutCommand({ TableName: name, Item: book }));
    console.log(`Caricato: ${book.title}`);
  }
};

main().catch((error) => {
  console.error('Seed non riuscito. DynamoDB Local è avviato? (npm run local:db)');
  console.error(error);
  process.exit(1);
});
