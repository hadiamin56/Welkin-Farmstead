import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Hashed JS/CSS go to /static so they never collide with the photo folder in /assets.
export default defineConfig({
  plugins: [react()],
  build: { assetsDir: 'static' },
  // `npm run dev` + `npm start` (API on :8888) lets the admin work during development.
  server: { proxy: { '/api': 'http://localhost:8888', '/media': 'http://localhost:8888' } },
});
