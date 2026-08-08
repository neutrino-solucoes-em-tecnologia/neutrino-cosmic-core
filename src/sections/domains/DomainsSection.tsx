import { Reveal } from '@/site/Reveal'
import { Section } from '@/site/Section'
import { DOMAINS } from './model'

export function DomainsSection() {
  return (
    <Section
      id="dominios"
      tone="water"
      eyebrow="Engenharia"
      title="O que sustenta os resultados acima."
      lead="Seis frentes em que decisão errada não tem conserto barato: a que se toma no início cobra dois anos depois. Cada uma indica o sistema em que foi exercida."
    >
      <div className="grid gap-x-12 gap-y-px border-t border-hairline sm:grid-cols-2 lg:grid-cols-3">
        {DOMAINS.map((domain, index) => (
          <Reveal key={domain.title} delay={(index % 3) * 70} className="border-b border-hairline">
            <div className="py-8 pr-4">
              <h3 className="text-[1.0625rem] font-bold leading-snug tracking-[-0.01em] text-event">
                {domain.title}
              </h3>
              <p className="mt-3.5 text-[0.9375rem] leading-[1.7] text-body">{domain.body}</p>
              <p className="mono mt-5 text-[0.6875rem] uppercase tracking-[0.1em] text-signal">
                {domain.evidence}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
