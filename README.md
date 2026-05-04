# bestaigpu.com

Best value GPU comparison site for local LLM inference.

bestaigpu.com helps first-time local AI builders compare GPUs by practical value, not gaming benchmarks. The first version focuses on price, VRAM, tokens/s, model fit, power use, software support, noise, and beginner pain.

## Status

Early MVP. Data is manually curated and may include sourced estimates. Uncertain numbers should be clearly marked.

## Local Development

Install dependencies and start the dev server.

```sh
pnpm install
pnpm dev
```

The app runs at `http://localhost:3000`.

Useful checks:

```sh
pnpm check
pnpm typecheck
pnpm build
```

## Data

GPU data is maintained in Google Sheets, imported into static JSON, and validated before use.

The planned generated data file is:

```txt
src/data/gpus.json
```

## Docs

- [Features](docs/features.md)
- [MVP Plan](docs/mvp-prelim-plan.md)
- [Implementation Plan](docs/impl-plan.md)
- [Tech Plan](docs/tech.md)
- [Methodology](docs/methodology.md)
- [Data Schema](docs/data-schema.md)
- [Content and SEO](docs/content-and-seo.md)
- [Future Plans](docs/future-plans.md)

## Principles

See [Principles](docs/principles.md) for the product philosophy behind the site.
