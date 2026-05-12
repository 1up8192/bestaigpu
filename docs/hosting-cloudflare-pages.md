# Cloudflare Hosting Setup

This project should launch on Cloudflare Workers static assets as a static Next.js export, with GPU data updated by GitHub Actions from a published Google Sheet CSV.

Current stack:

- Host: Cloudflare Workers static assets
- Domain: `bestaigpu.com`
- App output: static Next.js export in `out/`
- Data source: published Google Sheet CSV
- Data import: `.github/workflows/import-gpus.yml`
- Generated data file: `data/gpu-metrics.json`

Official docs checked on 2026-05-12:

- Cloudflare Workers Builds configuration: https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- Cloudflare Workers static assets: https://developers.cloudflare.com/workers/static-assets/
- Cloudflare Pages to Workers static assets migration: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
- Cloudflare Pages static Next.js guide: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
- Next.js static export: https://nextjs.org/docs/pages/guides/static-exports
- GitHub Actions secrets: https://docs.github.com/en/actions/security-for-github-actions/security-guides/about-secrets

## 1. Prepare the Google Sheet

Create a Google Sheet that matches the schema in `docs/data-schema.md`.

Publish the data tab as CSV:

1. Open the Google Sheet.
2. Go to `File > Share > Publish to web`.
3. Select the GPU data sheet/tab.
4. Choose `Comma-separated values (.csv)`.
5. Publish and copy the CSV URL.

Keep this URL private enough for editing workflow purposes, but do not treat it as a real secret if the sheet is publicly published. Anyone with the published CSV URL may be able to read it.

## 2. Verify the import locally

Create a local `.env.local` file:

```sh
SHEET_CSV_URL="https://docs.google.com/spreadsheets/d/<sheet-id>/export?format=csv&gid=<tab-gid>"
```

Do not use the normal Google Sheets `/edit` URL. The importer needs CSV, not the spreadsheet HTML page. A published CSV URL also works if you use `File > Share > Publish to web` and choose CSV output for the metrics tab.

Run:

```sh
pnpm install
pnpm import:gpus
pnpm typecheck
pnpm build
```

Expected result:

- `pnpm import:gpus` updates `data/gpu-metrics.json`.
- Validation fails loudly if the sheet has invalid rows.
- `pnpm build` creates a static export in `out/`.

For normal local development, the sheet is optional. `pnpm dev` uses checked-in data from `data/gpu-static.json` and `data/gpu-metrics.json`. If you want to refresh from Sheets and then start the dev server, use:

```sh
pnpm dev:sheet
```

## 3. Add the GitHub repository secret

In GitHub:

1. Open the repo.
2. Go to `Settings > Secrets and variables > Actions`.
3. Select `New repository secret`.
4. Name: `SHEET_CSV_URL`.
5. Value: the published Google Sheet CSV URL.
6. Save.

The existing workflow at `.github/workflows/import-gpus.yml` already reads this secret and passes it to `pnpm import:gpus`.

## 4. Test the GitHub data update workflow

In GitHub:

1. Go to `Actions`.
2. Select `Import GPU data`.
3. Select `Run workflow`.
4. Run it on the production branch.
5. Confirm the workflow succeeds.
6. Confirm it commits `data/gpu-metrics.json` only when the imported data changed.

The workflow also runs daily at `06:00 UTC`.

## 5. Create the Cloudflare Worker project

In Cloudflare:

1. Go to `Workers & Pages`.
2. Select `Create application`.
3. Select the Worker/Git repository setup flow.
4. Connect the GitHub repo.
5. Choose the production branch.

Use these build settings:

```txt
Build command: pnpm build
Deploy command: pnpm deploy
Non-production branch deploy command: pnpm deploy:preview
Root directory: /
```

The deploy command uses `wrangler.jsonc`, which points Cloudflare to the static export in `out/`:

```jsonc
{
    "name": "bestaigpu",
    "compatibility_date": "2026-05-12",
    "assets": {
        "directory": "./out",
        "not_found_handling": "404-page"
    }
}
```

