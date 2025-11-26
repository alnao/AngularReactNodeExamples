import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { createResponse, createErrorResponse } from '../utils/response';

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE!
    };

    const result = await dynamoDb.send(new ScanCommand(params));

    return createResponse(200, { books: result.Items || [] });
  } catch (error) {
    console.error('Error listing books:', error);
    return createErrorResponse(500, 'Could not fetch the books');
  }
};
