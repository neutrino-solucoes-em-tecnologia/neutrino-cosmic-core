import { SCENE } from './config'

/**
 * O detector, em Canvas 2D puro — sem React, sem WebGL, sem three.js.
 *
 * A ausência de WebGL não é limitação, é a tese: a página inteira argumenta
 * pelo próprio peso e publica o número no rodapé. Seiscentos kilobytes de
 * runtime 3D para desenhar pontos e um arco contradiriam o argumento.
 *
 * Custo por frame: uma varredura sobre ~1.100 sensores numa tela de 1440×900,
 * com no máximo dois eventos simultâneos. Alvo: menos de 4ms em Android médio.
 */

/** Faixas de brilho no repouso — ver drawSensors. */
const BUCKETS = 3

interface Sensor {
  x: number
  y: number
  /** 0 = apagado, 1 = pico. Decai continuamente. */
  lit: number
  /** Brilho de repouso, 0.5–1. Grade perfeitamente uniforme lê como textura de
   *  fundo; a variação leve faz cada ponto parecer um sensor individual. */
  gain: number
}

interface Event {
  x: number
  y: number
  /** Direção da deriva, normalizada. */
  dx: number
  dy: number
  radius: number
}

export interface Field {
  destroy(): void
  /**
   * Desenha um evento parado, com o raio pedido, sem depender do loop.
   *
   * Existe porque uma cena animada é quase impossível de verificar: o
   * `requestAnimationFrame` não roda em aba de segundo plano, então qualquer
   * inspeção automatizada encontra a tela congelada e não distingue "correto e
   * pausado" de "quebrado". Com isto o estado do detector vira determinístico —
   * mesmo raio, mesmo desenho, conferível a qualquer momento.
   */
  renderAt(radius: number): void
}

/** Grade hexagonal: linhas ímpares deslocadas meio passo. */
function buildSensors(w: number, h: number): Sensor[] {
  const sensors: Sensor[] = []
  const rowHeight = SCENE.step * 0.866 // altura de um triângulo equilátero
  let row = 0

  for (let y = -rowHeight; y < h + rowHeight; y += rowHeight) {
    const offset = row % 2 === 0 ? 0 : SCENE.step / 2
    let col = 0
    for (let x = -SCENE.step; x < w + SCENE.step; x += SCENE.step) {
      // Hash determinístico da posição: o mesmo sensor tem sempre o mesmo
      // brilho, então redimensionar a janela não faz a grade cintilar.
      const hash = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453
      const gain = 1 - SCENE.sensorJitter * (hash - Math.floor(hash))
      sensors.push({ x: x + offset, y, lit: 0, gain })
      col++
    }
    row++
  }

  return sensors
}

function spawn(w: number, h: number): Event {
  const angle = Math.random() * Math.PI * 2
  return {
    // Nasce dentro do quadro, com folga da borda — o anel precisa de espaço
    // para abrir antes de sair de cena.
    x: w * (0.15 + Math.random() * 0.7),
    y: h * (0.15 + Math.random() * 0.7),
    dx: Math.cos(angle),
    dy: Math.sin(angle),
    radius: 0,
  }
}

/**
 * Monta a cena sobre um canvas existente e devolve o cancelador.
 *
 * `reduced` desenha um único estado formado e não anima: com
 * `prefers-reduced-motion` a página não pode ter movimento perpétuo, mas
 * também não deve perder a identidade — a grade e um anel ficam parados.
 */
