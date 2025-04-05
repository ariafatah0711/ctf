import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  // base: "/ctf/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // ← sesuaikan dengan tsconfig
    }
  }
})
