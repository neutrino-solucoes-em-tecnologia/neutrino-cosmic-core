import { Navigation } from '@/components/Navigation';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Atom, Zap, Globe, Cpu, Heart, TrendingUp, Users, Star } from 'lucide-react';

const Ecossistema = () => {
  const companies = [
    {
      name: 'Neutrino Soluções',
      subtitle: 'O Núcleo do Ecossistema',
      description: 'A força central que interliga todas as empresas do grupo. Responsável pela arquitetura tecnológica, segurança, automação e integração de sistemas.',
      icon: Atom,
      color: 'text-primary-glow',
    },
    {
      name: 'Boson Rewards',
      subtitle: 'Conectando Pessoas e Prosperidade',
      description: 'Plataforma de fidelização e recompensas que transforma consumo em oportunidades através de blockchain e economia circular.',
      icon: Star,
      color: 'text-secondary',
    },
    {
      name: 'Photon Media',
      subtitle: 'Iluminando Ideias',
      description: 'Rede global de mídia digital com milhares de sites em múltiplos idiomas, transformando informação em energia financeira.',
      icon: Zap,
      color: 'text-quantum-glow',
    },
    {
      name: 'Graviton Bank',
      subtitle: 'A Força do Seu Capital',
      description: 'Banco digital completo com infraestrutura BaaS, Pix, TED, KYC 2.0 e carteiras digitais de última geração.',
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      name: 'QuarkCode',
      subtitle: 'O Código que Estrutura o Universo',
      description: 'Coração técnico do desenvolvimento, criando softwares, APIs e sistemas de alto desempenho para todo o ecossistema.',
      icon: Cpu,
      color: 'text-secondary',
    },
    {
      name: 'Muon City',
      subtitle: 'Tecnologia que Transforma Cidades',
      description: 'Plataforma de gestão urbana que conecta cidadãos, governos e empresas para criar cidades mais inteligentes e sustentáveis.',
      icon: Globe,
      color: 'text-quantum-glow',
    },
    {
      name: 'GluonPet',
      subtitle: 'Conectando Vidas, Unindo Corações',
      description: 'Sistema digital completo para adoção, resgate e cuidado animal, criando ponte entre pessoas, ONGs e abrigos.',
      icon: Heart,
      color: 'text-primary-glow',
    },
    {
      name: 'Rifas.Club',
      subtitle: 'Entretenimento e Gamificação',
      description: 'Ecossistema de sorteios e experiências gamificadas conectando participantes e influenciadores em ambiente premium.',
      icon: Star,
      color: 'text-quantum-glow',
    },
    {
      name: 'Proton Motors',
      subtitle: 'Energia e Movimento',
      description: 'Inovação automotiva e eletrificação, focada em veículos elétricos e soluções de energia limpa para o futuro da mobilidade.',
      icon: Zap,
      color: 'text-primary',
    },
    {
      name: 'Quasar Home',
      subtitle: 'O Lar do Futuro',
      description: 'Automação residencial e design inteligente, transformando casas em ecossistemas conectados de luxo e eficiência.',
      icon: Users,
      color: 'text-secondary',
    },
    {
      name: 'Tachyon Aroma',
      subtitle: 'Energia, Movimento e Fragrância',
      description: 'Linha sensorial que combina aromaterapia e bioengenharia para criar experiências olfativas que estimulam produtividade.',
      icon: Heart,
      color: 'text-primary-glow',
    },
  ];

  const dnaPoints = [
    {
      title: 'Tecnologia de Ponta',
      description: 'Operamos com soluções avançadas em IA, automação, segurança e infraestrutura em nuvem que redefinem padrões de mercado.',
      icon: Cpu,
    },
    {
      title: 'Arquitetura Escalável',
      description: 'Mantemos integrações sólidas entre múltiplos segmentos — finanças, mídia, varejo, cidades inteligentes, pets e entretenimento.',
      icon: Globe,
    },
    {
      title: 'Sustentabilidade Financeira',
      description: 'Cada empresa do ecossistema opera de forma autossuficiente, lucrativa e interdependente, gerando valor consistente.',
      icon: TrendingUp,
    },
    {
      title: 'Impacto Social Real',
      description: 'Geramos oportunidades, promovemos inclusão digital e distribuímos riqueza de forma justa através da tecnologia.',
      icon: Users,
    },
  ];

  return (
    <div className="relative min-h-screen">
      <Navigation />
      <ParticleBackground />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 text-center max-w-6xl mx-auto px-4"
          >
            {/* Pulsing Glow Effect */}
            <div className="absolute inset-0 -z-10">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-96 h-96 mx-auto rounded-full bg-primary/30 blur-3xl"
              />
            </div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-7xl font-orbitron font-bold mb-6"
            >
              Ecossistema Neutrino
            </motion.h1>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl md:text-4xl font-orbitron font-semibold mb-8 text-secondary"
            >
              A Energia que Move o Futuro
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground mb-12 font-inter leading-relaxed"
            >
              Um organismo vivo de inovação. Um conjunto de empresas interligadas por tecnologia, 
              propósito e energia criativa — cada uma representando uma partícula essencial desse universo. 
              <span className="text-primary font-semibold">Somos invisíveis aos olhos, mas presentes em tudo</span>.
            </motion.p>

            {/* Orbital Rings */}
            <div className="absolute inset-0 -z-20 pointer-events-none">
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  animate={{
                    rotate: ring % 2 === 0 ? 360 : -360,
                  }}
                  transition={{
                    duration: 20 + ring * 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div
                    className={`border border-primary/10 rounded-full`}
                    style={{
                      width: `${300 + ring * 150}px`,
                      height: `${300 + ring * 150}px`,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Vision Section */}
        <section className="relative py-32 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-8">
                🌌 Nossa Visão
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto font-inter leading-relaxed">
                Construímos um <span className="text-primary font-semibold">ecossistema bilionário capaz de gerar impacto social positivo, 
                transformar economias e redefinir a experiência humana com a tecnologia</span>. 
                Cada empresa é uma partícula com propósito. Juntas, formam o campo energético que impulsiona o futuro.
              </p>
            </motion.div>
          </div>
        </section>

        {/* DNA Section */}
        <section className="relative py-32 px-4 md:px-8 bg-card/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-8">
                ⚙️ Nosso DNA
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dnaPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="p-4 rounded-xl bg-primary/10 text-primary-glow">
                      <point.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-orbitron font-bold mb-4">
                        {point.title}
                      </h3>
                      <p className="text-muted-foreground font-inter leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Companies Section */}
        <section className="relative py-32 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-8">
                🌐 As Empresas do Ecossistema
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Cada marca representa uma partícula vital operando dentro desse universo tecnológico bilionário
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company, index) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="bg-card border border-border rounded-2xl p-8 h-full transition-all duration-300 hover:border-primary/50 shadow-card hover:shadow-glow">
                    <div className="absolute inset-0 bg-gradient-orbital rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      <div className={`inline-block p-4 rounded-xl bg-background/50 mb-6 ${company.color}`}>
                        <company.icon className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-2xl font-orbitron font-bold mb-2">
                        {company.name}
                      </h3>
                      
                      <p className="text-lg font-inter font-semibold mb-4 text-secondary">
                        {company.subtitle}
                      </p>
                      
                      <p className="text-muted-foreground font-inter leading-relaxed">
                        {company.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="relative py-32 px-4 md:px-8 bg-gradient-to-b from-background to-card">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-8">
                🚀 O Futuro é Neutrino
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-5xl mx-auto font-inter leading-relaxed mb-12">
                O Ecossistema Neutrino opera com <span className="text-primary font-semibold">escala bilionária</span>, 
                unindo negócios digitais de alto desempenho com propósito humano real. 
                Cada empresa <span className="text-secondary font-semibold">gera valor, retorno e legado</span>, 
                sustentada por inteligência artificial, análise de dados e visão estratégica comprovada.
              </p>
              
              <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-card max-w-4xl mx-auto">
                <p className="text-lg md:text-xl text-muted-foreground font-inter leading-relaxed mb-8">
                  Criamos mais do que empresas — <span className="text-primary font-semibold">operamos uma nova forma de economia digital</span>, 
                  onde <span className="text-quantum-glow font-semibold">tecnologia, propósito e prosperidade</span> coexistem em perfeito equilíbrio.
                </p>

                <div className="border-t border-border pt-8">
                  <p className="text-lg text-muted-foreground font-inter leading-relaxed mb-6">
                    O Ecossistema Neutrino é mais do que um conjunto de empresas — é uma <span className="text-primary font-semibold">força invisível em movimento constante</span>, 
                    expandindo-se como o próprio universo. 
                    Cada inovação, cada linha de código, cada conexão faz parte de algo maior: <span className="text-secondary font-semibold">um legado tecnológico para as próximas gerações</span>.
                  </p>
                  
                  <p className="text-xl font-orbitron font-bold text-foreground mb-2">
                    Neutrino Soluções em Tecnologia
                  </p>
                  <p className="text-lg font-inter font-medium text-secondary italic">
                    Conectando o invisível. Potencializando o impossível.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Ecossistema;