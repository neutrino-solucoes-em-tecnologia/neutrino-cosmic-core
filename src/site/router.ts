import { useEffect, useSyncExternalStore } from 'react'

/**
 * Roteador de três rotas, em trinta linhas.
 *
 * O react-router custa ~20KB gzip para resolver `/`, `/privacidade` e o 404 —
 * todas estáticas, nenhuma com parâmetro, nenhuma aninhada. Numa página cujo
 * argumento central é o próprio peso, importar isso contradiria a seção
 * "Esta página" logo acima do rodapé.
 */

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  window.addEventListener('neutrino:navigate', callback)
  return () => {
    window.removeEventListener('popstate', callback)
    window.removeEventListener('neutrino:navigate', callback)
  }
}

export function useRoute(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => '/',
  )
}

export function navigate(href: string) {
  if (href === window.location.pathname) return
  window.history.pushState({}, '', href)
  window.dispatchEvent(new Event('neutrino:navigate'))
  window.scrollTo(0, 0)
}

/**
 * Título e descrição por rota.
 *
 * Sem isto, as quatro rotas do site anterior eram indexadas com o mesmo title e
 * a mesma description do index.html — o buscador via quatro páginas idênticas.
 */
export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title

    const set = (selector: string, attr: string, value: string) => {
      const tag = document.head.querySelector(selector)
      if (tag) tag.setAttribute(attr, value)
    }

    set('meta[name="description"]', 'content', description)
    set('meta[property="og:title"]', 'content', title)
    set('meta[property="og:description"]', 'content', description)
    set('link[rel="canonical"]', 'href', window.location.origin + window.location.pathname)
  }, [title, description])
}
