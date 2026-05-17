import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatInteger, formatPrice, formatScore, formatTps, formatValueScore } from '#/lib/format'
import { gpus } from '#/lib/gpu-data'
import { type ScoredGPU, scoreGpus } from '#/lib/scoring'
import {
  createJsonLd,
  createOpenGraphMetadata,
  gpuDescription,
  gpuPath,
  gpuProductJsonLd,
  gpuTitle,
} from '#/lib/seo'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

const scoredGpus = scoreGpus(gpus)

export function generateStaticParams() {
  return gpus.map((gpu) => ({
    slug: gpu.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const gpu = findGpu(slug)

  if (!gpu) {
    return {}
  }

  return createOpenGraphMetadata({
    title: gpuTitle(gpu),
    description: gpuDescription(gpu),
    path: gpuPath(gpu),
  })
}

export default async function GpuPage({ params }: PageProps) {
  const { slug } = await params
  const gpu = findGpu(slug)

  if (!gpu) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: createJsonLd(gpuProductJsonLd(gpu)) }}
      />
      <article className="mx-auto max-w-[1080px] px-3 pt-10 pb-16 sm:px-6 xl:px-8">
        <Link
          className="text-[var(--color-link)] text-sm hover:text-[var(--color-text-bright)]"
          href="/"
        >
          Back to GPU value index
        </Link>

        <header className="mt-8 border-[var(--color-line)] border-b pb-8">
          <p className="font-semibold text-[var(--color-accent)] text-sm uppercase tracking-[2px]">
            Local LLM GPU Notes
          </p>
          <h1 className="mt-2 font-semibold text-3xl text-[var(--color-text-bright)] tracking-normal">
            {gpu.name} for local LLMs
          </h1>
          <p className="mt-4 max-w-[78ch] text-[var(--color-text)] leading-7">{gpu.verdict}</p>
        </header>

        <section className="grid gap-8 py-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <section>
              <h2 className="font-semibold text-[var(--color-text-bright)] text-xl">
                Practical take
              </h2>
              <p className="mt-3 text-[var(--color-text)] leading-7">{gpu.notes}</p>
            </section>

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

          <aside className="space-y-5 border-[var(--color-line)] border-t pt-5 lg:border-t-0 lg:border-l lg:pl-6">
            <Stat label="Value score" value={formatValueScore(gpu.practical_value_score)} />
            <Stat label="VRAM" value={`${gpu.vram_gb}GB`} />
            <Stat label="New price" value={formatPrice(gpu.new_price_usd)} />
            <Stat label="Used price" value={formatPrice(gpu.used_price_usd)} />
            <Stat label="Tokens/s estimate" value={formatTps(gpu.tokens_per_second)} />
            <Stat
              label="Tokens/s per $100"
              value={formatScore(gpu.tokens_per_second_per_100_usd)}
            />
            <Stat label="Power" value={`${formatInteger(gpu.power_w)}W`} />
            <Stat
              label="Memory bandwidth"
              value={`${formatInteger(gpu.memory_bandwidth_gbps)} GB/s`}
            />
            <Stat label="Software support" value={label(gpu.software_support)} />
            <Stat label="Beginner pain" value={label(gpu.beginner_pain)} />
            <Stat label="Last checked" value={gpu.price_last_checked} />

            <div className="space-y-2 border-[var(--color-line)] border-t pt-4">
              <SourceLink href={gpu.price_source_url} label="Price source" />
              <SourceLink href={gpu.tokens_source_url} label="Tokens/s source" />
            </div>
          </aside>
        </section>
      </article>
    </main>
  )
}

function findGpu(slug: string) {
  return scoredGpus.find((gpu) => gpu.slug === slug)
}

function label(value: string) {
  return value.replaceAll('_', ' ')
}

function DetailList({ title, items, empty }: { title: string; items?: string[]; empty: string }) {
  return (
    <section>
      <h2 className="font-semibold text-[var(--color-text-bright)] text-xl">{title}</h2>
      {items && items.length > 0 ? (
        <ul className="mt-3 space-y-2 pl-[2ch] text-[var(--color-text)]">
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
        <p className="mt-3 text-[var(--color-text-dim)]">{empty}</p>
      )}
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[var(--color-accent)] text-sm uppercase tracking-[2px]">{label}</p>
      <p className="mt-1 font-semibold text-[var(--color-text-bright)] capitalize">{value}</p>
    </div>
  )
}

function SourceLink({ href, label }: { href: string; label: string }) {
  if (!href) {
    return null
  }

  return (
    <a
      className="block text-[var(--color-link)] text-sm hover:text-[var(--color-text-bright)]"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {label}
    </a>
  )
}
