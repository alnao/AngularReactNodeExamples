import { randomUUID } from 'node:crypto';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { Book, validateBookInput } from '../models/Book';
import { dynamoDb, tableName } from '../utils/db';
import { createErrorResponse, createResponse, parseJsonBody } from '../utils/response';

/** POST /books: crea un libro con id generato dal backend. */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const parsed = parseJsonBody(event.body);
  if (!parsed.ok) return parsed.response;

  const validation = validateBookInput(parsed.data);
  if (!validation.ok) return createErrorResponse(400, validation.error);

  const now = Date.now();
  const book: Book = {
    id: randomUUID(),
    ...validation.value,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await dynamoDb.send(
      new PutCommand({
        TableName: tableName(),
        Item: book,
        // Protezione (teorica) contro una collisione di UUID: non sovrascrive mai un libro esistente
        ConditionExpression: 'attribute_not_exists(id)',
      }),
    );
    return createResponse(201, book);
  } catch (error) {
    console.error('Errore nella creazione del libro:', error);
    return createErrorResponse(500, 'Impossibile creare il libro');
  }
};
