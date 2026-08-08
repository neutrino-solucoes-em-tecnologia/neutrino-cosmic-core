import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  server: {
    // 8080 era a porta do scaffold anterior; mantida para não quebrar o
    // endereço que já está aberto na aba de quem trabalha no projeto.
    port: process.env.PORT ? Number(process.env.PORT) : 8080,
  },
  build: {
    // O peso do bundle é argumento de venda nesta página, não detalhe de
    // infraestrutura: o rodapé mede e publica o número. Um aviso a 60KB existe
    // para que uma dependência nova não passe despercebida.
    chunkSizeWarningLimit: 60,
    cssMinify: 'lightningcss',
  },
})
