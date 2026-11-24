---
version: 1
slug: "src-layouts-postdetails-astro"
primary_target: "src/layouts/PostDetails.astro"
related_targets: ["src/pages/index.astro", "src/layouts/Main.astro"]
---

# Surface brief: blog (post page, shelf, index pages)

Mode: Read. Readers arrive cold from social onto one long post; the post page is the primary surface, the homepage shelf the secondary.

## Direction contract

THESIS: Every post is a numbered title in a colour-coded paperback series (Observability, Leadership, Lab); the homepage is the shelf. Refuses the template dev-blog column with a floating blurred nav card and icon-decorated meta.

OWN-WORLD: Flat printed bands, no shadow/blur/gradient. Series inks blue #1D5FB4, plum #6B3FA0, green #1F7A4D, house ink band for non-series pages; one cool tonal ramp for every neutral and chart grey in both themes. Cabin for masthead, titles, UI; Libre Baskerville for running text; JetBrains Mono for code only. Series colour always travels with series name and number. State is a printed mark (notch/rule), not a hue alone.

STORY: The reader knows within a glance which series they're in, what the post claims (one-sentence deck), how long it is, and where the next title in the series is.

FIRST VIEWPORT: Full-bleed series band (wordmark left, series nav right). White title band on a two-column grid: left margin holds series name and a large number; right holds the h1 (~52px desktop) and italic deck, then date and reading time. An 8px series rule closes it. Below, contents sticky in the left margin and an 18px serif column at ~65 characters on one shared left axis.

FORM: Paperback series (mid-century nonfiction paperback grid, colour-coded series), candidate 6 of 7. seed:fa4f15fb93c4b473

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Constraints

- Keep: light/dark toggle, JordanSimonov.ski wordmark, TOC (desktop + mobile), QuoteShare, Lightbox, giscus, inline themeable SVG charts (legacy --color-* vars stay mapped).
- Feels wrong: vendor/SaaS, hacker cosplay, template-generic.
- No Penguin/Pelican name, logo or bird: the grid tradition only.

## Unresolved

- Series assignment for the 13 posts is a default; author can re-file via the `series` frontmatter field.
- OG images (satori) still use the old look.
