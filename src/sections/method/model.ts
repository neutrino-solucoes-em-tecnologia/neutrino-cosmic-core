/**
 * Da arquitetura à operação.
 *
 * A versão anterior era diagnóstico → correção → transferência, e isso descrevia
 * apenas metade do que a empresa faz — a metade em que se entra num sistema
 * alheio já quebrado. Lida de fora, dizia "consertamos o que os outros erraram",
 * quando quatro dos seis sistemas do portfólio foram construídos aqui desde a
 * arquitetura. A diferença entre construir uma plataforma e assumir a de outro é
 * grande demais para caber na mesma palavra.
 *
 * As três etapas servem aos dois caminhos, e a primeira muda de natureza
 * conforme o sistema já exista ou não.
 *
 * "Engajamento" saiu do texto visível: é a palavra que mais entrega consultoria
 * numa página que vende construção.
 *
 * ⚠️ EXTENSÃO — os três `body` e os três `deliverable` têm comprimento
 * equivalente de propósito. As colunas ficam lado a lado e compartilham as
 * faixas do subgrid: quando um texto é bem mais curto que o vizinho, sobra um
 * vão desigual antes da linha âmbar e as três colunas parecem desalinhadas,
 * mesmo estando. Ao editar, manter o corpo perto de 250 caracteres e o
 * entregável perto de 100.
 */

export interface Step {
  index: string
  title: string
  duration: string
  body: string
  /** O que fica com o cliente ao fim da etapa. */
  deliverable: string
}

export const STEPS: Step[] = [
  {
    index: '01',
    title: 'Arquitetura',
    duration: 'Duas a quatro semanas · escopo fechado',
    body: 'Em plataforma nova, decide o que o resto consegue sustentar: fronteiras entre contextos, modelo de dados, isolamento entre clientes e o que será medido desde o primeiro dia. Em sistema que já roda, começa instrumentando o que existe antes de opinar sobre ele.',
    deliverable:
      'Desenho técnico com cada decisão registrada, inclusive as descartadas, pronto para qualquer time executar.',
  },
  {
    index: '02',
    title: 'Construção',
    duration: 'Ciclos de escopo fechado',
    body: 'Cada ciclo tem objetivo verificável no início e no fim, e termina em produção, não em branch nem em homologação. O que é novo nasce com teste, observabilidade e trilha de auditoria; o que é correção sai com a medição de antes e depois.',
    deliverable:
      'Software em produção ao fim de cada ciclo, acompanhado da medição que justifica a mudança.',
  },
  {
    index: '03',
    title: 'Operação e transferência',
    duration: 'Do primeiro ciclo à virada de chave',
    body: 'Operamos junto enquanto o sistema amadurece: painéis, alertas e plantão até o comportamento em carga real ser conhecido. A documentação é escrita durante o trabalho, e o runbook cobre o que fazer quando alguém for acordado às três da manhã.',
    deliverable:
      'Seu time assume sem depender da gente, sem conhecimento crítico preso apenas na nossa cabeça.',
  },
]
