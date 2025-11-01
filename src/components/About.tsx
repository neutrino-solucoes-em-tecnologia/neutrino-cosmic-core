import { motion } from 'framer-motion';
import { Target, Eye, Shield } from 'lucide-react';

export const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Missão',
      description: 'Acelerar a transformação tecnológica global através de investimentos estratégicos e gestão de portfólio de alto impacto',
      color: 'text-secondary',
    },
    {
      icon: Eye,
      title: 'Visão',
      description: 'Ser reconhecida como a holding tecnológica mais influente do mundo, moldando o futuro através da inovação disruptiva',
      color: 'text-primary-glow',
    },
    {
      icon: Shield,
      title: 'Valores',
      description: 'Excelência operacional. Inovação disruptiva. Impacto global sustentável. Crescimento exponencial',
      color: 'text-quantum-glow',
    },
  ];

  return (
    <section className="relative py-32 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
            Liderança Global em Tecnologia
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto font-inter mb-8">
            Holding tecnológica com portfólio diversificado de R$ 2.5 bilhões, operando através 
            de 15+ empresas especializadas que transformam indústrias e impactam milhões de vidas globalmente.
          </p>
          
          {/* Achievement highlights */}
          <div className="flex flex-wrap justify-center gap-8 text-sm font-inter text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Forbes Global 2000</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Unicorn Portfolio Leader</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>B3 Listed Companies</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-card border border-border rounded-2xl p-8 h-full transition-all duration-300 hover:border-primary/50 shadow-card hover:shadow-glow">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-orbital rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className={`inline-block p-4 rounded-xl bg-background/50 mb-6 ${value.color}`}>
                    <value.icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-orbitron font-bold mb-4">
                    {value.title}
                  </h3>
                  
                  <p className="text-muted-foreground font-inter leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>



        {/* Energy Flow Animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none -z-10">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="w-full h-full border border-primary/10 rounded-full"
          />
        </div>
      </div>
    </section>
  );
};
