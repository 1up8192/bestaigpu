# MVP Plan

## Goal

Ship a useful first version of bestaigpu.com that helps first-time local LLM users compare GPU options by practical value.

The MVP should be simple, opinionated, and trustworthy.

## Scope

The MVP includes:

- One public landing page
- One main GPU comparison table
- One hero model for scoring
- Around 10–12 GPU rows
- Practical value score
- Basic filters
- Source and confidence labels
- Short methodology section
- Placeholder buying links
- Basic analytics

The MVP does not include:

- GPU detail pages
- Price history
- AI recommender
- Full PC build generator
- User accounts
- User submissions
- Multi-GPU comparison
- Automated scraping
- Blog system

## Phase 1: Project Foundation

Complexity: Low

Set up the project structure, core docs, basic page layout, and deployment path.

Deliverables:

- Project scaffold
- Root README
- Docs folder
- Basic landing page shell
- Basic deployment working

## Phase 2: Data Model

Complexity: Medium

Define the GPU data format and the minimum fields required for the MVP table.

Deliverables:

- GPU data schema
- Initial data source
- Validation rules
- First sample GPU rows
- Clear confidence labels

## Phase 3: GPU Dataset

Complexity: Medium

Create the first manually curated dataset.

Initial dataset should include:

- Good value cards
- Premium cards
- Budget cards
- Experimental cards
- Used server/workstation cards
- Beginner traps

Deliverables:

- 10–12 GPU rows
- Price estimates
- VRAM and spec data
- Hero model fit labels
- Benchmark estimates or sourced numbers
- Strengths and headache notes

## Phase 4: Main Table

Complexity: Medium

Build the main sortable and filterable comparison table.

Deliverables:

- Desktop table
- Mobile-friendly layout
- Sorting
- Filtering
- Expandable row details
- Practical value display
- Raw value display

## Phase 5: Scoring

Complexity: Medium

Implement a simple practical value score that balances speed, price, model fit, software support, noise, and hardware pain.

Deliverables:

- Raw value score
- Practical value score
- Score labels
- Sorting by practical value
- Explanation of scoring logic

## Phase 6: Trust Layer

Complexity: Low

Add enough transparency to make the site credible when shared publicly.

Deliverables:

- Methodology summary
- Benchmark caveats
- Source links
- Confidence labels
- Last updated date
- Clear uncertainty markers

## Phase 7: Data Update Flow

Complexity: Medium

Set up a simple automated data update path from the editable data source into the static site.

Deliverables:

- Editable source data
- Automated import
- Validation step
- Generated static data file
- Scheduled update workflow
- Manual update trigger

## Phase 8: Landing Page Copy

Complexity: Low

Add concise positioning and practical buying guidance around the table.

Deliverables:

- Hero copy
- Short intro
- Beginner-focused explanation
- Out-of-scope caveats
- Planned updates section
- Placeholder buying CTAs

## Phase 9: Launch Polish

Complexity: Low

Prepare the MVP for sharing.

Deliverables:

- Clean responsive layout
- Basic SEO metadata
- Analytics
- Social preview metadata
- Footer links
- Contact or feedback link
- Final data sanity check

## Launch Criteria

The MVP is ready to share when users can answer:

- Which GPU is best value for local AI?
- Which GPU is best for beginners?
- Which GPUs are traps?
- How much VRAM do I need?
- Why is a used RTX 3090 often recommended?
- What are the tradeoffs between price, speed, VRAM, and pain?

## First Post-MVP Priorities

After launch, prioritize:

1. GPU detail pages
2. GPU comparison pages
3. Better benchmark sources
4. Price history
5. Affiliate link setup
6. AI-powered recommender
7. Full build generator