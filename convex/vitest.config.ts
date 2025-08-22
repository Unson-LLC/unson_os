import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test-setup.ts'],
  },
  resolve: {
    alias: {
      '@': '/src',
      '~': '/',
    },
  },
})