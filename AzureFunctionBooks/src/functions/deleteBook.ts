import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getContainer, hasStatus } from '../utils/cosmosClient';
import { errorResponse, jsonResponse } from '../utils/response';

/** DELETE /api/books/{id}: cancella il libro; 404 se non esiste. */
export async function deleteBook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  if (!id) return errorResponse(400, "L'id del libro è obbligatorio");

  try {
    await getContainer().item(id, id).delete();
    context.log('Libro cancellato:', id);
    return jsonResponse(200, { message: 'Libro cancellato', id });
  } catch (error) {
    if (hasStatus(error, 404)) return errorResponse(404, 'Libro non trovato');
    context.error('Errore nella cancellazione del libro:', error);
    return errorResponse(500, 'Impossibile cancellare il libro');
  }
}

app.http('deleteBook', {
  methods: ['DELETE'],
  authLevel: 'function',
  route: 'books/{id}',
  handler: deleteBook,
});
