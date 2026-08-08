import { useCallback, type ReactNode } from 'react'
import { navigate } from './router'

/**
 * Link interno: navega sem recarregar, mas continua sendo um `<a href>` de
 * verdade — abre em nova aba com ctrl/cmd, mostra o destino na barra de status
 * e o buscador enxerga para onde aponta.
 */
export function Link({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      e.preventDefault()
      navigate(href)
    },
    [href],
  )

  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  )
}
