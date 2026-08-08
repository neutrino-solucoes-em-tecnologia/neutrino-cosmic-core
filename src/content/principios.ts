/**
 * Compromissos de engenharia.
 *
 * Este conteúdo já esteve na home, como uma seção chamada "Postura" com o título
 * "quatro coisas que não são negociáveis". Saiu de lá porque, no meio de uma
 * página de venda, lia como confronto com quem estava lendo — e o último item
 * chegava a avisar o visitante de que ele podia ser recusado.
 *
 * O conteúdo continua verdadeiro e continua importando; o que mudou foi o lugar
 * e o tom. Aqui é documento: quem procura sabe o que veio buscar, e o texto pode
 * ser factual em vez de enfático.
 */

export interface Principle {
  index: string
  title: string
  body: string
}

export const PRINCIPLES: Principle[] = [
  {
    index: '01',
    title: 'Decisão sobre pessoa passa por pessoa',
    body: 'Em sistemas que identificam ou classificam indivíduos, nenhuma correspondência automática dispara ação por conta própria. O resultado entra numa fila supervisionada: o sistema sugere, alguém decide, e a decisão fica registrada com autoria.',
  },
  {
    index: '02',
    title: 'A trilha é projetada antes de ser necessária',
    body: 'Registramos o que foi observado, o que foi sugerido e quem decidiu, inclusive quando a decisão foi descartar. O objetivo é que uma auditoria futura seja respondida a partir do próprio sistema, e não reconstruída de registros que não foram feitos para isso.',
  },
  {
    index: '03',
    title: 'Conformidade entra no modelo de dados',
    body: 'Dado biométrico é dado pessoal sensível nos termos do art. 11 da LGPD. Tratamos isso como decisão de esquema: o consentimento é armazenado junto da base legal sob a qual foi obtido, e exportar ou eliminar os dados de um titular é uma operação prevista do produto.',
  },
  {
    index: '04',
    title: 'Escopos que não atendemos',
    body: 'Há classes de sistema que não construímos: vigilância sem supervisão humana, pontuação de pessoas sem via de contestação, e coleta que o titular não teria como identificar. Registramos isso aqui porque é mais útil saber no início de uma conversa do que ao fim dela.',
  },
]
