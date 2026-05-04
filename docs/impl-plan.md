# MVP Implementation Plan

Tracer bullet style — every step ends with something new visible in the browser.
Run `pnpm dev` after each step and verify before moving on.

---

## Step 1 — Seed data + schema → real rows in the existing table

**Visible result:** the current placeholder table shows real GPU names, real VRAM, real prices.

- [x] Write `src/lib/data-schema.ts`
  - [x] Zod enums for all categorical fields (`vendor`, `category`, `qwen_fit`, `software_support`, `noise_level`, `beginner_pain`, `hardware_pain`, `tokens_confidence`, `price_mode`)
  - [x] Zod object schema for `GPU` with all required fields (nullable numbers where data may be missing)
  - [x] Include optional detail fields used by expanded rows: `strengths`, `software_headaches`, `hardware_headaches`, `notes`
  - [x] Keep score fields out of `gpus.json`; `raw_value_score` and `practical_value_score` are derived in `scoring.ts`
  - [x] Export inferred `GPU` type via `z.infer<typeof GpuSchema>`
- [x] Write `src/data/gpus.json` — first 5–6 rows
  - [x] RTX 3090 (used ~$700, community-sourced tps)
  - [x] RTX 4090 (new ~$1800, community-sourced tps)
  - [x] RX 7900 XTX (new, ROCm)
  - [x] Tesla P40 (cheap used, server card trap)
  - [x] Arc Pro B70 32GB
  - [x] RTX 4060 Ti 16GB
- [x] Update `src/app/page.tsx`
  - [x] Import and parse `gpus.json` with Zod at module level (build fails on bad data)
  - [x] Replace hardcoded `tablePreview` with real parsed rows
  - [x] Keep existing static `<table>` markup — just drive it with real data

---

## Step 2 — Scoring → practical value score column appears

**Visible result:** a "Value score" column shows computed numbers. Best value card is obvious.

- [x] Write `src/lib/scoring.ts`
  - [x] Export multiplier lookup maps for `qwen_fit`, `software_support`, `noise_level`, `hardware_pain`, `beginner_pain` so methodology can render the same source of truth
  - [x] `getDisplayPrice(gpu: GPU): number | null` — chooses the price used for scoring/filtering from `new_price_usd`, `used_price_usd`, and `price_mode`
  - [x] `getDisplayPriceLabel(gpu: GPU): "new" | "used" | "new/used" | "unknown"` — used by cells and row details
  - [x] `computeRawValue(tps, price): number | null`
  - [x] `computePracticalValue(gpu: GPU): number | null`
  - [x] Return `null` when display price or tokens/s is missing; do not invent scores from incomplete data
  - [x] `scoreGpus(gpus: GPU[]): ScoredGPU[]` — attaches both scores
- [x] Write `src/lib/format.ts`
  - [x] `formatPrice(n: number | null): string` — "$700" or "—"
  - [x] `formatTps(n: number | null): string` — "42 t/s" or "—"
  - [x] `formatScore(n: number | null): string` — two decimal places or "—"
- [x] Update `page.tsx`
  - [x] Run `scoreGpus()` on parsed data
  - [x] Add practical value score column to static table
  - [x] Sort rows by practical value descending with `[...rows].sort()` so parsed/scored source arrays are not mutated

---

## Step 3 — TanStack Table → columns are sortable by clicking headers

**Visible result:** clicking column headers sorts the table. This is now the real product.

- [x] Write `src/lib/cn.ts` — `cn()` wrapper around `clsx` + `tailwind-merge`
- [x] Write `src/components/gpu-table/columns.tsx`
  - [x] `createColumnHelper<ScoredGPU>()` setup
  - [x] All 12 desktop columns: GPU, VRAM, Price, Tokens/s, Tokens/s per $100, Qwen fit, Power, Mem bandwidth, Software, Noise, Beginner pain, Verdict
  - [x] Null-safe cell renderers (use `formatPrice`, `formatTps`, etc.)
  - [x] Sort functions for numeric and ordinal columns
- [x] Write `src/components/gpu-table/GpuTable.tsx`
  - [x] `useReactTable` with `getSortedRowModel`
  - [x] Clickable `<th>` headers with sort direction indicator (lucide chevron icons)
  - [x] Default sort: practical value score descending
  - [x] Overflow scroll wrapper for wide tables
- [x] Write `src/components/gpu-table/GpuExplorer.tsx`
  - [x] Mark with `"use client"`
  - [x] Own all interactive table state that cannot live in the server component
  - [x] Render `<GpuTable data={scored} />`
- [x] Update `page.tsx` — keep JSON parsing/scoring in the server component and swap static `<table>` for `<GpuExplorer data={scored} />`

