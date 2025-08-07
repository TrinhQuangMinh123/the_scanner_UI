// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Thêm mục server và cấu hình proxy
  server: {
    proxy: {
      // Bất kỳ yêu cầu nào bắt đầu bằng /api hoặc /docs, /redoc, /health...
      // sẽ được chuyển tiếp đến server backend.
      '/api': {
        target: 'http://10.102.199.42:8000',
        changeOrigin: true,
      },
      '/docs': {
        target: 'http://10.102.199.42:8000',
        changeOrigin: true,
      },
      '/redoc': {
        target: 'http://10.102.199.42:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://10.102.199.42:8000',
        changeOrigin: true,
      },
      '/debug': {
        target: 'http://10.102.199.42:8000',
        changeOrigin: true,
      }
    }
  }
})