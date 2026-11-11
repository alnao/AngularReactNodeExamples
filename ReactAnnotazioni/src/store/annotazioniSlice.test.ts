import { describe, expect, it } from 'vitest';
import reducer, {
  cambiaStato,
  clearSelectedAnnotazione,
  deleteAnnotazione,
  fetchAnnotazioni,
  initialAnnotazioniState,
} from './annotazioniSlice';
import type { Annotazione } from '../types';

const nota = (id: string, stato = 'INSERITA'): Annotazione => ({
  id,
  descrizione: `Nota ${id}`,
  valoreNota: 'testo',
  stato,
});

describe('annotazioniSlice', () => {
  it('fetchAnnotazioni.pending attiva il loading e azzera l’errore', () => {
    const state = reducer({ ...initialAnnotazioniState, error: 'vecchio' }, fetchAnnotazioni.pending('', undefined));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchAnnotazioni.fulfilled salva gli elementi', () => {
    const items = [nota('1'), nota('2')];
    const state = reducer(initialAnnotazioniState, fetchAnnotazioni.fulfilled(items, '', undefined));
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(items);
  });

  it('fetchAnnotazioni.rejected salva il messaggio del backend', () => {
    const action = fetchAnnotazioni.rejected(null, '', undefined, 'Backend non raggiungibile');
    const state = reducer(initialAnnotazioniState, action);
    expect(state.error).toBe('Backend non raggiungibile');
  });

  it('cambiaStato.fulfilled sostituisce l’annotazione aggiornata', () => {
    const start = { ...initialAnnotazioniState, items: [nota('1'), nota('2')] };
    const action = cambiaStato.fulfilled(nota('2', 'CONFERMATA'), '', {
      id: '2',
      vecchioStato: 'INSERITA',
      nuovoStato: 'CONFERMATA',
      utente: 'mario',
    });
    const state = reducer(start, action);
    expect(state.items.map((i) => i.stato)).toEqual(['INSERITA', 'CONFERMATA']);
  });

  it('deleteAnnotazione.fulfilled rimuove l’elemento', () => {
    const start = { ...initialAnnotazioniState, items: [nota('1'), nota('2')] };
    const state = reducer(start, deleteAnnotazione.fulfilled('1', '', '1'));
    expect(state.items.map((i) => i.id)).toEqual(['2']);
  });

  it('clearSelectedAnnotazione azzera la selezione', () => {
    const start = { ...initialAnnotazioniState, selectedAnnotazione: nota('1') };
    expect(reducer(start, clearSelectedAnnotazione()).selectedAnnotazione).toBeNull();
  });
});
