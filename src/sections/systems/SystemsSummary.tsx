import { CASES } from '@/content/sistemas'
import { Arrow } from '@/site/Cta'
import { Link } from '@/site/Link'
import { Reveal } from '@/site/Reveal'
import { Section } from '@/site/Section'

/**
 * Síntese dos sistemas na home.
 *
 * Os seis casos completos ocupavam quase metade da página e obrigavam a leitura
 * de tudo para chegar ao resto. Aqui fica só o índice — domínio, uma linha e a
 * métrica que melhor representa o caso — e o detalhe mora em /sistemas.
 *
 * Formato de tabela, não de card: o leitor varre seis linhas em segundos e
 * decide onde quer profundidade. É também a forma que um índice técnico teria.
 */
export function SystemsSummary() {
  return (
    <Section
      id="sistemas"
      eyebrow="O que construímos"
      title="Seis sistemas em produção."
      lead="Inteligência visual, decisão sobre domínio regulado, pagamento instantâneo, identidade e telemetria. O primeiro é público e pode ser aberto."
    >
      <ul className="border-t border-edge">
        {CASES.map((item, index) => {
          const headline = item.metrics[0]
          return (
            <Reveal as="li" key={item.id} delay={index * 45} className="border-b border-hairline">
              <div className="grid items-baseline gap-x-8 gap-y-2 py-6 lg:grid-cols-[13rem_minmax(0,1fr)_9rem]">
                <p className="mono text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-signal">
                  {item.segment}
                </p>

                <div>
                  <p className="text-[1rem] font-semibold leading-snug tracking-[-0.01em] text-event">
                    {item.name}
                  </p>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-body">
                    {item.oneLiner}
                  </p>
                </div>

                <p className="mono text-[0.9375rem] font-semibold tracking-[-0.02em] text-event lg:text-right">
                  {headline.depois}
                  <span className="mt-1 block text-[0.625rem] font-normal uppercase tracking-[0.08em] text-faint">
                    {headline.label}
                  </span>
                </p>
              </div>
            </Reveal>
          )
        })}
      </ul>

      <Reveal delay={120}>
        <Link
          href="/sistemas"
          className="group/link mono mt-10 inline-flex items-center gap-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-signal transition-colors hover:text-signal-hi"
        >
          Ver os seis em detalhe
          <Arrow className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none" />
        </Link>
      </Reveal>
    </Section>
  )
}
