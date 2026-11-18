import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, tableName } from '../utils/db';
import { createErrorResponse, createResponse } from '../utils/response';

/** DELETE /books/{id}: cancella il libro; 404 se non esiste. */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return createErrorResponse(400, "L'id del libro è obbligatorio");

  try {
    await dynamoDb.send(
      new DeleteCommand({
        TableName: tableName(),
        Key: { id },
        ConditionExpression: 'attribute_exists(id)',
      }),
    );
    return createResponse(200, { message: 'Libro cancellato', id });
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      return createErrorResponse(404, 'Libro non trovato');
    }
    console.error('Errore nella cancellazione del libro:', error);
    return createErrorResponse(500, 'Impossibile cancellare il libro');
  }
};
