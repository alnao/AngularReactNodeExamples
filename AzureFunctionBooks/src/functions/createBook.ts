import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { v4 as uuidv4 } from 'uuid';
import { Book } from '../models/Book';
import { getCosmosContainer } from '../utils/cosmosClient';
import { createResponse, createErrorResponse } from '../utils/response';

export async function createBook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const timestamp = new Date().getTime();
    const body = await request.text();
    
    if (!body) {
      return createErrorResponse(400, 'Request body is required');
    }

    const data: Partial<Book> = JSON.parse(body);

    // Validation
    if (!data.title || !data.author) {
      return createErrorResponse(400, 'Title and author are required');
    }

    const book: Book = {
      id: uuidv4(),
      title: data.title,
      author: data.author,
      price: data.price || 0,
      isbn: data.isbn || '',
      description: data.description || '',
      type: data.type || 'general',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const container = getCosmosContainer();
    await container.items.create(book);

    context.log('Book created:', book.id);
    return createResponse(201, book);
  } catch (error) {
    context.error('Error creating book:', error);
    return createErrorResponse(500, 'Could not create the book');
  }
}

app.http('createBook', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'books',
  handler: createBook
});
