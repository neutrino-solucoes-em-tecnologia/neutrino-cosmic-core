import { motion } from 'framer-motion';
import { Code2, Database, Cloud, Brain, Workflow, Shield } from 'lucide-react';

export const Technology = () => {
  const technologies = [
    {
      icon: Code2,
      name: 'Laravel',
      description: 'Backend PHP robusto e elegante',
      color: 'text-red-400',
    },
    {
      icon: Code2,
      name: 'NestJS',
      description: 'Framework Node.js escalável',
      color: 'text-rose-400',
    },
    {
      icon: Code2,
      name: 'Next.js',
      description: 'React framework de produção',
      color: 'text-foreground',
    },
    {
      icon: Workflow,
      name: 'Apache Kafka',
      description: 'Streaming de eventos em tempo real',
      color: 'text-foreground',
    },
    {
      icon: Cloud,
      name: 'Oracle Cloud',
      description: 'Infraestrutura enterprise',
      color: 'text-red-500',
    },
    {
      icon: Brain,
      name: 'Inteligência Artificial',
      description: 'Machine Learning e análise preditiva',
      color: 'text-quantum-glow',
    },
    {
      icon: Database,
      name: 'PostgreSQL',
      description: 'Banco de dados relacional avançado',
      color: 'text-blue-400',
    },
    {
      icon: Shield,
      name: 'Kubernetes',
      description: 'Orquestração de containers',
      color: 'text-primary-glow',
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
            Tecnologia e Energia
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-inter mb-4">
            Ciência, código e propósito em movimento
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-card border border-border rounded-2xl p-6 h-full transition-all duration-300 hover:border-primary/50 shadow-card hover:shadow-glow overflow-hidden">
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-quantum/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center p-4 rounded-xl bg-background/50 mb-4 ${tech.color} transition-transform duration-300 group-hover:scale-110`}>
                    <tech.icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-orbitron font-bold mb-2">
                    {tech.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground font-inter leading-relaxed">
                    {tech.description}
                  </p>
                </div>

                {/* Particle Effect */}
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-radial from-primary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-cosmic border border-border rounded-2xl p-12 text-center shadow-card"
        >
          <h3 className="text-3xl font-orbitron font-bold mb-4">
            Stack Completo
          </h3>
          <p className="text-lg text-muted-foreground font-inter mb-8 max-w-2xl mx-auto">
            Combinamos tecnologias de ponta para criar soluções robustas, 
            escaláveis e prontas para o futuro
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {['React', 'TypeScript', 'Docker', 'Redis', 'GraphQL', 'Terraform', 'GitHub Actions'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-background/50 border border-border rounded-lg text-sm font-inter font-medium hover:border-secondary/50 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none -z-10">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-full h-full border border-primary/5 rounded-full"
        />
      </div>
    </section>
  );
};
