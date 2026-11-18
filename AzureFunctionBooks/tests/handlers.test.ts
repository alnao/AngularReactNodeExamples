/**
 * Test delle funzioni senza Azure: il container Cosmos DB è sostituito da un finto container
 * (vi.mock), quindi si controlla solo la logica delle funzioni.
 * HttpRequest e InvocationContext sono le classi di @azure/functions pensate anche per i test.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpRequest, InvocationContext } from '@azure/functions';

const fake = vi.hoisted(() => {
  const item = { read: vi.fn(), replace: vi.fn(), delete: vi.fn() };
  const fetchAll = vi.fn();
  const container = {
    items: { create: vi.fn(), readAll: vi.fn(() => ({ fetchAll })) },
    item: vi.fn(() => item),
  };
  return { item, fetchAll, container };
});

vi.mock('../src/utils/cosmosClient', async (importOriginal) => {
  const original = await importOriginal<typeof import('../src/utils/cosmosClient')>();
  return { ...original, getContainer: () => fake.container };
});

import { createBook } from '../src/functions/createBook';
import { deleteBook } from '../src/functions/deleteBook';
import { getBook } from '../src/functions/getBook';
import { listBooks } from '../src/functions/listBooks';
import { updateBook } from '../src/functions/updateBook';

const context = () => new InvocationContext({ logHandler: () => undefined });

const request = (method: string, options: { body?: string; id?: string } = {}) =>
  new HttpRequest({
    method,
    url: `http://localhost:7071/api/books${options.id ? `/${options.id}` : ''}`,
    body: options.body !== undefined ? { string: options.body } : undefined,
    params: options.id ? { id: options.id } : {},
  });

const cosmosError = (code: number) => Object.assign(new Error(`Cosmos ${code}`), { code });

const validBook = { title: 'Il nome della rosa', author: 'Umberto Eco', price: 20, type: 'storic' };
const systemFields = { _rid: 'x', _self: 'x', _etag: '"etag-1"', _attachments: 'x', _ts: 1 };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createBook', () => {
  it('crea il libro con id e timestamp e risponde 201', async () => {
    fake.container.items.create.mockImplementation(async (doc: object) => ({ resource: { ...doc, ...systemFields } }));
    const res = await createBook(request('POST', { body: JSON.stringify(validBook) }), context());

    expect(res.status).toBe(201);
    const body = res.jsonBody as Record<string, unknown>;
    expect(body.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(body).toMatchObject({ ...validBook, isbn: '', description: '' });
    expect(body).not.toHaveProperty('_etag');
  });

  it('normalizza i campi come li invia il form Angular (null e prezzo stringa)', async () => {
    fake.container.items.create.mockImplementation(async (doc: object) => ({ resource: doc }));
    const formValue = { id: null, title: ' Titolo ', author: 'Autore', price: '12.5', isbn: null, description: null, type: null };
    const res = await createBook(request('POST', { body: JSON.stringify(formValue) }), context());

    expect(res.status).toBe(201);
    expect(res.jsonBody).toMatchObject({ title: 'Titolo', price: 12.5, isbn: '', description: '', type: 'general' });
  });

  it('risponde 400 se il body non è JSON valido, senza chiamare Cosmos DB', async () => {
    const res = await createBook(request('POST', { body: '{non json' }), context());
    expect(res.status).toBe(400);
    expect(fake.container.items.create).not.toHaveBeenCalled();
  });

  it('risponde 400 se mancano title o author', async () => {
    const res = await createBook(request('POST', { body: JSON.stringify({ title: 'Solo titolo' }) }), context());
    expect(res.status).toBe(400);
  });

  it('risponde 500 se Cosmos DB fallisce', async () => {
    fake.container.items.create.mockRejectedValue(new Error('boom'));
    const res = await createBook(request('POST', { body: JSON.stringify(validBook) }), context());
    expect(res.status).toBe(500);
  });
});

describe('listBooks', () => {
  it('risponde { books } senza i campi di sistema di Cosmos DB', async () => {
    fake.fetchAll.mockResolvedValue({ resources: [{ id: '1', ...validBook, ...systemFields }] });
    const res = await listBooks(request('GET'), context());

    expect(res.status).toBe(200);
    const body = res.jsonBody as { books: Record<string, unknown>[] };
    expect(body.books).toHaveLength(1);
    expect(body.books[0]).not.toHaveProperty('_rid');
  });
});

describe('getBook', () => {
  it('restituisce il libro', async () => {
    fake.item.read.mockResolvedValue({ resource: { id: 'abc', ...validBook, ...systemFields } });
    const res = await getBook(request('GET', { id: 'abc' }), context());
    expect(res.status).toBe(200);
    expect(fake.container.item).toHaveBeenCalledWith('abc', 'abc');
  });

  it('risponde 404 se il libro non esiste', async () => {
    fake.item.read.mockResolvedValue({ resource: undefined, statusCode: 404 });
    const res = await getBook(request('GET', { id: 'nope' }), context());
    expect(res.status).toBe(404);
  });
});

describe('updateBook', () => {
  it("aggiorna il libro mantenendo createdAt e controllando l'_etag", async () => {
    fake.item.read.mockResolvedValue({ resource: { id: 'abc', ...validBook, createdAt: 111, ...systemFields } });
    fake.item.replace.mockImplementation(async (doc: object) => ({ resource: doc }));
    const res = await updateBook(request('PUT', { id: 'abc', body: JSON.stringify({ ...validBook, price: 30 }) }), context());

    expect(res.status).toBe(200);
    expect(res.jsonBody).toMatchObject({ id: 'abc', price: 30, createdAt: 111 });
    expect(fake.item.replace.mock.calls[0][1]).toEqual({ accessCondition: { type: 'IfMatch', condition: '"etag-1"' } });
  });

  it("risponde 404 e non crea nulla se l'id non esiste", async () => {
    fake.item.read.mockResolvedValue({ resource: undefined, statusCode: 404 });
    const res = await updateBook(request('PUT', { id: 'nope', body: JSON.stringify(validBook) }), context());
    expect(res.status).toBe(404);
    expect(fake.item.replace).not.toHaveBeenCalled();
  });

  it('risponde 409 se il libro è stato modificato nel frattempo', async () => {
    fake.item.read.mockResolvedValue({ resource: { id: 'abc', ...validBook, ...systemFields } });
    fake.item.replace.mockRejectedValue(cosmosError(412));
    const res = await updateBook(request('PUT', { id: 'abc', body: JSON.stringify(validBook) }), context());
    expect(res.status).toBe(409);
  });

  it('risponde 400 con dati incompleti, senza chiamare Cosmos DB', async () => {
    const res = await updateBook(request('PUT', { id: 'abc', body: JSON.stringify({ price: 3 }) }), context());
    expect(res.status).toBe(400);
    expect(fake.item.read).not.toHaveBeenCalled();
  });
});

describe('deleteBook', () => {
  it('cancella il libro', async () => {
    fake.item.delete.mockResolvedValue({});
    const res = await deleteBook(request('DELETE', { id: 'abc' }), context());
    expect(res.status).toBe(200);
    expect(res.jsonBody).toEqual({ message: 'Libro cancellato', id: 'abc' });
  });

  it('risponde 404 se il libro non esiste', async () => {
    fake.item.delete.mockRejectedValue(cosmosError(404));
    const res = await deleteBook(request('DELETE', { id: 'nope' }), context());
    expect(res.status).toBe(404);
  });
});
