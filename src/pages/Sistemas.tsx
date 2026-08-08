import { CASES } from '@/content/sistemas'
import { CaseCard } from '@/sections/cases/CaseCard'
import { CloseSection } from '@/sections/close/CloseSection'
import { Footer } from '@/site/Footer'
import { Mesh } from '@/site/Mesh'
import { Navbar } from '@/site/Navbar'
import { useDocumentMeta } from '@/site/router'

/**
 * Os seis sistemas, em detalhe.
 *
 * Saíram da home porque ocupavam quase metade dela e obrigavam a atravessar
 * tudo para chegar ao resto. Aqui podem ser densos: quem chega já decidiu que
 * quer o detalhe.
 */
export function Sistemas() {
  useDocumentMeta(
    'Sistemas em produção | Neutrino',
    'Seis plataformas construídas e operadas pela Neutrino: inteligência visual, decisão sobre domínio regulado, pagamento instantâneo, identidade e telemetria.',
  )

  return (
    <>
      <Mesh />
      <Navbar />
      <main>
        <header className="border-b border-hairline">
          <div className="mx-auto max-w-[80rem] px-6 pb-16 pt-36 lg:px-12">
            <p className="mono flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-faint">
              <span aria-hidden="true" className="h-px w-6 shrink-0 bg-faint/60" />
              Portfólio técnico
            </p>
            <h1 className="mt-6 max-w-[46rem] text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.08] tracking-[-0.035em] text-event">
              Seis sistemas em produção.
            </h1>
            <p className="mt-6 max-w-[44rem] text-[1.0625rem] leading-[1.72] text-body">
              Quatro foram construídos por nós desde a arquitetura; dois já existiam e foram
              assumidos para correção. Cada caso registra o estado anterior, quando havia um, a
              intervenção e o resultado medido em produção.
            </p>
          </div>
        </header>

        <section className="mx-auto max-w-[80rem] px-6 py-16 lg:px-12">
          <div className="grid gap-px overflow-hidden rounded-md border border-hairline bg-hairline md:grid-cols-2">
            {CASES.map((item, index) => (
              <CaseCard key={item.id} item={item} delay={index * 70} />
            ))}
          </div>

          <p className="mt-8 max-w-[44rem] text-[0.8125rem] leading-relaxed text-faint">
            Números medidos em produção, nos painéis dos próprios sistemas e nos relatórios de
            auditoria que os originaram. Onde o estado anterior não foi registrado à época, ele não
            aparece.
          </p>
        </section>

        <CloseSection />
      </main>
      <Footer />
    </>
  )
}
