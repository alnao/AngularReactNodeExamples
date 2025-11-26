import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCosmosContainer } from '../utils/cosmosClient';
import { createResponse, createErrorResponse } from '../utils/response';

export async function getBook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const id = request.params.id;
    
    if (!id) {
      return createErrorResponse(400, 'Book ID is required');
    }

    const container = getCosmosContainer();
    const { resource: book } = await container.item(id, id).read();

    if (!book) {
      return createErrorResponse(404, 'Book not found');
    }

    context.log('Book retrieved:', id);
    return createResponse(200, book);
  } catch (error: any) {
    if (error.code === 404) {
      return createErrorResponse(404, 'Book not found');
    }
    context.error('Error getting book:', error);
    return createErrorResponse(500, 'Could not fetch the book');
  }
}

app.http('getBook', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'books/{id}',
  handler: getBook
});
