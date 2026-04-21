import { Network, Shield, Code, Server, Database, Zap } from 'lucide-react';

export const Solutions = () => {
  const solutions = [
    {
      icon: Network,
      title: 'Arquitetura de Software',
      description: 'Sistemas de alta disponibilidade projetados para crescer sem refatoração. Arquiteturas que sobrevivem ao sucesso do produto.',
    },
    {
      icon: Shield,
      title: 'Segurança & Compliance',
      description: 'Threat modeling, design seguro de APIs, detecção de anomalias, auditoria para LGPD, PCI-DSS e normas setoriais. Redução de superfície de ataque.',
    },
    {
      icon: Code,
      title: 'Engenharia de Backend',
      description: 'PHP/Laravel em larga escala, Go para serviços de alta performance. Sistemas que processam dinheiro, dados sensíveis e operações críticas.',
    },
    {
      icon: Server,
      title: 'Infraestrutura & Resiliência',
      description: 'Arquitetura AWS multi-AZ, auto scaling, alta disponibilidade e disaster recovery. O sistema funciona mesmo quando a infraestrutura falha.',
    },
    {
      icon: Database,
      title: 'Performance & Observabilidade',
      description: 'Diagnóstico e resolução de gargalos reais: query tuning, caching estratégico, partitioning. Com métricas que provam o resultado.',
    },
    {
      icon: Zap,
      title: 'Integrações Críticas',
      description: 'APIs financeiras, bancárias e de terceiros com comportamento instável. Circuit breakers, retry inteligente e tolerância a falhas externas.',
    },
  ];

  return (
    <section id="solutions" className="relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16 sm:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quantum mb-8">
            Especialidades
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.15] mb-6 tracking-tight">
            Profundidade onde a maioria fica na superfície.
          </h2>
          <p className="text-lg text-muted-foreground leading-[1.7]">
            Não somos generalistas. Cada especialidade abaixo tem anos de casos reais
            em produção — com código, métricas e clientes que confirmam.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {solutions.map((solution, index) => (
            <div
              key={solution.title}
              className="group bg-background p-8 sm:p-10 hover:bg-card transition-colors duration-300"
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <solution.icon className="w-6 h-6 text-muted-foreground group-hover:text-quantum transition-colors duration-300" strokeWidth={1.5} />
                  <span className="text-xs font-bold text-muted-foreground/25 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground leading-tight">
                  {solution.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {solution.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
