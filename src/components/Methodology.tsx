import { Target, Layers, GitMerge, Shield } from 'lucide-react';

export const Methodology = () => {
  const principles = [
    {
      icon: Layers,
      title: 'Architecture-first',
      description: 'Antes de escrever código, desenhamos a arquitetura. Componentes, fluxos, pontos de falha, escalabilidade. O código é consequência.',
    },
    {
      icon: Shield,
      title: 'Security by design',
      description: 'Segurança não é auditoria no final. É decisão arquitetural desde o início. Criptografia, surface reduction, defense in depth.',
    },
    {
      icon: Target,
      title: 'Eficiência sobre hype',
      description: 'Não usamos tecnologia porque está na moda. Usamos o que resolve o problema com menor custo operacional e maior confiabilidade.',
    },
    {
      icon: GitMerge,
      title: 'Manutenibilidade',
      description: 'Código que funciona hoje e quebra amanhã não serve. SOLID, MVC, padrões consolidados. Legibilidade é responsabilidade.',
    },
  ];

  return (
    <section id="methodology" className="relative py-32 px-6 md:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-8">
            Como Trabalhamos
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.2] mb-8 tracking-tight">
            Metodologia que prioriza resultado, não processo
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-[1.7]">
            Não seguimos frameworks ágeis cegamente. Seguimos engenharia disciplinada, 
            accountability técnica e ownership de longo prazo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {principles.map((principle, index) => (
            <div 
              key={principle.title} 
              className="group bg-white p-8 border border-gray-200 hover:border-gray-900 transition-all duration-300 hover:shadow-lg"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 group-hover:bg-gray-900 transition-colors duration-300">
                    <principle.icon className="w-6 h-6 text-foreground group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-bold text-gray-300">{String(index + 1).padStart(2, '0')}</span>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">
                    {principle.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-16">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 leading-tight">
                Transparência técnica
              </h3>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                Você entende o que estamos fazendo e por quê. Sem jargões para impressionar. 
                Sem esconder complexidade com marketing.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                Documentação técnica real, revisões de código, explicações claras. 
                O projeto é seu, não nosso.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 leading-tight">
                Ownership de longo prazo
              </h3>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                Não entregamos e sumimos. Assumimos a responsabilidade pelo código que escrevemos. 
                Se quebrar, consertamos.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                Contratos de longo prazo, SLAs reais, disponibilidade 24/7 para sistemas críticos. 
                Parceria, não projeto pontual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
