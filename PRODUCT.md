# PRODUCT.md — site institucional Neutrino

Registro do que a página afirma, com que autoridade, e o que ainda precisa de
decisão humana antes de ir ao ar. Existe porque a versão anterior publicava
"holding tecnológica de R$ 2,5 bilhões" sem nenhum lugar onde alguém pudesse
perguntar de onde saiu o número.

## A tese

A landing não diz que a Neutrino é boa — ela é a prova. Cada afirmação da página
é verificável pelo visitante ou auditável internamente, e a seção `Esta página`
mede a si mesma em runtime para que a primeira evidência que o visitante recebe
seja uma que ele confere sozinho, em dez segundos, no DevTools.

Consequência prática: **performance é argumento de venda, não requisito de
infraestrutura.** Uma dependência nova que engorde o bundle não é um detalhe
técnico, é uma afirmação da página ficando menos verdadeira.

## Ordem das dobras, e por quê

1. **Hero** — o problema, na metáfora da marca.
2. **Como trabalhamos** — medir, corrigir, sair. O método antes da prova.
3. **O que já resolvemos** — prova de terceiro, com delta e método.
4. **Investimento** — o preço no momento de maior ceticismo.
5. **Esta página** — prova de primeira mão, logo depois do preço. É de propósito.
6. **Dúvidas** — inclusive as desconfortáveis.
7. **Começar** — e-mail e WhatsApp, sem formulário.

## Copy sancionado

- Headline: "Todo sistema em produção está dizendo o que há de errado. Quase
  ninguém tem o instrumento para ouvir."
- Posicionamento: engenharia para sistemas **já em produção**, com consequência
  em receita, compliance ou operação. Não é fábrica de software, não é produto
  do zero, não é alocação de corpo.
- Limite declarado: três engajamentos simultâneos.
- Contato: `neutrino@neutrino.dev.br`, `+55 41 99921-4248`, Curitiba/PR.

## Pendências antes de publicar

Em ordem de urgência. As três primeiras bloqueiam o lançamento.

1. **Preço** (`src/sections/pricing/model.ts`) — `price` está `null` nas duas
   ofertas e a página mostra "Depende do escopo". Publicar a faixa real é o
   movimento de confiança mais forte disponível neste mercado e qualifica lead
   sozinho. É a única decisão que o código não pode tomar.
2. **CNPJ** (`src/config/site.ts`) — vazio. A LGPD (art. 41) exige que o
   controlador seja publicamente identificável; enquanto faltar, a página de
   privacidade declara a lacuna em vez de fingir conformidade.
3. **Procedência dos números dos casos** (`src/sections/cases/model.ts`) — todos
   com `auditado: false`. Vieram do site anterior, onde estavam escritos direto
   no JSX sem origem registrada. Confirmar cada um contra o painel que mediu, e
   preencher os campos `antes` que estão `null` — eles são o que dá peso ao
   depois.
4. **Aceite dos clientes** para citar segmento. Nenhum é nomeado, mas "fintech
   Series B" identifica dentro de um mercado pequeno.
5. **Teardown técnico público** — a peça de maior conversão que falta. Um
   problema real, o raciocínio inteiro, incluindo o que foi tentado e falhou.
   Converte comprador técnico melhor que qualquer seção "por que nós".

## O que saiu, e por quê

- **`/sobre` e `/ecossistema`** — publicavam "holding tecnológica de R$ 2,5
  bilhões", "15+ empresas controladas" e "potência tecnológica global" a um
  clique de uma home que promete não vender hype. Estavam no sitemap com
  prioridade 0.9. Um comprador técnico lê isso como sinal de alerta, e o resto
  da página perde junto.
- **Formulário de contato** — não enviava nada: chamava `toast.success`, limpava
  o estado e descartava o lead. Mesmo funcionando, era atrito no público errado.
- **Página `/cookies`** — não há cookie a documentar.
- **`docs/`** — 80+ arquivos de documentação técnica de outro sistema, incluindo
  credenciais de integração. Movidos para fora do repositório; ver o relatório
  de auditoria para a parte que ainda depende de decisão (histórico Git e
  rotação de chaves).
