import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteRemoveConsole from 'vite-plugin-remove-console';
import path from 'path';

export default defineConfig({
  // base: "/ctf/",
  // root: './src',
  plugins: [
    vue(),
    ViteRemoveConsole()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // ← sesuaikan dengan tsconfig
    }
  },
})