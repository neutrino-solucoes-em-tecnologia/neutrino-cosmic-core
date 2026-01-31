import { Users, Award, Clock, HeartHandshake } from 'lucide-react';

export const Team = () => {
  const stats = [
    {
      icon: Users,
      value: '4-6',
      label: 'Engenheiros Sêniores',
      description: 'Time enxuto, high-output. Sem júniors em projetos críticos.',
    },
    {
      icon: Award,
      value: '12+',
      label: 'Anos de Experiência (média)',
      description: 'Profissionais que já passaram por Black Friday, migração de legado, incident response.',
    },
    {
      icon: Clock,
      value: '< 2h',
      label: 'SLA de Resposta',
      description: 'Em produção: resposta em até 2h. Incidentes críticos: on-call 24/7.',
    },
    {
      icon: HeartHandshake,
      value: '3-5 anos',
      label: 'Relação Média com Clientes',
      description: 'Relacionamentos individuais da equipe. Não somos projeto, somos parceria.',
    },
  ];

  return (
    <section id="team" className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-12 sm:mb-16 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-400 mb-6 sm:mb-8">
            Quem Somos
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] sm:leading-[1.2] mb-6 sm:mb-8 tracking-tight">
            Time pequeno. Impacto grande.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-[1.6] sm:leading-[1.7]">
            Somos um time enxuto de engenheiros sêniores. Não terceirizamos, não sub-contratamos júniors, 
            não fazemos body shop. Você fala direto com quem escreve o código.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group bg-gray-50 p-6 border border-gray-200 hover:border-gray-900 transition-all duration-300 hover:shadow-lg"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 group-hover:bg-gray-900 transition-colors duration-300">
                  <stat.icon className="w-6 h-6 text-foreground group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
                    {stat.label}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 md:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              Nossa Abordagem
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                  O que NÃO somos
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">×</span>
                    <span>Agência com múltiplos clientes simultâneos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">×</span>
                    <span>Fábrica de software com time offshore</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">×</span>
                    <span>Consultoria que entrega apresentação e vai embora</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">×</span>
                    <span>Body shop que aloca júniors em problemas críticos</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                  O que somos
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-foreground">✓</span>
                    <span>Parceiro técnico de longo prazo (3-5 anos típico)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground">✓</span>
                    <span>Time dedicado que assume ownership do código</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground">✓</span>
                    <span>Engenheiros que acordam às 3h se sistema cair</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground">✓</span>
                    <span>Transparência brutal: se não sabemos, dizemos</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 leading-relaxed">
                Trabalhamos com <strong>2-3 clientes por vez</strong>, no máximo. Isso garante foco, disponibilidade 
                e profundidade técnica. Se não tivermos capacidade, indicamos outros profissionais ao invés de 
                aceitar projeto que não conseguimos executar com excelência.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
