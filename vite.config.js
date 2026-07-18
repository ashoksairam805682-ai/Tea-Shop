import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config for the Tea Shop Billing System (pure front-end, no backend)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
