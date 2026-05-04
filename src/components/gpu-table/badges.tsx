import { cn } from '#/lib/cn'
import type { BeginnerPain, QwenFit, SoftwareSupport, TokensConfidence } from '#/lib/data-schema'

const fitStyles = {
  excellent: 'bg-emerald-100 text-emerald-900 ring-emerald-200',
  good: 'bg-lime-100 text-lime-900 ring-lime-200',
  tight: 'bg-amber-100 text-amber-950 ring-amber-200',
  barely: 'bg-orange-100 text-orange-950 ring-orange-200',
  no: 'bg-red-100 text-red-900 ring-red-200',
} satisfies Record<QwenFit, string>

const softwareStyles = {
  excellent: 'bg-emerald-100 text-emerald-900 ring-emerald-200',
  good: 'bg-sky-100 text-sky-900 ring-sky-200',
  okay: 'bg-zinc-100 text-zinc-800 ring-zinc-200',
  improving: 'bg-violet-100 text-violet-900 ring-violet-200',
  painful: 'bg-red-100 text-red-900 ring-red-200',
} satisfies Record<SoftwareSupport, string>

const painStyles = {
  low: 'bg-emerald-100 text-emerald-900 ring-emerald-200',
  medium: 'bg-yellow-100 text-yellow-950 ring-yellow-200',
  high: 'bg-orange-100 text-orange-950 ring-orange-200',
  trap: 'bg-red-100 text-red-900 ring-red-200',
} satisfies Record<BeginnerPain, string>

const confidenceStyles = {
  measured: 'bg-emerald-600',
  community_sourced: 'bg-sky-600',
  estimated: 'bg-amber-500',
  spec_derived: 'bg-violet-500',
  needs_verification: 'border border-zinc-500 bg-transparent',
} satisfies Record<TokensConfidence, string>

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 font-medium text-xs capitalize ring-1 ring-inset',
        className
      )}
    >
      {children}
    </span>
  )
}

function label(value: string) {
  return value.replaceAll('_', ' ')
}

export function FitBadge({ value }: { value: QwenFit }) {
  return <Badge className={fitStyles[value]}>{label(value)}</Badge>
}

export function SoftwareBadge({ value }: { value: SoftwareSupport }) {
  return <Badge className={softwareStyles[value]}>{label(value)}</Badge>
}

export function VerdictBadge({ value }: { value: BeginnerPain }) {
  return <Badge className={painStyles[value]}>{label(value)}</Badge>
}

export function ConfidenceDot({ value }: { value: TokensConfidence }) {
  return (
    <span
      aria-label={`Token estimate confidence: ${label(value)}`}
      className={cn('inline-block size-2.5 shrink-0 rounded-full', confidenceStyles[value])}
      role="img"
      title={`Confidence: ${label(value)}`}
    />
  )
}
