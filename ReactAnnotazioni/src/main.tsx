import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Elemento #root non trovato in index.html');
}

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
