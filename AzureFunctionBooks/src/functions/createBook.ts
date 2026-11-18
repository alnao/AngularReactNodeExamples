import { randomUUID } from 'node:crypto';
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Book, toBook, validateBookInput } from '../models/Book';
import { getContainer } from '../utils/cosmosClient';
import { errorResponse, jsonResponse, parseJsonBody } from '../utils/response';

/** POST /api/books: crea un libro con id generato dal backend. */
export async function createBook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;

  const validation = validateBookInput(parsed.data);
  if (!validation.ok) return errorResponse(400, validation.error);

  const now = Date.now();
  const book: Book = { id: randomUUID(), ...validation.value, createdAt: now, updatedAt: now };

  try {
    // items.create fallisce con 409 se l'id esiste già: non sovrascrive mai un libro
    const { resource } = await getContainer().items.create(book);
    context.log('Libro creato:', book.id);
    return jsonResponse(201, toBook(resource ?? book));
  } catch (error) {
    context.error('Errore nella creazione del libro:', error);
    return errorResponse(500, 'Impossibile creare il libro');
  }
}

app.http('createBook', {
  methods: ['POST'],
  authLevel: 'function',
  route: 'books',
  handler: createBook,
});
