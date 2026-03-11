import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
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

    const result = await dynamoDb.send(new GetCommand(params));

    if (!result.Item) {
      return createErrorResponse(404, 'Book not found');
    }

    return createResponse(200, result.Item);
  } catch (error) {
    console.error('Error getting book:', error);
    return createErrorResponse(500, 'Could not fetch the book');
  }
};