---

## Step 4 — Badges → table is readable at a glance

**Visible result:** colored pills on Qwen fit, beginner pain, software support. Table stops looking like raw data.

- [x] Write `src/components/gpu-table/badges.tsx`
  - [x] `FitBadge` — color-coded by `qwen_fit` (excellent=green → no=red)
  - [x] `VerdictBadge` — color-coded by `beginner_pain` (low=green, medium=yellow, high=orange, trap=red)
  - [x] `SoftwareBadge` — color-coded by `software_support`
  - [x] `ConfidenceDot` — small inline dot (solid=measured, striped=community, dotted=estimated, hollow=needs_verification)
- [x] Update `columns.tsx` to use badges in relevant cells
- [x] Price cell shows new vs used label based on `price_mode`
- [x] Price cell uses `getDisplayPrice()` / `getDisplayPriceLabel()` instead of duplicating price selection logic
- [x] Tokens/s cell shows `ConfidenceDot` next to the number

---

## Step 5 — Expandable rows → click a row to see full detail

**Visible result:** clicking a GPU row expands a detail panel with source links, headaches, notes, confidence label.

- [x] Write `src/components/gpu-table/GpuRowDetails.tsx`
  - [x] Strengths list
  - [x] Software headaches
  - [x] Hardware headaches
  - [x] Source links (price source, tokens source) as external `<a>` tags
  - [x] Confidence label with plain-English explanation
  - [x] Notes field
  - [x] `price_last_checked` date
- [x] Update `GpuTable.tsx`
  - [x] Add `getExpandedRowModel` to `useReactTable`
  - [x] Chevron toggle on GPU name cell
  - [x] Render `<GpuRowDetails>` in expanded row spanning all columns

---

## Step 6 — Filter bar → filters actually work

**Visible result:** "Beginner-safe" hides the Tesla P40. Price brackets narrow the list. VRAM chips filter by memory.

- [x] Write `src/lib/filters.ts`
  - [x] `FilterState` type definition
  - [x] `defaultFilterState` constant
  - [x] `applyFilters(gpus: ScoredGPU[], filters: FilterState): ScoredGPU[]` — pure predicate function
- [x] Write `src/components/gpu-table/FilterBar.tsx`
  - [x] Beginner-safe / All / Tinker cards — radio group (3 options)
  - [x] Define "tinker cards" in `filters.ts` from structured fields (`category`, `beginner_pain`, `hardware_pain`) rather than UI copy
  - [x] New only / New or used — toggle
  - [x] AI only / Gaming too — toggle or segmented control using `ai_only` / `gaming_too`
  - [x] Price bracket pills: Under $300 / $500 / $800 / $1200 / Premium / All
  - [x] VRAM chips: 12GB / 16GB / 24GB / 32GB / 40GB+ / 48GB+ / All
  - [x] Active filter count badge / "Clear filters" link
- [x] Update `GpuExplorer.tsx`
  - [x] `useState<FilterState>` for filter state
  - [x] Run `applyFilters()` before passing data to `<GpuTable>`
  - [x] Replace placeholder filter pills with `<FilterBar>`
- [x] Keep `page.tsx` as a server component that passes scored data into `<GpuExplorer>`

---

## Step 7 — Methodology section → trust layer is on the page

**Visible result:** scrolling below the table shows scoring formula, multiplier tables, caveats, last-updated date.

- [x] Write `src/components/MethodologySection.tsx`
  - [x] Scoring formula rendered as a code/pre block
  - [x] Multiplier lookup table for each ordinal field (value → multiplier) imported from `scoring.ts`, not manually duplicated
  - [x] Confidence label definitions
  - [x] Benchmark caveats paragraph (model, quant, backend, OS, context length all affect numbers)
  - [x] Price caveats (manually maintained, check source links)
  - [x] Last updated date (max `price_last_checked` across all rows)
- [x] Add `<MethodologySection>` below `<GpuTable>` in `page.tsx`
- [x] Add a `#methodology` anchor so the filter bar or footer can link to it

---

## Step 8 — Mobile layout → usable on phone

**Visible result:** on 375px the table shows only GPU / Price / VRAM / Tokens/s / Value / Verdict with horizontal scroll for the rest.

- [x] Add `meta.hideOnMobile: boolean` flag to column definitions in `columns.tsx`
- [x] Mark these columns as mobile-hidden: Mem bandwidth, Power, Software, Noise, Tokens/s per $100
- [x] Implement column visibility in `GpuTable.tsx`
  - [x] Prefer CSS-first responsive hiding based on column metadata/classes
  - [x] Avoid a `useBreakpoint` hook/window resize listener unless CSS cannot satisfy the table behavior
