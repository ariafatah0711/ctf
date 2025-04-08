import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteRemoveConsole from 'vite-plugin-remove-console';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    ViteRemoveConsole()
  ],
  // base: "/ctf/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // ← sesuaikan dengan tsconfig
    }
  },
})