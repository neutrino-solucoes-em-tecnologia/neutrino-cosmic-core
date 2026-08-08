import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Principios } from './pages/Principios'
import { Sistemas } from './pages/Sistemas'
import { Privacidade } from './pages/Privacidade'
import { useRoute } from './site/router'

/**
 * Três rotas estáticas. `/sobre` e `/ecossistema` foram removidas: publicavam
 * "holding tecnológica de R$ 2,5 bilhões" e "15+ empresas controladas" a um
 * clique de uma home que promete não vender hype — e as duas estavam no
 * sitemap com prioridade 0.9. Ver DESIGN.md § "Do not".
 */
export function App() {
  const path = useRoute()

  switch (path.replace(/\/+$/, '') || '/') {
    case '/':
      return <Home />
    case '/sistemas':
      return <Sistemas />
    case '/principios':
      return <Principios />
    case '/privacidade':
      return <Privacidade />
    default:
      return <NotFound />
  }
}
