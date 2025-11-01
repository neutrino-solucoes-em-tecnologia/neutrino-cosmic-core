import { motion } from 'framer-motion';
import { Linkedin, Twitter, Instagram } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();



  const footerLinks = [
    {
      title: 'Empresa',
      links: [
        { name: 'Sobre', href: '/sobre' },
        { name: 'Ecossistema', href: '/ecossistema' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacidade', href: '/privacidade' },
        { name: 'Cookies', href: '/cookies' },
      ],
    },
    {
      title: 'Contato',
      links: [
        { name: 'neutrino@neutrino.dev.br', href: 'mailto:neutrino@neutrino.dev.br' },
      ],
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-background to-card border-t border-border overflow-hidden">
      {/* Particle Effect Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
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

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-orbitron font-black mb-4">
                <span className="bg-gradient-to-r from-primary-glow via-secondary to-quantum-glow bg-clip-text text-transparent">
                  NEUTRINO
                </span>
              </h3>
              <p className="text-muted-foreground font-inter leading-relaxed mb-6 max-w-md">
                O universo Neutrino — onde cada partícula é um propósito. 
                Transformando complexidade em fluidez tecnológica.
              </p>
              

            </motion.div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-orbitron font-bold mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-secondary transition-colors font-inter"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
                {section.title === 'Contato' && (
                  <li className="flex gap-4 mt-4">
                    <a
                      href="#"
                      aria-label="LinkedIn"
                      className="p-3 bg-background/50 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
                    >
                      <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary-glow transition-colors" />
                    </a>
                    <a
                      href="#"
                      aria-label="Twitter"
                      className="p-3 bg-background/50 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
                    >
                      <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-primary-glow transition-colors" />
                    </a>
                    <a
                      href="#"
                      aria-label="Instagram"
                      className="p-3 bg-background/50 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
                    >
                      <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-primary-glow transition-colors" />
                    </a>
                  </li>
                )}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-inter"
        >
          <p>
            © {currentYear} Neutrino Soluções em Tecnologia. Todos os direitos reservados.
          </p>
          
          <div className="flex flex-wrap gap-4 text-xs">
            <span>Curitiba, PR</span>
            <span>•</span>
            <span>Valor de Portfólio: R$ 2,5B</span>
            <span>•</span>
            <span>Operações Globais</span>
          </div>
        </motion.div>
      </div>

      {/* Glow Effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
};
