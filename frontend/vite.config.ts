import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/ · https://vitest.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // Lógica pura roda direto no Node, bem mais rápido. Testes que desenham na tela pedem o navegador simulado no topo
    // do arquivo, com o comentário `// @vitest-environment jsdom`.
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    // Os testes não dependem da API: sem VITE_API_URL, o catálogo usa os dados de exemplo.
    env: { VITE_API_URL: '' },
    restoreMocks: true,
    // Os testes de rota esperam as páginas carregadas sob demanda serem compiladas, o que é lento na primeira vez.
    testTimeout: 15_000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx', 'src/**/index.ts', 'src/env.d.ts'],
    },
  },
})
