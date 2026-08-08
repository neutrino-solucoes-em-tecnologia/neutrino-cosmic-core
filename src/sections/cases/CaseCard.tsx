import { Arrow } from '@/site/Cta'
import { Reveal } from '@/site/Reveal'
import type { Case, Metric } from '@/content/sistemas'

/**
 * A seta entre antes e depois é o argumento inteiro do card: sem ela sobra um
 * número solto, que é exatamente o que qualquer concorrente também escreve.
 */
function MetricRow({ metric }: { metric: Metric }) {
  return (
    <div className="border-t border-hairline py-4">
      {/* flex-wrap: "5–15 s → sub-segundo" não cabe em uma linha a 375px, e
          cortar o depois destruiria justamente o lado que importa. */}
      <div className="flex flex-wrap items-baseline gap-x-2.5">
        {metric.antes ? (
          <>
            <span className="mono text-[0.875rem] text-faint line-through decoration-faint/50">
              {metric.antes}
            </span>
            <Arrow className="h-3 w-3 shrink-0 text-faint" />
          </>
        ) : null}
        <span className="mono text-[1.125rem] font-semibold tracking-[-0.03em] text-event sm:text-[1.25rem]">
          {metric.depois}
        </span>
      </div>
      <p className="mono mt-1.5 text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
        {metric.label}
      </p>
    </div>
  )
}

/** O card completo. Vive em /sistemas; a home carrega apenas a síntese. */
export function CaseCard({ item, delay = 0 }: { item: Case; delay?: number }) {
  return (
    <Reveal as="article" delay={delay} className="h-full bg-mine">
      <div className="flex h-full flex-col p-7 lg:p-9">
        <p className="mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-signal">
          {item.segment}
        </p>

        <h3 className="mt-4 text-balance text-[1.25rem] font-bold leading-[1.25] tracking-[-0.02em] text-event">
          {item.title}
        </h3>

        <p className="mt-4 text-[0.9375rem] leading-[1.7] text-body">{item.problem}</p>

        <div className="mt-6">
          <p className="mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-faint">
            Como
          </p>
          <p className="mt-2.5 text-[0.9375rem] leading-[1.7] text-body">{item.how}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-x-8 min-[420px]:grid-cols-2">
          {item.metrics.map((metric) => (
            <MetricRow key={metric.label} metric={metric} />
          ))}
        </div>

        <ul className="mt-7 flex flex-wrap gap-x-3 gap-y-1.5 pt-1">
          {item.stack.map((tech) => (
            <li
              key={tech}
              className="mono border border-hairline px-2 py-1 text-[0.6875rem] text-faint"
            >
              {tech}
            </li>
          ))}
        </ul>

        {item.link ? (
          <a
            href={item.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link mono mt-6 inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-signal transition-colors hover:text-signal-hi"
          >
            Abrir {item.link.label}
            <Arrow className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none" />
          </a>
        ) : null}
      </div>
    </Reveal>
  )
}
