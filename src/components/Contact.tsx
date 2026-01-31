import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mensagem enviada! Responderemos em breve.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <section id="contact" className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20">
          {/* Left Column - Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-400 mb-6 sm:mb-8">
              Contato
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] sm:leading-[1.2] mb-6 sm:mb-8 tracking-tight">
              Explique o problema. A tecnologia vem depois.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 md:mb-12 leading-[1.6] sm:leading-[1.7]">
              Não vendemos soluções prontas. Ouvimos o problema, analisamos o contexto, 
              e propomos arquitetura sob medida. Podemos conectar você com CTOs que já trabalharam conosco.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-foreground mt-1" strokeWidth={1.5} />
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">Email</div>
                  <a href="mailto:neutrino@neutrino.dev.br" className="text-sm text-gray-600 hover:text-foreground transition-colors">
                    neutrino@neutrino.dev.br
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-foreground mt-1" strokeWidth={1.5} />
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">Telefone</div>
                  <a href="tel:+5541999214248" className="text-sm text-gray-600 hover:text-foreground transition-colors">
                    +55 (41) 99921-4248
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-foreground mt-1" strokeWidth={1.5} />
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">Localização</div>
                  <p className="text-sm text-gray-600">
                    Curitiba, Paraná<br />
                    Brasil
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-gray-50 p-10 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                  Nome Completo *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11 bg-white border-gray-300 text-foreground text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                  Email Corporativo *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11 bg-white border-gray-300 text-foreground text-sm"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                  Empresa *
                </label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="h-11 bg-white border-gray-300 text-foreground text-sm"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                  Descreva o problema técnico *
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="bg-white border-gray-300 text-foreground resize-none text-sm"
                  placeholder="Ex: Sistema instável sob carga, arquitetura legada difícil de escalar, integrações frágeis..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background font-semibold text-sm"
              >
                Enviar Mensagem
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
