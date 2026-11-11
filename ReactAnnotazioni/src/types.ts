// Tipi condivisi tra API, slice Redux e componenti.
// Rispecchiano i payload del backend descritti in API.md.

export const STATI_ANNOTAZIONE = [
  'INSERITA',
  'MODIFICATA',
  'CONFERMATA',
  'RIFIUTATA',
  'DAINVIARE',
  'INVIATA',
  'SCADUTA',
  'BANNATA',
  'ERRORE',
] as const;

export type StatoAnnotazione = (typeof STATI_ANNOTAZIONE)[number];

/** Stati in cui un'annotazione può ancora essere modificata. */
export const isModificabile = (stato: string | undefined): boolean =>
  stato === 'INSERITA' || stato === 'MODIFICATA';

export interface User {
  username: string;
  email?: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email?: string;
  role?: string;
}

export interface Annotazione {
  id: string;
  versioneNota?: string | number;
  valoreNota: string;
  descrizione: string;
  utenteCreazione?: string;
  utenteUltimaModifica?: string;
  dataInserimento?: string;
  dataUltimaModifica?: string;
  categoria?: string;
  tags?: string;
  pubblica?: boolean;
  priorita?: number;
  stato: StatoAnnotazione | string;
}

/** Campi modificabili dal form di creazione/modifica. */
export interface AnnotazioneForm {
  valoreNota: string;
  descrizione: string;
  utente: string;
  categoria: string;
  tags: string;
  pubblica: boolean;
  priorita: number;
}

export interface TransizioneStato {
  statoPartenza: string;
  statoArrivo: string;
  [key: string]: unknown;
}

export interface CambioStatoRequest {
  vecchioStato: string;
  nuovoStato: string;
  utente?: string;
}

/** Risposta del backend alla prenotazione: il formato non è vincolato dal frontend. */
export type Prenotazione = Record<string, unknown>;
