
# Future Plans

## Direction

bestaigpu.com should grow from a static MVP table into a practical buying assistant for local AI hardware.

The long-term goal is to help users answer:

> What should I buy for my local AI needs, at today’s prices, with the least regret?

## Phase 1: Post-MVP Polish

Add after the first public MVP is useful.

### GPU Detail Pages

Create one page per GPU.

Each page should include:

- Current new price
- Current used price
- VRAM
- Power usage
- Memory bandwidth
- Qwen3.6-27B fit
- Tokens/s estimates
- Beginner verdict
- Software headaches
- Hardware headaches
- Buying notes

Example pages:

- `/gpu/rtx-3090`
- `/gpu/rtx-4090`
- `/gpu/arc-pro-b70`
- `/gpu/rx-7900-xtx`

### Comparison Pages

Create SEO-friendly comparison pages.

Initial examples:

- RTX 3090 vs RTX 4090 for local AI
- RTX 3090 vs RTX 5090 for local AI
- RTX 3090 vs Arc Pro B70
- RTX 3090 vs RX 7900 XTX
- Tesla P40 vs RTX 3090
- RTX 4080 16GB vs RTX 3090

These pages should be short, opinionated, and practical.

## Phase 2: Better Data

Improve data freshness and trust.

### Price Automation

Automate price collection from:

- Amazon
- eBay
- Newegg
- B&H
- European retailers
- Local marketplaces where possible

Track:

- New price
- Used price
- Lowest realistic price
- Suspicious price
- Last checked date

### Price History

Add price history charts.

Useful views:

- 30 days
- 90 days
- 1 year
- Since release

This unlocks “wait or buy now” advice.

### Source Tracking

Improve source transparency.

Each row should track:

- Benchmark source
- Price source
- Spec source
- Last verified date
- Confidence level

## Phase 3: More Models

Expand beyond one hero model.

Possible model categories:

- General local model
- Coding model
- Fast small model
- Long-context model
- Multimodal model

Candidate models:

- Qwen3.6-27B
- Qwen3.6-35B-A3B
- Qwen3-Coder-Next
- Gemma 4 31B
- Mistral Small 3.2 24B
- Other strong local models as they emerge

The UI should avoid overwhelming beginners.

A good structure:

- One primary score
- Secondary model fit badges
- Advanced model matrix hidden by default

## Phase 4: AI GPU Recommender

Add an interactive recommender.

The user answers questions like:

- Budget?
- New only or used okay?
- Coding or general chat?
- Gaming too?
- Noise sensitivity?
- Desktop or server build?
- Linux okay?
- Tinkering tolerance?
- Electricity cost concern?
- Need long context?

The recommender outputs:

- Best value pick
- Beginner-safe pick
- Premium pick
- Avoid list
- Reasoning
- Buying links

The recommender should not hallucinate prices or benchmarks. It should use the site’s structured data.

## Phase 5: Full Build Generator

Generate full PC builds around a chosen GPU.

For each GPU, provide three build tiers:

- Cheapest non-bottlenecking
- Balanced midrange
- Premium quiet build

Each build should include:

- CPU
- Motherboard
- RAM
- SSD
- PSU
- Case
- Cooling
- Required cables
- Notes on fit and thermals

This is useful because first-time users often know the GPU they want but not the surrounding parts.

## Phase 6: Multi-GPU and Advanced Builds

Add advanced categories after the beginner path is strong.

Potential sections:

- Dual RTX 3090 builds
- Workstation cards
- Server GPUs
- Used datacenter cards
- External GPU setups
- Threadripper / workstation platforms
- PCIe lane considerations
- NVLink realities
- Power and cooling constraints

This should be clearly marked as advanced.

## Phase 7: Apple Silicon and Non-GPU Options

Add non-traditional local AI hardware.

Possible categories:

- Mac Studio
- Mac mini
- MacBook Pro
- Apple unified memory
- NVIDIA DGX Spark-like devices
- Mini AI appliances
- CPU-only options

These should not be mixed blindly into the main GPU ranking.

They need separate scoring because the tradeoffs are different.

## Phase 8: Deals and Alerts

Add deal tracking.

Possible features:

- Best current deals page
- Used GPU alerts
- Regional deal pages
- “Notify me below price” feature
- Telegram / X / RSS deal feed
- Seller reputation notes

Example alerts:

- RTX 3090 under $650
- RTX 4090 under $1500
- Arc Pro B70 under $1000
- RTX 6000 Ada under target price

## Phase 9: Community and Submissions

Allow users to submit data.

Possible submissions:

- Benchmark result
- GPU price
- Build photo
- Noise report
- Compatibility issue
- Driver issue
- Successful setup guide

Submissions should require moderation.

Bad data can destroy trust.

## Phase 10: Monetization

Possible revenue sources:

- Affiliate links
- Used GPU seller partnerships
- Full build affiliate bundles
- Deal pages
- Sponsored listings with clear disclosure
- Premium alerts
- Consulting for local AI workstation builds

Avoid early display ads.

The site should feel useful and trustworthy before aggressive monetization.

## Long-Term Vision

bestaigpu.com can become the local AI hardware equivalent of a value GPU tracker, but tuned for the things gamers’ benchmarks miss:

- VRAM matters more than FPS
- Model fit matters more than raw compute
- Software support matters a lot
- Used cards can be great or awful
- Server cards can be traps
- Noise and power matter
- Context length matters
- Beginner pain matters

The long-term product should help people confidently move from cloud-only AI to owning their own useful local AI setup.