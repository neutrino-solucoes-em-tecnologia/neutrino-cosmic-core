export const WhyNeutrino = () => {
  const differentiators = [
    {
      title: 'Liderança técnica profunda',
      description:
        'Não apenas codificamos. Fazemos code review de arquiteturas inteiras, identificamos gargalos invisíveis, projetamos sistemas que escalam sem surpresas.',
    },
    {
      title: 'Experiência em cenários críticos',
      description:
        'Já enfrentamos Black Friday com 50x de tráfego normal, sistemas bancários 24/7, integrações Pix em produção. Sabemos o que quebra sob pressão.',
    },
    {
      title: 'Sustentabilidade técnica',
      description:
        'Não entregamos projeto e sumimos. Assumimos a operação de longo prazo. Se algo quebrar em produção, somos nós que acordamos às 3h da manhã.',
    },
    {
      title: 'Transparência brutal',
      description:
        'Se um prazo é impossível, dizemos. Se uma tecnologia é arriscada, alertamos. Se um problema não tem solução simples, não inventamos milagre.',
    },
  ];

  return (
    <section id="why" className="relative py-32 px-6 md:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-8">
            Por Que a Neutrino
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.2] mb-8 tracking-tight">
            Porque o problema não é falta de código. É falta de quem entenda o problema.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {differentiators.map((item, index) => (
            <div 
              key={index} 
              className="group bg-white p-8 border border-gray-200 hover:border-gray-900 transition-all duration-300 hover:shadow-lg"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 group-hover:bg-gray-900 transition-colors duration-300">
                    <span className="text-xl font-bold text-foreground group-hover:text-white transition-colors duration-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-300">{String(index + 1).padStart(2, '0')}</span>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-16 border-t border-gray-200">
          <div className="max-w-4xl space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-6 leading-tight">
              Não somos agência, não somos fábrica de software
            </h3>
            <p className="text-base text-gray-600 leading-relaxed">
              Somos engenheiros sêniores que assumem responsabilidade técnica de longo prazo. 
              Não entregamos "projetos concluídos" e desaparecemos. Entregamos sistemas em 
              produção e ficamos do lado de dentro.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              Se o sistema cair, somos nós que recebemos o alerta. Se precisa escalar, 
              somos nós que calculamos a infraestrutura. Se a arquitetura precisa evoluir, 
              somos nós que fazemos o refactor sem downtime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
