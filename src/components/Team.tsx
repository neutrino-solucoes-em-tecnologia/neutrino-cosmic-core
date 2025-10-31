import { motion } from 'framer-motion';
import { Users, Lightbulb, Rocket, Heart } from 'lucide-react';

export const Team = () => {
  const values = [
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Nenhum sistema é completo sem quem o move',
    },
    {
      icon: Lightbulb,
      title: 'Inovação',
      description: 'Pensamento criativo aplicado a problemas reais',
    },
    {
      icon: Rocket,
      title: 'Excelência',
      description: 'Busca constante pela perfeição técnica',
    },
    {
      icon: Heart,
      title: 'Propósito',
      description: 'Cada linha de código com significado e impacto',
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
            Equipe e Energia Humana
          </h2>
          <p className="text-2xl md:text-3xl text-secondary font-orbitron font-semibold mb-8">
            "Nenhum sistema é completo sem quem o move"
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Somos um time de visionários, engenheiros e criadores apaixonados 
            por transformar ideias complexas em realidade tangível
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative bg-card border border-border rounded-2xl p-8 h-full transition-all duration-300 hover:border-primary/50 shadow-card hover:shadow-glow">
                <div className="absolute inset-0 bg-gradient-orbital rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center p-6 rounded-full bg-primary/10 text-primary-glow mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <value.icon className="w-10 h-10" />
                  </div>
                  
                  <h3 className="text-xl font-orbitron font-bold mb-3">
                    {value.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground font-inter leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-cosmic border border-border rounded-2xl p-12 text-center shadow-card relative overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2.5,
              }}
              className="absolute bottom-0 right-0 w-64 h-64 bg-quantum/20 rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">
              Filosofia de Trabalho
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto font-inter leading-relaxed mb-8">
              Acreditamos que a tecnologia mais poderosa é aquela que funciona perfeitamente 
              sem chamar atenção para si mesma. Como partículas subatômicas, trabalhamos nos 
              bastidores para criar experiências fluidas e impactantes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-6 py-3 bg-primary/20 border border-primary/30 rounded-xl text-primary-glow font-orbitron font-semibold">
                Precisão
              </span>
              <span className="px-6 py-3 bg-secondary/20 border border-secondary/30 rounded-xl text-secondary font-orbitron font-semibold">
                Eficiência
              </span>
              <span className="px-6 py-3 bg-quantum/20 border border-quantum/30 rounded-xl text-quantum-glow font-orbitron font-semibold">
                Consistência
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
