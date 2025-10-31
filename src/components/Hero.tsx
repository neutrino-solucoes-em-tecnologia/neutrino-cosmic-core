import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  const scrollToEcosystem = () => {
    document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Central Nucleus */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center"
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

        {/* Logo/Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-block relative">
            <h1 className="text-6xl md:text-8xl font-orbitron font-black tracking-tight mb-4 cosmic-glow">
              <span className="bg-gradient-to-r from-primary-glow via-secondary to-quantum-glow bg-clip-text text-transparent">
                NEUTRINO
              </span>
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-quantum/20 rounded-full blur-2xl -z-10 animate-pulse-glow" />
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground mb-3 font-inter"
        >
          Soluções em Tecnologia
        </motion.p>

        {/* Main Headline */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-3xl md:text-5xl font-orbitron font-bold mb-6 max-w-4xl mx-auto px-4"
        >
          O núcleo que move o universo da tecnologia
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto px-4 font-inter"
        >
          Ecossistema inteligente de soluções que conectam inovação, pessoas e propósito
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <Button
            onClick={scrollToEcosystem}
            size="lg"
            className="group relative overflow-hidden bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-6 text-lg font-orbitron font-semibold rounded-xl transition-all duration-300 cosmic-glow"
          >
            <span className="relative z-10">Explorar o Universo</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-quantum opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </motion.div>

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

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-8 h-8 text-secondary" />
        </motion.div>
      </motion.div>
    </section>
  );
};
