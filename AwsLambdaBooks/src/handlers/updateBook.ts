import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { validateBookInput } from '../models/Book';
import { dynamoDb, tableName } from '../utils/db';
import { createErrorResponse, createResponse, parseJsonBody } from '../utils/response';

/**
 * PUT /books/{id}: sostituisce i campi del libro (stessa validazione del POST).
 * UpdateItem da solo farebbe un "upsert" e creerebbe un libro nuovo se l'id non esiste:
 * la ConditionExpression lo impedisce e in quel caso si risponde 404.
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return createErrorResponse(400, "L'id del libro è obbligatorio");

  const parsed = parseJsonBody(event.body);
  if (!parsed.ok) return parsed.response;

  const validation = validateBookInput(parsed.data);
  if (!validation.ok) return createErrorResponse(400, validation.error);
  const book = validation.value;

  try {
    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: tableName(),
        Key: { id },
        ConditionExpression: 'attribute_exists(id)',
        UpdateExpression:
          'SET #title = :title, #author = :author, price = :price, isbn = :isbn, ' +
          'description = :description, #type = :type, updatedAt = :updatedAt',
        // title, author e type sono parole riservate di DynamoDB: servono gli alias #
        ExpressionAttributeNames: { '#title': 'title', '#author': 'author', '#type': 'type' },
        ExpressionAttributeValues: {
          ':title': book.title,
          ':author': book.author,
          ':price': book.price,
          ':isbn': book.isbn,
          ':description': book.description,
          ':type': book.type,
          ':updatedAt': Date.now(),
        },
        ReturnValues: 'ALL_NEW',
      }),
    );
    return createResponse(200, result.Attributes);
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      return createErrorResponse(404, 'Libro non trovato');
    }
    console.error("Errore nell'aggiornamento del libro:", error);
    return createErrorResponse(500, 'Impossibile aggiornare il libro');
  }
};
