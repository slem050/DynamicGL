import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DynamicGLCharts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['three', '@dynamicgl/core'],
    },
    sourcemap: true,
  },
  plugins: [dts({ include: ['src/**/*'] })],
});

