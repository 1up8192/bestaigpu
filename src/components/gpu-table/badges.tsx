import { cn } from '#/lib/cn'
import type { BeginnerPain, QwenFit, SoftwareSupport, TokensConfidence } from '#/lib/data-schema'

const fitStyles = {
  excellent: 'text-[var(--color-green)]',
  good: 'text-[var(--color-green)]',
  tight: 'text-[var(--color-yellow)]',
  barely: 'text-[var(--color-accent)]',
  no: 'text-[var(--color-text-dim)]',
} satisfies Record<QwenFit, string>

const softwareStyles = {
  excellent: 'text-[var(--color-green)]',
  good: 'text-[var(--color-link)]',
  okay: 'text-[var(--color-text)]',
  improving: 'text-[var(--color-yellow)]',
  painful: 'text-[var(--color-accent)]',
} satisfies Record<SoftwareSupport, string>

const painStyles = {
  low: 'text-[var(--color-green)]',
  medium: 'text-[var(--color-yellow)]',
  high: 'text-[var(--color-accent)]',
  trap: 'text-[var(--color-accent)]',
} satisfies Record<BeginnerPain, string>

const confidenceStyles = {
  measured: 'bg-[var(--color-green)]',
  community_sourced: 'bg-[var(--color-link)]',
  estimated: 'bg-[var(--color-yellow)]',
  spec_derived: 'bg-[var(--color-accent)]',
  needs_verification: 'border border-[var(--color-text-dim)] bg-transparent',
} satisfies Record<TokensConfidence, string>

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium text-xs capitalize before:text-[var(--color-text-dim)] before:content-["["] after:text-[var(--color-text-dim)] after:content-["]"]',
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
