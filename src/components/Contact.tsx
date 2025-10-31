import { motion } from 'framer-motion';
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
    toast.success('Mensagem enviada! Entraremos em contato em breve.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'contato@neutrino.tech',
      href: 'mailto:contato@neutrino.tech',
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: '+55 (11) 9999-9999',
      href: 'tel:+5511999999999',
    },
    {
      icon: MapPin,
      label: 'Localização',
      value: 'São Paulo, Brasil',
      href: '#',
    },
  ];

  return (
    <section className="relative py-32 px-4 md:px-8 overflow-hidden">
      {/* Pulsing Background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
            Conecte-se ao Núcleo
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Pronto para fazer parte do universo Neutrino? Entre em contato e descubra 
            como podemos transformar suas ideias em realidade tecnológica
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-8 shadow-card"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-inter font-medium mb-2">
                  Nome Completo
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                  required
                  className="bg-background border-border focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-inter font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                  className="bg-background border-border focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-inter font-medium mb-2">
                  Empresa (opcional)
                </label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Sua empresa"
                  className="bg-background border-border focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-inter font-medium mb-2">
                  Mensagem
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Como podemos ajudar?"
                  required
                  rows={5}
                  className="bg-background border-border focus:border-primary transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-orbitron font-semibold rounded-xl transition-all duration-300 cosmic-glow"
              >
                Enviar Mensagem
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-gradient-cosmic border border-border rounded-2xl p-8 shadow-card">
              <h3 className="text-2xl font-orbitron font-bold mb-6">
                Informações de Contato
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-start gap-4 group"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 text-primary-glow transition-transform duration-300 group-hover:scale-110">
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-inter mb-1">
                        {info.label}
                      </p>
                      <p className="text-foreground font-inter font-medium group-hover:text-primary-glow transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
              <h3 className="text-2xl font-orbitron font-bold mb-4">
                Horário de Atendimento
              </h3>
              <p className="text-muted-foreground font-inter mb-4">
                Segunda a Sexta: 9h - 18h<br />
                Sábado: 9h - 13h<br />
                Domingo: Fechado
              </p>
              <p className="text-sm text-muted-foreground font-inter">
                Respostas em até 24 horas úteis
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
