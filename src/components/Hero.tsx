import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const Hero = () => {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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
            <div className="flex items-start gap-2 mb-4 justify-start">
              {/* Barra vertical - altura exata dos textos */}
              <div className="w-2 bg-white rounded-full self-stretch"></div>
              
              {/* Textos */}
              <div className="flex flex-col items-start text-left">
                <h1 className="text-4xl md:text-6xl font-tt-hoves font-black tracking-tight text-white leading-none text-left">
                  neutrino
                </h1>
                <p className="text-xs md:text-sm font-tt-hoves font-medium text-white tracking-wider leading-none -mt-1 text-left uppercase">
                  tecnologia e inovação
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-3xl md:text-5xl font-orbitron font-bold mb-6 max-w-4xl mx-auto px-4"
        >
          Construindo o futuro através da tecnologia
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto px-4 font-inter"
        >
          Empresa tecnológica que acelera a inovação global através de um portfólio estratégico de empresas disruptivas
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-8 mb-12 px-4"
        >
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-orbitron font-bold text-primary">R$ 2.5B+</div>
            <div className="text-sm text-muted-foreground font-inter">Valor de Portfólio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-orbitron font-bold text-primary">15+</div>
            <div className="text-sm text-muted-foreground font-inter">Empresas do Grupo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-orbitron font-bold text-primary">1M+</div>
            <div className="text-sm text-muted-foreground font-inter">Vidas Impactadas</div>
          </div>
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
