/**
 * Casos.
 *
 * A estrutura é deliberada: `antes`, `depois` e `como` são campos separados
 * porque métrica sem delta e sem método é claim, e claim é o que a página
 * inteira se recusa a fazer. "p95 de 47ms" isolado é um número bonito que
 * qualquer um digita; "de 890ms para 47ms trocando N+1 por projeção
 * materializada" é engenharia, e só escreve quem fez.
 *
 * ⚠️ ACEITE — o VVE OS é o único caso nomeado, e é nomeado porque está público
 * em vveos.com. Ainda assim, citar a Neutrino como quem construiu depende do
 * OK de quem é dono da marca VVE. Sem esse OK, o caso sai da lista; não basta
 * o site ser público.
 *
 * ⚠️ SELEÇÃO — nem todo projeto da casa entra aqui, e o critério não é orgulho,
 * é se o caso sustenta o posicionamento. Ficaram de fora: a suíte de marketing
 * multinível (o domínio custa mais credibilidade do que a engenharia devolve),
 * os projetos de e-commerce e página de campanha (não são sistema crítico), e
 * um clone exploratório que nunca foi produto.
 *
 * ⚠️ LOROS — o caso é nomeado e cita "147 fechados" porque o encerramento dos
 * itens da auditoria de 2026-07-29 foi confirmado pelo time em 2026-08-08. O
 * `REVIEW_TODO.md` do projeto ainda registra o backlog no estado em que foi
 * levantado; anexar ali a evidência de fechamento é o que torna este número
 * auditável por terceiro, e não apenas afirmado aqui.
 *
 * ⚠️ PROCEDÊNCIA — os números dos demais casos vieram do site anterior, onde
 * estavam escritos direto no JSX sem origem registrada. Os do VVE OS são os
 * declarados na página do próprio produto e têm a mesma pendência: o
 * PRODUCT.md daquele projeto registra que vieram do comp do cliente e devem
 * ser trocados por medição auditada antes de virarem alegação nossa. Antes de
 * publicar:
 *   1. confirmar cada valor contra o painel ou o relatório que o mediu;
 *   2. preencher os `antes` marcados como null — eles são o que dá peso ao
 *      depois, e são justamente os que faltam;
 *   3. obter o aceite do cliente para citar o segmento (nenhum é nomeado, mas
 *      "fintech Series B" identifica dentro de um mercado pequeno).
 * Enquanto `auditado` for false, o caso mostra a métrica com a ressalva de
 * ordem de grandeza em vez de precisão falsa.
 */

export interface Metric {
  /** Estado anterior. `null` quando não foi registrado — não se inventa. */
  antes: string | null
  depois: string
  label: string
}

export interface Case {
  id: string
  segment: string
  title: string
  /**
   * Nome curto, para a síntese da home.
   *
   * Antes a síntese cortava `title` no travessão. Com os travessões removidos
   * do texto, o corte parou de acontecer e a linha passou a exibir o título
   * inteiro. Nome de sistema é dado, não resultado de manipulação de string.
   */
  name: string
  /**
   * Uma linha, para a síntese da home.
   *
   * A home não carrega mais os seis casos inteiros — eles moram em /sistemas.
   * O que fica na home é esta linha: o suficiente para o leitor reconhecer o
   * tipo de trabalho e decidir se quer o detalhe.
   */
  oneLiner: string
  /** O problema em uma frase, do ponto de vista do negócio. */
  problem: string
  /** A intervenção, em termos técnicos verificáveis. */
  how: string
  metrics: Metric[]
  stack: string[]
  auditado: boolean
  /**
   * Endereço público do que foi construído, quando existe.
   *
   * É a diferença entre um case e uma alegação: o visitante abre, navega e
   * julga sozinho. Um único caso conferível vale mais que quatro descritos.
   */
  link?: { href: string; label: string }
}

