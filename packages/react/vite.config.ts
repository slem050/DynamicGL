import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), dts({ include: ['src/**/*'] })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DynamicGLReact',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei', '@dynamicgl/core', '@dynamicgl/charts'],
    },
    sourcemap: true,
  },
});

