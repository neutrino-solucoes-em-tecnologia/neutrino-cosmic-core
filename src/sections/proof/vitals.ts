import { useEffect, useState } from 'react'

/**
 * Métricas da própria página, medidas no dispositivo do visitante.
 *
 * Nenhum número desta seção é escrito à mão. É a única métrica do site que o
 * visitante confere sozinho — abre o DevTools e compara — e é por isso que ela
 * sustenta as outras. Um número que se pode auditar em dez segundos vale mais
 * que dez que se pode apenas acreditar.
 */
export interface Vitals {
  /** Bytes de JavaScript transferidos, incluindo o documento inicial. */
  scriptBytes: number
  /** Bytes de CSS e fonte. */
  styleBytes: number
  /** Largest Contentful Paint, em ms. */
  lcp: number | null
  /** Requisições a hosts que não são este. */
  thirdParty: number
  /** Cookies gravados neste navegador por este site. */
  cookies: number
}

type Resource = PerformanceResourceTiming

/**
 * `transferSize` é 0 quando a resposta vem do cache ou quando o servidor não
 * envia `Timing-Allow-Origin`. Como não há terceiro nenhum aqui, o segundo caso
 * não ocorre — mas o cache sim, e nesse caso o tamanho real é o do corpo.
 */
function bytesOf(entry: Resource): number {
  return entry.transferSize || entry.encodedBodySize || 0
}

function isThirdParty(url: string): boolean {
  try {
    return new URL(url, location.href).host !== location.host
  } catch {
    return false
  }
}

export function usePageVitals(): Vitals | null {
  const [vitals, setVitals] = useState<Vitals | null>(null)

  useEffect(() => {
    let lcp: number | null = null
    let observer: PerformanceObserver | undefined

    if ('PerformanceObserver' in window) {
      try {
        observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const latest = entries[entries.length - 1]
          if (latest) lcp = Math.round(latest.startTime)
        })
        // buffered: o LCP normalmente ocorre antes deste componente montar.
        observer.observe({ type: 'largest-contentful-paint', buffered: true })
      } catch {
        // Navegador sem suporte a LCP: a linha simplesmente não é publicada.
      }
    }

    /** Medir cedo demais captura metade dos recursos. */
    function collect() {
      const resources = performance.getEntriesByType('resource') as Resource[]
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming | undefined

      let scriptBytes = navigation ? bytesOf(navigation as unknown as Resource) : 0
      let styleBytes = 0
      let thirdParty = 0

      for (const entry of resources) {
        if (isThirdParty(entry.name)) thirdParty++

        if (entry.initiatorType === 'script') scriptBytes += bytesOf(entry)
        else if (entry.initiatorType === 'link' || entry.initiatorType === 'css')
          styleBytes += bytesOf(entry)
      }

      setVitals({
        scriptBytes,
        styleBytes,
        lcp,
        thirdParty,
        cookies: document.cookie ? document.cookie.split(';').length : 0,
      })
    }

    // Uma volta depois do load: o LCP já assentou e os recursos já entraram.
    if (document.readyState === 'complete') {
      const id = window.setTimeout(collect, 600)
      return () => {
        window.clearTimeout(id)
        observer?.disconnect()
      }
    }

    let timeout: number
    const onLoad = () => {
      timeout = window.setTimeout(collect, 600)
    }
    window.addEventListener('load', onLoad)
    return () => {
      window.removeEventListener('load', onLoad)
      window.clearTimeout(timeout)
      observer?.disconnect()
    }
  }, [])

  return vitals
}

export function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`
}

export function formatSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(2).replace('.', ',')} s`
}
