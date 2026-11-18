/** Libro salvato nella tabella DynamoDB. */
export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  isbn: string;
  description: string;
  type: string;
  createdAt: number;
  updatedAt: number;
}

/** Campi che il client può inviare in POST e PUT (id e timestamp li gestisce il backend). */
export type BookInput = Pick<Book, 'title' | 'author' | 'price' | 'isbn' | 'description' | 'type'>;

export type ValidationResult =
  | { ok: true; value: BookInput }
  | { ok: false; error: string };

const isEmpty = (value: unknown): boolean => value === undefined || value === null || value === '';

/** Stringa obbligatoria: deve esserci e non essere vuota dopo il trim. */
const requiredString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : null;

/** Stringa facoltativa: null/undefined diventano il valore di default. */
const optionalString = (value: unknown, fallback: string): string | null => {
  if (isEmpty(value)) return fallback;
  return typeof value === 'string' ? value.trim() : null;
};

/**
 * Valida il body di POST e PUT.
 * Il frontend Angular invia i form così come sono: i campi vuoti arrivano come null o ''
 * e il prezzo può arrivare come stringa numerica, quindi qui si normalizza.
 * I campi in più (per esempio `id` nel form di dettaglio) vengono ignorati.
 */
export const validateBookInput = (data: unknown): ValidationResult => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { ok: false, error: 'Il body deve essere un oggetto JSON' };
  }
  const input = data as Record<string, unknown>;

  const title = requiredString(input.title);
  const author = requiredString(input.author);
  if (!title || !author) {
    return { ok: false, error: 'title e author sono obbligatori' };
  }

  let price = 0;
  if (!isEmpty(input.price)) {
    price = typeof input.price === 'string' ? Number(input.price) : (input.price as number);
    if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
      return { ok: false, error: 'price deve essere un numero maggiore o uguale a zero' };
    }
  }

  const isbn = optionalString(input.isbn, '');
  const description = optionalString(input.description, '');
  const type = optionalString(input.type, 'general');
  if (isbn === null || description === null || type === null) {
    return { ok: false, error: 'isbn, description e type devono essere stringhe' };
  }

  return { ok: true, value: { title, author, price, isbn, description, type } };
};