export const CASES: Case[] = [
  {
    id: 'vveos',
    name: 'VVE OS',
    oneLiner: 'Inteligência visual em tempo real, doze verticais sobre um motor.',
    segment: 'Inteligência visual · Plataforma',
    title: 'VVE OS, uma plataforma que você pode abrir e conferir agora',
    problem:
      'Doze operações diferentes (segurança pública, saúde, varejo, defesa, escolas) que precisavam do mesmo motor de inteligência visual sem virar doze produtos para manter. E dado biométrico no meio, que é dado sensível pelo art. 11 da LGPD.',
    how: 'Ingestão por padrão aberto sobre as câmeras que o cliente já tem, arquitetura orientada a eventos com processamento na borda e na nuvem, e isolamento multi-tenant por desenho. Conformidade tratada como modelo de dados e não como anexo: consentimento guardado com a base legal, exportação e exclusão do titular implementadas como operação, e toda decisão que mira uma pessoa espera numa fila supervisionada: nenhuma correspondência vira ação sozinha.',
    metrics: [
      { antes: 'doze produtos', depois: 'um motor', label: 'superfície de manutenção' },
      { antes: null, depois: '<100 ms', label: 'processamento de evento' },
      { antes: null, depois: '99,999%', label: 'disponibilidade por desenho' },
      { antes: 'anexo de conformidade', depois: 'modelo de dados', label: 'LGPD art. 11' },
    ],
    stack: ['Arquitetura de eventos', 'Multi-tenant', 'Edge + Cloud', 'IA de visão', 'API'],
    auditado: false,
    link: { href: 'https://vveos.com', label: 'vveos.com' },
  },
  {
    id: 'loros',
    name: 'Loros',
    oneLiner: 'RAG sobre todo o edital público do país, com fallback entre modelos.',
    segment: 'SaaS B2B · IA aplicada',
    title: 'Loros, ler todo edital público do país e dizer quais valem a pena',
    problem:
      'Licitante perde contrato de duas formas: não enxerga o edital certo no volume diário do país, ou enxerga e avalia errado se a própria solução atende. As duas são trabalho de leitura que nenhuma equipe humana consegue fazer na velocidade em que os editais saem.',
    how: 'Ingestão horária do PNCP com extração de PDF e ZIP, chunking e embeddings em pgvector, e interpretação do Termo de Referência por LLM com fallback entre provedores para que a análise não pare quando um deles cai. Sobre isso, um motor que cruza os requisitos do edital com o portfólio do cliente e devolve score de compatibilidade, quinze domínios de negócio, multi-tenant, com billing e trilha de LGPD.',
    metrics: [
      { antes: 'leitura manual', depois: 'horária', label: 'cobertura do PNCP' },
      { antes: null, depois: '15 domínios', label: 'em uma plataforma' },
      { antes: 'nenhuma', depois: '147 fechados', label: 'achados de auditoria' },
      { antes: null, depois: 'com fallback', label: 'entre provedores de LLM' },
    ],
    stack: ['Laravel', 'PostgreSQL', 'pgvector', 'Redis', 'LLM', 'Multi-tenant'],
    auditado: true,
  },
  {
    id: 'pix',
    name: 'Pix em alta frequência',
    oneLiner: 'Pagamento instantâneo em alta frequência, sem janela de indisponibilidade.',
    segment: 'Fintech · Pagamentos',
    title: 'Pix em alta frequência sem janela de indisponibilidade',
    problem:
      'O volume multiplicava por dez em picos previsíveis e a plataforma degradava justamente aí, no horário em que a transação acontece.',
    how: 'Separação de leitura e escrita em CQRS, com MySQL na escrita e MongoDB na projeção de leitura alimentada por CDC. Fila com dead letter e retry idempotente para que nenhuma transação dependa de o consumidor estar de pé no instante certo. Cache Redis em duas camadas.',
    metrics: [
      { antes: null, depois: '47 ms', label: 'p95 nas APIs críticas' },
      { antes: null, depois: '30.000+/min', label: 'eventos sustentados' },
      { antes: null, depois: '92%', label: 'acerto de cache' },
      { antes: null, depois: 'zero', label: 'transações perdidas' },
    ],
    stack: ['PHP 8.3', 'Laravel', 'MySQL', 'MongoDB', 'Redis', 'AWS'],
    auditado: false,
  },
  {
    id: 'veicular',
    name: 'Monitoramento veicular',
    oneLiner: 'Consulta de quinze segundos reduzida a sub-segundo, com auditoria.',
    segment: 'GovTech · Monitoramento',
    title: 'Consulta que levava quinze segundos, e caía no pico',
    problem:
      'Sistema legado com consultas de 5 a 15 segundos, queda sob tráfego alto e nenhuma trilha de auditoria, em uma operação onde a consulta lenta é uma decisão que não é tomada.',
    how: 'Índices compostos e particionamento sobre as tabelas quentes, CDC para sincronizar as bases sem acoplar escrita e leitura, cache em múltiplas camadas e instrumentação de erro com rastreio distribuído.',
    metrics: [
      { antes: '5–15 s', depois: 'sub-segundo', label: 'consulta principal' },
      { antes: 'queda no pico', depois: 'estável', label: 'comportamento sob carga' },
      { antes: 'inexistente', depois: 'completa', label: 'trilha de auditoria' },
    ],
    stack: ['PHP', 'Laravel', 'MySQL', 'MongoDB', 'Redis'],
    auditado: false,
  },
  {
    id: 'biometria',
    name: 'Autenticação biométrica',
    oneLiner: 'Autenticação biométrica central para oito sistemas independentes.',
    segment: 'Segurança · Identidade',
    title: 'Autenticação biométrica central para oito sistemas que não se falavam',
    problem:
      'Cada sistema legado tinha o seu próprio caminho de autenticação. Unificar sem reescrever nenhum deles era a condição.',
    how: 'API stateless de validação e ciclo de vida biométrico (cadastro, revogação, auditoria) desenhada para escalar horizontalmente. Rate limiting por origem e criptografia em repouso com trilha de acesso, pelos requisitos de LGPD.',
    metrics: [
      { antes: null, depois: '180 ms', label: 'p95 de validação' },
      { antes: null, depois: '99,94%', label: 'disponibilidade em 24 meses' },
      { antes: '8 caminhos', depois: '1 API', label: 'superfície de autenticação' },
    ],
    stack: ['PHP', 'Laravel', 'MySQL', 'Redis', 'JWT'],
    auditado: false,
  },
  {
    id: 'slim',
    name: 'Terminal de autoatendimento',
    oneLiner: 'Terminal de autoatendimento que opera sem rede e reconcilia depois.',
    segment: 'Varejo · Autoatendimento',
    title: 'Terminal que continua vendendo quando a internet cai',
    problem:
      'Terminal de autoatendimento parado é caixa fechado. E trocar de adquirente exigia mexer no código embarcado de toda a rede.',
    how: 'Três camadas: portal de gestão, sistema embarcado offline-first que opera sem rede e reconcilia depois, e uma camada de abstração de meio de pagamento com fallback automático, trocar de provedor virou configuração, não implantação.',
    metrics: [
      { antes: null, depois: 'opera offline', label: 'sem perda de função' },
      { antes: 'implantação', depois: 'configuração', label: 'troca de adquirente' },
      { antes: null, depois: '−73%', label: 'chamados de suporte' },
    ],
    stack: ['PHP', 'Laravel', 'Python', 'MySQL', 'Redis'],
    auditado: false,
  },
]
