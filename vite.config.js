import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Hashed JS/CSS go to /static so they never collide with the photo folder in /assets.
export default defineConfig({
  plugins: [react()],
  build: { assetsDir: 'static' },
});
