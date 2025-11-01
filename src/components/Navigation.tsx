import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Início', href: '/' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Ecossistema', href: '/ecossistema' },
    { name: 'Contato', href: '#contact' },
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const yOffset = -80; // Offset para compensar a navbar fixa
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      if (href === '#contact') {
        scrollToContact();
      }
    } else {
      window.location.href = href;
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 z-50"
          >
            <div className="flex items-start gap-2">
              {/* Barra vertical */}
              <div className="w-1 h-8 bg-white rounded-full"></div>
              
              {/* Textos */}
              <div className="flex flex-col items-start">
                <span className="text-xl font-tt-hoves font-black tracking-tight text-white leading-none">
                  neutrino
                </span>
                <span className="text-[10px] font-tt-hoves font-medium text-white/80 tracking-wide leading-none mt-0.5 uppercase">
                  tecnologia e inovação
                </span>
              </div>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                onClick={() => handleNavClick(item.href)}
                className="text-foreground hover:text-primary transition-colors duration-300 font-inter font-medium text-sm uppercase tracking-wider"
              >
                {item.name}
              </motion.button>
            ))}
            
            {/* LinkedIn Button */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-inter font-semibold text-xs px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
                onClick={() => window.open('https://www.linkedin.com/in/leonardo-lima-88a78b1b5/', '_blank')}
              >
                <ExternalLink className="w-3 h-3" />
                LinkedIn
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden z-50 p-2 rounded-lg hover:bg-background/50 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left text-foreground hover:text-primary transition-colors duration-300 font-inter font-medium text-base py-2 border-b border-border/50 last:border-b-0 uppercase tracking-wider"
                >
                  {item.name}
                </motion.button>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="pt-4"
              >
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-inter font-semibold text-sm py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => {
                    window.open('https://www.linkedin.com/in/leonardo-lima-88a78b1b5/', '_blank');
                    setIsOpen(false);
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  LinkedIn do Fundador
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};