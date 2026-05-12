import { ExternalLink } from 'lucide-react'
import { formatPriceWithLabel, formatTps } from '#/lib/format'
import type { ScoredGPU } from '#/lib/scoring'
import { SoftwareBadge, VerdictBadge } from './badges'

const confidenceDescriptions = {
  measured: 'Benchmarked directly by this project.',
  community_sourced: 'Taken from public user reports or benchmark threads.',
  estimated: 'Estimated from related benchmarks or comparable cards.',
  spec_derived: 'Inferred mostly from hardware specifications.',
  needs_verification: 'Weak or incomplete data that needs better sourcing.',
} satisfies Record<ScoredGPU['tokens_confidence'], string>

interface GpuRowDetailsProps {
  gpu: ScoredGPU
}

export function GpuRowDetails({ gpu }: GpuRowDetailsProps) {
  return (
    <div className="grid gap-6 bg-[var(--color-panel)] p-4 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-[var(--color-text-bright)]">{gpu.name}</h3>
          <p className="mt-2 max-w-3xl text-[var(--color-text)] text-sm leading-6">{gpu.notes}</p>
        </div>

        <DetailList title="Strengths" items={gpu.strengths} empty="No strengths listed yet." />
        <DetailList
          title="Software headaches"
          items={gpu.software_headaches}
          empty="No software headaches listed yet."
        />
        <DetailList
          title="Hardware headaches"
          items={gpu.hardware_headaches}
          empty="No hardware headaches listed yet."
        />
      </div>

      <aside className="space-y-4 border-[var(--color-line)] border-l pl-4">
        <div>
          <p className="text-[var(--color-accent)] text-sm uppercase tracking-[2px]">
            Display price
          </p>
          <p className="mt-1 font-semibold text-[var(--color-text-bright)]">
            {formatPriceWithLabel(gpu.display_price_usd, gpu.display_price_label)}
          </p>
          <p className="mt-1 text-[var(--color-text-dim)] text-xs">
            Last checked {gpu.price_last_checked}
          </p>
        </div>

        <div>
          <p className="text-[var(--color-accent)] text-sm uppercase tracking-[2px]">
            Tokens/s estimate
          </p>
          <p className="mt-1 font-semibold text-[var(--color-text-bright)]">
            {formatTps(gpu.tokens_per_second)}
          </p>
          <p className="mt-1 text-[var(--color-text-dim)] text-xs">
            {confidenceDescriptions[gpu.tokens_confidence]}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SoftwareBadge value={gpu.software_support} />
          <VerdictBadge value={gpu.beginner_pain} />
        </div>

        <div className="space-y-2 border-[var(--color-line)] border-t pt-4">
          <SourceLink href={gpu.price_source_url} label="Price source" />
          <SourceLink href={gpu.tokens_source_url} label="Tokens/s source" />
        </div>
      </aside>
    </div>
  )
}

function DetailList({ title, items, empty }: { title: string; items?: string[]; empty: string }) {
  return (
    <div>
      <h4 className="font-medium text-[var(--color-accent)] text-sm uppercase tracking-[2px]">
        {title}
      </h4>
      {items && items.length > 0 ? (
        <ul className="mt-2 space-y-1 pl-[2ch] text-[var(--color-text)] text-sm">
          {items.map((item) => (
            <li
              className="before:-ml-[2ch] before:inline-block before:w-[2ch] before:text-[var(--color-green)] before:content-['>']"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[var(--color-text-dim)] text-sm">{empty}</p>
      )}
    </div>
  )
}

function SourceLink({ href, label }: { href: string; label: string }) {
  if (!href) {
    return <p className="text-[var(--color-text-dim)] text-sm">{label}: not sourced yet</p>
  }

  return (
    <a
      className="inline-flex items-center gap-1.5 text-[var(--color-link)] text-sm hover:text-[var(--color-text-bright)]"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {label}
      <ExternalLink aria-hidden="true" size={14} />
    </a>
  )
}
