import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Porta que deseja usar durante a execução local (desenvolvimento)
const devPort = 3002;

export default defineConfig({
  plugins: [react()],
  server: {
    port: devPort
  }
});
