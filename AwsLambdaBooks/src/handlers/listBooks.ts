import type { APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand, type ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, tableName } from '../utils/db';
import { createErrorResponse, createResponse } from '../utils/response';

/**
 * GET /books: restituisce { books: [...] }, il formato che si aspetta AngularBookExample.
 * Uno Scan legge al massimo 1 MB per chiamata: si continua finché c'è LastEvaluatedKey.
 * Va bene per una tabella piccola come questa; con molti dati servirebbe una paginazione
 * esposta al client (parametri limit/nextToken) o una Query su un indice.
 */
export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const books: Record<string, unknown>[] = [];
    let startKey: ScanCommandOutput['LastEvaluatedKey'];
    do {
      const page = await dynamoDb.send(
        new ScanCommand({ TableName: tableName(), ExclusiveStartKey: startKey }),
      );
      books.push(...(page.Items ?? []));
      startKey = page.LastEvaluatedKey;
    } while (startKey);

    return createResponse(200, { books });
  } catch (error) {
    console.error("Errore nella lettura dell'elenco:", error);
    return createErrorResponse(500, "Impossibile leggere l'elenco dei libri");
  }
};
