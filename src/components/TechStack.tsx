export const TechStack = () => {
  const technologies = {
    'Linguagens & Runtime': [
      'PHP 8.2+ (missão crítica, 6K eventos/min)',
      'Go (concorrência, microservices)',
      'Ruby (Rails, refactor de legados)',
      'JavaScript / TypeScript',
      'Python (Flask, scraping, automações)',
      'SQL (otimização, índices compostos)',
    ],
    'Backend & Frameworks': [
      'Laravel 11/12 (CQRS, dual-database)',
      'Ruby on Rails (refactor, integrations)',
      'NestJS / Express.js (Node services)',
      'Flask (Python microservices)',
      'TypeORM / Eloquent ORM',
    ],
    'Arquitetura & Patterns': [
      'CQRS (Command Query Separation)',
      'Repository + Service Layer',
      'Observer Pattern (event-driven)',
      'Multi-Database Architecture (poliglota)',
      'Dead Letter Queue (falha resiliente)',
      'Domain-Driven Design (pragmático)',
    ],
    'Cloud & Infraestrutura': [
      'AWS (EC2, ALB, Auto Scaling, S3)',
      'Linux Ubuntu Server (produção)',
      'Nginx / Apache (reverse proxy)',
      'PHP-FPM 8.3 (pool management)',
      'Cloudflare (DNS, proxy, DDoS protection)',
      'Redis (cache, queue, session)',
    ],
    'Bancos & Persistência': [
      'MySQL 8.0+ / Percona Server (OLTP)',
      'PostgreSQL / TimescaleDB (séries temporais)',
      'MongoDB 7.0+ (documental, 92% cache hit)',
      'Redis (cache, queue, pub/sub, session)',
      'Elasticsearch (full-text search)',
      'Apache Cassandra (wide-column)',
      'DynamoDB (key-value, serverless)',
      'Percona XtraBackup / pg_dump',
    ],
    'Sync & Replicação': [
      'Cross-database sync (SQL↔NoSQL)',
      'Change Data Capture (CDC)',
      'Event sourcing (audit trail)',
      'Master-slave replication',
      'Multi-master replication',
      'Sharding strategies (horizontal scaling)',
    ],
    'Query & Performance': [
      'Query optimization (EXPLAIN ANALYZE)',
      'Index design (composite, covering)',
      'Materialized views',
      'Partitioning (range, hash, list)',
      'Connection pooling (PgBouncer, ProxySQL)',
      'Query caching strategies',
    ],
    'Segurança & Compliance': [
      'OWASP Top 10 compliance',
      'Threat Modeling & surface reduction',
      'Cloaking (User-Agent, IP intel, behavior)',
      'Bot Detection & Mitigation',
      'Input sanitization (XSS/SQLi prevention)',
      'CSRF/CSP/CORS hardening',
      'Audit logging (compliance-ready)',
    ],
    'Integrações Críticas': [
      'Pix / APIs bancárias (transacional)',
      'BaaS / Embedded Finance',
      'Celcoin (integração direta, não wrapper)',
      'Pusher / WebSockets (real-time)',
      'OAuth 2.0 / Bearer Tokens',
      'Webhooks (retry + idempotência)',
      'Kafka / Redis Streams (event sourcing)',
    ],
    'Performance & Observabilidade': [
      'Queue Workers (6K eventos/min sustentado)',
      'p95 latency ≤50ms (API)',
      'EXPLAIN ANALYZE (query profiling)',
      'Redis cache (92%+ hit rate)',
      'Sentry (error tracking)',
      'Prometheus + Grafana (metrics)',
      'Structured logging (JSON)',
    ],
    'Message Brokers & Streaming': [
      'Apache Kafka (event streaming)',
      'RabbitMQ (AMQP messaging)',
      'Redis Streams (lightweight streaming)',
      'AWS SQS / SNS (cloud-native)',
      'Dead Letter Queues (DLQ)',
      'Message retry strategies',
      'Consumer groups & partitioning',
    ],
    'Qualidade & Testes': [
      'PHPUnit (80%+ cobertura)',
      'PHPStan Level 6 (análise estática)',
      'Laravel Pint (PSR-12 enforcement)',
      'Feature + Unit tests',
      'Testes de carga (k6, JMeter)',
      'CI/CD pipelines (GitHub Actions)',
    ],
  };

  return (
    <section id="tech" className="relative py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-8">
            Stack Tecnológico
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.2] mb-8 tracking-tight">
            Ferramentas escolhidas por maturidade, não por novidade
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-[1.7]">
            Não corremos atrás de tendências. Usamos tecnologias consolidadas, 
            com comunidade ativa, documentação sólida e cases de produção comprovados.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {Object.entries(technologies).map(([category, items]) => (
            <div key={category} className="space-y-6">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-gray-200 pb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item} className="text-sm text-gray-600 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="bg-foreground text-background p-12 md:p-16 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gray-400"></div>
            
            <div className="relative max-w-5xl mx-auto">
              <div className="flex items-start gap-6">
                <span className="text-5xl md:text-6xl font-bold text-gray-400 leading-none">"</span>
                <div className="flex-1 pt-2">
                  <p className="text-lg md:text-xl text-gray-100 leading-[1.7] font-light mb-6">
                    Nossa stack não é <span className="font-semibold text-white">ferramenta-centric</span>. 
                    É <span className="font-semibold text-white">problema-centric</span>.
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                    <div className="w-12 h-[2px] bg-gray-400"></div>
                    <p className="text-sm font-semibold text-white uppercase tracking-wider">
                      Arquiteturas que não falham, sistemas sob ataque, zero margem para erro
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