Set these environment variables for both production and preview unless intentionally different:

```txt
NODE_VERSION=22
PNPM_VERSION=10.33.0
NEXT_PUBLIC_BASE_URL=https://bestaigpu.com
```

`SHEET_CSV_URL` does not need to be added to Cloudflare because the hosted site reads checked-in JSON, not the sheet. The sheet import runs in GitHub Actions.

## 6. Deploy once on the Workers preview URL

Trigger the first Cloudflare deployment from the dashboard.

After it finishes:

1. Open the generated `*.workers.dev` URL.
2. Confirm the page loads.
3. Confirm filters and table interactions work.
4. Open `/sitemap.xml`.
5. Open `/robots.txt`.

If `/sitemap.xml` still uses `https://bestaigpu.com`, that is expected when `NEXT_PUBLIC_BASE_URL` is already set for production.

## 7. Add the production domain

For the apex domain `bestaigpu.com`, Cloudflare requires the domain to be a Cloudflare zone on the same account as the Worker project.

If the domain is not already on Cloudflare:

1. Add `bestaigpu.com` as a Cloudflare website/zone.
2. Follow Cloudflare's nameserver instructions at the domain registrar.
3. Wait for nameserver activation.

Then attach the domain to the Worker:

1. Open `Workers & Pages`.
2. Select the Worker.
3. Go to `Settings > Domains & Routes`.
4. Add a custom domain or route.
5. Enter `bestaigpu.com`.
6. Continue and activate.

Cloudflare should create the required DNS record automatically when the zone is active in the same account.

## 8. Add the `www` redirect

Add `www.bestaigpu.com` as a second custom domain or DNS alias, then choose one canonical URL.

Recommended canonical URL:

```txt
https://bestaigpu.com
```

Redirect `www.bestaigpu.com` to `bestaigpu.com` with a Cloudflare redirect rule. After that, verify:

```txt
https://bestaigpu.com
https://www.bestaigpu.com
```

Both should end up on the canonical domain over HTTPS.

## 9. Verify production SEO files

After the custom domain is active, check:

```txt
https://bestaigpu.com/
https://bestaigpu.com/robots.txt
https://bestaigpu.com/sitemap.xml
```

Expected:

- The homepage loads over HTTPS.
- `robots.txt` allows `/`.
- `robots.txt` points to `https://bestaigpu.com/sitemap.xml`.
- `sitemap.xml` contains `https://bestaigpu.com`.

## 10. Submit to search consoles

After production is live:

1. Add `https://bestaigpu.com` to Google Search Console.
2. Add `https://bestaigpu.com` to Bing Webmaster Tools.
3. Submit `https://bestaigpu.com/sitemap.xml`.

## 11. Normal update flow

For data-only updates:

```txt
Edit Google Sheet
→ GitHub Actions daily/manual import runs
→ data/gpu-metrics.json is committed if changed
→ Cloudflare Workers Builds sees the commit
→ Cloudflare rebuilds and redeploys the static assets
```

For code updates:

```txt
Push to production branch
→ Cloudflare Workers Builds runs `pnpm build`
→ `pnpm deploy` uploads `out/` as static assets
```

## Troubleshooting

If Cloudflare cannot find the output directory, confirm `next.config.ts` includes:

```ts
output: 'export'
```

If the build uses the wrong Node or pnpm version, set:

```txt
NODE_VERSION=22
PNPM_VERSION=10.33.0
```

If the sheet import works locally but fails in GitHub Actions, check:

- `SHEET_CSV_URL` exists as a repository Actions secret.
- The published CSV URL is reachable without a Google login.
- The sheet columns still match `docs/data-schema.md`.

If the domain does not activate, check:

- `bestaigpu.com` is active as a Cloudflare zone.
- The registrar nameservers point to Cloudflare.
- The Worker custom domain was added under the same Cloudflare account as the zone.
