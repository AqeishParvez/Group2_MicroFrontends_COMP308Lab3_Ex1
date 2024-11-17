import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        auth_mfe: 'http://localhost:4173/assets/remoteEntry.js',
        vitals_mfe: 'http://localhost:4174/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', '@apollo/client', 'graphql'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
});
