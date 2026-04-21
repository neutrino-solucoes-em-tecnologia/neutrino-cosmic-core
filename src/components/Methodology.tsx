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
    <section id="methodology" className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-12 sm:mb-16 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-quantum mb-6 sm:mb-8">
            Como Trabalhamos
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] sm:leading-[1.2] mb-6 sm:mb-8 tracking-tight">
            Metodologia que prioriza resultado, não processo
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-[1.6] sm:leading-[1.7]">
            Não seguimos frameworks ágeis cegamente. Seguimos engenharia disciplinada,
            accountability técnica e ownership de longo prazo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20">
          {principles.map((principle, index) => (
            <div
              key={principle.title}
              className="group bg-background p-8 border border-border hover:border-quantum/40 transition-all duration-300"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 flex items-center justify-center bg-secondary border border-border group-hover:border-quantum/50 group-hover:bg-quantum/10 transition-colors duration-300">
                    <principle.icon className="w-6 h-6 text-muted-foreground group-hover:text-quantum transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground/40">{String(index + 1).padStart(2, '0')}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">
                    {principle.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-16">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 leading-tight">
                Transparência técnica
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Você entende o que estamos fazendo e por quê. Sem jargões para impressionar.
                Sem esconder complexidade com marketing.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Documentação técnica real, revisões de código, explicações claras.
                O projeto é seu, não nosso.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 leading-tight">
                Ownership de longo prazo
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Não entregamos e sumimos. Assumimos a responsabilidade pelo código que escrevemos.
                Se quebrar, consertamos.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
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
