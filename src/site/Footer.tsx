import { CONTACT, NAV, SITE } from '@/config/site'
import { Link } from './Link'
import { Wordmark } from './Wordmark'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-water">
      <div className="mx-auto max-w-[80rem] px-6 py-16 lg:px-12">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[22rem]">
            <Link href="/">
              <Wordmark />
            </Link>
            <p className="mt-5 text-[0.9375rem] leading-[1.7] text-body">
              Engenharia para sistemas em produção onde a falha tem consequência.
            </p>
            <p className="mt-4 text-[0.8125rem] text-faint">
              {SITE.locality}, {SITE.region} · desde {SITE.foundingYear}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 sm:gap-16">
            <nav aria-label="Seções">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-faint">
                Seções
              </p>
              <ul className="mt-5 space-y-3">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-[0.9375rem] text-body transition-colors hover:text-event"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Contato e documentos">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-faint">
                Contato
              </p>
              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="break-all text-[0.9375rem] text-body transition-colors hover:text-event"
                  >
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.9375rem] text-body transition-colors hover:text-event"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <Link
                    href="/principios"
                    className="text-[0.9375rem] text-body transition-colors hover:text-event"
                  >
                    Compromissos de engenharia
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacidade"
                    className="text-[0.9375rem] text-body transition-colors hover:text-event"
                  >
                    Privacidade
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-faint">
            © {YEAR} {SITE.legalName}
          </p>
          <p className="text-[0.8125rem] text-faint">
            Sem cookies, sem rastreadores, sem terceiros.{' '}
            <a href="#esta-pagina" className="underline decoration-hairline hover:text-body">
              medido nesta página
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
