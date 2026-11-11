import { describe, expect, it } from 'vitest';
import reducer, { clearError, getInitialAuthState, login, logout } from './authSlice';

const credenziali = { username: 'mario', password: 'segreta' };

describe('authSlice', () => {
  it('senza localStorage parte non autenticato', () => {
    const state = getInitialAuthState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
  });

  it('login.fulfilled salva token e utente', () => {
    const payload = { token: 'jwt', user: { username: 'mario', role: 'USER' } };
    const state = reducer(getInitialAuthState(), login.fulfilled(payload, '', credenziali));
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('jwt');
    expect(state.user?.username).toBe('mario');
  });

  it('login.rejected salva il messaggio d’errore', () => {
    const action = login.rejected(null, '', credenziali, 'Credenziali errate');
    const state = reducer(getInitialAuthState(), action);
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe('Credenziali errate');
  });

  it('logout.fulfilled azzera la sessione', () => {
    const logged = { ...getInitialAuthState(), token: 'jwt', isAuthenticated: true };
    const state = reducer(logged, logout.fulfilled(null, ''));
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
  });

  it('clearError azzera l’errore', () => {
    const state = reducer({ ...getInitialAuthState(), error: 'x' }, clearError());
    expect(state.error).toBeNull();
  });
});
