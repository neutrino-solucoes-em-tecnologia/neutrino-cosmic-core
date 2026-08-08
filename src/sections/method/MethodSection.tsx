import { Reveal } from '@/site/Reveal'
import { Section } from '@/site/Section'
import { STEPS } from './model'

export function MethodSection() {
  return (
    <Section
      id="metodo"
      tone="water"
      eyebrow="Como trabalhamos"
      title="Da arquitetura à operação."
      lead="Três etapas, nesta ordem. A primeira decide o que as outras duas conseguem sustentar, e é a que não se pula, nem em plataforma nova nem em sistema que já roda."
    >
      {/*
        Quatro faixas declaradas no container e herdadas por cada card via
        `subgrid`: título, duração, corpo (a única elástica) e entregável.

        Alinhar as linhas azuis exige que as faixas sejam compartilhadas entre as
        três colunas, e nenhum arranjo de flex faz isso. Tentei `mt-auto` — ancora
        pelo fundo, e os topos continuam desiguais. Tentei `flex-1` no corpo —
        não há folga para distribuir: o card 01 tem corpo curto e entregável de
        quatro linhas, o 02 tem o oposto, e ambos preenchem a mesma altura por
        caminhos diferentes. Com subgrid a faixa do corpo é `1fr` e absorve a
        diferença, então o entregável começa no mesmo Y nos três.

        `gap-y-px` só no mobile: no desktop as faixas internas herdariam o gap e
        apareceriam como fios de 1px atravessando o card.
      */}
      <ol className="grid gap-x-px gap-y-px overflow-hidden rounded-md border border-hairline bg-hairline lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr_auto] lg:gap-y-0">
        {STEPS.map((step, index) => (
          <Reveal
            as="li"
            key={step.index}
            delay={index * 80}
            className="flex flex-col bg-water p-7 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-0 lg:p-9"
          >
            <div className="flex items-baseline gap-4">
              <span className="mono text-[0.8125rem] font-semibold text-signal">
                {step.index}
              </span>
              <h3 className="text-[1.25rem] font-bold tracking-[-0.02em] text-event">
                {step.title}
              </h3>
            </div>

            <p className="mono mt-3 text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
              {step.duration}
            </p>

            <p className="mt-6 text-[0.9375rem] leading-[1.7] text-body">{step.body}</p>

            <div className="pt-8">
              <p className="border-l-2 border-signal pl-4 text-[0.9375rem] leading-[1.65] text-event">
                {step.deliverable}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
