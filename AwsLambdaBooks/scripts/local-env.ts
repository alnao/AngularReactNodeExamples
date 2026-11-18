/**
 * Valori di default per lavorare in locale con DynamoDB Local (docker-compose.yml).
 * Va importato PRIMA degli handler, perché il client DynamoDB legge le variabili all'avvio.
 * Le credenziali sono finte: DynamoDB Local le accetta ma non le verifica.
 */
const defaults: Record<string, string> = {
  DYNAMODB_ENDPOINT: 'http://localhost:8000',
  TABLE_NAME: 'aws-js-AwsLambdaBooks-local',
  AWS_REGION: 'eu-central-1',
  AWS_ACCESS_KEY_ID: 'local',
  AWS_SECRET_ACCESS_KEY: 'local',
  ALLOWED_ORIGIN: 'http://localhost:4200',
  PORT: '3001',
};

for (const [key, value] of Object.entries(defaults)) {
  process.env[key] ??= value;
}

// Sicurezza: questi script lavorano solo su DynamoDB Local, mai sulla tabella su AWS
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(process.env.DYNAMODB_ENDPOINT!)) {
  throw new Error(`DYNAMODB_ENDPOINT deve puntare a localhost, trovato: ${process.env.DYNAMODB_ENDPOINT}`);
}
