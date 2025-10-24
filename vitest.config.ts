import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    threads: false,
    server: {
      deps: {
        // This is necessary to make the WASM module work in Vitest
        inline: ['@dimforge/rapier3d'],
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})