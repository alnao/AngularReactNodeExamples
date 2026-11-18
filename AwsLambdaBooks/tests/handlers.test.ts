/**
 * Test degli handler senza AWS: il client DynamoDB è sostituito da un mock
 * (aws-sdk-client-mock), quindi si controlla solo la logica delle Lambda.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { handler as createBook } from '../src/handlers/createBook';
import { handler as deleteBook } from '../src/handlers/deleteBook';
import { handler as getBook } from '../src/handlers/getBook';
import { handler as listBooks } from '../src/handlers/listBooks';
import { handler as updateBook } from '../src/handlers/updateBook';

process.env.TABLE_NAME = 'books-test';
process.env.ALLOWED_ORIGIN = 'http://localhost:4200';

const ddb = mockClient(DynamoDBDocumentClient);

const event = (overrides: Partial<APIGatewayProxyEvent> = {}): APIGatewayProxyEvent =>
  ({ body: null, pathParameters: null, ...overrides }) as APIGatewayProxyEvent;

const conditionalFailed = () =>
  new ConditionalCheckFailedException({ message: 'The conditional request failed', $metadata: {} });

const validBook = { title: 'Il nome della rosa', author: 'Umberto Eco', price: 20, type: 'storic' };

beforeEach(() => {
  ddb.reset();
});

describe('createBook', () => {
  it('crea il libro con id e timestamp e risponde 201', async () => {
    ddb.on(PutCommand).resolves({});
    const res = await createBook(event({ body: JSON.stringify(validBook) }));

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(body).toMatchObject({ ...validBook, isbn: '', description: '' });
    expect(body.createdAt).toBe(body.updatedAt);

    const put = ddb.commandCalls(PutCommand)[0].args[0].input;
    expect(put.TableName).toBe('books-test');
    expect(put.ConditionExpression).toBe('attribute_not_exists(id)');
  });

  it('normalizza i campi come li invia il form Angular (null e prezzo stringa)', async () => {
    ddb.on(PutCommand).resolves({});
    const formValue = { id: null, title: ' Titolo ', author: 'Autore', price: '12.5', isbn: null, description: null, type: null };
    const res = await createBook(event({ body: JSON.stringify(formValue) }));

    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.body)).toMatchObject({ title: 'Titolo', price: 12.5, isbn: '', description: '', type: 'general' });
  });

  it('risponde 400 se il body non è JSON valido', async () => {
    const res = await createBook(event({ body: '{non json' }));
    expect(res.statusCode).toBe(400);
    expect(ddb.calls()).toHaveLength(0);
  });

  it('risponde 400 se manca il body', async () => {
    expect((await createBook(event())).statusCode).toBe(400);
  });

  it('risponde 400 se mancano title o author', async () => {
    const res = await createBook(event({ body: JSON.stringify({ title: 'Solo titolo' }) }));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toContain('title e author');
  });

  it('risponde 400 se il prezzo non è un numero valido', async () => {
    const res = await createBook(event({ body: JSON.stringify({ ...validBook, price: 'abc' }) }));
    expect(res.statusCode).toBe(400);
  });

  it('risponde 500 se DynamoDB fallisce', async () => {
    ddb.on(PutCommand).rejects(new Error('boom'));
    const res = await createBook(event({ body: JSON.stringify(validBook) }));
    expect(res.statusCode).toBe(500);
  });
});

describe('getBook', () => {
  it('restituisce il libro', async () => {
    ddb.on(GetCommand).resolves({ Item: { id: 'abc', ...validBook } });
    const res = await getBook(event({ pathParameters: { id: 'abc' } }));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).id).toBe('abc');
  });

  it('risponde 404 se il libro non esiste', async () => {
    ddb.on(GetCommand).resolves({});
    const res = await getBook(event({ pathParameters: { id: 'nope' } }));
    expect(res.statusCode).toBe(404);
  });

  it("risponde 400 senza l'id", async () => {
    expect((await getBook(event())).statusCode).toBe(400);
  });
});

describe('listBooks', () => {
  it('legge tutte le pagine dello Scan e risponde { books }', async () => {
    ddb
      .on(ScanCommand)
      .resolvesOnce({ Items: [{ id: '1' }], LastEvaluatedKey: { id: '1' } })
      .resolvesOnce({ Items: [{ id: '2' }] });
    const res = await listBooks();

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ books: [{ id: '1' }, { id: '2' }] });
    const calls = ddb.commandCalls(ScanCommand);
    expect(calls).toHaveLength(2);
    expect(calls[1].args[0].input.ExclusiveStartKey).toEqual({ id: '1' });
  });

  it('restituisce un elenco vuoto se la tabella è vuota', async () => {
    ddb.on(ScanCommand).resolves({});
    expect(JSON.parse((await listBooks()).body)).toEqual({ books: [] });
  });
});

describe('updateBook', () => {
  it('aggiorna il libro esistente', async () => {
    ddb.on(UpdateCommand).resolves({ Attributes: { id: 'abc', ...validBook } });
    const res = await updateBook(event({ pathParameters: { id: 'abc' }, body: JSON.stringify(validBook) }));

    expect(res.statusCode).toBe(200);
    const input = ddb.commandCalls(UpdateCommand)[0].args[0].input;
    expect(input.ConditionExpression).toBe('attribute_exists(id)');
    expect(input.Key).toEqual({ id: 'abc' });
  });

  it('risponde 404 invece di creare un libro nuovo se l\'id non esiste', async () => {
    ddb.on(UpdateCommand).rejects(conditionalFailed());
    const res = await updateBook(event({ pathParameters: { id: 'nope' }, body: JSON.stringify(validBook) }));
    expect(res.statusCode).toBe(404);
  });

  it('risponde 400 con dati incompleti, senza chiamare DynamoDB', async () => {
    const res = await updateBook(event({ pathParameters: { id: 'abc' }, body: JSON.stringify({ price: 3 }) }));
    expect(res.statusCode).toBe(400);
    expect(ddb.calls()).toHaveLength(0);
  });

  it('risponde 400 se il body non è JSON valido', async () => {
    const res = await updateBook(event({ pathParameters: { id: 'abc' }, body: 'xx' }));
    expect(res.statusCode).toBe(400);
  });
});

describe('deleteBook', () => {
  it('cancella il libro', async () => {
    ddb.on(DeleteCommand).resolves({});
    const res = await deleteBook(event({ pathParameters: { id: 'abc' } }));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ message: 'Libro cancellato', id: 'abc' });
  });

  it('risponde 404 se il libro non esiste', async () => {
    ddb.on(DeleteCommand).rejects(conditionalFailed());
    const res = await deleteBook(event({ pathParameters: { id: 'nope' } }));
    expect(res.statusCode).toBe(404);
  });
});

describe('header CORS', () => {
  it('usa ALLOWED_ORIGIN e non invia Allow-Credentials', async () => {
    ddb.on(ScanCommand).resolves({});
    const res = await listBooks();
    expect(res.headers?.['Access-Control-Allow-Origin']).toBe('http://localhost:4200');
    expect(res.headers).not.toHaveProperty('Access-Control-Allow-Credentials');
  });
});
