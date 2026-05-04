import { Cpu } from 'lucide-react'
import { GpuExplorer } from '#/components/gpu-table/GpuExplorer'
import { MethodologySection } from '#/components/MethodologySection'
import gpusJson from '#/data/gpus.json'
import { GpusSchema } from '#/lib/data-schema'
import { scoreGpus } from '#/lib/scoring'

const parsedGpus = GpusSchema.parse(gpusJson)
const scoredGpus = [...scoreGpus(parsedGpus)].sort((a, b) => {
  const aScore = a.practical_value_score ?? Number.NEGATIVE_INFINITY
  const bScore = b.practical_value_score ?? Number.NEGATIVE_INFINITY

  return bScore - aScore
})

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="border-zinc-200 border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-10 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-zinc-950 text-emerald-300">
                <Cpu aria-hidden="true" size={22} />
              </div>
              <span className="font-semibold text-lg">bestaigpu.com</span>
            </div>
          </header>

          <div className="max-w-3xl">
            <p className="mb-4 font-medium text-emerald-700 text-sm uppercase">
              Local LLM GPU buying guide
            </p>
            <h1 className="text-balance font-semibold text-4xl tracking-normal sm:text-5xl">
              Best value GPUs for local AI.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-zinc-700 leading-8">
              Compare GPUs by practical inference value: price, VRAM, model fit, software support,
              power, noise, and beginner pain.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-semibold text-2xl">GPU comparison table</h2>
            <p className="mt-2 text-zinc-600">
              Default view starts at 24GB+ because the first scoring target is Qwen3.6-27B.
            </p>
          </div>
        </div>

        <GpuExplorer data={scoredGpus} />
      </section>
      <MethodologySection gpus={scoredGpus} />
    </main>
  )
}
