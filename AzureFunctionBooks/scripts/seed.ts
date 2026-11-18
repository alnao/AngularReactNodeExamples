/**
 * Crea database e container sull'emulatore Cosmos DB (se non esistono) e carica i libri di esempio.
 * Legge la configurazione da local.settings.json (o da local.settings.example.json).
 * Gli id sono fissi, quindi rilanciare lo script non crea duplicati.
 * Lavora solo in locale: su Azure database e container li crea start-all.sh.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Book } from '../src/models/Book';

const root = join(__dirname, '..');
const settingsFile = existsSync(join(root, 'local.settings.json')) ? 'local.settings.json' : 'local.settings.example.json';
const settings = JSON.parse(readFileSync(join(root, settingsFile), 'utf8')) as { Values: Record<string, string> };
for (const [key, value] of Object.entries(settings.Values)) {
  process.env[key] ??= value;
}

// Sicurezza: lo script scrive solo sull'emulatore, mai su un account Cosmos DB su Azure
const endpoint = /AccountEndpoint=([^;]+)/.exec(process.env.COSMOS_DB_CONNECTION_STRING ?? '')?.[1] ?? '';
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(endpoint)) {
  throw new Error(`Il seed lavora solo sull'emulatore locale, endpoint trovato: "${endpoint}"`);
}

const now = Date.now();
const sampleBooks: Book[] = [
  { id: '00000000-0000-4000-8000-000000000001', title: 'Il nome della rosa', author: 'Umberto Eco', price: 20, isbn: 'DEMO-0001', description: 'Giallo storico ambientato in un monastero nel 1327', type: 'storic', createdAt: now, updatedAt: now },
  { id: '00000000-0000-4000-8000-000000000002', title: 'Il Diario di Anna Frank', author: 'Anna Frank', price: 12, isbn: 'DEMO-0002', description: 'Diario scritto durante la Seconda guerra mondiale', type: 'storic', createdAt: now, updatedAt: now },
  { id: '00000000-0000-4000-8000-000000000003', title: 'Gli arancini di Montalbano', author: 'Andrea Camilleri', price: 11, isbn: 'DEMO-0003', description: 'Racconti del commissario Montalbano', type: 'yellow', createdAt: now, updatedAt: now },
];

const main = async (): Promise<void> => {
  // Import dinamico: il client va creato dopo aver impostato le variabili d'ambiente
  const { createCosmosClient, databaseId, containerId } = await import('../src/utils/cosmosClient');
  const client = createCosmosClient();
  const { database } = await client.databases.createIfNotExists({ id: databaseId() });
  // Stessa partition key del container creato da start-all.sh
  const { container } = await database.containers.createIfNotExists({ id: containerId(), partitionKey: { paths: ['/id'] } });
  console.log(`Container ${databaseId()}/${containerId()} pronto su ${endpoint}`);
  for (const book of sampleBooks) {
    await container.items.upsert(book);
    console.log(`Caricato: ${book.title}`);
  }
};

main().catch((error) => {
  console.error("Seed non riuscito. L'emulatore Cosmos DB è avviato? (npm run local:db, poi attendere qualche secondo)");
  console.error(error);
  process.exit(1);
});
