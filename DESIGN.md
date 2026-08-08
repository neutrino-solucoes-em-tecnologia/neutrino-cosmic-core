# DESIGN.md — Neutrino

Contrato visual do site institucional. Fonte de verdade: `src/index.css` (tokens),
`src/scene/config.ts` (cena) e este documento (a razão de cada um).

## A tese

**Os sistemas da Neutrino decidem coisas a respeito de pessoas.**

Reconhecimento facial que aponta um suspeito. Um motor que pontua quem ganha contrato público.
Identidade biométrica. Monitoramento veicular. O que liga o portfólio inteiro não é escala nem
stack — é consequência sobre gente. É daí que vem a exigência de engenharia, e é a única coisa
que um concorrente não copia escrevendo no próprio site.

Tudo abaixo serve a isso. Se uma decisão visual não puder ser justificada por "isto é um
instrumento sério, operado por gente que responde pelo que ele faz", ela não entra.

## Cor

| Papel | Valor | Uso |
|---|---|---|
| Chassi | `#07090C` | fundo; grafite frio, nunca preto absoluto |
| Painel | `#0C0F15` | superfície elevada, bandas alternadas |
| Fosso | `#050609` | o que afunda: poços, tabelas |
| **Sinal** | `#FFB020` | **âmbar de leitura — só dado medido, ação primária e o evento na cena** |
| Sinal alto | `#FFC658` | hover de ação, pico do anel |
| Leitura | `#F2F5F9` | headline, números, picos raros |
| Corpo | `#99A2B0` | texto corrido |
| Apagado | `#5B6472` | rótulo, legenda, nota |
| Fio / Borda / Malha | `rgba(255,255,255, .08 / .16 / .045)` | estrutura, sempre neutra |

**Por que não azul.** A paleta anterior era índigo sobre preto-azulado. Era bonita e era a
assinatura de metade das ferramentas de desenvolvedor: azul virou a cor padrão de "tecnologia",
e por isso não diz nada sobre quem a usa. Esta segue a lógica de um painel real — osciloscópio,
cabine, sala de controle: **chassi frio, leitura quente.** A cor deixa de ser decoração e ganha
função. Só recebe âmbar o que foi medido.

**Regra dura.** Se o âmbar aparecer em algo que não é dado medido, ação primária ou o evento da
cena, virou enfeite e a regra quebrou. Estrutura é sempre neutra: a estrutura de um instrumento
é usinada, não colorida.

## Tipografia

Duas famílias, com fronteira semântica — não estética.

- **Inter Variable**, self-hosted, subset latino apenas (um woff2, 48KB): prosa, títulos, tudo
  que é frase. Display em 700, tracking −0.035em.
- **Monoespaçada do sistema** (`ui-monospace` → SF Mono, Cascadia, JetBrains…), custo zero:
  número, unidade, rótulo, identificador, ação. **Nunca frase.**

A versão anterior deste documento proibia uma segunda família. A regra existia contra decoração
e continua valendo para prosa — mas dado medido e prosa não são a mesma coisa, e tratá-los com
a mesma face é o que fazia a página parecer institucional em vez de técnica. Monoespaçada é o
sinal mais imediato de instrumentação que a tipografia tem.

Números sempre com `tabular-nums`: métrica que dança ao contar destrói a impressão de instrumento.

## Estrutura

Sistema de 8px. Container 1280, gutter 48 / 24 no mobile. Raio 4px em ação e campo; nada mais é
arredondado. Elevação é declarada por fio, nunca por sombra — a única sombra do site é o brilho
âmbar do botão primário.

**Malha.** As colunas do container ficam desenhadas atrás de tudo, fixas, a 4,5% de opacidade.
Uma página de engenharia não deveria flutuar; isso declara a estrutura sobre a qual ela está
montada. Fica no limiar do perceptível de propósito: ninguém deve enxergar listras, e sim sentir
que há um sistema por baixo.

## A cena (gramática)

Um detector visto de frente, não um fundo de partículas.

- **Sensores:** grade hexagonal a 11,5% de opacidade, passo de 28px, com variação determinística
  de brilho entre eles. Estão sempre lá, apagados. São a instrumentação.
- **Evento:** a cada 4–8 segundos (sorteado, nunca cadenciado), um anel se expande a ~340px/s.
  Os sensores que a casca cruza acendem em âmbar e sobem ao branco de `Leitura` no centro dela,
  decaindo em ~900ms.
- **Raridade é a mensagem, dentro de um limite.** A primeira versão usava 34px de passo, 7% de
  opacidade e 7–13s entre eventos: metade do hero ficava em preto liso e quem chegava ia embora
  sem saber que ali havia um detector. Contraste atual entre pico e repouso: 8,8×.
- **Custo:** Canvas 2D. Sem WebGL, sem three.js — a página argumenta pelo próprio peso e publica
  o número no rodapé.
- **Inspeção:** `window.__field.renderAt(290)` congela o detector num raio conhecido (só em dev).
  Sem isso, uma cena animada é inverificável: `requestAnimationFrame` não roda em aba de segundo
  plano, e toda inspeção automatizada encontra a tela parada sem distinguir "pausado" de "quebrado".
- **Respeito:** com `prefers-reduced-motion`, um estado formado e estático. Sem canvas em
  `saveData`.

## Prova, não asserção

**Todo número da página precisa ser verificável pelo visitante ou auditável internamente.**

- O bloco `Esta página` mede a si mesmo em runtime. Nenhum número escrito à mão.
- Métrica de case sem delta e sem método é claim: o `model.ts` separa `antes`, `depois` e `como`
  para tornar impossível publicar só o `depois`.
- Número não auditado fica marcado `⚠️` no model e não vai para produção.

## Do not

Azul de marca; roxo; ciano; gradiente em texto; card com sombra; âmbar em qualquer coisa que não
seja dado medido, ação primária ou o evento; monoespaçada em frase; partícula perpétua; cena em
WebGL; banner de cookie (não há cookie); número de marketing sem origem; "R$ 2,5 bilhões";
"15+ empresas"; superlativo sobre a própria competência que a página não demonstre no mesmo scroll.
