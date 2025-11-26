import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export const createResponse = (statusCode: number, body: any): HttpResponseInit => {
  return {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    jsonBody: body
  };
};

export const createErrorResponse = (statusCode: number, message: string): HttpResponseInit => {
  return createResponse(statusCode, { error: message });
};
