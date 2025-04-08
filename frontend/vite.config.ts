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
  // build: {
  //   terserOptions: {
  //     compress: {
  //       drop_console: true, // Menghapus semua console.log di build produksi
  //     },
  //   },
  // },
})