- [x] Verify expanded row detail panel is usable at 375px (full-width, readable text)
- [x] Verify filter bar wraps cleanly at 375px (pills wrap, no overflow)

---

## Step 9 — Full dataset → all 10–12 GPU rows

**Visible result:** complete table. Filters become meaningful. Score differences are obvious.

- [x] Add remaining GPU rows to `src/data/gpus.json`
  - [x] RTX 5090 32GB
  - [x] RTX 3060 12GB
  - [x] RTX 6000 Ada 48GB
  - [x] A100 40GB
  - [x] Intel Arc Pro B60 24GB
- [ ] Fill in real tokens/s numbers (community-sourced from llama.cpp benchmarks, llm-benchmark repos, etc.)
- [ ] Add source URLs for each row's price and tokens/s
- [ ] Sanity-check sort order — does the ranking feel right? Tune multipliers in `scoring.ts` if not
- [x] Verify all filters produce correct results with the full set

---

## Step 10 — Import script → data update flow works end-to-end

**Visible result:** `pnpm import:gpus` fetches the Google Sheet and overwrites `gpus.json`. Page rebuilds with fresh data.

- [x] Write `scripts/import-gpus.ts`
  - [x] Fetch published Google Sheets CSV from `SHEET_CSV_URL` env var
  - [x] Parse CSV rows with a real CSV parser such as `csv-parse` or `papaparse` (handle empty cells, quoted commas, trim whitespace, coerce types)
  - [x] Normalize values (lowercase enums, parse numbers, convert dates)
  - [x] Validate each row with Zod — throw on invalid required fields, warn on missing optional
  - [x] Write validated array to `src/data/gpus.json`
  - [x] Print summary: rows imported and warnings
  - [x] Fail the import on bad rows; do not silently skip invalid data
- [x] Add `.env.example` with `SHEET_CSV_URL=` placeholder
- [x] Add dependencies for the importer: `tsx` and the chosen CSV parser
- [x] Add `"import:gpus": "tsx scripts/import-gpus.ts"` to `package.json` scripts
- [ ] Set up Google Sheet matching the schema column order
- [x] Run `pnpm import:gpus` and verify JSON updates correctly

---

## Step 11 — GitHub Actions + deployment → live URL exists

**Visible result:** `git push` deploys the site. The daily cron auto-updates data without manual work.

- [ ] Create Vercel or Cloudflare Pages project, connect repo
- [ ] Set environment variables in hosting dashboard (`NEXT_PUBLIC_BASE_URL`, `SHEET_CSV_URL`)
- [x] Write `.github/workflows/import-gpus.yml`
  - [x] Add `permissions: contents: write` so the workflow can commit updated `gpus.json`
  - [x] Triggers: `workflow_dispatch` + `schedule: cron: "0 6 * * *"`
  - [x] Steps: checkout → pnpm install → run `pnpm import:gpus` → commit changed JSON if diff → push
  - [ ] Add `SHEET_CSV_URL` as GitHub repository secret
- [ ] Verify the manual trigger works end-to-end (Actions tab → run → check commit)
- [ ] Verify `robots.ts` sitemap URL resolves with the real base URL

---

## Step 12 — Launch polish → shareable link

**Visible result:** link previews work on Twitter/Reddit. Page has a favicon. Footer is complete.

- [x] `public/favicon.svg` — simple CPU icon in zinc + emerald palette
- [x] OG metadata in `layout.tsx`
  - [x] `og:title`, `og:description`
  - [x] `og:image` (static image or generated)
  - [x] `twitter:card: summary_large_image`
- [x] Write `src/app/sitemap.ts`
- [x] Write `src/components/layout/Footer.tsx`
  - [x] Link to `#methodology`
  - [x] Last updated date
  - [x] Feedback / contact link
  - [x] Disclaimer: "Estimates only. Not affiliated with any vendor."
- [x] Add footer to `layout.tsx`
- [ ] Add Plausible or Umami script (env-gated: only fires when `NEXT_PUBLIC_BASE_URL` is set)
- [ ] Final responsive check at 375px / 768px / 1280px
- [ ] Final data sanity check — all source URLs resolve, no `null` scores on major cards

---

## Launch criteria checklist

Before sharing publicly, verify a user can answer all of these from the page:

- [ ] Which GPU is best value for local AI right now?
- [ ] Which GPU is safest for a first build?
- [ ] Which GPUs are traps and why?
- [ ] How much VRAM do I need for Qwen3.6-27B?
- [ ] Why is the used RTX 3090 so often recommended?
- [ ] What are the tradeoffs between price, speed, VRAM, and pain?