export function createField(canvas: HTMLCanvasElement, reduced: boolean): Field {
  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return { destroy() {}, renderAt() {} }

  let sensors: Sensor[] = []
  let events: Event[] = []
  let width = 0
  let height = 0
  let raf = 0
  let last = 0
  let nextSpawn: number = SCENE.gapMin
  let running = true

  /**
   * `clientWidth/clientHeight` em vez de `getBoundingClientRect`: são inteiros
   * de layout e não sofrem com transform de ancestral.
   *
   * A guarda contra zero não é defensiva por precaução — sem ela o canvas era
   * dimensionado como 0×N no primeiro disparo do observer (antes do primeiro
   * layout do hero) e nunca mais voltava, porque as medidas seguintes eram
   * iguais e o observer não redisparava. A cena simplesmente não existia.
   */
  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (w <= 0 || h <= 0) return

    const dpr = Math.min(window.devicePixelRatio || 1, SCENE.maxDpr)
    width = w
    height = h
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    sensors = buildSensors(width, height)
    if (reduced) drawReduced()
  }

  /** Acende os sensores que a casca do anel está cruzando neste instante. */
  function illuminate(event: Event) {
    const half = SCENE.ringThickness / 2
    const inner = event.radius - half
    const outer = event.radius + half
    // Fora do alcance do anel nenhum sensor muda — poupa a raiz quadrada.
    const innerSq = inner > 0 ? inner * inner : 0
    const outerSq = outer * outer

    for (const s of sensors) {
      const dx = s.x - event.x
      const dy = s.y - event.y
      const distSq = dx * dx + dy * dy
      if (distSq < innerSq || distSq > outerSq) continue

      const dist = Math.sqrt(distSq)
      // Pico no centro da casca, zero nas bordas.
      const proximity = 1 - Math.abs(dist - event.radius) / half
      // O evento perde energia conforme se abre — mas em curva, não em rampa:
      // linear, o anel já nascia meio apagado e nunca chegava a brilhar.
      const fade = Math.pow(1 - event.radius / SCENE.ringMaxRadius, 0.55)
      const intensity = proximity * fade
      if (intensity > s.lit) s.lit = intensity
    }
  }

  function drawSensors() {
    ctx!.clearRect(0, 0, width, height)

    // Camada apagada, em três faixas de brilho: um fill por faixa em vez de um
    // por sensor. Mantém o custo em três chamadas e ainda assim a grade tem
    // textura — uniforme demais, ela desaparece; individual demais, custa caro.
    const band = SCENE.sensorJitter / BUCKETS
    for (let bucket = 0; bucket < BUCKETS; bucket++) {
      const low = 1 - SCENE.sensorJitter + band * bucket
      const high = bucket === BUCKETS - 1 ? Infinity : low + band
      const alpha = SCENE.sensorAlpha * (low + band / 2)

      ctx!.fillStyle = `rgba(${SCENE.sensorRgb},${alpha.toFixed(3)})`
      ctx!.beginPath()
      for (const s of sensors) {
        if (s.lit > 0.02 || s.gain < low || s.gain >= high) continue
        ctx!.moveTo(s.x + SCENE.sensorRadius, s.y)
        ctx!.arc(s.x, s.y, SCENE.sensorRadius, 0, Math.PI * 2)
      }
      ctx!.fill()
    }

    // Camada acesa: alpha e cor por sensor, então um caminho cada.
    for (const s of sensors) {
      if (s.lit <= 0.02) continue

      ctx!.fillStyle = `rgba(${SCENE.litColor},${(s.lit * SCENE.haloAlpha).toFixed(3)})`
      ctx!.beginPath()
      ctx!.arc(s.x, s.y, SCENE.haloRadius, 0, Math.PI * 2)
      ctx!.fill()

      // O branco entra só no topo da curva: um sensor que a casca cruzou de
      // raspão continua azul, o que está no centro dela vira evento.
      const peak = s.lit > 0.55 ? (s.lit - 0.55) / 0.45 : 0
      const color = peak > 0 ? SCENE.peakColor : SCENE.litColor
      const alpha = Math.min(1, 0.35 + s.lit * 0.85)

      ctx!.fillStyle = `rgba(${color},${alpha.toFixed(3)})`
      ctx!.beginPath()
      ctx!.arc(s.x, s.y, SCENE.sensorRadius + s.lit * SCENE.litRadius, 0, Math.PI * 2)
      ctx!.fill()
    }
  }

  function drawRing(event: Event) {
    const fade = Math.pow(Math.max(0, 1 - event.radius / SCENE.ringMaxRadius), 0.55)
    if (fade <= 0) return
    ctx!.strokeStyle = `rgba(${SCENE.ringColor},${(fade * SCENE.ringAlpha).toFixed(3)})`
    ctx!.lineWidth = 1.2
    ctx!.beginPath()
    ctx!.arc(event.x, event.y, event.radius, 0, Math.PI * 2)
    ctx!.stroke()
  }

  /** Um evento parado no raio pedido. Base do modo reduzido e da inspeção. */
  function renderAt(radius: number) {
    if (!sensors.length) return
    const event: Event = { x: width * 0.68, y: height * 0.44, dx: 0, dy: 0, radius }
    for (const s of sensors) s.lit = 0
    illuminate(event)
    drawSensors()
    drawRing(event)
  }

  /** Estado estático para prefers-reduced-motion: formado, sem movimento. */
  function drawReduced() {
    renderAt(Math.min(width, height) * 0.38)
  }

  function frame(now: number) {
    if (!running) return
    const dt = last ? Math.min(now - last, 64) : 16
    last = now

    nextSpawn -= dt
    if (nextSpawn <= 0) {
      events.push(spawn(width, height))
      nextSpawn = SCENE.gapMin + Math.random() * (SCENE.gapMax - SCENE.gapMin)
    }

    const decayStep = dt / SCENE.decay
    for (const s of sensors) {
      if (s.lit > 0) s.lit = Math.max(0, s.lit - decayStep)
    }

    // Contagem de fundo: mantém o detector visivelmente ligado entre eventos.
    if (sensors.length && Math.random() < (SCENE.noiseRate * dt) / 1000) {
      const s = sensors[Math.floor(Math.random() * sensors.length)]
      const level = SCENE.noiseMin + Math.random() * (SCENE.noiseMax - SCENE.noiseMin)
      if (s && level > s.lit) s.lit = level
    }

    const seconds = dt / 1000
    for (const event of events) {
      event.radius += SCENE.ringSpeed * seconds
      event.x += event.dx * SCENE.driftSpeed * seconds
      event.y += event.dy * SCENE.driftSpeed * seconds
      illuminate(event)
    }
    events = events.filter((e) => e.radius < SCENE.ringMaxRadius)

    drawSensors()
    for (const event of events) drawRing(event)

    raf = requestAnimationFrame(frame)
  }

  function start() {
    if (reduced || raf) return
    last = 0
    raf = requestAnimationFrame(frame)
  }

  function stop() {
    if (!raf) return
    cancelAnimationFrame(raf)
    raf = 0
  }

  /** Aba oculta não desenha: nenhum visitante está olhando. */
  function onVisibility() {
    if (document.hidden) stop()
    else start()
  }

  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  document.addEventListener('visibilitychange', onVisibility)

  resize()
  // Primeiro evento cedo: quem chega precisa ver o detector registrar algo
  // antes de rolar a página, ou a cena parece um fundo estático.
  nextSpawn = 1200
  start()

  return {
    renderAt,
    destroy() {
      running = false
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    },
  }
}
