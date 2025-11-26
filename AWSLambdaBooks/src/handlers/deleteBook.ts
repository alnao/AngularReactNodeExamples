import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { createResponse, createErrorResponse } from '../utils/response';

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.pathParameters?.id) {
      return createErrorResponse(400, 'Book ID is required');
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE!,
      Key: {
        id: event.pathParameters.id
      }
    };

    await dynamoDb.send(new DeleteCommand(params));

    return createResponse(200, { message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return createErrorResponse(500, 'Could not delete the book');
  }
};
