import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

/**
 * Client DynamoDB condiviso da tutti gli handler.
 * Creato fuori dall'handler, così viene riusato tra un'invocazione e l'altra della stessa Lambda.
 * In locale DYNAMODB_ENDPOINT punta a DynamoDB Local (vedi docker-compose.yml);
 * su AWS non è impostato e si usa l'endpoint standard della regione.
 */
export const dynamoDbClient = new DynamoDBClient(
  process.env.DYNAMODB_ENDPOINT ? { endpoint: process.env.DYNAMODB_ENDPOINT } : {},
);

export const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient, {
  marshallOptions: { removeUndefinedValues: true },
});

export const tableName = (): string => {
  const name = process.env.TABLE_NAME;
  if (!name) {
    throw new Error('Variabile TABLE_NAME non impostata');
  }
  return name;
};
