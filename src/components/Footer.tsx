import { Linkedin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Soluções',
      links: [
        { name: 'Arquitetura', href: '#solutions' },
        { name: 'Segurança', href: '#solutions' },
        { name: 'Backend', href: '#solutions' },
        { name: 'Infraestrutura', href: '#solutions' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { name: 'Problemas', href: '#problems' },
        { name: 'Metodologia', href: '#methodology' },
        { name: 'Tecnologias', href: '#tech' },
        { name: 'Por Quê', href: '#why' },
      ],
    },
    {
      title: 'Contato',
      links: [
        { name: 'Email', href: 'mailto:neutrino@neutrino.dev.br' },
        { name: 'Telefone', href: 'tel:+5541999214248' },
        { name: 'LinkedIn', href: 'https://www.linkedin.com/company/neutrino-solu%C3%A7%C3%B5es-em-tecnologia/' },
      ],
    },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative bg-gray-900 text-gray-300">
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-bold text-white mb-4">neutrino</h3>
            <p className="text-gray-400 leading-relaxed max-w-md mb-8 text-sm">
              Engenharia de software de alta complexidade para sistemas que não podem falhar.
            </p>
            <a
              href="https://www.linkedin.com/company/neutrino-solu%C3%A7%C3%B5es-em-tecnologia/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-sm font-medium"
            >
              <Linkedin className="w-4 h-4" />
              Siga no LinkedIn
            </a>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('#') ? (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-sm text-gray-400 hover:text-white transition-colors text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {currentYear} Neutrino Soluções em Tecnologia. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-500">
            Curitiba, Paraná · Brasil
          </p>
        </div>
      </div>
    </footer>
  );
};
