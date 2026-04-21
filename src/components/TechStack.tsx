export const TechStack = () => {
  const coreCompetencies = [
    {
      title: 'Backend de Alta Performance',
      description: 'PHP/Laravel em escala enterprise, Go para concorrência extrema, arquitetura que processa 50K+ eventos/min com p95 ≤50ms.',
      stack: ['PHP 8.3 + Laravel 11/12', 'Go (microservices)', 'MySQL 8.0 / Percona', 'MongoDB 7.0+', 'Redis (cache/queue)'],
      metrics: '50K eventos/min • p95 latency 47ms • 92% cache hit rate',
    },
    {
      title: 'Arquitetura Mission-Critical',
      description: 'CQRS, event sourcing, multi-database, CDC, dead letter queues. Sistemas que não param quando terceiros falham.',
      stack: ['CQRS + Event Sourcing', 'Multi-DB (SQL + NoSQL)', 'Change Data Capture', 'Circuit Breaker', 'Dead Letter Queue'],
      metrics: '100% uptime • Zero perda de transações • Resiliente a falhas',
    },
    {
      title: 'Segurança & Compliance',
      description: 'Threat modeling, cloaking avançado, detecção de bots, OWASP Top 10, auditoria para regulatórios (LGPD, PCI-DSS).',
      stack: ['Cloaking (IP/UA/Behavior)', 'Bot Detection', 'OWASP compliance', 'Audit Logging', 'Encryption at rest/transit'],
      metrics: 'PHPStan Level 6 • 80%+ test coverage • Zero CVEs em 18 meses',
    },
    {
      title: 'Integrações Financeiras',
      description: 'Pix, APIs bancárias, embedded finance (BaaS), gateways de pagamento. Alto volume, baixa latência, resiliência a instabilidade.',
      stack: ['Pix / APIs bancárias', 'Celcoin / BaaS', 'Webhooks + retry', 'Idempotência', 'Kafka / Redis Streams'],
      metrics: 'Sub-200ms latency • Retry inteligente • Circuit breaker em terceiros',
    },
    {
      title: 'Cloud & Infraestrutura AWS',
      description: 'Arquitetura cloud-native, auto scaling, alta disponibilidade, disaster recovery, observabilidade profunda.',
      stack: ['AWS (EC2, ALB, S3, RDS)', 'Auto Scaling', 'Cloudflare', 'Nginx / PHP-FPM', 'Prometheus + Grafana'],
      metrics: 'Multi-AZ • Backup automático • 99.95%+ uptime',
    },
    {
      title: 'Otimização & Performance',
      description: 'Query tuning, índices compostos, partitioning, connection pooling, profiling contínuo. Reduzimos 15s para 180ms em queries reais.',
      stack: ['EXPLAIN ANALYZE', 'Composite indexes', 'Partitioning', 'Connection pooling', 'Query caching'],
      metrics: '15s → 180ms em queries críticas • 92% cache hit • Sub-50ms p95',
    },
  ];

  return (
    <section id="tech" className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-12 sm:mb-16 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-quantum mb-6 sm:mb-8">
            Competências Core
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] sm:leading-[1.2] mb-6 sm:mb-8 tracking-tight">
            Onde somos especialistas profundos
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-[1.6] sm:leading-[1.7]">
            Ao invés de listar 60 tecnologias, focamos nas 6 áreas onde temos experiência comprovada
            em produção, com métricas reais e clientes que podem confirmar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {coreCompetencies.map((competency, index) => (
            <div
              key={index}
              className="group bg-background border border-border hover:border-quantum/40 transition-all duration-300"
            >
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                    {competency.title}
                  </h3>
                  <span className="text-xs font-bold text-muted-foreground/40 group-hover:text-quantum transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {competency.description}
                </p>

                <div className="pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {competency.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-secondary border border-border text-xs text-muted-foreground rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-quantum mt-2 flex-shrink-0" />
                    <p className="text-xs font-semibold text-quantum">
                      {competency.metrics}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Statement */}
        <div className="mt-12 sm:mt-16 md:mt-20">
          <div className="bg-secondary border border-border border-l-4 border-l-quantum p-6 sm:p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-foreground">
                Não somos generalistas. Somos especialistas em backend de alta criticidade com PHP/Laravel e Go,
                arquitetura resiliente, integrações financeiras e segurança para compliance. Se seu problema está
                fora dessas áreas, indicamos profissionais melhores que nós.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
