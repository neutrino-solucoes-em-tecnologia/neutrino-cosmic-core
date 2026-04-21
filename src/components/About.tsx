import { Clock, Users, Code2, HeartHandshake } from 'lucide-react';

export const About = () => {
  const values = [
    {
      icon: Code2,
      title: 'Engenharia, não entrega',
      description: 'Não entregamos features. Entregamos sistemas. A diferença está na responsabilidade que assumimos pelo que escrevemos.',
    },
    {
      icon: Users,
      title: 'Time enxuto por princípio',
      description: 'Somos 4–6 engenheiros sêniores. Sem júniors em projetos críticos, sem terceirização, sem body shop. Você fala com quem escreve o código.',
    },
    {
      icon: Clock,
      title: 'Ownership de longo prazo',
      description: 'Não entregamos projetos e sumimos. Assumimos a operação, respondemos a incidentes e evoluímos o sistema junto com o negócio.',
    },
    {
      icon: HeartHandshake,
      title: 'Transparência sobre tudo',
      description: 'Se um prazo é impossível, dizemos. Se uma tecnologia é arriscada, alertamos. Nunca inventamos milagre para fechar contrato.',
    },
  ];

  return (
    <section id="about" className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-20 md:mb-32">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quantum mb-6 sm:mb-8">
              Sobre a Neutrino
            </p>
            <h2 className="font-fraunces text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] sm:leading-[1.2] tracking-tight mb-6 sm:mb-8">
              Nascemos para resolver o que outros evitam.
            </h2>
            <div className="w-12 h-[2px] bg-quantum mb-8 sm:mb-10" />
          </div>

          <div className="space-y-6 pt-0 lg:pt-20">
            <p className="text-lg sm:text-xl text-muted-foreground leading-[1.7]">
              A Neutrino foi fundada por engenheiros que passaram anos em sistemas onde instabilidade
              significa perda de receita, falhas de segurança têm impacto regulatório e downtime
              paralisa operações inteiras.
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground leading-[1.7]">
              Cansamos de ver empresas contratando agências ou fábricas de software que entregam
              projetos e desaparecem. Decidimos fazer diferente: assumir ownership real, de longo prazo,
              de sistemas que não podem falhar.
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground leading-[1.7]">
              Não somos grandes. Nunca quisemos ser. Somos o time que você liga às 3h da manhã
              quando o sistema cai — e a pessoa que atende é a mesma que escreveu o código.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {values.map((value, index) => (
            <div key={value.title} className="group bg-card p-8 border border-border hover:border-quantum/40 transition-all duration-300">
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 flex items-center justify-center bg-secondary border border-border group-hover:border-quantum/50 group-hover:bg-quantum/10 transition-colors duration-300">
                    <value.icon className="w-6 h-6 text-muted-foreground group-hover:text-quantum transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground/40">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div className="mt-16 sm:mt-20 md:mt-24 border-t border-border pt-12 sm:pt-16">
          <div className="max-w-3xl">
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-[1.4] mb-4">
              Trabalhamos com no máximo{' '}
              <span className="text-quantum">2–3 clientes simultâneos.</span>
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-[1.7]">
              Essa é a nossa escolha deliberada. Foco, profundidade e disponibilidade real não
              cabem em um modelo de escala. Se não tivermos capacidade no momento, indicamos
              outros profissionais — nunca aceitamos o que não conseguimos executar com excelência.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
