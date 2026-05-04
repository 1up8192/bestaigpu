import gpusJson from '#/data/gpus.json'
import { GpusSchema } from '#/lib/data-schema'

const gpus = GpusSchema.parse(gpusJson)
const lastUpdated = gpus.map((gpu) => gpu.price_last_checked).sort((a, b) => b.localeCompare(a))[0]

export function Footer() {
  return (
    <footer className="border-zinc-200 border-t bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-zinc-600 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <p className="font-semibold text-zinc-950">bestaigpu.com</p>
          <p className="mt-1">Estimates only. Not affiliated with any GPU vendor.</p>
        </div>

        <nav className="flex flex-wrap gap-4">
          <a className="hover:text-zinc-950" href="/#methodology">
            Methodology
          </a>
          <a className="hover:text-zinc-950" href="mailto:feedback@bestaigpu.com">
            Feedback
          </a>
          <span>Last updated: {lastUpdated}</span>
        </nav>
      </div>
    </footer>
  )
}
