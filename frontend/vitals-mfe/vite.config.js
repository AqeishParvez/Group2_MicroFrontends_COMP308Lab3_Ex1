import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'vitals_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './VitalsApp': './src/App.jsx',
      },
      shared: ['react', 'react-dom', '@apollo/client', 'graphql'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  server: {
    port: 5174,
  },
});