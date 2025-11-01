import { motion } from 'framer-motion';
import { Atom, Cpu, Globe, Zap } from 'lucide-react';

export const Architecture = () => {
  const layers = [
    {
      title: 'Corporação Holding',
      subtitle: 'Neutrino',
      description: 'Gestão estratégica de portfólio com foco em crescimento exponencial e criação de valor',
      icon: Atom,
      color: 'text-primary-glow',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Empresas do Portfólio',
      subtitle: '15+ Empresas Controladas',
      description: 'Participações majoritárias em empresas líderes com potencial de crescimento disruptivo',
      icon: Cpu,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Impacto de Mercado',
      subtitle: 'Operações Globais',
      description: 'Presença estratégica em mercados de alto crescimento com foco em escalabilidade',
      icon: Globe,
      color: 'text-quantum-glow',
      bgColor: 'bg-quantum/10',
    },
  ];

  const sectors = [
    { name: 'Tecnologia Financeira', icon: Zap },
    { name: 'Inteligência Artificial', icon: Cpu },
    { name: 'Mobilidade Sustentável', icon: Globe },
    { name: 'Comércio Digital', icon: Atom },
    { name: 'Infraestrutura Inteligente', icon: Zap },
    { name: 'Saúde & Biotecnologia', icon: Cpu },
    { name: 'Energia Limpa', icon: Globe },
    { name: 'Tecnologia Espacial', icon: Atom },
  ];

  return (
    <section id="architecture" className="relative py-32 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
            Portfólio Estratégico Global
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto font-inter mb-8">
            Estrutura corporativa diversificada com participações estratégicas em empresas líderes 
            de mercado, gerando valor sustentável através de sinergias operacionais e tecnológicas
          </p>
          
          {/* Portfolio metrics */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-inter">
            <div className="bg-card border border-border rounded-lg px-4 py-2">
              <span className="text-primary font-semibold">R$ 2.5B</span>
              <span className="text-muted-foreground ml-2">Valor Total do Portfólio</span>
            </div>
            <div className="bg-card border border-border rounded-lg px-4 py-2">
              <span className="text-primary font-semibold">15+</span>
              <span className="text-muted-foreground ml-2">Empresas Controladas</span>
            </div>
            <div className="bg-card border border-border rounded-lg px-4 py-2">
              <span className="text-primary font-semibold">8</span>
              <span className="text-muted-foreground ml-2">Países de Atuação</span>
            </div>
          </div>
        </motion.div>

        {/* Hierarchical Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Connection Line */}
              {index < layers.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-secondary via-quantum to-transparent z-0" />
              )}

              <div className={`relative ${layer.bgColor} border border-border rounded-2xl p-8 h-full transition-all duration-300 hover:border-primary/50 shadow-card hover:shadow-glow`}>
                <div className={`inline-block p-4 rounded-xl bg-background/50 mb-6 ${layer.color}`}>
                  <layer.icon className="w-10 h-10" />
                </div>

                <h3 className="text-2xl font-orbitron font-bold mb-2">
                  {layer.title}
                </h3>

                <p className="text-lg text-secondary mb-4 font-orbitron font-semibold">
                  {layer.subtitle}
                </p>

                <p className="text-muted-foreground font-inter leading-relaxed">
                  {layer.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sectors Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-card"
        >
          <h3 className="text-3xl font-orbitron font-bold mb-8 text-center">
            Liderança em Mercados Verticais
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sectors.map((sector, index) => (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-background/50 border border-border rounded-xl p-4 hover:border-secondary/50 transition-all duration-300 group"
              >
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary/20 transition-colors">
                  <sector.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-inter font-medium">
                  {sector.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-quantum/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      </div>
    </section>
  );
};
