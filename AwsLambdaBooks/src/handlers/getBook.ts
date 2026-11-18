import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, tableName } from '../utils/db';
import { createErrorResponse, createResponse } from '../utils/response';

/** GET /books/{id}: restituisce un libro oppure 404. */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return createErrorResponse(400, "L'id del libro è obbligatorio");

  try {
    const result = await dynamoDb.send(new GetCommand({ TableName: tableName(), Key: { id } }));
    if (!result.Item) return createErrorResponse(404, 'Libro non trovato');
    return createResponse(200, result.Item);
  } catch (error) {
    console.error('Errore nella lettura del libro:', error);
    return createErrorResponse(500, 'Impossibile leggere il libro');
  }
};
