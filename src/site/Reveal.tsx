import { useEffect, useRef, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Escalona a entrada de itens irmãos, em ms. */
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}

/**
 * Entrada única do site: sobe e desfoca ao entrar em viewport, uma vez só.
 *
 * O observer se desconecta no primeiro disparo — reanimar ao rolar de volta
 * chama atenção para o efeito em vez do conteúdo.
 */
export function Reveal({ children, delay = 0, className = '', as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const Tag = as

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Sem IntersectionObserver o conteúdo simplesmente já está visível: o
    // estado inicial do CSS é invisível, então a falha precisa abrir, não fechar.
    if (!('IntersectionObserver' in window)) {
      node.dataset.in = 'true'
      return
    }

    /*
     * Rede de segurança.
     *
     * O estado inicial é invisível, então qualquer falha do observer fecha o
     * conteúdo em vez de abri-lo — foi assim que os botões e os números do hero
     * sumiram quando a aba estava em segundo plano e o observer nunca disparou.
     * Um elemento não pode depender de um callback para existir: se em 900ms
     * ninguém avisou nada, ele aparece.
     */
    const fallback = window.setTimeout(() => {
      node.dataset.in = 'true'
      observer.disconnect()
    }, 900)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        window.clearTimeout(fallback)
        node.dataset.in = 'true'
        observer.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px' },
    )

    observer.observe(node)
    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
