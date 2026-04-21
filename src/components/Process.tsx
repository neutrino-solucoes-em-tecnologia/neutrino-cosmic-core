import { MessageSquare, FileSearch, Code2, Rocket } from 'lucide-react';

export const Process = () => {
  const steps = [
    {
      number: '01',
      icon: MessageSquare,
      title: 'Conversa Inicial',
      duration: '1 hora',
      description: 'Entendemos o problema técnico, contexto de negócio, urgência e restrições. Sem compromisso, sem custo.',
      deliverable: 'Proposta de assessment ou passamos se não formos o fit certo.',
    },
    {
      number: '02',
      icon: FileSearch,
      title: 'Assessment Técnico',
      duration: '1-2 semanas',
      description: 'Auditoria profunda: arquitetura atual, gargalos, vulnerabilidades, debt técnico. Acesso read-only ao código e infra.',
      deliverable: 'Relatório executivo + recomendações priorizadas + estimativa de esforço.',
    },
    {
      number: '03',
      icon: Code2,
      title: 'Pilot / Prova de Conceito',
      duration: '30-45 dias',
      description: 'Resolvemos 1 problema crítico como piloto. Você avalia nossa execução, comunicação e fit cultural antes de comprometer long-term.',
      deliverable: 'Código em produção + documentação + métricas de resultado.',
    },
    {
      number: '04',
      icon: Rocket,
      title: 'Parceria Contínua',
      duration: 'Ongoing',
      description: 'Assumimos ownership de longo prazo: desenvolvimento, manutenção, evolução, on-call. Você tem um CTO técnico sob demanda.',
      deliverable: 'Sprints quinzenais, relatórios mensais, SLA documentado, acesso direto ao time.',
    },
  ];

  return (
    <section id="process" className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-muted">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-12 sm:mb-16 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-quantum mb-6 sm:mb-8">
            Como Trabalhamos
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] sm:leading-[1.2] mb-6 sm:mb-8 tracking-tight">
            Processo transparente. Sem surpresas.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-[1.6] sm:leading-[1.7]">
            Não começamos projetos de 6 meses sem provar que somos o fit certo. 
            Você testa nossa execução em um piloto real antes de qualquer compromisso long-term.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group bg-card border border-border hover:border-quantum/40 transition-all duration-300"
            >
              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                  {/* Left: Number + Icon */}
                  <div className="flex lg:flex-col items-start gap-4 lg:gap-6">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl sm:text-5xl font-bold text-border group-hover:text-quantum transition-colors duration-300">
                        {step.number}
                      </span>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-secondary border border-border group-hover:border-quantum/50 group-hover:bg-quantum/10 transition-colors duration-300">
                        <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground group-hover:text-quantum transition-colors duration-300" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                        {step.title}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 bg-secondary text-xs font-semibold text-muted-foreground rounded-full whitespace-nowrap">
                        {step.duration}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>

                    <div className="pt-3 border-t border-border">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Entregável: </span>
                          <span className="text-sm text-foreground">{step.deliverable}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Investment Info */}
        <div className="mt-12 sm:mt-16 md:mt-20 bg-card border border-border p-6 sm:p-8 md:p-10">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">
              Investimento Típico
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Assessment</div>
                <div className="text-2xl font-bold text-foreground mb-1">R$ 8.000 - 15.000</div>
                <div className="text-sm text-muted-foreground">Relatório completo + roadmap técnico prioritizado</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Pilot (30 dias)</div>
                <div className="text-2xl font-bold text-foreground mb-1">R$ 25.000 - 45.000</div>
                <div className="text-sm text-muted-foreground">1 problema crítico resolvido + código em produção</div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Parceria contínua: a partir de R$ 35.000/mês (squad dedicado). Valores variam conforme complexidade, 
                urgência e volume de trabalho. Primeiro piloto sempre antes de compromisso long-term.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-base sm:text-lg text-muted-foreground mb-6">
            Quer saber se seu desafio se encaixa? Vamos conversar.
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center px-6 sm:px-8 h-11 sm:h-12 bg-quantum hover:bg-quantum/90 text-quantum-foreground rounded font-semibold text-sm transition-all"
          >
            Agendar Conversa Inicial
          </button>
        </div>
      </div>
    </section>
  );
};
