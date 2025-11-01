import { motion } from 'framer-motion';
import { ExternalLink, Award, TrendingUp, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Founder = () => {
  const achievements = [
    {
      icon: TrendingUp,
      title: 'Visão Estratégica',
      description: 'Pioneirismo em estratégias de investimento tecnológico que geram retornos exponenciais',
      color: 'text-primary',
    },
    {
      icon: Users,
      title: 'Excelência em Liderança',
      description: 'Construção e escalabilidade de equipes de alta performance em múltiplas indústrias',
      color: 'text-secondary',
    },
    {
      icon: Globe,
      title: 'Impacto Global',
      description: 'Criação de soluções tecnológicas sustentáveis que transformam mercados inteiros',
      color: 'text-quantum-glow',
    },
    {
      icon: Award,
      title: 'Pioneiro em Inovação',
      description: 'Reconhecido líder de pensamento em tecnologias emergentes e modelos de negócio disruptivos',
      color: 'text-primary-glow',
    },
  ];

  const milestones = [
    {
      year: '2018',
      title: 'Empreendedor Tecnológico',
      description: 'Fundou primeira venture tecnológica focada em transformação digital'
    },
    {
      year: '2020',
      title: 'Estratégia de Investimentos',
      description: 'Desenvolveu framework proprietário de investimentos para empresas de tecnologia'
    },
    {
      year: '2022',
      title: 'Expansão do Portfólio',
      description: 'Escalou portfólio para 10+ empresas em múltiplos verticais de mercado'
    },
    {
      year: '2024',
      title: 'Neutrino Holdings',
      description: 'Estabeleceu a Neutrino como holding tecnológica de R$ 2,5 bilhões'
    },
  ];

  return (
    <section id="founder" className="relative py-32 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
            Liderança Visionária
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Conheça a mente estratégica por trás da revolução tecnológica global da Neutrino
          </p>
        </motion.div>

        {/* Founder Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-6">
                {/* Leonardo's Photo */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
                  <img 
                    src="/1722811769271.jpeg" 
                    alt="Leonardo Lima - Founder & Chairman" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-3xl font-orbitron font-bold mb-2">
                    Leonardo Lima
                  </h3>
                  <p className="text-xl text-primary font-inter mb-2">
                    Fundador & Chairman
                  </p>
                  <p className="text-muted-foreground font-inter mb-4">
                    Pioneiro em Investimentos Tecnológicos
                  </p>
                  
                  <Button
                    className="bg-[#0077B5] hover:bg-[#005885] text-white font-inter font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2"
                    onClick={() => window.open('https://www.linkedin.com/in/leonardo-lima-88a78b1b5/', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Perfil LinkedIn
                  </Button>
                </div>
              </div>
            </div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-8 shadow-card"
            >
              <h4 className="text-2xl font-orbitron font-bold mb-4">Sobre Leonardo</h4>
              <p className="text-muted-foreground font-inter leading-relaxed mb-4">
                Leonardo Lima é um empreendedor visionário e estrategista de investimentos tecnológicos que 
                construiu a Neutrino Holdings como uma potência tecnológica global de R$ 2,5 bilhões. Com 
                profunda expertise em identificar e escalar tecnologias disruptivas, Leonardo guiou com 
                sucesso mais de 15 empresas desde ventures iniciais até posições de liderança de mercado.
              </p>
              <p className="text-muted-foreground font-inter leading-relaxed">
                Sua abordagem estratégica combina insights de tecnologia de ponta com execução empresarial 
                comprovada, criando vantagens competitivas sustentáveis que impulsionam crescimento exponencial 
                em diversos verticais da indústria.
              </p>
            </motion.div>
          </motion.div>

          {/* Achievements Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-card border border-border rounded-2xl p-6 h-full transition-all duration-300 hover:border-primary/50 shadow-card hover:shadow-glow">
                  <div className="absolute inset-0 bg-gradient-orbital rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className={`inline-block p-3 rounded-xl bg-background/50 mb-4 ${achievement.color}`}>
                      <achievement.icon className="w-6 h-6" />
                    </div>
                    
                    <h5 className="text-lg font-orbitron font-bold mb-3">
                      {achievement.title}
                    </h5>
                    
                    <p className="text-sm text-muted-foreground font-inter leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-card"
        >
          <h3 className="text-3xl font-orbitron font-bold mb-12 text-center">
            Jornada para a Liderança em Inovação
          </h3>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-secondary to-quantum-glow"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-8"
                >
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary border-4 border-background shadow-lg"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="bg-background/50 border border-border rounded-xl p-6 hover:border-secondary/50 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-2xl font-orbitron font-bold text-primary">
                          {milestone.year}
                        </span>
                        <h4 className="text-xl font-orbitron font-semibold">
                          {milestone.title}
                        </h4>
                      </div>
                      <p className="text-muted-foreground font-inter leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground font-inter mb-8">
            Conecte-se com Leonardo e explore oportunidades de investimento
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-glow text-primary-foreground font-orbitron font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contate Leonardo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-orbitron font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300"
              onClick={() => window.open('https://www.linkedin.com/in/leonardo-lima-88a78b1b5/', '_blank')}
            >
              Seguir no LinkedIn
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none -z-10">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
          className="w-full h-full border border-primary/5 rounded-full"
        />
      </div>
    </section>
  );
};