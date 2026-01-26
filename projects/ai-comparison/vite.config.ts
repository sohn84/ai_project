import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3003,
    proxy: {
      // MCP 서버 프록시 설정 (CORS 우회)
      '/mcp': {
        target: 'https://boilingly-nonimpressionable-earnest.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
            proxyReq.setHeader('Accept', 'application/json, text/event-stream');
          });
        },
      },
    },
  },
})
