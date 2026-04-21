export const Problems = () => {
  const signals = [
    'O sistema para exatamente quando o negócio mais precisa que ele funcione.',
    'Cada mudança no código quebra algo que estava funcionando. Evoluir virou risco.',
    'Há uma integração crítica que ninguém consegue explicar completamente — e que falha.',
    'A arquitetura funcionou em tração. Não funciona em escala.',
    'Uma auditoria, um incidente ou uma regulação expôs o que o time interno não viu.',
    'O problema já saiu do radar técnico e chegou para o CEO ou para o conselho.',
  ];

  return (
    <section id="problems" className="relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left */}
          <div className="lg:sticky lg:top-32">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quantum mb-8">
              O Tipo de Problema que Resolvemos
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.15] mb-8">
              Se chegou até aqui, provavelmente já tentou de tudo.
            </h2>
            <div className="w-10 h-[2px] bg-quantum mb-8" />
            <p className="text-lg text-muted-foreground leading-[1.7]">
              Não resolvemos problemas simples. Resolvemos os que já resistiram
              a outras tentativas — onde o custo da inação é maior do que o custo
              de engenharia séria.
            </p>
          </div>

          {/* Right — signal list */}
          <div className="space-y-0">
            {signals.map((signal, index) => (
              <div
                key={index}
                className="group flex items-start gap-6 py-7 border-b border-border last:border-b-0 hover:border-quantum/30 transition-colors duration-300"
              >
                <span className="text-xs font-bold text-muted-foreground/30 mt-1 tabular-nums flex-shrink-0 group-hover:text-quantum transition-colors duration-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-base sm:text-lg text-muted-foreground group-hover:text-foreground leading-relaxed transition-colors duration-300">
                  {signal}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Closing statement */}
        <div className="mt-20 sm:mt-28 border-t border-border pt-14">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground max-w-3xl leading-[1.3]">
            "Se o problema já saiu do nível técnico e chegou para liderança,
            é exatamente o tipo de engajamento que fazemos."
          </p>
        </div>
      </div>
    </section>
  );
};
