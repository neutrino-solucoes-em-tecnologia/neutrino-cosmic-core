import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full py-16 sm:py-20 md:py-32">
        <div className="w-full">
          {/* Eyebrow */}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-8">
            Engenharia de Software de Alta Complexidade
          </p>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] sm:leading-[1.2] mb-6 sm:mb-8 tracking-tight max-w-5xl">
            Sistemas mission-critical precisam de engenharia mission-critical.
            <br className="hidden sm:block" />
            Sabemos fazer isso.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mb-8 sm:mb-10 md:mb-12 leading-[1.6] sm:leading-[1.7]">
            Arquitetura, segurança e escalabilidade para sistemas onde downtime custa dinheiro real. 
            Trabalhamos com empresas que precisam de parceiros técnicos, não fornecedores.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-16 sm:mb-20 md:mb-24">
            <Button 
              size="lg" 
              onClick={scrollToContact}
              className="text-sm px-8 h-12 bg-foreground hover:bg-foreground/90 text-background rounded font-semibold group transition-all"
            >
              Vamos conversar sobre seu desafio
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm px-6 sm:px-8 h-11 sm:h-12 border border-gray-300 hover:border-gray-900 hover:bg-gray-50 rounded font-semibold transition-all"
            >
              Ver Projetos Reais
            </Button>
          </div>

          {/* Stats - Technical Focus */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 sm:gap-x-12 gap-y-10 sm:gap-y-0 pt-12 sm:pt-16 md:pt-20 mt-4 border-t border-gray-200 max-w-5xl">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight">15</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-400">+</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground uppercase tracking-wide">Anos de Experiência</div>
                <div className="text-sm text-gray-500 leading-relaxed">
                  Sistemas de alta criticidade e larga escala
                </div>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight">99.9</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-400">%+</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground uppercase tracking-wide">Uptime Médio</div>
                <div className="text-sm text-gray-500 leading-relaxed">
                  {'< 4h'} downtime/ano em sistemas críticos
                </div>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight">24</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-400">/7</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground uppercase tracking-wide">Suporte Técnico</div>
                <div className="text-sm text-gray-500 leading-relaxed">
                  Monitoramento contínuo e resposta imediata
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
