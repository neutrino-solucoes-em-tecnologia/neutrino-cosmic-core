import { motion } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Shield, Eye, FileText, Lock, Users, Globe } from 'lucide-react';

export const Privacidade = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Informações Coletadas',
      content: `Coletamos informações que você nos fornece diretamente, como nome, e-mail, telefone e dados de contato quando você se comunica conosco através de nossos canais oficiais. Também coletamos automaticamente dados de navegação, incluindo endereço IP, tipo de navegador, páginas visitadas e tempo de permanência no site para melhorar nossa experiência digital.`
    },
    {
      icon: Lock,
      title: 'Uso das Informações',
      content: `Utilizamos suas informações para responder às suas solicitações, fornecer informações sobre nossos projetos e ecossistema de empresas, melhorar nossos serviços digitais e comunicar oportunidades relevantes. Nunca vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros sem seu consentimento explícito.`
    },
    {
      icon: Shield,
      title: 'Proteção de Dados',
      content: `Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. Nossos sistemas utilizam criptografia de ponta e seguem as melhores práticas de segurança da informação do mercado tecnológico.`
    },
    {
      icon: Users,
      title: 'Compartilhamento',
      content: `Suas informações podem ser compartilhadas apenas com empresas do ecossistema Neutrino quando necessário para fornecer os serviços solicitados, sempre com os mesmos padrões de proteção. Em casos legais, podemos compartilhar informações quando exigido por lei ou ordem judicial.`
    },
    {
      icon: Eye,
      title: 'Seus Direitos',
      content: `Você tem direito a acessar, corrigir, atualizar ou solicitar a exclusão de suas informações pessoais. Pode também se opor ao processamento de seus dados ou solicitar a portabilidade dos mesmos. Para exercer esses direitos, entre em contato através de neutrino@neutrino.dev.br.`
    },
    {
      icon: Globe,
      title: 'Cookies e Tecnologias',
      content: `Utilizamos cookies e tecnologias similares para melhorar sua experiência de navegação, analisar o uso do site e personalizar conteúdo. Você pode controlar o uso de cookies através das configurações do seu navegador, embora isso possa afetar algumas funcionalidades do site.`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative pt-24">
        {/* Hero Section */}
        <section className="relative py-20 px-4 md:px-8 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-1 h-1 bg-primary rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <Shield className="w-16 h-16 mx-auto text-primary mb-6" />
              <h1 className="text-4xl md:text-6xl font-orbitron font-black mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary-glow bg-clip-text text-transparent">
                  Política de Privacidade
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Transparência total sobre como protegemos e utilizamos suas informações no ecossistema Neutrino
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm text-muted-foreground font-inter"
            >
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </motion.div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-8 mb-12"
            >
              <h2 className="text-2xl font-orbitron font-bold mb-4 text-center">
                Compromisso com sua Privacidade
              </h2>
              <p className="text-muted-foreground font-inter leading-relaxed text-center">
                A Neutrino Soluções em Tecnologia está comprometida em proteger sua privacidade e 
                garantir a segurança de suas informações pessoais. Esta política descreve como 
                coletamos, usamos, protegemos e compartilhamos suas informações quando você interage 
                com nosso ecossistema tecnológico e nossas plataformas digitais.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Sections */}
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-2xl p-8 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-orbitron font-bold mb-4">
                        {section.title}
                      </h3>
                      <p className="text-muted-foreground font-inter leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary-glow/10 border border-primary/20 rounded-2xl p-8 text-center"
            >
              <h2 className="text-2xl font-orbitron font-bold mb-4">
                Dúvidas sobre Privacidade?
              </h2>
              <p className="text-muted-foreground font-inter mb-6">
                Se você tiver dúvidas sobre esta política de privacidade ou sobre como tratamos 
                suas informações, entre em contato conosco.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:neutrino@neutrino.dev.br"
                  className="text-primary hover:text-primary-glow transition-colors font-inter font-semibold"
                >
                  neutrino@neutrino.dev.br
                </a>
                <span className="hidden sm:block text-muted-foreground">•</span>
                <span className="text-muted-foreground font-inter">
                  Curitiba, Paraná
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Legal Notice */}
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center text-sm text-muted-foreground font-inter"
            >
              <p className="mb-4">
                Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD) 
                e demais regulamentações aplicáveis.
              </p>
              <p>
                Reservamo-nos o direito de atualizar esta política periodicamente. 
                Alterações significativas serão comunicadas através de nossos canais oficiais.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};