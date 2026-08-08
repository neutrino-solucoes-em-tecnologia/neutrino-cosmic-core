/**
 * Fit.
 *
 * Ocupa o lugar da antiga seção "Investimento": falar de dinheiro na página, sem
 * número, só enfraquecia. A função daquela seção era qualificar, e é isso que
 * esta faz melhor — o leitor reconhece o próprio caso e chama.
 *
 * As quatro situações começavam todas por problema preexistente ("o sistema
 * cresceu demais", "a carga chegou onde não previa"), o que dizia à página
 * inteira que a empresa existe para consertar o erro dos outros. Quatro dos seis
 * sistemas do portfólio foram construídos aqui desde a arquitetura. Construir
 * vem primeiro; assumir sistema alheio é o segundo caminho, não o único.
 */

export const WHEN_TO_CALL = [
  {
    title: 'Existe uma plataforma para construir, e ela é difícil',
    body: 'Multi-tenant desde o primeiro dia, tempo real, IA sobre acervo próprio, integração com o que o cliente já tem. O tipo de sistema que uma equipe generalista consegue especificar, começa a construir e trava quando as primeiras decisões de arquitetura cobram o preço.',
  },
  {
    title: 'Há dado pessoal ou decisão sobre pessoas no meio',
    body: 'Biometria, identificação, pontuação de indivíduos, dado sensível sob LGPD. Aqui o requisito não é desempenho: é saber quem acessou o quê, quem decidiu, e como isso se demonstra a um auditor um ano depois.',
  },
  {
    title: 'O produto precisa nascer pronto para operar',
    body: 'Não é protótipo: já sobe com observabilidade, trilha de auditoria, isolamento entre clientes e caminho de reversão. Quando esses itens ficam para a segunda fase, eles voltam como reescrita.',
  },
  {
    title: 'Um sistema em produção passou do ponto',
    body: 'O que funcionava com mil usuários degrada com cem mil, a equipe entrega mais rápido do que consegue verificar, e a discussão interna virou "reescrever ou aguentar". As duas respostas costumam estar erradas antes de existir medição.',
  },
] as const

