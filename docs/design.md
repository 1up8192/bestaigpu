---
version: alpha
name: BEST AI GPU
description: A terminal-inspired GPU comparison interface for local AI hardware
  decisions. The site uses a dark command-line canvas, monospace typography,
  ASCII identity art, and grid-heavy data tables with restrained syntax-like
  color accents.
colors:
  canvas: "#17181e"
  panel: "#1d1f27"
  text: "#aaaaaa"
  text-bright: "#e0e0e0"
  text-dim: "#666666"
  line: "#2a2a2a"
  link: "#7ab4cc"
  accent: "#c8885a"
  green: "#5aaa7a"
  yellow: "#c8a85a"
  logo-hi: "#ff6a00"
  logo-mid: "#f5920a"
  logo-lo: "#f7c948"
  logo-fade: "#ffe680"
typography:
  body:
    fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  label:
    fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.55
    letterSpacing: 2px
  ascii-logo:
    fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace"
    fontSize: "min(14px, calc((100vw - 3rem) / 46))"
    mobileFontSize: "min(14px, calc((100vw - 1.5rem) / 46))"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: 0
layout:
  max-width: 1600px
  page-x: 24px
  page-top: 32px
  page-bottom: 64px
  mobile-page-x: 12px
  table-min-width: 1380px
rounded:
  none: 0px
components:
  ascii-logo:
    typography: "{typography.ascii-logo}"
    gradient: "{colors.logo-hi} to {colors.logo-fade}"
  data-table:
    minWidth: "{layout.table-min-width}"
    borderColor: "{colors.line}"
    verticalLines: true
  filter-controls:
    borderColor: "{colors.line}"
    activeColor: "{colors.green}"
  badges:
    style: "bracketed text labels"
---

## Overview

BEST AI GPU is a compact comparison tool for choosing GPUs for local LLM
inference. The design should feel like a polished terminal data view: direct,
technical, dense, and readable. It is not a marketing landing page and should
not use card-heavy, glossy, or decorative SaaS patterns.

The page has three primary jobs:

- Establish the site identity with a warm ASCII `BEST AI GPU` wordmark.
- Let users scan and sort a wide GPU comparison table.
- Explain scoring in an expandable methodology section.

## Visual Direction

Use a dark CLI canvas, monospace type, plaintext rhythm, and table grid lines.
Hierarchy comes from color, spacing, uppercase labels, weight, and ASCII
structure.

Avoid:

- Rounded cards, shadows, glass effects, and decorative gradients outside the
  ASCII logo.
- Large marketing hero layouts or illustration panels.
- Badge pills that look like product tags. Use bracketed text labels instead.

## Colors

### Surface & Text

- **Canvas** (`#17181e`): Full page background and table base.
- **Panel** (`#1d1f27`): Header bands, hover rows, and expanded table detail
  surfaces.
- **Text** (`#aaaaaa`): Default body and table copy.
- **Text Bright** (`#e0e0e0`): Page title, GPU names, emphasized values.
- **Text Dim** (`#666666`): Metadata, secondary labels, sort icons.
- **Line** (`#2a2a2a`): Table grid, separators, footer/methodology rules.

### Accent Roles

- **Link** (`#7ab4cc`): External source links and navigational links.
- **Accent** (`#c8885a`): Section labels, table headers, control group labels.
- **Green** (`#5aaa7a`): Prompt markers, active filters, positive statuses.
- **Yellow** (`#c8a85a`): Value scores and highlighted numeric multipliers.

### Logo

The ASCII logo uses a warm orange-to-yellow gradient from `#ff6a00` through
`#f5920a` and `#f7c948` to `#ffe680`. It may have a subtle warm glow. This is
the only gradient treatment in the interface.

### Theme Mode

The interface supports dark and light modes through CSS custom properties.
Dark mode is the default. The user-facing switch stores the selected mode in
`localStorage` and applies it with `data-theme` on the root element. Light mode
keeps the terminal structure, grid, monospace typography, and accent semantics,
but swaps the canvas to a warm paper tone with darker text.

## Typography

Use JetBrains Mono everywhere. Body text is 16px with 1.55 line-height and zero
letter spacing. At widths below 600px, body text drops to 14px.

Labels use uppercase 14px monospace, weight 600, and 2px tracking. Keep labels
small and precise; do not scale them into hero typography.

The ASCII logo is rendered in a `pre` block with whitespace preserved,
line-height `1.02`, and responsive sizing. All breakpoints use the same
two-block stacked `BEST` / `AI GPU` wordmark.

- Default: `min(14px, calc((100vw - 3rem) / 46))`
- Mobile: `min(14px, calc((100vw - 1.5rem) / 46))`

## Layout

The content is centered and can expand to `1600px` on wide displays. Use 24px
horizontal padding on desktop, 12px on small screens, 32px top padding, and 64px
bottom padding.

The intro copy remains constrained to roughly `78ch` for readability, while the
GPU table is allowed to use the wider container.

## Components

### ASCII Logo

Render the `BEST AI GPU` block logo as preformatted text. Preserve whitespace
exactly. Use one logo variant at every breakpoint and scale it to fit the
available width. Clip overflow rather than wrapping the logo.

### Filter Controls

Filters are compact border buttons on the dark canvas. Active filters use the
green accent and no filled pill background. The filter panel opens inline above
the table and uses simple border separators.

### Theme Switch

The theme switch is a compact bordered control with moon/sun icons and a small
sliding indicator. It should remain utility-like, not a prominent navigation
item.

### Data Table

The GPU comparison table is the main interface surface.

- Minimum width is `1380px`; horizontal scrolling is acceptable on narrow
  screens.
- Use a full outer border, horizontal row lines, and vertical column lines.
- Header cells use the panel surface and accent text.
- Rows hover with the panel color.
- Sort controls stay inline in each header cell.
- Top and bottom ASCII guide lines may frame the table for terminal rhythm.

### Expanded Row Details

Expanded rows use the panel surface. Detail lists use green `>` markers with a
`2ch` indent. Source links use the link color. The metadata column is separated
with a line, not a card.

### Badges

Status labels are bracketed inline text such as `[excellent]`, `[medium]`, and
`[painful]`. Color communicates meaning, but shape remains text-native.

### Methodology

Methodology is an expandable `details` section below the table. It uses the same
line, label, and monospace conventions as the rest of the page. Formula blocks
are bordered plaintext, not cards.

### Footer

The footer is a simple bordered text row with site name, caveat copy, links, and
last updated date. It shares the `1600px` content width.

## Responsive Behavior

Keep a single-column document flow at every viewport size. The table scrolls
horizontally when needed; do not collapse it into cards. Hide lower-priority
columns at medium breakpoints where already implemented, but preserve sortable
table behavior.

At widths below 600px:

- Body text is 14px.
- Horizontal page padding is 12px.
- Logo scales with the mobile formula above.

## Current Gaps

- There is no standalone design system for forms, modals, or navigation.
- Print styling is not defined.
- No motion language is defined beyond hover states and the static logo glow.
