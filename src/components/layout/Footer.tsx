import gpusJson from "#/data/gpus.json";
import { GpusSchema } from "#/lib/data-schema";

const gpus = GpusSchema.parse(gpusJson);
const lastUpdated = gpus.map((gpu) => gpu.price_last_checked).sort((a, b) => b.localeCompare(a))[0];

export function Footer() {
  return (
    <footer className="border-[var(--color-line)] border-t">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-3 py-8 text-[var(--color-text-dim)] text-sm sm:px-6 md:flex-row md:items-center md:justify-between xl:px-8">
        <div>
          <p className="font-semibold text-[var(--color-text-bright)]">bestaigpu.com</p>
          <p className="mt-1">Estimates only. Not affiliated with any GPU vendor.</p>
        </div>

        <nav className="flex flex-wrap gap-4">
          <span>Last updated: {lastUpdated}</span>
        </nav>
      </div>
    </footer>
  );
}
