import { motion } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Cookie, Settings, Eye, Shield, BarChart3, Globe } from 'lucide-react';

export const Cookies = () => {
  const cookieTypes = [
    {
      icon: Shield,
      title: 'Cookies Essenciais',
      description: 'Necessários para o funcionamento básico do site',
      content: `Estes cookies são estritamente necessários para o funcionamento do nosso site e não podem ser desabilitados. Eles geralmente são definidos apenas em resposta a ações feitas por você, como definir suas preferências de privacidade, fazer login ou preencher formulários. Incluem cookies de sessão, segurança e funcionalidades básicas de navegação.`,
      required: true
    },
    {
      icon: BarChart3,
      title: 'Cookies de Análise',
      description: 'Coletam informações sobre o uso do site',
      content: `Utilizamos cookies de análise para entender como os visitantes interagem com nosso site, permitindo-nos melhorar continuamente a experiência do usuário. Estes cookies coletam informações de forma anônima sobre páginas visitadas, tempo de permanência, origem do tráfego e padrões de navegação. Os dados são agregados e não identificam usuários individuais.`,
      required: false
    },
    {
      icon: Settings,
      title: 'Cookies de Funcionalidade',
      description: 'Melhoram a experiência e personalização',
      content: `Estes cookies permitem que o site se lembre de escolhas que você faz (como seu nome de usuário, idioma ou região) e forneça recursos aprimorados e mais personais. Podem ser definidos por nós ou por provedores terceirizados cujos serviços adicionamos às nossas páginas. Se você não permitir estes cookies, alguns ou todos esses serviços podem não funcionar adequadamente.`,
      required: false
    },
    {
      icon: Globe,
      title: 'Cookies de Terceiros',
      description: 'Integração com serviços externos',
      content: `Utilizamos serviços de terceiros confiáveis que podem definir cookies para funcionalidades específicas, como análises web, mapas interativos ou integração com redes sociais. Estes parceiros seguem suas próprias políticas de privacidade e cookies. Trabalhamos apenas com fornecedores que atendem aos nossos padrões de segurança e privacidade.`,
      required: false
    }
  ];

  const managementOptions = [
    {
      title: 'Configurações do Navegador',
      description: 'Controle cookies diretamente nas configurações do seu navegador'
    },
    {
      title: 'Modo Privado/Incógnito',
      description: 'Use o modo privado para navegar sem armazenar cookies'
    },
    {
      title: 'Extensões de Privacidade',
      description: 'Instale extensões que bloqueiam cookies de rastreamento'
    },
    {
      title: 'Limpeza Regular',
      description: 'Limpe regularmente os cookies armazenados no seu dispositivo'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative pt-24">
        {/* Hero Section */}
        <section className="relative py-20 px-4 md:px-8 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -25, 0],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: 3.5 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-1 h-1 bg-secondary rounded-full"
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
              <Cookie className="w-16 h-16 mx-auto text-secondary mb-6" />
              <h1 className="text-4xl md:text-6xl font-orbitron font-black mb-6">
                <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                  Política de Cookies
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Transparência sobre como utilizamos cookies para melhorar sua experiência no ecossistema Neutrino
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
                O que são Cookies?
              </h2>
              <p className="text-muted-foreground font-inter leading-relaxed text-center mb-6">
                Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita 
                nosso site. Eles nos ajudam a proporcionar uma experiência melhor, mais rápida e personalizada, 
                além de nos permitir analisar como nosso site é utilizado.
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground font-inter text-center">
                  <strong>Compromisso:</strong> Utilizamos cookies de forma responsável e transparente, 
                  sempre respeitando sua privacidade e oferecendo controle sobre suas preferências.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cookie Types */}
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-orbitron font-bold text-center mb-12"
            >
              Tipos de Cookies Utilizados
            </motion.h2>

            <div className="grid gap-8">
              {cookieTypes.map((cookie, index) => (
                <motion.div
                  key={cookie.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-2xl p-8 hover:border-secondary/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary/10 rounded-lg flex-shrink-0">
                      <cookie.icon className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-orbitron font-bold">
                          {cookie.title}
                        </h3>
                        {cookie.required && (
                          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                            Necessário
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-inter mb-3">
                        {cookie.description}
                      </p>
                      <p className="text-muted-foreground font-inter leading-relaxed">
                        {cookie.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Management Section */}
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-orbitron font-bold text-center mb-12"
            >
              Gerenciar suas Preferências
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {managementOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <h3 className="text-lg font-orbitron font-bold mb-2">
                    {option.title}
                  </h3>
                  <p className="text-muted-foreground font-inter text-sm">
                    {option.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-secondary/10 via-primary/10 to-secondary/10 border border-secondary/20 rounded-2xl p-8"
            >
              <div className="text-center">
                <Eye className="w-12 h-12 mx-auto text-secondary mb-4" />
                <h3 className="text-xl font-orbitron font-bold mb-4">
                  Controle Total
                </h3>
                <p className="text-muted-foreground font-inter leading-relaxed">
                  Você tem controle total sobre os cookies. Pode aceitar todos, recusar os não essenciais 
                  ou personalizar suas preferências. Lembre-se de que bloquear alguns cookies pode afetar 
                  sua experiência de navegação e a disponibilidade de certas funcionalidades.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Browser Instructions */}
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <h2 className="text-2xl font-orbitron font-bold mb-6 text-center">
                Como Desabilitar Cookies
              </h2>
              <div className="space-y-4 text-muted-foreground font-inter">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Chrome:</h4>
                  <p className="text-sm">Configurações → Privacidade e segurança → Cookies e outros dados de sites</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Firefox:</h4>
                  <p className="text-sm">Opções → Privacidade e Segurança → Cookies e Dados de Sites</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Safari:</h4>
                  <p className="text-sm">Preferências → Privacidade → Gerenciar Dados de Website</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Edge:</h4>
                  <p className="text-sm">Configurações → Privacidade, pesquisa e serviços → Cookies e dados de sites</p>
                </div>
              </div>
            </motion.div>
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
                Dúvidas sobre Cookies?
              </h2>
              <p className="text-muted-foreground font-inter mb-6">
                Se você tiver dúvidas sobre nossa política de cookies ou precisar de ajuda para 
                gerenciar suas preferências, entre em contato conosco.
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
                Esta política de cookies complementa nossa Política de Privacidade e está em conformidade 
                com a Lei Geral de Proteção de Dados (LGPD) e demais regulamentações aplicáveis.
              </p>
              <p>
                Reservamo-nos o direito de atualizar esta política periodicamente para refletir 
                mudanças em nossa prática ou por razões legais.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};