import type { ReactNode } from 'react'

/**
 * A seta é SVG, não o caractere "→".
 *
 * O subset latin do Inter cobre U+2191 e U+2193 mas não U+2192: escrita como
 * texto, ela cairia na fonte do sistema e desalinharia com o rótulo ao lado.
 */
export function Arrow({
  className = 'h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none',
}: {
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  )
}

interface CtaProps {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
}

/**
 * Toda ação da página é um link — não há formulário, então não há submit.
 *
 * Links externos abrem em nova aba com `rel` completo; internos e âncoras não.
 */
export function Cta({ href, children, variant = 'primary', className = '' }: CtaProps) {
  const external = href.startsWith('http') || href.startsWith('mailto:')

  const base =
    'mono group inline-flex h-12 items-center gap-2.5 rounded-sm px-6 text-[0.75rem] font-semibold uppercase tracking-[0.1em] transition-all duration-200 hover:-translate-y-px motion-reduce:transform-none'

  /*
   * Texto escuro sobre o âmbar, não claro: branco sobre #FFB020 fica em 2:1 e
   * some. O chassi virando tipografia é também o que faz o botão parecer tecla
   * de painel em vez de botão de site.
   *
   * Sem brilho externo. O halo âmbar que havia aqui pedia atenção como banner —
   * e uma página que não precisa convencer também não precisa que o botão grite.
   */
  const skin =
    variant === 'primary'
      ? 'bg-signal text-mine hover:bg-signal-hi'
      : 'border border-edge text-body hover:border-signal hover:text-event'

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`${base} ${skin} ${className}`}
    >
      {children}
    </a>
  )
}
