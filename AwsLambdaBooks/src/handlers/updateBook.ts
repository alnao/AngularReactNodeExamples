import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Book } from '../models/Book';
import { createResponse, createErrorResponse } from '../utils/response';

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.pathParameters?.id) {
      return createErrorResponse(400, 'Book ID is required');
    }

    if (!event.body) {
      return createErrorResponse(400, 'Request body is required');
    }

    const timestamp = new Date().getTime();
    const data: Partial<Book> = JSON.parse(event.body);

    const params = {
      TableName: process.env.DYNAMODB_TABLE!,
      Key: {
        id: event.pathParameters.id
      },
      UpdateExpression: 'SET #title = :title, #author = :author, price = :price, isbn = :isbn, description = :description, #type = :type, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#author': 'author',
        '#type': 'type'
      },
      ExpressionAttributeValues: {
        ':title': data.title,
        ':author': data.author,
        ':price': data.price,
        ':isbn': data.isbn,
        ':description': data.description,
        ':type': data.type,
        ':updatedAt': timestamp
      },
      ReturnValues: 'ALL_NEW' as const
    };

    const result = await dynamoDb.send(new UpdateCommand(params));

    return createResponse(200, result.Attributes);
  } catch (error) {
    console.error('Error updating book:', error);
    return createErrorResponse(500, 'Could not update the book');
  }
};
