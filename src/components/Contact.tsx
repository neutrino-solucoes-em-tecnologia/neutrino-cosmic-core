import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    impact: '',
    problem: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Recebemos. Responderemos em até 48h úteis.');
    setFormData({ name: '', company: '', email: '', impact: '', problem: '' });
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 md:px-12 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left — framing */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quantum mb-8">
              Avaliação de Fit
            </p>
            <h2 className="font-fraunces text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.15] mb-8">
              Descreva o problema.<br />
              Nós avaliamos se podemos ajudar.
            </h2>
            <p className="text-lg text-muted-foreground mb-12 leading-[1.7]">
              Não aceitamos todos os projetos. Avaliamos o problema, o contexto
              e se há fit real com o que fazemos antes de qualquer proposta.
            </p>

            <div className="space-y-6">
              {[
                'Capacidade limitada a 3 projetos simultâneos.',
                'Se não formos o fit certo, indicamos quem é — sem rodeios.',
                'Não existe proposta padrão. Cada engajamento é desenhado para o problema específico.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <div className="w-[2px] h-4 bg-quantum flex-shrink-0 mt-1" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-10 border-t border-border">
              <p className="text-xs text-muted-foreground/40 uppercase tracking-wider mb-3">Contato direto</p>
              <a
                href="mailto:neutrino@neutrino.dev.br"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                neutrino@neutrino.dev.br
              </a>
            </div>
          </div>

          {/* Right — intake form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                    Nome *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12 bg-background border-border text-foreground text-sm rounded-none focus:border-quantum focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                    Empresa *
                  </label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    className="h-12 bg-background border-border text-foreground text-sm rounded-none focus:border-quantum focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                  Email Corporativo *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12 bg-background border-border text-foreground text-sm rounded-none focus:border-quantum focus:ring-0"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                  Impacto do Problema *
                </label>
                <select
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  required
                  className="w-full h-12 bg-background border border-border text-foreground text-sm px-3 focus:outline-none focus:border-quantum rounded-none appearance-none"
                >
                  <option value="">Selecione o tipo de impacto...</option>
                  <option value="operational">Operacional — downtime, instabilidade, suporte excessivo</option>
                  <option value="financial">Financeiro — perdas mensais mensuráveis</option>
                  <option value="regulatory">Regulatório / Jurídico — compliance, auditoria, LGPD, PCI</option>
                  <option value="strategic">Estratégico — inviabiliza crescimento ou captação</option>
                  <option value="security">Segurança — vulnerabilidades, exposição de dados, incidente</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                  Descreva o Problema *
                </label>
                <Textarea
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  required
                  rows={5}
                  className="bg-background border-border text-foreground resize-none text-sm rounded-none focus:border-quantum focus:ring-0"
                  placeholder="O que está acontecendo, há quanto tempo, o que já foi tentado, qual o impacto direto no negócio."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 bg-quantum hover:bg-quantum/90 text-quantum-foreground font-semibold text-sm rounded-none transition-all tracking-wide"
              >
                Enviar para Avaliação
              </Button>

              <p className="text-xs text-muted-foreground/40 text-center leading-relaxed">
                Respondemos em até 48h úteis. Sem pitch automático, sem proposta genérica.
              </p>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
