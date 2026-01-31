import { Network, Shield, Code, Server, Database, Zap } from 'lucide-react';

export const Solutions = () => {
  const solutions = [
    {
      icon: Network,
      title: 'Arquitetura de Software',
      description: 'Sistemas de alta disponibilidade, arquiteturas escaláveis, ambientes cloud-native e híbridos. Projetamos para crescer sem refatoração.',
    },
    {
      icon: Shield,
      title: 'Segurança & Criptografia',
      description: 'Threat modeling, design seguro de APIs, cloaking, detecção de bots, inteligência de tráfego. Redução de superfície de ataque.',
    },
    {
      icon: Code,
      title: 'Engenharia de Backend',
      description: 'Laravel em larga escala, Go para serviços de alta performance, PHP para sistemas críticos, Ruby on Rails para legado e refactor.',
    },
    {
      icon: Server,
      title: 'Infraestrutura & DevOps',
      description: 'Arquitetura AWS, Auto Scaling, ALB, alta disponibilidade. Estratégias de backup (Percona XtraBackup, S3, disaster recovery).',
    },
    {
      icon: Database,
      title: 'Performance & Observabilidade',
      description: 'Tuning de banco de dados, otimização de queries, análise de gargalos. Monitoramento proativo e ajuste contínuo.',
    },
    {
      icon: Zap,
      title: 'Integrações Complexas',
      description: 'APIs financeiras (Pix, bancos, pagamentos), sistemas terceiros com contratos quebrados. Alto volume, baixa latência.',
    },
  ];

  return (
    <section id="solutions" className="relative py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-8">
            O Que Fazemos
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.2] mb-8 tracking-tight">
            Engenharia que resolve, não improvisa
          </h2>
          <div className="space-y-4">
            <p className="text-lg md:text-xl text-gray-600 leading-[1.7]">
              A Neutrino atua como parceiro tecnológico em cenários onde a complexidade 
              exige experiência profunda, visão arquitetural e execução impecável.
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-[1.7]">
              Não fazemos sites institucionais. Fazemos sistemas que processam dinheiro, 
              suportam operações críticas e escalam sob pressão.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div 
              key={solution.title} 
              className="group bg-white p-8 border border-gray-200 hover:border-gray-900 transition-all duration-300 hover:shadow-lg"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 group-hover:bg-gray-900 transition-colors duration-300">
                    <solution.icon className="w-6 h-6 text-foreground group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-bold text-gray-300">{String(index + 1).padStart(2, '0')}</span>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">
                    {solution.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
