import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082';

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
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per gestire errori di autenticazione
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Auth
export const authAPI = {
  login: (username, password) =>
    api.post('/api/auth/login', { username, password }),
  
  register: (userData) =>
    api.post('/api/auth/register', userData),
  
  logout: () =>
    api.post('/api/auth/logout'),
  
  getProfile: () =>
    api.get('/api/auth/me'),
  
  refreshToken: () =>
    api.post('/api/auth/refresh'),
};

// API Annotazioni
export const annotazioniAPI = {
  getAll: () =>
    api.get('/api/annotazioni'),
  
  getById: (id) =>
    api.get(`/api/annotazioni/${id}`),
  
  create: (data) =>
    api.post('/api/annotazioni', data),
  
  update: (id, data) =>
    api.put(`/api/annotazioni/${id}`, data),
  
  delete: (id) =>
    api.delete(`/api/annotazioni/${id}`),
  
  search: (testo) =>
    api.get('/api/annotazioni/cerca', { params: { testo } }),
  
  getByUtente: (utente) =>
    api.get(`/api/annotazioni/utente/${utente}`),
  
  getByCategoria: (categoria) =>
    api.get(`/api/annotazioni/categoria/${categoria}`),
  
  getByStato: (stato) =>
    api.get(`/api/annotazioni/stato/${stato}`),
  
  getPubbliche: () =>
    api.get('/api/annotazioni/pubbliche'),
  
  getStatistiche: () =>
    api.get('/api/annotazioni/statistiche'),
  
  getTransizioniStato: () =>
    api.get('/api/annotazioni/transizioni-stato'),
  
  cambiaStato: (id, data) =>
    api.patch(`/api/annotazioni/${id}/stato`, data),
  
  prenota: (id, utente, secondi = 60) =>
    api.post(`/api/annotazioni/${id}/prenota`, { utente, secondi }),
  
  rilasciaPrenotazione: (id, utente) =>
    api.delete(`/api/annotazioni/${id}/prenota`, { data: { utente } }),
  
  getStatoPrenotazione: (id) =>
    api.get(`/api/annotazioni/${id}/prenota/stato`),
};

export default api;
