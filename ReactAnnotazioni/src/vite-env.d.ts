/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base del backend Annotazioni, es. http://localhost:8082 */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Bundle JS di Bootstrap importato solo per i side effect (dropdown, collapse).
declare module 'bootstrap/dist/js/bootstrap.bundle.min.js';
