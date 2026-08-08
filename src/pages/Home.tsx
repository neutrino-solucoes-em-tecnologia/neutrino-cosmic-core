import { SystemsSummary } from '@/sections/systems/SystemsSummary'
import { CloseSection } from '@/sections/close/CloseSection'
import { DomainsSection } from '@/sections/domains/DomainsSection'
import { FaqSection } from '@/sections/faq/FaqSection'
import { HeroSection } from '@/sections/hero/HeroSection'
import { MethodSection } from '@/sections/method/MethodSection'
import { FitSection } from '@/sections/fit/FitSection'
import { ProofSection } from '@/sections/proof/ProofSection'
import { Footer } from '@/site/Footer'
import { Mesh } from '@/site/Mesh'
import { Navbar } from '@/site/Navbar'
import { useDocumentMeta } from '@/site/router'

/**
 * A ordem das dobras é o argumento.
 *
 * Tese → o que já foi construído → como sustentamos isso → como se trabalha → fit
 * → prova de primeira mão → dúvida → contato.
 *
 * Sistemas vêm antes de Engenharia: a lista de competências, lida antes de
 * qualquer prova, é indistinguível da de qualquer concorrente — depois dos seis
 * casos, ela explica como aqueles resultados foram possíveis. Prova primeiro,
 * capacidade depois.
 *
 * O método desceu de propósito. Ele abria a página e fazia a empresa soar como
 * consultoria: quem avalia uma casa de engenharia quer primeiro saber se ela já
 * resolveu a classe de problema dele.
 * "Esta página" vem depois do fit — é a única evidência que o visitante
 * audita sozinho, e chega no momento de maior ceticismo.
 */
export function Home() {
  useDocumentMeta(
    'Neutrino, engenharia de software de alta complexidade',
    'Construímos o software que sustenta operações inteiras. Arquitetura e engenharia avançada, da concepção à produção.',
  )

  return (
    <>
      <Mesh />
      <Navbar />
      <main>
        <HeroSection />
        <SystemsSummary />
        <DomainsSection />
        <MethodSection />
        <FitSection />
        <ProofSection />
        <FaqSection />
        <CloseSection />
      </main>
      <Footer />
    </>
  )
}
