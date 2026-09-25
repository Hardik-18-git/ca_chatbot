import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ca_chatbot/',
  plugins: [react()],
});
