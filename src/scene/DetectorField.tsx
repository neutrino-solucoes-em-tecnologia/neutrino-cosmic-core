import { useEffect, useRef, useState } from 'react'
import { createField } from './field'

/**
 * O detector, montado atrás do hero.
 *
 * É decoração: a página inteira lê e converte com o canvas removido. Nada de
 * estrutural depende dele, e ele nunca intercepta ponteiro.
 */
export function DetectorField() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Modo de economia de dados é um pedido explícito do visitante: não é hora
    // de gastar bateria desenhando um enfeite.
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection
    if (connection?.saveData) return

    setEnabled(true)
  }, [])

  useEffect(() => {
    const canvas = ref.current
    if (!enabled || !canvas) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let field = createField(canvas, motion.matches)

    // Handle de inspeção, só em desenvolvimento: `__field.renderAt(260)` congela
    // o detector num raio conhecido. É a única forma de conferir a cena sem
    // depender de a aba estar em primeiro plano.
    if (import.meta.env.DEV) {
      ;(window as unknown as { __field?: unknown }).__field = field
    }

    // O visitante pode trocar a preferência com a página aberta.
    const onChange = () => {
      field.destroy()
      field = createField(canvas, motion.matches)
    }
    motion.addEventListener('change', onChange)

    return () => {
      motion.removeEventListener('change', onChange)
      field.destroy()
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
