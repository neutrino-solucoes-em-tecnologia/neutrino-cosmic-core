import { Reveal } from '@/site/Reveal'
import { formatKb, formatSeconds, usePageVitals } from './vitals'

/**
 * "Esta página" — a única seção do site cujos números o visitante confere
 * sozinho, e a razão de ela existir.
 *
 * Um site de consultoria que afirma competência técnica é ruído; um que entrega
 * um artefato mensurável e convida à conferência já respondeu à pergunta. Se
 * algum dia a página engordar, esta seção denuncia primeiro — o que é
 * exatamente o ponto.
 */
export function ProofSection() {
  const vitals = usePageVitals()

  const rows: Array<{ label: string; value: string; note?: string }> = vitals
    ? [
        {
          label: 'JavaScript transferido',
          value: formatKb(vitals.scriptBytes),
          note: 'React, a cena e todo o site',
        },
        { label: 'CSS e fontes', value: formatKb(vitals.styleBytes), note: 'Inter, self-hosted' },
        ...(vitals.lcp !== null
          ? [
              {
                label: 'Maior elemento pintado',
                value: formatSeconds(vitals.lcp),
                note: 'LCP, neste dispositivo',
              },
            ]
          : []),
        {
          label: 'Requisições a terceiros',
          value: String(vitals.thirdParty),
          note: 'nenhum CDN, nenhuma fonte remota',
        },
        { label: 'Cookies', value: String(vitals.cookies), note: 'e por isso não há banner' },
      ]
    : []

  return (
    <section id="esta-pagina" className="scroll-mt-24 border-t border-hairline bg-water">
      <div className="mx-auto max-w-[80rem] px-6 py-20 sm:py-24 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <header>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-signal">
                Esta página
              </p>
              <h2 className="mt-5 text-balance text-[clamp(1.75rem,4.4vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.03em] text-event">
                Medições desta página, feitas no seu navegador.
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-[1.7] text-body">
                Os valores abaixo não estão escritos no código: são lidos da Performance API do seu
                navegador, neste dispositivo e nesta conexão. Podem ser conferidos no DevTools.
              </p>
            </header>
          </Reveal>

          <Reveal delay={90}>
            <dl className="border-t border-edge">
              {rows.length === 0 ? (
                <p className="py-6 text-[0.9375rem] text-faint">Medindo…</p>
              ) : (
                rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-6 border-b border-hairline py-5"
                  >
                    <dt className="text-[0.9375rem] text-body">
                      {row.label}
                      {row.note ? (
                        <span className="mono mt-1 block text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
                          {row.note}
                        </span>
                      ) : null}
                    </dt>
                    <dd className="mono shrink-0 text-[1.375rem] font-semibold tracking-[-0.04em] text-event">
                      {row.value}
                    </dd>
                  </div>
                ))
              )}
            </dl>

            <p className="mt-6 text-[0.8125rem] leading-relaxed text-faint">
              Três dependências em produção: React, React DOM e a fonte. Sem framework de animação,
              biblioteca de ícones, roteador de terceiros ou WebGL. A cena do topo é Canvas 2D e
              para de desenhar quando a aba sai da frente.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
