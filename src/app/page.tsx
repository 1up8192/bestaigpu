import { GpuExplorer } from "#/components/gpu-table/GpuExplorer";
import { AsciiLogo } from "#/components/layout/AsciiLogo";
import { ThemeToggle } from "#/components/layout/ThemeToggle";
import { MethodologySection } from "#/components/MethodologySection";
import gpusJson from "#/data/gpus.json";
import { GpusSchema } from "#/lib/data-schema";
import { scoreGpus } from "#/lib/scoring";

const parsedGpus = GpusSchema.parse(gpusJson);
const scoredGpus = [...scoreGpus(parsedGpus)].sort((a, b) => {
  const aScore = a.practical_value_score ?? Number.NEGATIVE_INFINITY;
  const bScore = b.practical_value_score ?? Number.NEGATIVE_INFINITY;

  return bScore - aScore;
});

export default function Page() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-3 pt-8 pb-16 sm:px-6 xl:px-8">
        <div className="mb-5 flex justify-end">
          <ThemeToggle />
        </div>

        <div className="mx-auto mb-7 max-w-[92ch]">
          <AsciiLogo />

          <p className="mb-3 text-[var(--color-line)]">
            {"="}
            {"=".repeat(78)}
          </p>
          <p className="font-semibold text-[var(--color-accent)] text-sm uppercase tracking-[2px]">
            GPU VALUE INDEX
          </p>
          <h1 className="mt-2 font-semibold text-2xl text-[var(--color-text-bright)] tracking-normal sm:text-3xl">
            Best value GPUs for local LLM-s.
          </h1>
          <p className="mt-3 max-w-[78ch] text-[var(--color-text)]">
            Compare GPUs by practical inference value: price, VRAM, model fit, software support,
            power, noise, and beginner pain. Main goal is to help the first time local LLM machine
            builder. Default view starts at 24GB+ for the Qwen3.6-27B scoring target considering
            single GPU setups.
          </p>
        </div>

        <GpuExplorer data={scoredGpus} />
      </div>
      <MethodologySection gpus={scoredGpus} />
    </main>
  );
}
