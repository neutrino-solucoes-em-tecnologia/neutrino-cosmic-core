import { PRINCIPLES } from '@/content/principios'
import { CONTACT } from '@/config/site'
import { Footer } from '@/site/Footer'
import { Navbar } from '@/site/Navbar'
import { useDocumentMeta } from '@/site/router'

/**
 * Compromissos de engenharia.
 *
 * Este conteúdo já esteve na home. Saiu porque, no meio de uma página de venda,
 * lia como confronto com quem estava lendo — e o último item avisava o visitante
 * de que ele podia ser recusado. Aqui é documento: quem chega sabe o que veio
 * buscar, e o texto pode ser factual em vez de enfático.
 */
export function Principios() {
  useDocumentMeta(
    'Compromissos de engenharia | Neutrino',
    'Como a Neutrino trata supervisão humana, trilha de auditoria, dado pessoal sensível e limites de escopo nos sistemas que constrói.',
  )

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[46rem] px-6 pb-24 pt-36 lg:px-12">
        <p className="mono flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-signal">
          <span aria-hidden="true" className="h-px w-6 shrink-0 bg-signal/60" />
          Documento técnico
        </p>

        <h1 className="mt-6 text-balance text-[clamp(2rem,5.5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.035em] text-event">
          Compromissos de engenharia
        </h1>

        <p className="mt-6 text-[1.0625rem] leading-[1.72] text-body">
          Parte dos sistemas que construímos identifica, classifica ou decide algo a respeito de
          pessoas. Estes são os critérios que aplicamos nesse tipo de projeto, registrados aqui
          para que possam ser conferidos antes de uma conversa e cobrados durante uma.
        </p>

        <div className="mt-14 space-y-12">
          {PRINCIPLES.map((item) => (
            <section key={item.index}>
              <div className="flex items-baseline gap-4">
                <span className="mono text-[0.75rem] font-semibold text-signal">{item.index}</span>
                <h2 className="text-[1.125rem] font-bold tracking-[-0.02em] text-event">
                  {item.title}
                </h2>
              </div>
              <p className="mt-4 pl-9 text-[0.9375rem] leading-[1.75] text-body">{item.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-16 border-t border-hairline pt-8 text-[0.875rem] leading-[1.7] text-faint">
          Dúvida sobre como algum destes pontos se aplica ao seu caso, escreva para{' '}
          <a
            href={`mailto:${CONTACT.email}`}
            className="break-all text-signal hover:text-signal-hi"
          >
            {CONTACT.email}
          </a>
          .
        </p>
      </main>
      <Footer />
    </>
  )
}
