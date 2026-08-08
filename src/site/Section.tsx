import { memo, type ReactNode } from 'react'
import { Reveal } from './Reveal'

export interface SectionProps {
  id?: string
  /** Kicker em caixa alta acima do título. */
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  children: ReactNode
  /** Alterna a banda para que seções consecutivas não borrem entre si. */
  tone?: 'mine' | 'water'
  className?: string
}

/**
 * Shell de toda dobra abaixo do hero.
 *
 * Centralizar o ritmo — largura, respiro vertical, escala do título, tom da
 * banda — é o que faz uma página longa ler como um documento só, e não como
 * uma pilha de blocos que nasceram em dias diferentes.
 */
export const Section = memo(function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  tone = 'mine',
  className = '',
}: SectionProps) {
  return (
    <section
      id={id}
      // scroll-mt impede que a nav fixa cubra o título quando a âncora salta.
      className={`scroll-mt-24 border-t border-hairline ${
        tone === 'water' ? 'bg-water' : 'bg-mine'
      } ${className}`}
    >
      <div className="mx-auto max-w-[80rem] px-6 py-20 sm:py-24 lg:px-12">
        <Reveal>
          <header className="max-w-[44rem]">
            {eyebrow ? (
              <p className="mono flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-signal">
                {/* Traço curto antes do rótulo: marcação de seção, como um
                    documento técnico numera as suas. */}
                <span aria-hidden="true" className="h-px w-6 shrink-0 bg-signal/60" />
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-5 text-balance text-[clamp(1.75rem,4.4vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.03em] text-event">
              {title}
            </h2>
            {lead ? (
              <p className="mt-5 text-pretty text-[1.0625rem] leading-[1.7] text-body">{lead}</p>
            ) : null}
          </header>
        </Reveal>

        <div className="mt-14">{children}</div>
      </div>
    </section>
  )
})
