export const createResponse = (statusCode: number, body: any, headers: any = {}) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      ...headers
    },
    body: JSON.stringify(body)
  };
};

export const createErrorResponse = (statusCode: number, message: string) => {
  return createResponse(statusCode, { error: message });
};
