# Data Source Automation Plan

Keep this simple for the MVP: automate data collection, but keep publishing reviewed data through Google Sheets.

## Goal

Collect candidate GPU prices and tokens/s data automatically, then review the values before they affect the public site.

```txt
GitHub Actions
-> collect candidate data
-> write candidate JSON
-> review in Google Sheets
-> existing sheet import updates data/gpu-metrics.json
```

## Keep Google Sheets as the Source of Truth

The public site should continue using:

```txt
Google Sheet CSV
-> scripts/import-gpus.ts
-> data/gpu-metrics.json
```

Do not let scrapers directly overwrite public GPU metrics yet. Bad automated prices are worse than slightly stale reviewed prices.

## Add a Candidate Collection Script

Create:

```txt
scripts/collect-gpu-sources.ts
```

Output:

```txt
data/gpu-source-candidates.json
```

Candidate shape:

```json
{
    "slug": "rtx-3090",
    "kind": "used_price",
    "source": "ebay",
    "source_url": "https://example.com/source",
    "observed_value": 700,
    "sample_size": 12,
    "confidence": "candidate",
    "checked_at": "2026-05-12",
    "notes": "Median of relevant listings."
}
```

## Start With These Sources

### Prices

- eBay used prices through an API or structured search provider.
- Keepa for Amazon price history if Amazon pricing becomes important.
- Manual source rows for Newegg, B&H, Micro Center, PCPartPicker, and vendor pages.

### Tokens/s

- Start with manually reviewed benchmark sources.
- Store model, quant, backend, and source URL with every tokens/s candidate.
- Prefer one comparable benchmark target instead of mixing unrelated numbers.

## Add a GitHub Action

Create:

```txt
.github/workflows/collect-gpu-sources.yml
```

Run it manually and once per day:

```yaml
on:
  workflow_dispatch:
  schedule:
    - cron: "30 5 * * *"
```

Basic job:

```txt
checkout
setup pnpm/node
pnpm install --frozen-lockfile
pnpm collect:gpu-sources
commit data/gpu-source-candidates.json if changed
```

Add a package script:

```json
"collect:gpu-sources": "tsx scripts/collect-gpu-sources.ts"
```

## Review Flow

Use `data/gpu-source-candidates.json` as a review queue.

For each candidate:

1. Check that the source matches the exact GPU.
2. Ignore suspicious listings or incomparable benchmarks.
3. Copy the reviewed value into the Google Sheet.
4. Keep the source URL and update the confidence label.
5. Let the existing import workflow update `data/gpu-metrics.json`.

## MVP Checklist

- [ ] Add `scripts/collect-gpu-sources.ts`.
- [ ] Add `collect:gpu-sources` package script.
- [ ] Add `.github/workflows/collect-gpu-sources.yml`.
- [ ] Write candidates to `data/gpu-source-candidates.json`.
- [ ] Start with one source only, preferably eBay used prices.
- [ ] Keep tokens/s manual until the benchmark format is consistent.
- [ ] Review candidate values in Google Sheets before publishing.
