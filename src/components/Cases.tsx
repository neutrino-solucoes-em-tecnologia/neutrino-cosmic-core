import { TrendingUp, Shield, Zap, Database, Package, Smartphone } from 'lucide-react';

export const Cases = () => {
  const cases = [
    {
      icon: Database,
      category: 'Logística Industrial / EPI Management',
      title: 'Sistema Storage: Gerenciamento Automatizado de EPIs',
      challenge: 'Empresa industrial precisava rastrear distribuição de EPIs (equipamentos de proteção individual) com auditoria completa, controle de acesso e relatórios de compliance. Sistema legado era manual, sem rastreabilidade.',
      solution: 'Plataforma web completa com portal de gerenciamento (quem retira, o que, quando, por quê), integração com terminais de distribuição automatizados, sistema de permissões granular, relatórios de interação em tempo real e auditoria para compliance.',
      results: [
        'Eliminação de processos manuais de distribuição',
        'Rastreabilidade completa com auditoria NR-6',
        'Redução de 68% no tempo médio de entrega',
        'Relatórios automáticos para auditorias de compliance',
      ],
      tech: ['PHP', 'Laravel', 'MySQL', 'Bootstrap', 'REST API'],
    },
    {
      icon: Smartphone,
      category: 'Retail / Self-Service',
      title: 'Sistema Slim: Plataforma de Autoatendimento para Varejo',
      challenge: 'Rede varejista precisava de solução robusta para terminais de autoatendimento com integração de pagamento, sistema embarcado confiável e abstração de gateway de pagamento para trocar providers sem refactor.',
      solution: 'Arquitetura em 3 camadas: (1) Slim Web - portal de gerenciamento e configuração, (2) Thor - sistema embarcado para terminais (alta disponibilidade offline-first), (3) Slim Stone - camada de abstração para gateways de pagamento com fallback automático.',
      results: [
        'Operação offline-first sem perda de funcionalidade',
        'Troca de gateway de pagamento sem downtime',
        'Redução de 73% em chamados de suporte',
        'Escalado para 50+ terminais simultâneos',
      ],
      tech: ['PHP', 'Laravel', 'JavaScript', 'Python', 'MySQL', 'Redis'],
    },
    {
      icon: Shield,
      category: 'Security / Identity Management',
      title: 'Sistema Biometria: API de Autenticação Biométrica',
      challenge: 'Múltiplos sistemas legados precisavam de autenticação biométrica centralizada, mas cada um tinha arquitetura diferente. Solução precisava ser agnóstica e escalável.',
      solution: 'API RESTful centralizada para autenticação/validação biométrica com recursos gerenciais (cadastro, revogação, auditoria). Arquitetura stateless para escalabilidade horizontal, com rate limiting e caching agressivo.',
      results: [
        'Autenticação centralizada para 8+ sistemas',
        'p95 latency de 180ms para validação biométrica',
        '99.94% uptime em 24 meses de operação',
        'Compliance LGPD (auditoria + criptografia at rest)',
      ],
      tech: ['PHP', 'Laravel', 'MySQL', 'Redis', 'REST API', 'JWT'],
    },
    {
      icon: TrendingUp,
      category: 'IoT / Fleet Management',
      title: 'Sistema Engenharia: Monitoramento de Parque de Máquinas',
      challenge: 'Empresa com centenas de máquinas (sistemas embarcados) precisava monitorar versões de firmware, distribuir atualizações OTA (over-the-air), diagnosticar falhas remotamente e gerar relatórios de saúde da frota.',
      solution: 'Plataforma de telemetria e gerenciamento remoto: coleta de métricas em tempo real, versionamento de firmware, distribuição progressiva de updates (canary deployment), alertas automáticos de falha de comunicação, dashboard executivo.',
      results: [
        'Monitoramento em tempo real de 200+ dispositivos',
        'Redução de 58% no tempo de rollout de updates',
        'Detecção proativa em 87% dos casos de falha',
        'Sistema de rollback automático (zero bricks)',
      ],
      tech: ['PHP', 'Laravel', 'Python', 'MySQL', 'MongoDB', 'WebSockets'],
    },
    {
      icon: Zap,
      category: 'Fintech / Embedded Finance',
      title: 'Sistema de Pagamentos com Pix em Alta Frequência',
      challenge: 'Fintech Series B precisava processar transações Pix com latência sub-100ms, sem downtime durante picos de 10x no volume.',
      solution: 'Arquitetura CQRS com dual-database (MySQL para write, MongoDB para read), queue workers escaláveis, caching agressivo (Redis), monitoramento em tempo real.',
      results: [
        '30.000+ eventos/min processados de forma sustentada',
        'p95 latency de 47ms em APIs críticas',
        '92% cache hit rate (Redis multi-layer)',
        'Zero perda de transações (dead letter queue + retry)',
      ],
      tech: ['PHP 8.3', 'Laravel', 'MySQL', 'MongoDB', 'Redis', 'AWS'],
    },
    {
      icon: Package,
      category: 'GovTech / Smart Cities',
      title: 'Plataforma de Monitoramento Veicular em Tempo Real',
      challenge: 'Sistema legacy com queries lentas (5-15s), crashes durante picos de tráfego, falta de auditoria para compliance.',
      solution: 'Refactor completo: otimização de queries (índices compostos, partitioning), CDC para sincronização cross-database, caching multi-layer, observabilidade com Sentry.',
      results: [
        'Redução de 12s → 850ms em queries críticas (94% melhoria)',
        '78% cache hit rate em consultas frequentes',
        'Auditoria completa com event sourcing',
        'Suporte a 3x o volume sem degradação de performance',
      ],
      tech: ['PHP 8.2', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch'],
    },
    {
      icon: Shield,
      category: 'SaaS B2B',
      title: 'API de Integrações Bancárias com SLA 99.9%',
      challenge: 'Startup precisava integrar múltiplos bancos (APIs instáveis) com SLA garantido para clientes enterprise.',
      solution: 'Camada de abstração com circuit breaker, retry inteligente, fallback strategies, telemetria granular, testes de carga contínuos.',
      results: [
        '99.92% uptime em 12 meses (dentro do SLA)',
        'Circuit breaker evitou 89% de erros em cascata',
        'Onboarding de novos bancos: 2-3 semanas',
        'p95 latency de 340ms (incluindo APIs externas)',
      ],
      tech: ['Go', 'PostgreSQL', 'Redis', 'Kafka', 'Prometheus'],
    },
  ];

  // Divide cases em verificáveis e experiência da equipe
  const verifiableCases = cases.slice(0, 5); // Storage, Slim, Biometria, Engenharia, Fintech
  const teamExperienceCases = cases.slice(5); // GovTech, SaaS

  return (
    <section id="cases" className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-12 sm:mb-16 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-quantum mb-6 sm:mb-8">
            Resultados
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] sm:leading-[1.2] mb-6 sm:mb-8 tracking-tight">
            Problemas reais. Métricas reais.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-[1.6] sm:leading-[1.7]">
            Cinco projetos verificáveis desenvolvidos pela Neutrino, dois em cooperação técnica com parceiros.
            Todos os números abaixo são de sistemas em produção — não de benchmark ou laboratório.
          </p>
        </div>

        {/* Projetos Verificáveis da Neutrino */}
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {verifiableCases.map((caseStudy, index) => (
            <div 
              key={index}
              className="group bg-background border border-border hover:border-quantum/40 transition-all duration-300"
            >
              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                  {/* Left: Icon + Category */}
                  <div className="flex-shrink-0 flex lg:flex-col items-start gap-4 lg:gap-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-secondary border border-border group-hover:border-quantum/50 group-hover:bg-quantum/10 transition-colors duration-300">
                      <caseStudy.icon className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground group-hover:text-quantum transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    <div className="lg:rotate-180 lg:[writing-mode:vertical-lr]">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {caseStudy.category}
                      </span>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 leading-tight">
                        {caseStudy.title}
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">Desafio</h4>
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {caseStudy.challenge}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">Solução</h4>
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {caseStudy.solution}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-border">
                      {caseStudy.results.map((result, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                          <p className="text-sm text-foreground leading-relaxed">
                            {result}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {caseStudy.tech.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 bg-secondary border border-border text-xs font-medium text-muted-foreground rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cooperações Técnicas */}
        <div className="mt-12 sm:mt-16 md:mt-20">
          <div className="max-w-4xl mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              Cooperações Técnicas
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Projetos desenvolvidos em cooperação com parceiros:
            </p>
          </div>

          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            {teamExperienceCases.map((caseStudy, index) => (
              <div 
                key={index}
                className="group bg-background border border-border hover:border-border/80 transition-all duration-300"
              >
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                    {/* Left: Icon + Category */}
                    <div className="flex-shrink-0 flex lg:flex-col items-start gap-4 lg:gap-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-secondary border border-border group-hover:border-border hover:bg-secondary/80 transition-colors duration-300">
                        <caseStudy.icon className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground transition-colors duration-300" strokeWidth={1.5} />
                      </div>
                      <div className="lg:rotate-180 lg:[writing-mode:vertical-lr]">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {caseStudy.category}
                        </span>
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 leading-tight">
                          {caseStudy.title}
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">Desafio</h4>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                              {caseStudy.challenge}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">Solução</h4>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                              {caseStudy.solution}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Results Grid */}
                      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-border">
                        {caseStudy.results.map((result, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                            <p className="text-sm text-foreground leading-relaxed">
                              {result}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {caseStudy.tech.map((tech) => (
                          <span 
                            key={tech}
                            className="px-3 py-1 bg-secondary border border-border text-xs font-medium text-muted-foreground rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-border">
          <p className="text-base text-muted-foreground max-w-2xl">
            Referências e detalhes técnicos adicionais disponíveis para projetos em avaliação.
          </p>
        </div>
      </div>
    </section>
  );
};
