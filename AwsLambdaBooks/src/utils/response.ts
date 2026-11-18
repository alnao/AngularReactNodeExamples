import type { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Header CORS aggiunti a ogni risposta delle Lambda (integrazione proxy di API Gateway).
 * L'origine ammessa arriva dalla variabile ALLOWED_ORIGIN impostata nel template SAM.
 * Niente `Access-Control-Allow-Credentials`: l'API non usa cookie e quell'header
 * non è compatibile con un'origine `*`.
 */
const corsHeaders = (): Record<string, string> => ({
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'Content-Type,x-api-key',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
});

export const createResponse = (statusCode: number, body: unknown): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    ...corsHeaders(),
  },
  body: JSON.stringify(body),
});

export const createErrorResponse = (statusCode: number, message: string): APIGatewayProxyResult =>
  createResponse(statusCode, { error: message });

/** Legge il body JSON; se manca o non è JSON valido restituisce una risposta 400 pronta. */
export const parseJsonBody = (
  body: string | null,
): { ok: true; data: unknown } | { ok: false; response: APIGatewayProxyResult } => {
  if (!body) {
    return { ok: false, response: createErrorResponse(400, 'Il body della richiesta è obbligatorio') };
  }
  try {
    return { ok: true, data: JSON.parse(body) };
  } catch {
    return { ok: false, response: createErrorResponse(400, 'Il body non è un JSON valido') };
  }
};
