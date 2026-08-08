/**
 * Frentes de engenharia.
 *
 * A seção fica depois dos sistemas de propósito: lida antes de qualquer prova,
 * uma lista de competências é indistinguível da de qualquer concorrente. Depois
 * dos casos, ela responde à pergunta seguinte — como aqueles resultados foram
 * possíveis.
 *
 * Regra de conteúdo: cada item descreve a decisão difícil e o que ela custa
 * quando é tomada errado. "Sabemos fazer X" não diz nada; "quando X é feito
 * assim, acontece Y dois anos depois" só escreve quem já viu acontecer.
 *
 * Regra de entrada: nenhum domínio aparece aqui sem um sistema em produção que
 * o exerça. Não é lista de tecnologias — é onde já houve consequência real.
 */

export interface Domain {
  title: string
  body: string
  /** O sistema que exerce esse domínio, citado nos casos. */
  evidence: string
}

export const DOMAINS: Domain[] = [
  {
    title: 'Arquitetura orientada a eventos',
    body: 'A decisão é onde fica a fonte da verdade e o que acontece quando o consumidor cai, porque em volume alto ele vai cair. Entrega garantida, consumo idempotente e fila morta com reprocessamento entram no desenho inicial; encaixados depois, viram uma migração com o sistema no ar.',
    evidence: 'VVE OS · pagamentos em alta frequência',
  },
  {
    title: 'Isolamento entre clientes',
    body: 'Multi-tenancy é fácil de acertar no caminho feliz e difícil de garantir nos indiretos: uma busca que retorna contagem, uma mensagem de erro que confirma existência, um relatório agregado. Isolamento que vive no modelo de dados sobrevive ao endpoint novo que alguém escreve na pressa; o que vive em filtro de aplicação, não.',
    evidence: 'VVE OS · plataforma de licitações',
  },
  {
    title: 'IA sobre acervo próprio',
    body: 'Recuperação com embeddings e busca vetorial, interpretação por modelo de linguagem com fallback entre provedores, e teto de custo com contabilização por chamada. Sem isso, a conta de inferência só aparece na fatura. Onde a saída atinge uma pessoa, ela passa por fila supervisionada antes de virar ação.',
    evidence: 'Loros · VVE OS',
  },
  {
    title: 'Alto volume, baixa latência',
    body: 'Separação de leitura e escrita, projeção materializada alimentada por captura de mudança, cache em camadas e particionamento das tabelas quentes. O alvo não é o número do benchmark: é o percentil 95 no horário em que a operação de fato acontece, que costuma ser o pior momento do dia.',
    evidence: 'Pix · monitoramento veicular',
  },
  {
    title: 'Dado sensível e auditoria',
    body: 'Biometria é dado sensível pelo art. 11 da LGPD, e isso é decisão de esquema, não de documento. Consentimento guardado com a base legal sob a qual foi obtido, eliminação do titular como operação de rotina, e trilha que responde à auditoria a partir do sistema, não de uma força-tarefa reconstruindo log que nunca foi feito para isso.',
    evidence: 'VVE OS · API de biometria',
  },
  {
    title: 'Borda, nuvem e operação offline',
    body: 'Processamento distribuído entre borda e nuvem, e software embarcado que continua operando com a rede fora e reconcilia quando ela volta. Trocar de provedor precisa ser configuração: quando exige implantação em toda a frota, o custo de uma renegociação comercial vira um projeto de engenharia.',
    evidence: 'VVE OS · terminais de autoatendimento',
  },
]
