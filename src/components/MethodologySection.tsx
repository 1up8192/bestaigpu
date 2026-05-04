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
  needs_verification: 'Weak or incomplete data that needs better sourcing.',
} satisfies Record<ScoredGPU['tokens_confidence'], string>

interface MethodologySectionProps {
  gpus: ScoredGPU[]
}

export function MethodologySection({ gpus }: MethodologySectionProps) {
  const lastUpdated = gpus
    .map((gpu) => gpu.price_last_checked)
    .sort((a, b) => b.localeCompare(a))[0]

  return (
    <section id="methodology" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <div className="border-zinc-200 border-t pt-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="font-medium text-emerald-700 text-sm uppercase">Methodology</p>
            <h2 className="mt-3 font-semibold text-3xl tracking-normal">How value is scored</h2>
            <p className="mt-4 text-zinc-700 leading-7">
              The default ranking starts with tokens per dollar, then applies practical penalties
              for model fit, software support, noise, hardware pain, and beginner pain. The default
              view is limited to 24GB+ cards because Qwen3.6-27B is not a good first-target model
              for 12GB and 16GB GPUs.
            </p>
            <p className="mt-4 text-zinc-700 leading-7">
              The price-basis toggle changes which price feeds the score and price filters. Lowest
              price uses the lower available new or used price. New price only ignores used prices
              and hides cards without a new-price estimate.
            </p>
            <p className="mt-4 text-sm text-zinc-500">Last updated: {lastUpdated}</p>
          </div>

          <div className="space-y-6">
            <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-emerald-100 text-sm">
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
              <MultiplierTable title="Qwen fit" values={qwenFitMultipliers} />
              <MultiplierTable title="Software support" values={softwareSupportMultipliers} />
              <MultiplierTable title="Noise" values={noiseMultipliers} />
              <MultiplierTable title="Hardware pain" values={hardwarePainMultipliers} />
              <MultiplierTable title="Beginner pain" values={beginnerPainMultipliers} />
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold">Confidence labels</h3>
              <dl className="mt-3 grid gap-3 text-sm">
                {Object.entries(confidenceLabels).map(([label, description]) => (
                  <div key={label}>
                    <dt className="font-medium text-zinc-950 capitalize">
                      {label.replaceAll('_', ' ')}
                    </dt>
                    <dd className="mt-1 text-zinc-600">{description}</dd>
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
                text="MVP prices are manually maintained and can go stale quickly. Check row source links and last-checked dates before buying."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MultiplierTable({ title, values }: { title: string; values: Record<string, number> }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <h3 className="font-semibold text-sm">{title}</h3>
      <dl className="mt-3 space-y-2 text-sm">
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <dt className="text-zinc-600 capitalize">{key.replaceAll('_', ' ')}</dt>
            <dd className="font-mono text-zinc-950">{value.toFixed(2)}x</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Caveat({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 leading-6">{text}</p>
    </article>
  )
}
