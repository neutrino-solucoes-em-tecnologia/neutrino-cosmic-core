# Neutrino — site institucional

Landing de página única, em React 19 + Vite 7 + Tailwind 4, com três dependências
em produção: React, React DOM e a fonte.

A restrição é deliberada. A seção `Esta página` mede o próprio peso em runtime e
publica o número — então cada dependência nova torna uma afirmação da página
menos verdadeira. Antes de instalar qualquer coisa, leia
[DESIGN.md](DESIGN.md) § "Prova, não asserção".

## Rodar

```bash
npm install
npm run dev
```

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | typecheck → bundle → gera OG e favicons |
| `npm run typecheck` | só o TypeScript |
| `npm run lint` | ESLint |
| `npm run og` | regenera `og-image.png` e os favicons a partir do script |

## Onde as coisas estão

```
src/
  config/site.ts        tudo que aponta para fora: contato, nav, dados legais
  index.css             tokens da paleta Cherenkov (@theme do Tailwind 4)
  scene/                o detector — Canvas 2D, sem WebGL
  sections/<nome>/      model.ts (conteúdo) + <Nome>Section.tsx (layout)
  site/                 Navbar, Footer, Section, Cta, Reveal, roteador
  pages/                Home, Privacidade, NotFound
scripts/build-og.mjs    gera og-image.png e favicons a partir da identidade
```

Conteúdo mora em `model.ts`, nunca dentro do JSX. Trocar um número de caso ou
um passo do método não deve exigir abrir um arquivo com `className` dentro.

## Documentos

- **[DESIGN.md](DESIGN.md)** — a identidade: de onde vem, paleta, tipografia,
  a gramática da cena e a lista do que não fazer. É contrato, não sugestão.
- **[PRODUCT.md](PRODUCT.md)** — o que a página afirma, com que autoridade, e as
  pendências que bloqueiam o lançamento (preço, CNPJ, auditoria dos números).

## Publicar

Deploy na Vercel a partir da `main`. `vercel.json` traz CSP, HSTS e cache
imutável para `/assets`. Não há variável de ambiente e não há backend.
