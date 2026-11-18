/**
 * Server HTTP locale che simula API Gateway: riceve le richieste del frontend,
 * costruisce l'evento come farebbe API Gateway e chiama gli stessi handler delle Lambda.
 * Usa DynamoDB Local, quindi non serve un account AWS.
 *
 *   npm run local:db     # avvia DynamoDB Local (Docker)
 *   npm run local:seed   # crea la tabella e carica i dati di esempio
 *   npm run local        # API su http://localhost:3001/books
 *
 * Differenza rispetto ad AWS: qui non si controlla l'header x-api-key.
 */
import './local-env';
import { createServer, type IncomingMessage } from 'node:http';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handler as createBook } from '../src/handlers/createBook';
import { handler as deleteBook } from '../src/handlers/deleteBook';
import { handler as getBook } from '../src/handlers/getBook';
import { handler as listBooks } from '../src/handlers/listBooks';
import { handler as updateBook } from '../src/handlers/updateBook';
import { createErrorResponse, createResponse } from '../src/utils/response';

type Handler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

/** Stesse rotte definite in template.yaml */
const routes: { method: string; pattern: RegExp; handler: Handler }[] = [
  { method: 'POST', pattern: /^\/books\/?$/, handler: createBook },
  { method: 'GET', pattern: /^\/books\/?$/, handler: listBooks },
  { method: 'GET', pattern: /^\/books\/([^/]+)$/, handler: getBook },
  { method: 'PUT', pattern: /^\/books\/([^/]+)$/, handler: updateBook },
  { method: 'DELETE', pattern: /^\/books\/([^/]+)$/, handler: deleteBook },
];

const readBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const method = req.method ?? 'GET';
  let result: APIGatewayProxyResult;

  if (method === 'OPTIONS') {
    // Preflight CORS del browser: su AWS la gestisce API Gateway
    result = { ...createResponse(204, null), body: '' };
  } else {
    const route = routes.find((r) => r.method === method && r.pattern.test(url.pathname));
    if (!route) {
      result = createErrorResponse(404, `Rotta non trovata: ${method} ${url.pathname}`);
    } else {
      const id = url.pathname.match(route.pattern)?.[1];
      const body = await readBody(req);
      const event = {
        httpMethod: method,
        path: url.pathname,
        resource: route.pattern.source,
        headers: req.headers as Record<string, string>,
        pathParameters: id ? { id: decodeURIComponent(id) } : null,
        queryStringParameters: Object.fromEntries(url.searchParams),
        body: body || null,
        isBase64Encoded: false,
      } as unknown as APIGatewayProxyEvent;
      result = await route.handler(event);
    }
  }

  console.log(`${new Date().toISOString()} ${method} ${url.pathname} -> ${result.statusCode}`);
  res.writeHead(result.statusCode, result.headers as Record<string, string>);
  res.end(result.body);
});

const port = Number(process.env.PORT);
server.listen(port, () => {
  console.log(`API locale su http://localhost:${port}/books (tabella ${process.env.TABLE_NAME} su ${process.env.DYNAMODB_ENDPOINT})`);
});
