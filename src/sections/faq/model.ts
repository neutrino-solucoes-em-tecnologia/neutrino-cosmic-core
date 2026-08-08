/**
 * Dúvidas.
 *
 * As perguntas que aparecem de fato na primeira conversa, inclusive as
 * desconfortáveis — FAQ que só faz pergunta fácil sinaliza que existe uma
 * difícil sendo escondida.
 *
 * A versão anterior foi escrita quando a página vendia diagnóstico e correção,
 * e duas perguntas passaram a contradizer o posicionamento: uma respondia que
 * construir produto novo "não é o que fazemos melhor" — o oposto do que a
 * página afirma hoje — e outra tratava o time do cliente como quem seria
 * auditado. Foram substituídas pelas que um comprador de construção realmente
 * faz: prazo, propriedade do código, verificação e o que acontece depois.
 */

export interface Question {
  q: string
  a: string
}

export const QUESTIONS: Question[] = [
  {
    q: 'Quem faz o trabalho é quem eu converso?',
    a: 'Sim. Não há camada de repasse: quem entra na sua base é quem esteve na reunião. É por isso que o teto é de três projetos simultâneos. Não é escassez de marketing: é a conta de quantas bases um time pequeno consegue conhecer de verdade ao mesmo tempo.',
  },
  {
    q: 'Quanto tempo até a primeira coisa entrar em produção?',
    a: 'A arquitetura leva de duas a quatro semanas. A partir daí cada ciclo termina em produção, e o primeiro costuma fechar em quatro a seis semanas, não com o produto inteiro, e sim com o caminho que atravessa o sistema de ponta a ponta. Colocar cedo o fluxo completo no ar é o que revela erro de arquitetura enquanto ele ainda é barato de corrigir.',
  },
  {
    q: 'O código e a infraestrutura ficam no nome de quem?',
    a: 'Do cliente, desde o primeiro dia. Repositório na sua organização, contas de nuvem na sua titularidade, domínio e certificados no seu registro. Nunca houve projeto nosso hospedado em conta da Neutrino, e não é por generosidade: sistema que só a fornecedora consegue publicar é um risco operacional que ninguém deveria aceitar.',
  },
  {
    q: 'Como vocês verificam que o que foi entregue funciona?',
    a: 'Teste automatizado rodando em integração contínua, análise estática travando o merge, e observabilidade instalada antes do primeiro usuário, não depois do primeiro incidente. Cada ciclo declara no início o número que pretende mover e mostra a medição no fim, inclusive quando ela desmente o que a gente esperava.',
  },
  {
    q: 'Depois que vocês saem, meu time consegue tocar?',
    a: 'É o objetivo declarado desde a primeira etapa. A documentação é escrita durante o trabalho, os painéis e alertas ficam no ambiente do cliente e o runbook cobre o que fazer de madrugada. Consultoria que se torna indispensável fracassou na parte que importa, e a transferência começa antes do fim, não como entrega final.',
  },
  {
    q: 'Com qual stack vocês trabalham?',
    a: 'PHP e Laravel, Go, Python, PostgreSQL e MySQL, MongoDB, Redis, filas e AWS. Fora disso avaliamos caso a caso, e se não dominarmos o suficiente para responder pelo resultado, dizemos na primeira conversa e indicamos quem domina. A escolha da stack sai da restrição do problema, não da nossa preferência.',
  },
  {
    q: 'Assinam NDA e trabalham com dado pessoal sensível?',
    a: 'Sim para os dois. Trabalhamos sob NDA e, quando há dado pessoal envolvido, o levantamento de exposição sob a LGPD entra já na etapa de arquitetura: quem acessa o quê, o que está cifrado em repouso, o que ficaria registrado em caso de incidente. Os critérios que aplicamos estão publicados em Compromissos de engenharia.',
  },
]
