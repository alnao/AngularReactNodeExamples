import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { toBook } from '../models/Book';
import { getContainer } from '../utils/cosmosClient';
import { errorResponse, jsonResponse } from '../utils/response';

/**
 * GET /api/books: restituisce { books: [...] }, lo stesso formato di AwsLambdaBooks.
 * fetchAll legge tutte le pagine: va bene per un container piccolo; con molti dati
 * servirebbe una paginazione esposta al client (continuation token).
 */
export async function listBooks(_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const { resources } = await getContainer().items.readAll<Record<string, unknown>>().fetchAll();
    context.log('Libri letti:', resources.length);
    return jsonResponse(200, { books: resources.map(toBook) });
  } catch (error) {
    context.error("Errore nella lettura dell'elenco:", error);
    return errorResponse(500, "Impossibile leggere l'elenco dei libri");
  }
}

app.http('listBooks', {
  methods: ['GET'],
  authLevel: 'function',
  route: 'books',
  handler: listBooks,
});
