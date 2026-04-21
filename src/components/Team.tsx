export const Team = () => {
  const principles = [
    {
      label: 'Ownership real',
      text: 'Não entregamos código e desaparecemos. Quando o sistema vai para produção, continuamos responsáveis por ele. Nosso nome está no que funciona — e no que falha.',
    },
    {
      label: 'Time que responde',
      text: 'Você fala com o engenheiro que escreveu o código, não com um gerente de conta. Em incidentes críticos, a resposta não passa por camadas.',
    },
    {
      label: 'Seleção de clientes',
      text: 'Trabalhamos com no máximo 3 empresas ao mesmo tempo. Isso não é marketing — é a única forma de manter o nível de atenção que projetos complexos exigem.',
    },
    {
      label: 'Sem júniors em produção',
      text: 'Somos um time enxuto de engenheiros sêniores. Projetos críticos não são oportunidade de aprendizado para ninguém do nosso lado.',
    },
  ];

  return (
    <section id="team" className="relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">

          {/* Left */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quantum mb-8">
              Como Trabalhamos
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.15] mb-8">
              Não somos fornecedores. Somos os engenheiros que assumem o problema como se fosse nosso.
            </h2>
            <div className="w-10 h-[2px] bg-quantum" />
          </div>

          {/* Right — principles */}
          <div className="space-y-0">
            {principles.map((item, index) => (
              <div key={index} className="py-8 border-b border-border last:border-b-0">
                <div className="flex items-start gap-6">
                  <span className="text-xs font-bold text-muted-foreground/30 mt-1 flex-shrink-0 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-2">
                      {item.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Ecosystem note — brief, confident */}
        <div className="mt-20 sm:mt-28 pt-14 border-t border-border">
          <div className="grid sm:grid-cols-2 gap-10 max-w-4xl">
            <div>
              <p className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                Além do serviço
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Além dos projetos de clientes, construímos nosso próprio portfólio de produtos —
                12 verticais de SaaS que usam a mesma infraestrutura que entregamos.
                Temos skin in the game no código que escrevemos.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                Localização
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Curitiba, Paraná · Brasil.<br />
                Atendemos remotamente em todo o país.<br />
                <span className="text-muted-foreground/50">neutrino@neutrino.dev.br</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
