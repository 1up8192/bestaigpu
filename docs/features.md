# MVP Features

## Goal

bestaigpu.com helps first-time local LLM users choose the best value GPU for running practical local AI models.

The MVP focuses on one clear use case:

> Which GPU should I buy if I want to run useful local LLMs without wasting money?

The site is not a gaming benchmark site. It is not a full PC part picker. It is an opinionated local AI GPU buying guide.

## Target User

The first version targets:

- First-time local LLM builders
- Developers who want local coding models
- AI hobbyists moving beyond cloud-only tools
- People considering used GPUs
- People confused by VRAM, CUDA, ROCm, quantization, and model fit

The MVP should assume the user is smart but not yet deeply familiar with local inference hardware.

## Core Page

The MVP has one main public page:

- Landing headline
- Short positioning copy
- Main sortable GPU table
- Filters
- Methodology summary
- Caveats
- Planned updates

The table is the product. It should appear near the top of the page.

## Hero Model

The MVP uses one hero model for scoring:

- Qwen3.6-27B

This keeps the first version simple and avoids model-choice overload.

Other models may be mentioned as context, but they are not part of the first scoring system.

## GPU Table

Initial table size:

- Around 10–12 GPUs

Initial candidate rows:

- RTX 3060 12GB
- RTX 4060 Ti 16GB
- RTX 4080 / 5080 16GB
- RTX 3090 24GB
- RTX 4090 24GB
- RTX 5090 32GB
- RX 7900 XTX 24GB
- Intel Arc Pro B60 24GB
- Intel Arc Pro B70 32GB
- RTX 6000 Ada 48GB
- Tesla P40 24GB
- A100 40GB

The table should include good options, premium options, experimental options, and bad-on-paper beginner traps.

## Visible Table Columns

The default desktop table should show:

- GPU
- VRAM
- Price
- Tokens/s
- Tokens/s per $100
- Qwen3.6-27B fit
- Power usage
- Memory bandwidth
- Software support
- Noise level
- Beginner pain
- Verdict

Expanded row details should show:

- Subjective strengths
- Software headaches
- Hardware headaches
- Source links
- Confidence label
- Notes

## Mobile Table

Mobile should show fewer columns:

- GPU
- Price
- VRAM
- Tokens/s
- Value
- Verdict

Extra information should be available in an expanded row or detail drawer.

## Filters

MVP filters:

- All / beginner-safe only / tinker cards
- New only / new or used
- AI only / gaming too
- Price bracket
- VRAM amount

Price brackets:

- Under $300
- Under $500
- Under $800
- Under $1200
- Premium

VRAM filters:

- 12GB
- 16GB
- 24GB
- 32GB
- 40GB+
- 48GB+

## Default Sort

Default sort should be:

- Practical Value Score

Raw tokens/s per dollar should be visible, but it should not be the only ranking metric.

Cheap but painful cards should not automatically win.

## Practical Value Score

The MVP score is based on:

```txt
raw_value = tokens_per_second / price

practical_value =
  raw_value
  × model_fit_multiplier
  × software_support_multiplier
  × noise_multiplier
  × hardware_pain_multiplier