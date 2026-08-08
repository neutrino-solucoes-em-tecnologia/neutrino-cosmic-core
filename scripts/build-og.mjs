/**
 * Gera og-image.png e os favicons a partir da identidade descrita em DESIGN.md.
 *
 * Roda no fim de `npm run build`. Existe porque o site anterior apontava
 * `og:image` para um .svg — WhatsApp, LinkedIn, Facebook e X não renderizam SVG
 * em Open Graph, então todo link compartilhado saía sem imagem — e porque
 * `apple-touch-icon.png`, `favicon-32x32.png` e `favicon-16x16.png` eram
 * referenciados no HTML e no manifest sem existir em `public/`.
 *
 * A arte é a cena do detector congelada num instante: grade de sensores, um
 * anel Cherenkov aberto e os sensores que ele acendeu na passagem.
 */
import { Resvg } from '@resvg/resvg-js'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = resolve(root, 'public')

const MINE = '#07090C'
const CHERENKOV = '#FFB020'
const LIT = '#FFC658'
const EVENT = '#F2F5F9'
const BODY = '#99A2B0'

/**
 * Grade hexagonal de sensores, com os que caem sobre a casca do anel acesos.
 * Mesma regra da cena em `src/scene/field.ts` — o material de divulgação e o
 * site precisam ser reconhecivelmente a mesma coisa.
 */
function sensors({ width, height, cx, cy, radius, step, thickness }) {
  const rowHeight = step * 0.866
  const parts = []
  let row = 0

  for (let y = 0; y <= height + rowHeight; y += rowHeight) {
    const offset = row % 2 === 0 ? 0 : step / 2
    for (let x = -step; x <= width + step; x += step) {
      const px = x + offset
      const dist = Math.hypot(px - cx, py(y) - cy)
      const proximity = 1 - Math.abs(dist - radius) / (thickness / 2)

      if (proximity > 0) {
        const alpha = (proximity * 0.9).toFixed(2)
        parts.push(
          `<circle cx="${px.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.2 + proximity * 2).toFixed(2)}" fill="${LIT}" opacity="${alpha}"/>`,
        )
      } else {
        parts.push(
          `<circle cx="${px.toFixed(1)}" cy="${y.toFixed(1)}" r="1.2" fill="#FFFFFF" opacity="0.07"/>`,
        )
      }
    }
    row++
  }

  function py(value) {
    return value
  }

  return parts.join('')
}

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${MINE}"/>
  ${sensors({ width: 1200, height: 630, cx: 930, cy: 300, radius: 250, step: 26, thickness: 76 })}
  <circle cx="930" cy="300" r="250" fill="none" stroke="${CHERENKOV}" stroke-width="1.5" opacity="0.5"/>
  <circle cx="930" cy="300" r="250" fill="none" stroke="${CHERENKOV}" stroke-width="18" opacity="0.06"/>
  <!-- Vinheta: apaga a direita para o texto respirar, como no hero. -->
  <rect width="1200" height="630" fill="url(#fade)"/>
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0.28" stop-color="${MINE}" stop-opacity="1"/>
      <stop offset="0.72" stop-color="${MINE}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <text x="80" y="128" font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="21" font-weight="800" letter-spacing="4.2" fill="${EVENT}">NEUTRINO<tspan fill="${CHERENKOV}">.</tspan></text>

  <text font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="53" font-weight="700" letter-spacing="-1.8" fill="${EVENT}">
    <tspan x="80" y="296">Construímos o software que</tspan>
    <tspan x="80" y="358">sustenta operações inteiras.</tspan>
  </text>

  <text x="80" y="432" font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="30" font-weight="600" fill="${CHERENKOV}">Arquitetura e engenharia avançada.</text>

  <rect x="80" y="520" width="46" height="2" fill="${CHERENKOV}"/>
  <text x="80" y="565" font-family="'SF Mono', Consolas, 'Courier New', monospace" font-size="16" font-weight="600" letter-spacing="2.2" fill="${BODY}">DA CONCEPÇÃO À PRODUÇÃO · CURITIBA · DESDE 2020</text>
</svg>`

/** Marca reduzida ao evento: o anel e o ponto. Legível a 16px. */
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="${MINE}"/>
  <circle cx="256" cy="256" r="150" fill="none" stroke="${CHERENKOV}" stroke-width="16" opacity="0.35"/>
  <circle cx="256" cy="256" r="96" fill="none" stroke="${LIT}" stroke-width="20"/>
  <circle cx="256" cy="256" r="30" fill="${EVENT}"/>
</svg>`

function render(svg, width, file) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    // O @fontsource entrega apenas woff2, que o renderizador não lê. As fontes
    // do sistema cobrem: se a máquina que builda tiver Inter, sai idêntico ao
    // site; senão cai numa grotesca próxima e a peça continua correta.
    font: { loadSystemFonts: true, defaultFontFamily: 'Inter' },
  })
  writeFileSync(resolve(publicDir, file), resvg.render().asPng())
  console.log(`  ${file}`)
}

mkdirSync(publicDir, { recursive: true })
writeFileSync(resolve(publicDir, 'favicon.svg'), iconSvg)
console.log('gerando imagens:')
console.log('  favicon.svg')
render(ogSvg, 1200, 'og-image.png')
render(iconSvg, 180, 'apple-touch-icon.png')
render(iconSvg, 32, 'favicon-32x32.png')
render(iconSvg, 16, 'favicon-16x16.png')
