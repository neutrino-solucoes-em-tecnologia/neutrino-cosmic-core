import { useEffect, useState } from 'react'
import { NAV, whatsappUrl } from '@/config/site'
import { Wordmark } from './Wordmark'

/**
 * Barra fixa: transparente sobre o hero, vidro depois de 8px de scroll.
 *
 * No mobile a barra carrega marca e menu apenas — um CTA de 44px espremido ao
 * lado do hambúrguer não é clicado, só ocupa a única linha que existe.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menu aberto trava o corpo: rolar o fundo por trás de um painel modal é
  // desorientador no toque.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-hairline bg-mine/72 backdrop-blur-lg' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-[80rem] items-center justify-between px-6 lg:px-12">
        <a href="/" aria-label="Neutrino — início">
          <Wordmark />
        </a>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.8125rem] text-body transition-colors hover:text-event"
            >
              {item.label}
            </a>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-signal transition-colors hover:text-signal-hi"
          >
            Contato
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 block h-px w-full bg-event transition-transform duration-200 ${
                open ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-full bg-event transition-transform duration-200 ${
                open ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-hairline bg-mine/95 backdrop-blur-lg lg:hidden">
          <nav className="mx-auto max-w-[80rem] px-6 py-6" aria-label="Principal (mobile)">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-b border-hairline py-4 text-[0.9375rem] text-body last:border-0"
              >
                {item.label}
              </a>
            ))}
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-signal"
            >
              Contato
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
