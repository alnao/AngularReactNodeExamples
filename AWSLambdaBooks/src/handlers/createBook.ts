import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { Book } from '../models/Book';
import { createResponse, createErrorResponse } from '../utils/response';

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const timestamp = new Date().getTime();
    
    if (!event.body) {
      return createErrorResponse(400, 'Request body is required');
    }

    const data: Partial<Book> = JSON.parse(event.body);

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

    const params = {
      TableName: process.env.DYNAMODB_TABLE!,
      Item: book
    };

    await dynamoDb.send(new PutCommand(params));

    return createResponse(201, book);
  } catch (error) {
    console.error('Error creating book:', error);
    return createErrorResponse(500, 'Could not create the book');
  }
};
