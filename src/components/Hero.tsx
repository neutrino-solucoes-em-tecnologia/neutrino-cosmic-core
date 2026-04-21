import { ArrowRight } from 'lucide-react';

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center bg-background border-b border-border overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-quantum/4 rounded-full blur-[160px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full py-24 sm:py-32 md:py-40">
        <div className="max-w-4xl">

          {/* Eyebrow */}
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-quantum mb-10 sm:mb-12">
            Engenharia de Software · Sistemas Críticos
          </p>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-8 sm:mb-10">
            Quando a decisão arquitetural errada
            <br className="hidden sm:block" />
            <span className="text-quantum"> virou um problema de board.</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-12 sm:mb-16 leading-[1.7]">
            A Neutrino atua em sistemas onde falha técnica tem consequência direta
            em receita, compliance ou operação. Não trabalhamos com todos.
            Trabalhamos com os que entendem o que está em jogo.
          </p>

          {/* Single CTA — confidence, no hedging */}
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-3 px-8 h-14 bg-quantum hover:bg-quantum/90 text-quantum-foreground font-semibold text-sm tracking-wide transition-all duration-200 group"
          >
            Solicitar Avaliação de Fit
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Qualifier note */}
          <p className="mt-5 text-xs text-muted-foreground/50 tracking-wide">
            Capacidade limitada · No máximo 3 projetos simultâneos
          </p>

        </div>
      </div>

      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-quantum" />
    </section>
  );
};
