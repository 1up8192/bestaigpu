import { ChevronDown } from 'lucide-react'
import type { ScoredGPU } from '#/lib/scoring'
import {
  beginnerPainMultipliers,
  hardwarePainMultipliers,
  noiseMultipliers,
  qwenFitMultipliers,
  softwareSupportMultipliers,
} from '#/lib/scoring'

const confidenceLabels = {
  measured: 'Benchmarked directly by this project.',
  community_sourced: 'Found from public user reports.',
  estimated: 'Inferred from comparable cards or partial data.',
  spec_derived: 'Based mostly on hardware specifications.',
  needs_verification: 'Limited public benchmark coverage.',
} satisfies Record<ScoredGPU['tokens_confidence'], string>

interface MethodologySectionProps {
  gpus: ScoredGPU[]
}

export function MethodologySection({ gpus }: MethodologySectionProps) {
  const lastUpdated = gpus
    .map((gpu) => gpu.price_last_checked)
    .sort((a, b) => b.localeCompare(a))[0]

  return (
    <section id="methodology" className="mx-auto max-w-[1600px] px-3 pb-16 sm:px-6 xl:px-8">
      <details className="group border-[var(--color-line)] border-t pt-7">
        <summary className="cursor-pointer list-none">
          <p className="font-semibold text-[var(--color-accent)] text-sm uppercase tracking-[2px]">
            Methodology
          </p>
          <h2 className="mt-1 inline-flex items-center gap-2 font-semibold text-[var(--color-text-bright)] text-xl tracking-normal">
            How value is scored
            <ChevronDown
              aria-hidden="true"
              size={20}
              className="shrink-0 text-[var(--color-text-dim)] transition-transform group-open:rotate-180"
            />
          </h2>
        </summary>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-[var(--color-text)] leading-7">
              The default ranking starts with tokens per dollar, then applies practical penalties
              for model fit, software support, noise, hardware pain, and beginner pain. The default
              view is limited to 24GB+ cards because Qwen3.6-27B is not a good first-target model
              for 12GB and 16GB GPUs.
            </p>
            <p className="mt-4 text-[var(--color-text)] leading-7">
              The price-basis toggle changes which price feeds the score and price filters. Lowest
              price uses the lower available new or used price. New price only ignores used prices
              and hides cards without a new-price estimate.
            </p>
            <p className="mt-4 text-[var(--color-text-dim)] text-sm">Last updated: {lastUpdated}</p>
          </div>

          <div className="space-y-6">
            <pre className="overflow-x-auto border-[var(--color-line)] border-y py-4 text-[var(--color-green)] text-sm">
              <code>{`raw_value = tokens_per_second / price

practical_value =
  raw_value
  * model_fit_multiplier
  * software_support_multiplier
  * noise_multiplier
  * hardware_pain_multiplier
  * beginner_pain_multiplier`}</code>
            </pre>

            <div className="grid gap-4 md:grid-cols-2">
              <MultiplierTable title="Model fit" values={qwenFitMultipliers} />
              <MultiplierTable title="Software support" values={softwareSupportMultipliers} />
              <MultiplierTable title="Noise" values={noiseMultipliers} />
              <MultiplierTable title="Hardware pain" values={hardwarePainMultipliers} />
              <MultiplierTable title="Beginner pain" values={beginnerPainMultipliers} />
            </div>

            <div className="border-[var(--color-line)] border-t pt-5">
              <h3 className="font-semibold text-[var(--color-accent)] text-sm uppercase tracking-[2px]">
                Confidence labels
              </h3>
              <dl className="mt-3 grid gap-3 text-sm">
                {Object.entries(confidenceLabels).map(([label, description]) => (
                  <div key={label}>
                    <dt className="font-medium text-[var(--color-text-bright)] capitalize">
                      {label.replaceAll('_', ' ')}
                    </dt>
                    <dd className="mt-1 text-[var(--color-text)]">{description}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Caveat
                title="Benchmark caveats"
                text="Local LLM throughput changes with model, quantization, backend, drivers, operating system, context length, prompt length, batch size, power limits, and CPU/RAM bottlenecks."
              />
              <Caveat
                title="Price caveats"
                text="Prices are manually maintained and can go stale quickly. Check row source links and last-checked dates before buying."
              />
            </div>
          </div>
        </div>
      </details>
    </section>
  )
}

function MultiplierTable({ title, values }: { title: string; values: Record<string, number> }) {
  return (
    <div className="border-[var(--color-line)] border-t pt-4">
      <h3 className="font-semibold text-[var(--color-accent)] text-sm uppercase tracking-[2px]">
        {title}
      </h3>
      <dl className="mt-3 space-y-2 text-sm">
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <dt className="text-[var(--color-text)] capitalize">{key.replaceAll('_', ' ')}</dt>
            <dd className="font-mono text-[var(--color-yellow)]">{value.toFixed(2)}x</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Caveat({ title, text }: { title: string; text: string }) {
  return (
    <article className="border-[var(--color-line)] border-t pt-4">
      <h3 className="font-semibold text-[var(--color-text-bright)]">{title}</h3>
      <p className="mt-2 text-[var(--color-text)] text-sm leading-6">{text}</p>
    </article>
  )
}
