import { AlertTriangle, TrendingDown, ShieldAlert, GitBranch } from 'lucide-react';

export const Problems = () => {
  const problems = [
    {
      icon: TrendingDown,
      title: 'Instabilidade sob carga',
      description: 'Seu sistema cai em momentos críticos. Black Friday, campanhas de marketing, picos de tráfego. A arquitetura não foi projetada para escalar.',
    },
    {
      icon: GitBranch,
      title: 'Decisões arquiteturais equivocadas',
      description: 'O código funciona, mas não evolui. Cada mudança quebra três funcionalidades. A dívida técnica impede o crescimento do negócio.',
    },
    {
      icon: ShieldAlert,
      title: 'Vulnerabilidades de segurança',
      description: 'APIs expostas, dados sensíveis mal protegidos, falta de criptografia adequada. Um ataque bem-sucedido é questão de tempo.',
    },
    {
      icon: AlertTriangle,
      title: 'Integrações frágeis',
      description: 'Dependência de terceiros que falham constantemente. APIs bancárias, gateways de pagamento, ERPs legados. Quando falham, seu negócio para.',
    },
  ];

  return (
    <section id="problems" className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12 sm:mb-16 md:mb-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 sm:mb-6">
            Problemas Reais
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
            Para quem trabalhamos
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            Empresas onde sistemas instáveis custam milhões. Onde vulnerabilidades não são 
            teóricas. Onde downtime significa perda de receita, credibilidade e clientes. 
            Se o problema é crítico, nós resolvemos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={problem.title} 
              className="group bg-white p-8 border border-gray-200 hover:border-gray-900 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 group-hover:bg-gray-900 transition-colors duration-300">
                    <problem.icon className="w-6 h-6 text-foreground group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                </div>
                
                <div className="flex-1 pt-1">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-xs font-bold text-gray-400">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="text-xl font-bold text-foreground leading-tight">
                      {problem.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="bg-foreground text-background p-12 md:p-16 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gray-400"></div>
            
            <div className="relative max-w-5xl mx-auto">
              <div className="flex items-start gap-6 mb-8">
                <span className="text-5xl md:text-6xl font-bold text-gray-400 leading-none">"</span>
                <div className="flex-1 pt-2">
                  <p className="text-lg md:text-xl text-gray-100 leading-relaxed font-light mb-6">
                    Se seu sistema processa <span className="font-semibold text-white">milhões de reais por mês</span>, 
                    se downtime <span className="font-semibold text-white">custa dinheiro real</span>, 
                    se segurança é <span className="font-semibold text-white">regulatória e obrigatória</span> — 
                    você precisa de <span className="font-semibold text-white">engenharia de verdade</span>, 
                    não de soluções temporárias.
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                    <div className="w-12 h-[2px] bg-gray-400"></div>
                    <p className="text-sm font-semibold text-white uppercase tracking-wider">
                      Esses são os problemas que resolvemos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
