import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Book } from '../models/Book';
import { getCosmosContainer } from '../utils/cosmosClient';
import { createResponse, createErrorResponse } from '../utils/response';

export async function updateBook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const id = request.params.id;
    
    if (!id) {
      return createErrorResponse(400, 'Book ID is required');
    }

    const body = await request.text();
    if (!body) {
      return createErrorResponse(400, 'Request body is required');
    }

    const timestamp = new Date().getTime();
    const data: Partial<Book> = JSON.parse(body);

    const container = getCosmosContainer();
    
    // Get existing book
    const { resource: existingBook } = await container.item(id, id).read();
    
    if (!existingBook) {
      return createErrorResponse(404, 'Book not found');
    }

    // Update book
    const updatedBook: Book = {
      ...existingBook,
      title: data.title || existingBook.title,
      author: data.author || existingBook.author,
      price: data.price !== undefined ? data.price : existingBook.price,
      isbn: data.isbn || existingBook.isbn,
      description: data.description || existingBook.description,
      type: data.type || existingBook.type,
      updatedAt: timestamp
    };

    await container.item(id, id).replace(updatedBook);

    context.log('Book updated:', id);
    return createResponse(200, updatedBook);
  } catch (error: any) {
    if (error.code === 404) {
      return createErrorResponse(404, 'Book not found');
    }
    context.error('Error updating book:', error);
    return createErrorResponse(500, 'Could not update the book');
  }
}

app.http('updateBook', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'books/{id}',
  handler: updateBook
});
