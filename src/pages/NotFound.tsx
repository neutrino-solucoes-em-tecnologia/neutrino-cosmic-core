import { Arrow, Cta } from '@/site/Cta'
import { Footer } from '@/site/Footer'
import { Navbar } from '@/site/Navbar'
import { useDocumentMeta } from '@/site/router'

export function NotFound() {
  useDocumentMeta('Página não encontrada | Neutrino', 'Esta página não existe.')

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70svh] max-w-[46rem] flex-col justify-center px-6 py-36 lg:px-12">
        <p className="tnum text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-signal">
          Erro 404
        </p>
        <h1 className="mt-5 text-balance text-[clamp(1.875rem,5.5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-event">
          Nada foi detectado neste endereço.
        </h1>
        <p className="mt-5 max-w-[32rem] text-[1.0625rem] leading-[1.7] text-body">
          A página saiu do ar ou o endereço veio errado. O caminho de volta está abaixo.
        </p>
        <div className="mt-10">
          <Cta href="/">
            Voltar ao início
            <Arrow />
          </Cta>
        </div>
      </main>
      <Footer />
    </>
  )
}
