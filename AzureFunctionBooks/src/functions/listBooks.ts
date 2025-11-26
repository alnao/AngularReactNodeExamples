import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCosmosContainer } from '../utils/cosmosClient';
import { createResponse, createErrorResponse } from '../utils/response';

export async function listBooks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const container = getCosmosContainer();
    const { resources: books } = await container.items.readAll().fetchAll();

    context.log('Books listed:', books.length);
    return createResponse(200, { books });
  } catch (error) {
    context.error('Error listing books:', error);
    return createErrorResponse(500, 'Could not fetch the books');
  }
}

app.http('listBooks', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'books',
  handler: listBooks
});
