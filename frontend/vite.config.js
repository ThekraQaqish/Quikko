import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    open: true,
    port: 5173,
    fs: {
      strict: false
    },
  },
  build: {
    rollupOptions: {
      input: '/index.html',
    },
  },
})

