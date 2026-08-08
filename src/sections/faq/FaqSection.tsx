import { Reveal } from '@/site/Reveal'
import { QUESTIONS } from './model'

/**
 * `<details>` nativo: acessível por teclado, funciona com JavaScript desligado,
 * indexável pelo buscador com a resposta aberta e custa zero byte de runtime.
 * O acordeão do Radix que estava aqui custava 14KB para fazer o mesmo pior.
 *
 * Não usa o shell `Section` porque este layout é de duas colunas: com o título
 * em cima, sete perguntas fechadas viravam uma lista estreita e alta com a
 * metade direita da tela vazia. Cabeçalho à esquerda e perguntas à direita é o
 * mesmo arranjo da seção "Esta página", e as duas passam a rimar.
 */
export function FaqSection() {
  return (
    <section id="duvidas" className="scroll-mt-24 border-t border-hairline bg-water">
      <div className="mx-auto max-w-[80rem] px-6 py-20 sm:py-24 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            {/* sticky: com sete itens abertos a coluna da direita fica longa, e
                o cabeçalho acompanha em vez de sumir no topo. */}
            <header className="lg:sticky lg:top-28">
              <p className="mono flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-signal">
                <span aria-hidden="true" className="h-px w-6 shrink-0 bg-signal/60" />
                Dúvidas
              </p>
              <h2 className="mt-5 text-balance text-[clamp(1.75rem,4.4vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.035em] text-event">
                Dúvidas frequentes.
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-[1.7] text-body">
                As que aparecem de fato na primeira conversa, inclusive as que costumam ficar para
                o fim.
              </p>
            </header>
          </Reveal>

          <Reveal delay={90}>
            <div className="border-t border-edge">
              {QUESTIONS.map((item, index) => (
                <details key={item.q} className="group border-b border-hairline">
                  <summary className="mono flex cursor-pointer list-none items-start gap-5 py-5 text-[0.9375rem] font-normal leading-[1.5] text-event transition-colors hover:text-signal [&::-webkit-details-marker]:hidden">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-[0.6875rem] font-semibold text-faint transition-colors group-open:text-signal"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="flex-1 font-sans font-semibold">{item.q}</span>

                    <span aria-hidden="true" className="relative mt-2 block h-2.5 w-2.5 shrink-0">
                      <span className="absolute left-0 top-1 block h-px w-full bg-signal" />
                      <span className="absolute left-1 top-0 block h-full w-px bg-signal transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
                    </span>
                  </summary>

                  <p className="max-w-[42rem] pb-6 pl-9 text-[0.9375rem] leading-[1.75] text-body">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
