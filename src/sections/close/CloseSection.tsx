import { CONTACT, mailtoUrl, whatsappUrl } from '@/config/site'
import { Arrow, Cta } from '@/site/Cta'
import { Reveal } from '@/site/Reveal'

/**
 * O fechamento — e o lugar onde o formulário de cinco campos deixou de existir.
 *
 * O anterior não enviava nada: chamava `toast.success`, limpava o estado e
 * descartava o lead. Mesmo funcionando, seria atrito no público errado —
 * quem decide contratar engenharia crítica escreve um e-mail, não preenche
 * "Impacto do Problema" num select.
 */
export function CloseSection() {
  return (
    <section id="contato" className="scroll-mt-24 border-t border-hairline bg-mine">
      <div className="mx-auto max-w-[80rem] px-6 py-24 sm:py-32 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-20">
          <Reveal>
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-signal">
                Começar
              </p>
              <h2 className="mt-5 max-w-[34rem] text-balance text-[clamp(1.875rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-event">
                Descreva o problema. Respondemos com o que faríamos primeiro.
              </h2>
              <p className="mt-6 max-w-[36rem] text-[1.0625rem] leading-[1.7] text-body">
                Não há formulário nem sequência automática de e-mails. A primeira resposta vem de quem
                faria o trabalho e traz uma leitura técnica do caso, inclusive quando a conclusão
                é que o problema não é para nós.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Cta href={whatsappUrl()}>
                  Abrir conversa
                  <Arrow />
                </Cta>
                <Cta href={mailtoUrl('Diagnóstico')} variant="ghost">
                  Escrever por e-mail
                </Cta>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="border-t border-hairline pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-faint">
                O que ajuda saber de início
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  'O que está acontecendo, e desde quando',
                  'O que já foi tentado',
                  'Qual o impacto: receita, operação, prazo regulatório',
                  'Quem no seu lado decide seguir',
                ].map((item) => (
                  <li key={item} className="flex gap-3.5 text-[0.9375rem] leading-[1.6] text-body">
                    <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-signal" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={mailtoUrl()}
                className="mt-10 block break-all text-[0.9375rem] text-body transition-colors hover:text-event"
              >
                {CONTACT.email}
              </a>
              <p className="mt-1.5 text-[0.8125rem] text-faint">
                {CONTACT.phoneDisplay} · {' '}
                <span className="whitespace-nowrap">Curitiba, PR</span>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
