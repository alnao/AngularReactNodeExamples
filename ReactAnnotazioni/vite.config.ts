/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Stessa porta usata con Create React App, così restano validi
    // gli URL documentati e la configurazione CORS del backend.
    port: 3000,
  },
  test: {
    environment: 'node',
  },
})
