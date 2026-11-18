import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { toBook } from '../models/Book';
import { getContainer, hasStatus } from '../utils/cosmosClient';
import { errorResponse, jsonResponse } from '../utils/response';

/** GET /api/books/{id}: restituisce un libro oppure 404. */
export async function getBook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  if (!id) return errorResponse(400, "L'id del libro è obbligatorio");

  try {
    // La partition key è /id, quindi id e partition key coincidono
    const { resource } = await getContainer().item(id, id).read<Record<string, unknown>>();
    if (!resource) return errorResponse(404, 'Libro non trovato');
    return jsonResponse(200, toBook(resource));
  } catch (error) {
    if (hasStatus(error, 404)) return errorResponse(404, 'Libro non trovato');
    context.error('Errore nella lettura del libro:', error);
    return errorResponse(500, 'Impossibile leggere il libro');
  }
}

app.http('getBook', {
  methods: ['GET'],
  authLevel: 'function',
  route: 'books/{id}',
  handler: getBook,
});
