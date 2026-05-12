# Data Schema

## Source of Truth

MVP data is maintained in Google Sheets.

The import script converts the sheet into:

```txt
src/data/gpus.json
```

The frontend should only read from the generated JSON.

CSV template:

```txt
docs/gpu-sheet-template.csv
```

## Required GPU Fields

```txt
slug
name
vendor
category
vram_gb
memory_bandwidth_gbps
power_w
new_price_usd
used_price_usd
price_mode
price_source_url
price_last_checked
tokens_per_second
tokens_source_url
tokens_confidence
qwen_fit
software_support
noise_level
beginner_pain
hardware_pain
verdict
```

## Derived Fields (computed by scoring.ts, not stored in spreadsheet)

```txt
practical_value_score
raw_value_score
```

## Optional GPU Fields

```txt
release_year
generation
cuda_support
rocm_support
intel_support
gaming_score
ai_only
gaming_too
affiliate_new_url
affiliate_used_url
image_url
strengths
software_headaches
hardware_headaches
notes
```

## Categorical Values

### vendor

```txt
nvidia
amd
intel
apple
other
```

### category

```txt
consumer
workstation
server
experimental
trap
```

### price_mode

```txt
new
used
new_or_used
```

### tokens_confidence

```txt
measured
community_sourced
estimated
spec_derived
needs_verification
```

### qwen_fit

```txt
excellent
good
tight
barely
no
```

### software_support

```txt
excellent
good
okay
improving
painful
```

### noise_level

```txt
quiet
normal
loud
server_jet
unknown
```

### beginner_pain

```txt
low
medium
high
trap
```

### hardware_pain

```txt
normal
needs_care
tinkerer
janky
server_mods
```

## Example JSON Row

```json
{
  "slug": "rtx-3090",
  "name": "RTX 3090",
  "vendor": "nvidia",
  "category": "consumer",
  "vram_gb": 24,
  "memory_bandwidth_gbps": 936,
  "power_w": 350,
  "new_price_usd": null,
  "used_price_usd": 700,
  "price_mode": "used",
  "price_source_url": "",
  "price_last_checked": "2026-05-02",
  "tokens_per_second": null,
  "tokens_source_url": "",
  "tokens_confidence": "needs_verification",
  "qwen_fit": "good",
  "software_support": "excellent",
  "noise_level": "normal",
  "beginner_pain": "low",
  "hardware_pain": "normal",
  "raw_value_score": null,
  "practical_value_score": null,
  "verdict": "Best used first serious local AI GPU.",
  "notes": "Strong CUDA support and 24GB VRAM make this the default value pick."
}
```

## Import Rules

The import script should:

* Fetch the published Google Sheet CSV
* Parse rows
* Normalize numbers
* Validate with Zod
* Fail on invalid required fields
* Write `src/data/gpus.json`
* Preserve source URLs and confidence labels
* Use semicolon-separated values for list fields such as `strengths`

Bad data should fail loudly.
