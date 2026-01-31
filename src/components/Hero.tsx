import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full py-24 md:py-32">
        <div className="w-full">
          {/* Eyebrow */}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-8">
            Engenharia de Software de Alta Complexidade
          </p>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.2] mb-8 tracking-tight max-w-5xl">
            Tecnologia não é sobre ferramentas.
            <br className="hidden md:block" />
            É sobre resolver problemas que não podem falhar.
          </h1>

          {/* Supporting Text */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-12 leading-[1.7]">
            Arquitetura de software, segurança e escalabilidade para sistemas mission-critical. 
            Quando a falha não é uma opção.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mb-24">
            <Button 
              size="lg" 
              onClick={scrollToContact}
              className="text-sm px-8 h-12 bg-foreground hover:bg-foreground/90 text-background rounded font-semibold group transition-all"
            >
              Vamos resolver o problema certo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('problems')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm px-8 h-12 border border-gray-300 hover:border-gray-900 hover:bg-gray-50 rounded font-semibold transition-all"
            >
              Conheça Nosso Trabalho
            </Button>
          </div>

          {/* Stats - Technical Focus */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12 pt-20 mt-4 border-t border-gray-200 max-w-5xl">
            <div className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">15</span>
                <span className="text-2xl md:text-3xl font-bold text-gray-400">+</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground uppercase tracking-wide">Anos de Experiência</div>
                <div className="text-sm text-gray-500 leading-relaxed">
                  Sistemas de alta criticidade e larga escala
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">100</span>
                <span className="text-2xl md:text-3xl font-bold text-gray-400">%</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground uppercase tracking-wide">Uptime em Produção</div>
                <div className="text-sm text-gray-500 leading-relaxed">
                  Disponibilidade garantida sem downtime
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">24</span>
                <span className="text-2xl md:text-3xl font-bold text-gray-400">/7</span>
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
