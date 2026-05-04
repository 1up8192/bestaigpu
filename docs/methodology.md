# Methodology

## Goal

Rank GPUs by practical value for local LLM inference, not gaming performance.

The MVP uses one hero model:

- Qwen3.6-27B

This keeps comparisons simple and useful for first-time local AI builders.

## Main Score

Default ranking uses Practical Value Score.

```txt
raw_value = tokens_per_second / price

practical_value =
  raw_value
  × model_fit_multiplier
  × software_support_multiplier
  × noise_multiplier
  × hardware_pain_multiplier
```

Raw tokens/s per dollar is shown separately for transparency.

## Why Not Pure Tokens/s per Dollar?

Pure value scoring can over-rank bad beginner cards.

Examples:

* Cheap server GPUs
* Loud blower cards
* Old CUDA cards
* Cards needing cooling mods
* Cards with weak software support

The Practical Value Score includes setup pain, software maturity, thermals, and model fit.

## Model Fit

Model fit describes how comfortably the GPU can run the hero model.

Labels:

* Excellent
* Good
* Tight
* Barely
* No

Fit considers:

* VRAM
* Quantization
* Context length
* Backend support
* Practical usability

## Confidence Labels

Every benchmark or estimate should have one confidence label.

* `measured`: benchmarked directly by us
* `community_sourced`: found from public user reports
* `estimated`: inferred from similar cards or partial data
* `spec_derived`: based mostly on specs
* `needs_verification`: weak or incomplete data

MVP data will mostly be `community_sourced` or `estimated`.

## Benchmark Caveats

Local LLM performance depends on:

* Model
* Quantization
* Backend
* Drivers
* Operating system
* Context length
* Prompt length
* Batch size
* GPU power limits
* CPU/RAM bottlenecks

Numbers are practical buying estimates, not lab-grade universal truth.

## Price Caveats

Prices can change quickly.

For MVP, prices are manually maintained in Google Sheets and imported into static JSON.

Each row should include:

* New price
* Used price
* Price source
* Last checked date

## Trust Rules

The site should clearly show:

* Source links
* Last updated date
* Confidence labels
* Simple scoring formula
* Clear caveats

If data is uncertain, mark it as uncertain.