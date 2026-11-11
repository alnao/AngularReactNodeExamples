import axios, { isAxiosError } from 'axios';
import type {
  Annotazione,
  AnnotazioneForm,
  CambioStatoRequest,
  LoginResponse,
  Prenotazione,
  TransizioneStato,
  User,
} from '../types';

// Configurabile con VITE_API_BASE_URL (vedi .env.example).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

// Crea istanza axios con configurazione base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere token JWT ad ogni richiesta
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor per gestire errori di autenticazione
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

/** Estrae il messaggio d'errore del backend, con un fallback leggibile. */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

// API Auth
export const authAPI = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>('/api/auth/login', { username, password }),

  register: (userData: Record<string, unknown>) => api.post('/api/auth/register', userData),

  logout: () => api.post('/api/auth/logout'),

  getProfile: () => api.get<User>('/api/auth/me'),

  refreshToken: () => api.post<LoginResponse>('/api/auth/refresh'),
};

// API Annotazioni
export const annotazioniAPI = {
  getAll: () => api.get<Annotazione[]>('/api/annotazioni'),

  getById: (id: string) => api.get<Annotazione>(`/api/annotazioni/${id}`),

  create: (data: AnnotazioneForm) => api.post<Annotazione>('/api/annotazioni', data),

  update: (id: string, data: Partial<Annotazione> & Partial<AnnotazioneForm>) =>
    api.put<Annotazione>(`/api/annotazioni/${id}`, data),

  delete: (id: string) => api.delete(`/api/annotazioni/${id}`),

  search: (testo: string) => api.get<Annotazione[]>('/api/annotazioni/cerca', { params: { testo } }),

  getByUtente: (utente: string) => api.get<Annotazione[]>(`/api/annotazioni/utente/${utente}`),

  getByCategoria: (categoria: string) =>
    api.get<Annotazione[]>(`/api/annotazioni/categoria/${categoria}`),

  getByStato: (stato: string) => api.get<Annotazione[]>(`/api/annotazioni/stato/${stato}`),

  getPubbliche: () => api.get<Annotazione[]>('/api/annotazioni/pubbliche'),

  getStatistiche: () => api.get<Record<string, unknown>>('/api/annotazioni/statistiche'),

  getTransizioniStato: () => api.get<TransizioneStato[]>('/api/annotazioni/transizioni-stato'),

  cambiaStato: (id: string, data: CambioStatoRequest) =>
    api.patch<Annotazione>(`/api/annotazioni/${id}/stato`, data),

  prenota: (id: string, utente: string | undefined, secondi = 60) =>
    api.post<Prenotazione>(`/api/annotazioni/${id}/prenota`, { utente, secondi }),

  rilasciaPrenotazione: (id: string, utente: string | undefined) =>
    api.delete(`/api/annotazioni/${id}/prenota`, { data: { utente } }),

  getStatoPrenotazione: (id: string) => api.get<Prenotazione>(`/api/annotazioni/${id}/prenota/stato`),
};

export default api;
