# Tech Plan

## Goal

Build a simple, fast, static-first MVP for bestaigpu.com.

The MVP should make it easy to compare GPUs for local LLM inference, especially for first-time local AI machine builders.

The table is the core product.

## Stack

Core stack:

- Next.js
- TypeScript
- Tailwind CSS
- TanStack Table
- Zod
- pnpm

Deployment:

- Cloudflare Pages Free

Hosting setup:

- See `docs/hosting-cloudflare-pages.md`

Analytics:

- Plausible or Umami
- Avoid Google Analytics for MVP

## Frontend

Use Next.js with the App Router.

The first version is mostly a static frontend with one main public page:

- Landing copy
- Main GPU comparison table
- Filters
- Methodology summary
- Caveats
- Planned updates

No backend is needed for the MVP.

## Table

Use TanStack Table for:

- Sorting
- Filtering
- Column definitions
- Row expansion
- Future table complexity

Avoid reimplementing table behavior manually.

The table should support:

- New only / new or used
- All / beginner-safe / tinker cards
- AI only / gaming too
- Price brackets
- VRAM filters
- Sorting by practical value score

## Styling

Design direction:

- Mostly utilitarian comparison-table style
- Some clean SaaS polish
- Tiny local-AI hacker flavor
- Not full cyberpunk
- Not meme-heavy in the UI

The site should feel practical, trustworthy, and fast.

## Data Source

The source of truth for volatile MVP data is Google Sheets.

The app composes static GPU facts and sheet-managed metrics from:

```txt
data/gpu-static.json
data/gpu-metrics.json
```

Google Sheets is used for prices and throughput because those values are easy to edit manually while the dataset is small.

Local development can run without sheet access because both JSON files are checked in. To refresh local metrics from the sheet, set `SHEET_CSV_URL` in `.env.local` and run `pnpm import:gpus` or `pnpm dev:sheet`.

## Data Update Flow

The MVP data flow:

```txt
Google Sheet
→ published CSV
→ GitHub Actions scheduled workflow
→ import script fetches CSV
→ Zod validates metric rows
→ writes data/gpu-metrics.json
→ commits changed JSON
→ hosting provider redeploys
```

This avoids:

* Database
* Runtime backend
* Google API credentials
* Manual local imports
* Scraping infrastructure

## GitHub Actions

Use GitHub Actions to automate imports.

Triggers:

* Manual trigger
* Scheduled daily run

Example schedule:

```yaml
on:
  workflow_dispatch:
  schedule:
    - cron: "0 6 * * *"
```

Daily updates are enough for the MVP.

The CSV URL can be stored as a GitHub repository variable or secret.

## Import Script

Create:

```txt
scripts/import-gpus.ts
```

Responsibilities:

* Fetch published Google Sheet CSV
* Parse CSV rows
* Normalize values
* Validate metric rows with Zod
* Write `data/gpu-metrics.json`
* Fail loudly on invalid data

The script should not silently ignore bad rows.

## Validation

Use Zod for data validation.

The schema should live in:

```txt
src/lib/data-schema.ts
```

The same schema should be used by:

* Import script
* Frontend types

This prevents broken spreadsheet data from silently corrupting the app.

## Scoring

Scoring logic should live in:

```txt
src/lib/scoring.ts
```

The MVP default score is Practical Value Score.

Basic formula:

```txt
raw_value = tokens_per_second / price

practical_value =
  raw_value
  × model_fit_multiplier
  × software_support_multiplier
  × noise_multiplier
  × hardware_pain_multiplier
```

The site should also show raw tokens/s per dollar for transparency.

## Suggested Project Structure

```txt
/
  README.md

  docs/
    features.md
    future-plans.md
    tech.md
    methodology.md
    data-schema.md

  src/
    app/
      layout.tsx
      page.tsx

    components/
      gpu-table/
        GpuTable.tsx
        columns.tsx
        FilterBar.tsx
        GpuRowDetails.tsx
        ValueBadge.tsx
        VerdictBadge.tsx

      layout/
        Header.tsx
        Footer.tsx

    lib/
      data-schema.ts
      types.ts
      scoring.ts
      filters.ts
      format.ts

  scripts/
    import-gpus.ts
```

this is not to be religiously followed! especially if we are not there yet in progress

## Libraries

Use immediately:

* `@tanstack/react-table`
* `zod`
* `clsx`
* `tailwind-merge`
* `lucide-react`

Possible later:

* `recharts`
* `date-fns`
* `gray-matter`

## Not in MVP

Avoid for now:

* Prisma
* Supabase
* Postgres
* Auth
* User accounts
* CMS
* Full backend API
* Scraping framework
* AI agents
* Price history database
* User benchmark submissions

## Future Automation

Later versions may add:

* Retailer scraping
* eBay deal tracking
* Affiliate link automation
* Price history
* GPU detail pages
* AI recommender
* Full build generator
* Multi-GPU comparison
* User-submitted benchmarks

These should build on the same structured data model.
