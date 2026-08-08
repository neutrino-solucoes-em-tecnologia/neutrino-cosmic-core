import { Reveal } from '@/site/Reveal'
import { Section } from '@/site/Section'
import { WHEN_TO_CALL } from './model'

export function FitSection() {
  return (
    <Section
      id="quando-chamar"
      eyebrow="Escopo"
      title="Quando nos procurar."
      lead="As situações abaixo descrevem o tipo de trabalho que fazemos. A conversa começa no problema, com alguém técnico desde a primeira reunião."
    >
      <div className="grid gap-x-16 gap-y-px border-t border-edge lg:grid-cols-2">
        {WHEN_TO_CALL.map((item, index) => (
          <Reveal key={item.title} delay={(index % 2) * 80} className="border-b border-hairline">
            <div className="flex gap-6 py-9 pr-4">
              <span className="mono shrink-0 pt-1 text-[0.75rem] font-semibold text-signal">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-[1.0625rem] font-bold leading-snug tracking-[-0.01em] text-event">
                  {item.title}
                </h3>
                <p className="mt-3.5 text-[0.9375rem] leading-[1.72] text-body">{item.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

    </Section>
  )
}
