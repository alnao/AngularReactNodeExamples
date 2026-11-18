import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Book, toBook, validateBookInput } from '../models/Book';
import { getContainer, hasStatus } from '../utils/cosmosClient';
import { errorResponse, jsonResponse, parseJsonBody } from '../utils/response';

/**
 * PUT /api/books/{id}: sostituisce i campi del libro (stessa validazione del POST).
 * Legge il documento per avere createdAt e l'_etag, poi lo sostituisce solo se nel frattempo
 * nessuno l'ha modificato (IfMatch sull'_etag); in caso contrario risponde 409.
 */
export async function updateBook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  if (!id) return errorResponse(400, "L'id del libro è obbligatorio");

  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const validation = validateBookInput(parsed.data);
  if (!validation.ok) return errorResponse(400, validation.error);

  try {
    const item = getContainer().item(id, id);
    const { resource: existing } = await item.read<Record<string, unknown>>();
    if (!existing) return errorResponse(404, 'Libro non trovato');

    const updated: Book = {
      id,
      ...validation.value,
      createdAt: (existing.createdAt as number) ?? Date.now(),
      updatedAt: Date.now(),
    };
    const { resource } = await item.replace(updated, {
      accessCondition: { type: 'IfMatch', condition: existing._etag as string },
    });
    context.log('Libro aggiornato:', id);
    return jsonResponse(200, toBook(resource ?? updated));
  } catch (error) {
    if (hasStatus(error, 404)) return errorResponse(404, 'Libro non trovato');
    if (hasStatus(error, 412)) return errorResponse(409, 'Il libro è stato modificato da un altro utente, ricaricarlo');
    context.error("Errore nell'aggiornamento del libro:", error);
    return errorResponse(500, 'Impossibile aggiornare il libro');
  }
}

app.http('updateBook', {
  methods: ['PUT'],
  authLevel: 'function',
  route: 'books/{id}',
  handler: updateBook,
});
