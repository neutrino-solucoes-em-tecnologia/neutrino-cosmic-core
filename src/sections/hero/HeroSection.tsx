import { DetectorField } from '@/scene/DetectorField'
import { Arrow, Cta } from '@/site/Cta'
import { Reveal } from '@/site/Reveal'
import { whatsappUrl } from '@/config/site'

/**
 * A abertura.
 *
 * O título anterior — "engenharia de plataforma para sistemas de consequência"
 * — usava um termo que ninguém decodifica na primeira leitura: "sistemas de
 * consequência" é jargão inventado aqui dentro. Trocado por um verbo e um
 * objeto que qualquer leitor entende, sem citar segmento.
 *
 * O parágrafo, pelo mesmo motivo, não abre por uma lista de nichos. Citar inteligência visual, domínio regulado e pagamento fechava a
 * empresa em três nichos — quem lesse concluiria que é só isso que fazemos,
 * quando o que liga o portfólio é a natureza do problema, não o mercado.
 *
 * O verbo "construir" é deliberado. A página inteira vinha
 * descrevendo entrada em sistema alheio — diagnóstico, correção, "passou do
 * ponto" — e isso comunica uma empresa que existe para consertar o erro dos
 * outros. Quatro dos seis sistemas do portfólio nasceram aqui, desde a
 * arquitetura. Construir vem primeiro; assumir sistema existente é o segundo
 * caminho, não o único.
 *
 * Nada aqui usa a animação de entrada do resto do site, de propósito. Ela é
 * disparada por IntersectionObserver, o que significa que o texto nasce
 * invisível e só aparece depois do JavaScript montar, rodar o observer e vencer
 * 700ms de transição com até 340ms de atraso. O efeito colateral era uma tela
 * quase vazia no primeiro segundo e um LCP artificialmente adiado — numa página
 * cujo argumento central é o próprio tempo de carregamento. Abaixo da dobra a
 * animação continua fazendo sentido; aqui, não.
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden border-b border-hairline">
      <DetectorField />

      {/*
        Máscara horizontal, não radial.
        A radial que estava aqui apagava a cena inteira e deixava 55% do hero em
        preto liso: a assinatura da marca simplesmente não aparecia na tela. Esta
        escurece só a faixa que fica sob o texto e devolve a direita ao detector
        — é a mesma composição que funciona na imagem de compartilhamento.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--color-mine)_0%,var(--color-mine)_30%,transparent_82%)]"
      />

      {/*
        A dobra inteira, com o conteúdo centrado na altura livre.

        `svh` e não `vh`: no mobile a barra do navegador entra na conta, e
        `100vh` empurraria o rodapé do bloco para fora da primeira tela.
      */}
      <div className="relative mx-auto flex w-full max-w-[80rem] flex-1 flex-col justify-center px-6 pb-24 pt-32 sm:pt-36 lg:px-12">
        <div className="max-w-[52rem]">
          <p className="mono flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-faint">
            <span aria-hidden="true" className="h-px w-6 shrink-0 bg-faint/60" />
            Curitiba, Brasil · Desde 2020
          </p>

          {/*
            Tom.

            As versões anteriores desta abertura tentavam ser memoráveis —
            "alguém precisa construir isso", "por isso a engenharia importa".
            Frase de efeito é o vocabulário de quem precisa convencer, e as casas
            de engenharia que servem de referência fazem o oposto: descrevem com
            precisão e deixam a especificidade trabalhar. A confiança aparece
            como ausência de esforço. Aqui o título diz o que a empresa é, e o
            parágrafo diz exatamente em quê — sem um único adjetivo sobre nós.
          */}
          <h1 className="mt-6 text-balance text-[clamp(2rem,5.4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.035em] text-event sm:mt-8">
            Construímos o software que sustenta operações inteiras.
          </h1>

          <p className="mt-6 max-w-[42rem] text-pretty text-[1.0625rem] leading-[1.72] text-body sm:mt-8 sm:text-[1.125rem]">
            Arquitetura e engenharia avançada, da concepção à produção.
          </p>

          {/*
            A entrada volta aqui — mas só daqui para baixo.

            A headline e o parágrafo continuam pintados no primeiro quadro,
            porque animá-los adiava o LCP numa página que publica o próprio
            tempo de carregamento. Ação e números podem chegar 200ms depois: dá
            movimento à abertura sem custar a métrica que a página defende.
          */}
          <Reveal delay={120}>
            <div className="mt-9 flex flex-wrap items-center gap-4 sm:mt-11">
              <Cta href={whatsappUrl()}>
                Iniciar conversa
                <Arrow />
              </Cta>
              <Cta href="/sistemas" variant="ghost">
                O que já está no ar
              </Cta>
            </div>
          </Reveal>

        </div>
      </div>

    </section>
  )
}
