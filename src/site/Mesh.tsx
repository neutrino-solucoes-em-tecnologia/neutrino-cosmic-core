/**
 * A malha estrutural do site: as colunas do container desenhadas atrás de tudo.
 *
 * Uma página de engenharia não deveria flutuar. Isto declara a estrutura sobre a
 * qual ela está montada — do mesmo jeito que um desenho técnico mostra a grade
 * em que foi feito. Fica no limiar do perceptível de propósito: ninguém deve
 * enxergar listras, e sim sentir que há um sistema por baixo.
 *
 * `fixed`: a malha não rola. O conteúdo passa por cima dela, o que faz a página
 * ler como camada sobre estrutura, e não como fundo colado no texto.
 */
export function Mesh() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="mx-auto h-full max-w-[80rem] px-6 lg:px-12">
        <div className="mesh h-full" />
      </div>
    </div>
  )
}
