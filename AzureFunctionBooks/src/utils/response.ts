import type { HttpRequest, HttpResponseInit } from '@azure/functions';

/*
 * Il CORS non si gestisce qui: lo fa la piattaforma, sia su Azure
 * (az functionapp cors add, vedi start-all.sh) sia in locale
 * (Host.CORS in local.settings.json). La piattaforma risponde anche alla
 * preflight OPTIONS del browser prima di chiamare le funzioni.
 */

export const jsonResponse = (status: number, body: unknown): HttpResponseInit => ({
  status,
  jsonBody: body,
});

export const errorResponse = (status: number, message: string): HttpResponseInit =>
  jsonResponse(status, { error: message });

/** Legge il body JSON; se manca o non è JSON valido restituisce una risposta 400 pronta. */
export const parseJsonBody = async (
  request: HttpRequest,
): Promise<{ ok: true; data: unknown } | { ok: false; response: HttpResponseInit }> => {
  const text = await request.text();
  if (!text) {
    return { ok: false, response: errorResponse(400, 'Il body della richiesta è obbligatorio') };
  }
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false, response: errorResponse(400, 'Il body non è un JSON valido') };
  }
};
