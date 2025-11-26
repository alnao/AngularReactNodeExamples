import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCosmosContainer } from '../utils/cosmosClient';
import { createResponse, createErrorResponse } from '../utils/response';

export async function deleteBook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const id = request.params.id;
    
    if (!id) {
      return createErrorResponse(400, 'Book ID is required');
    }

    const container = getCosmosContainer();
    await container.item(id, id).delete();

    context.log('Book deleted:', id);
    return createResponse(200, { message: 'Book deleted successfully' });
  } catch (error: any) {
    if (error.code === 404) {
      return createErrorResponse(404, 'Book not found');
    }
    context.error('Error deleting book:', error);
    return createErrorResponse(500, 'Could not delete the book');
  }
}

app.http('deleteBook', {
  methods: ['DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'books/{id}',
  handler: deleteBook
});
