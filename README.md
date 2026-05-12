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

By default, local development uses checked-in static data from `data/gpu-static.json` and sheet-managed metrics from `data/gpu-metrics.json`.

To refresh local data from the Google Sheet first, create `.env.local` with `SHEET_CSV_URL`, then run:

```sh
pnpm dev:sheet
```

Useful checks:

```sh
pnpm check
pnpm typecheck
pnpm build
```

## Data

GPU prices and throughput are maintained in Google Sheets, imported into static JSON, and validated before use. Static GPU facts live in `data/gpu-static.json`.

The generated metrics data file is:

```txt
data/gpu-metrics.json
```

## Docs

- [Features](docs/features.md)
- [MVP Plan](docs/mvp-prelim-plan.md)
- [Implementation Plan](docs/impl-plan.md)
- [Tech Plan](docs/tech.md)
- [Cloudflare Hosting Setup](docs/hosting-cloudflare-pages.md)
- [Methodology](docs/methodology.md)
- [Data Schema](docs/data-schema.md)
- [GPU Sheet CSV Template](data/gpu-sheet-template.csv)
- [Content and SEO](docs/content-and-seo.md)
- [Future Plans](docs/future-plans.md)

## Principles

See [Principles](docs/principles.md) for the product philosophy behind the site.
