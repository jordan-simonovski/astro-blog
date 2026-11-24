---
name: JordanSimonov.ski
description: Long-form SRE, observability and leadership writing, filed as numbered titles in colour-coded paperback series.
colors:
  series-observability: "#1D5FB4"
  series-observability-on-dark: "#80B1F0"
  series-leadership: "#6B3FA0"
  series-leadership-on-dark: "#BA9CE4"
  series-lab-band: "#1F7A4D"
  series-lab: "#1B7046"
  series-lab-on-dark: "#70C698"
  house-ink: "#16181D"
  house-ink-dark: "#252A37"
  band-type: "#FFFFFF"
  paper: "#F6F7F9"
  sheet: "#FFFFFF"
  ink: "#16181D"
  ink-muted: "#545A65"
  plate: "#EAECF1"
  plate-deep: "#C9CDD4"
  hairline: "#DDE0E6"
  paper-dark: "#10131A"
  sheet-dark: "#181C25"
  ink-dark: "#E8EAEE"
  ink-muted-dark: "#A4AAB6"
  plate-dark: "#212632"
  plate-deep-dark: "#404757"
  hairline-dark: "#2C3240"
typography:
  display:
    fontFamily: "Cabin, sans-serif"
    fontSize: "clamp(2rem, 1.25rem + 2.6vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Cabin, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Cabin, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  series-number:
    fontFamily: "Cabin, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  body:
    fontFamily: "Libre Baskerville, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.75
  deck:
    fontFamily: "Libre Baskerville, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "Cabin, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Cabin, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    letterSpacing: "0.12em"
  code:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.85em"
    fontWeight: 400
rounded:
  none: "0"
  code: "0.125rem"
spacing:
  gutter: "clamp(1.25rem, 5vw, 4.5rem)"
  frame-max: "76rem"
  margin-column: "12.5rem"
  column-gap: "3rem"
  measure: "38rem"
  wide-column: "46rem"
  band-rule: "0.5rem"
  touch-target: "2.75rem"
components:
  masthead-band:
    backgroundColor: "{colors.series-observability}"
    textColor: "{colors.band-type}"
    height: "4rem"
  masthead-band-house:
    backgroundColor: "{colors.house-ink}"
    textColor: "{colors.band-type}"
  title-band:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    padding: "3rem 0 2.75rem"
  band-rule:
    backgroundColor: "{colors.series-observability}"
    height: "{spacing.band-rule}"
  series-code:
    textColor: "{colors.series-observability}"
    typography: "{typography.meta}"
  shelf-entry:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "1.25rem 0"
  search-input:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.875rem 1rem 0.875rem 2.75rem"
  tag-link:
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    height: "{spacing.touch-target}"
  inline-code:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.code}"
    padding: "0.1em 0.35em"
---

<!-- markdownlint-disable MD025 -- frontmatter keys named "title" are not a page title -->

# Design System: JordanSimonov.ski

## Overview

Creative North Star: **"The Paperback Series"**

Every post is a numbered title in a colour-coded nonfiction paperback series: Observability, Leadership, Lab. The homepage is the shelf, one band of series ink per series. A post opens like a cover: a full-bleed band of series ink carrying the wordmark, then a white title sheet set on a two-column grid. The left margin holds the series name and a large number; the right holds the title, an italic one-sentence deck and the dateline. An 8px rule in the series ink closes the sheet, and the reading column starts below it on the same left edge.

The material is flat print. There are no shadows, blurs or gradients. Depth comes from three things: the white sheet against the cool paper ground, the solid band, and the printed rule. Every neutral comes from one cool tonal ramp, in both themes. Colour carries information: it tells you which series you are in, and it always appears next to the series name or code. State is shown with a printed mark (an underline, a rule that gets longer), never with a change of hue alone.

Density stays calm and bookish. The serif text column holds about 65 characters, and code, figures and tables take the wider column. The margin column carries wayfinding only: series mark, contents, shelf labels.

**Key Characteristics:**

- Full-bleed flat series band, white type, in both themes.
- White title sheet on the frame grid, closed by an 8px series rule.
- Series name, code and number always travel with the series colour.
- One cool neutral ramp; three series inks plus a house ink for pages outside a series.
- Cabin for UI and titles, Libre Baskerville for running text and decks, JetBrains Mono for code only.
- Square corners; the only rounding is 2px on code.

## Colors

One cool neutral ramp sits underneath three saturated series inks. Each ink is tuned twice: a deep version for bands and for text on light grounds, and a lighter version for text and rules on the dark ground.

### Primary

- **Observability Blue** (series-observability): the band, band rule, series code, bullets, link underlines and active-contents mark inside the Observability series. On the dark ground, text and rules switch to **Observability Sky** (series-observability-on-dark). The band stays deep.
- **Leadership Plum** (series-leadership): the same roles for Leadership. On the dark ground: **Leadership Lilac** (series-leadership-on-dark).
- **Lab Green** (series-lab-band for the band, series-lab for text on light grounds): the same roles for Lab. The text ink is a touch deeper than the band so it reads on white. On the dark ground: **Lab Mint** (series-lab-on-dark).
- **House Ink** (house-ink; house-ink-dark in the dark theme): the band on pages outside any series (home, about, tags, search). Outside a series the accent falls back to body ink.

Series inks are scoped with `data-series` on `<html>` or on any element. A nested `data-series` (a shelf group, a shelf entry) re-tints its own subtree, which is how the homepage shows all three inks at once.

### Neutral

- **Paper** (paper / paper-dark): the page ground and the reading area below the title band.
- **Sheet** (sheet / sheet-dark): the raised title band, the search field and the mobile contents running head. It is the only "raised" surface.
- **Ink** (ink / ink-dark): body text, headings and table header rules.
- **Muted Ink** (ink-muted / ink-muted-dark): decks, meta lines, the contents list, visited shelf titles, captions.
- **Plate** (plate / plate-dark): inline code ground and the code-block ground under the prose.
- **Deep Plate** (plate-deep / plate-deep-dark): blockquote rule, resting tag and social underlines, the idle contents mark, the scrollbar thumb, the search field's side borders.
- **Hairline** (hairline / hairline-dark): shelf entry separators, footer top rule, table cell borders.
- **Band Type** (band-type): every bit of text and every icon on a band, plus text selected inside a band-coloured selection, in both themes.

Inline SVG charts read the legacy `--color-text-base` and `--color-fill` triplets directly, so the light/dark toggle repaints their axes and labels. Each chart keeps its own categorical palette (`--s1`…`--s3`) for its data series. Those legacy variable names stay on purpose, and chart categories are not series inks.

### Named Rules

**The Ink Travels With Its Name Rule.** Series colour never appears alone. Wherever an ink marks something, the series name or code ("Obs 07") sits next to it.

**The One Ramp Rule.** Every neutral, chart grey included, comes from the single cool ramp above. Do not introduce a new grey.

**The White-on-Band Rule.** Bands always take white type, in both themes. In the dark theme the house band lifts to house-ink-dark instead of going black, so it stays a band rather than a hole.

## Typography

**Display Font:** Cabin (with sans-serif)
**Body Font:** Libre Baskerville (with Georgia, serif)
**Label/Mono Font:** JetBrains Mono (with monospace), for code only

**Character:** A humanist sans for the cover and the apparatus, against a bookish transitional serif for the reading. It is the split you see in a mid-century nonfiction paperback, between the jacket and the text block.

### Hierarchy

- **Display** (700, clamp 2rem to 3.25rem, 1.06, -0.015em, max 24ch): the post title in the title band. The homepage h1 runs one step larger (up to 3.5rem, -0.02em). Ordinary page titles run one step smaller (up to 2.75rem).
- **Series Number** (700, 3rem, 1, tabular figures): the large number in the margin of a post's title band, in body ink.
- **Headline** (700, 1.625rem, 1.2, -0.01em): prose h2, in Cabin inside the serif column.
- **Title** (700, 1.25rem, 1.3): shelf entry titles. Prose h3 uses the same size at 600.
- **Deck** (Libre Baskerville italic, 1.125rem, 1.6, muted ink, 38rem): the one-sentence claim under every title.
- **Body** (400, 1.125rem from 640px and 1.0625rem below, 1.75): running text, held to a 38rem measure inside a 46rem column.
- **Meta** (Cabin 400, 0.9375rem, muted ink): datelines ("4 July 2026 · 17 min read"), tags, footer. Separators are a middle dot.
- **Label** (Cabin 700, 0.8125 to 0.875rem, 0.12em, uppercase): margin labels only (the series name, "Contents", shelf headings).
- **Code** (JetBrains Mono, 0.85em inline): code, kbd, samp, pre. Never used for labels or numbers.

### Named Rules

**The Three Voices Rule.** Cabin speaks for the cover and the UI, Baskerville speaks for the author, and JetBrains Mono speaks for the machine. Don't cross them. Mono never appears as decoration.

**The Margin Label Rule.** Tracked uppercase lives only in the margin column and the contents running head. It never stacks above a headline in the main column. Where the margin disappears on narrow screens, the label is dropped (kept for screen readers) and the series code moves into the meta line.

## Layout

The frame is one centred container (76rem max, fluid gutter clamp(1.25rem, 5vw, 4.5rem)). From 1024px it becomes a two-column grid: a 12.5rem margin column and a main column with a 3rem gap. Title, deck, prose, figures, footer and shelf entries all share the main column's left edge. The margin column carries the series mark, the sticky contents (top 2rem) and the shelf labels.

Bands span the full width: the masthead (min 4rem), the title band and the 8px band rule. Their contents sit back on the frame grid. The vertical rhythm of the title band is 2.25rem/2rem padding on narrow screens and 3rem/2.75rem on desktop. Below 1024px the margin column collapses. The contents become a sticky full-bleed running head that opens a bottom sheet, and the series appears in the meta line. Below 768px the masthead menu folds into a full-width list inside the band. At 640px and up, prose steps to 18px and the previous/next series navigation splits into two columns. Every interactive target is at least 2.75rem tall.

### Named Rules

**The Shared Axis Rule.** Everything readable starts on the main column's left edge. Nothing in the reading flow is centred except images.

**The Measure Rule.** Running text, headings, quotes and lists hold 38rem. Code, figures and tables may take the full 46rem column.

## Elevation & Depth

The system is flat. There is no box-shadow anywhere, and expressive-code's frame shadow is set to none. Depth is tonal and printed: the white sheet sits on cool paper, solid bands of ink frame the page, and an 8px rule closes each title band. The only translucency belongs to modal overlays: the image lightbox backdrop (black at 92%) and the contents bottom sheet backdrop (black at 50%). The sheet's top edge is an 8px band, not a shadow.

### Named Rules

**The Flat Band Rule.** No shadow, blur or gradient. When a surface needs to stand forward, make it sheet-white or give it a band rule.

**The Printed Mark Rule.** State is a mark, not a hue alone. The current nav item gets a 3px white underline on the band. The section you are reading in the contents gets a rule that grows from 0.625rem by 1px in deep plate to 1.125rem by 3px in series ink. Hovered links thicken their underline.

## Shapes

Corners are square. Bands, sheets, the search field, the band rule and the series navigation are all right-angled. The only rounding is a 2px corner on inline code and expressive-code frames. Lines are the shape vocabulary: 1px hairline separators, 3px marks for state and for the top of the series navigation, 8px band rules for closure, and a 4rem by 3px series-ink rule for the prose hr.

## Components

### Masthead Band

Full-bleed series ink (house ink outside a series), min 4rem tall, with white type and white icons. The wordmark is Cabin 700 at 1.25rem on the left. Navigation is Cabin 500: the three series, About, CV, a search icon and the theme toggle. Hover adds a 3px white underline at 45% opacity. The current page gets a solid 3px white underline. Focus rings on the band are white. Below 768px a menu button opens the nav as a full-width list with 20% white hairlines. The current item there keeps its 3px mark.

### Title Band

A sheet-white panel on the frame grid. On posts, the margin carries the series mark: the series name as a label in series ink, with the large number underneath in ink. The main column holds the display title, the italic deck, and the meta line (series code, then date, then reading time). It is always followed by the 8px band rule.

### Series Code

Cabin 600, tabular figures, no wrapping, in series ink: "Obs 07", "Lead 03", "Lab 01". It appears in shelf entries, the post meta line on narrow screens, and the previous/next series navigation ("Next · Obs 04").

### Shelf Entry

A two-column list row: a 4.25rem code column and the content. It has a 1px hairline top border and 1.25rem vertical padding. The title is Cabin 700 at 1.25rem. Hover turns it series ink with a 2px underline. Visited titles turn muted so the shelf shows what you have read. Below the title sit a Baskerville description (1rem, 1.65, 38rem) and a meta dateline. Each homepage shelf opens with an 8px band rule in its series ink and a margin label with the title count.

### Contents

On desktop, a sticky margin list in muted ink, with a short printed rule before each entry (see the Printed Mark Rule). Depth-3 and depth-4 entries step in by 0.75rem. On narrow screens there is a sticky sheet-white running head: a "Contents" label in series ink, then the current section, truncated. It opens a bottom sheet on paper with an 8px band top edge. The active entry there is series ink with a 2px underline.

### Inputs / Fields

The search field is square and sheet-white. It has a 1px deep-plate border with a 3px ink bottom edge, like a ruled line on a form, and a muted search icon inset on the left. Focus shows a 2px ink outline, offset 2px.

### Links and Tags

Prose links are body ink with a 1.5px series-ink underline, offset 0.2em. On hover they turn series ink and the underline thickens to 3px. Tags and social links are lowercase text links with a 1.5px deep-plate underline that switches to currentColor on hover. They have no pills or chips. The global focus ring is a 2px outline in series ink, offset 3px.

### Series Navigation

It closes each post: a 3px series-ink top rule, a "More in {Series}" heading, and previous/next steps. Each step is a series code line plus a Cabin 600 title, and hovering a step underlines its title in series ink.

## Do's and Don'ts

### Do

- **Do** put the series name or code next to every use of series colour (the Ink Travels With Its Name Rule).
- **Do** close every title band and every shelf with an 8px rule in the band's ink.
- **Do** show state with a printed mark: a 3px underline on the band, or a lengthening rule in the contents.
- **Do** take every neutral from the one cool ramp, and tune any new series ink twice: a deep version for the band and light grounds, a light version for text on dark.
- **Do** keep running text at a 38rem measure in Libre Baskerville, and let code, figures and tables take the 46rem column.
- **Do** put white type on every band, in both themes.
- **Do** keep interactive targets at least 2.75rem tall.

### Don't

- **Don't** add box-shadows, backdrop blur or gradients. Depth is sheet-white, band and rule.
- **Don't** round corners on bands, sheets, fields or panels. The 2px corner belongs to code only.
- **Don't** use series colour by itself to mean something (no unlabeled coloured dots, chips or backgrounds).
- **Don't** set tracked uppercase labels above a headline in the main column. They belong in the margin column.
- **Don't** use JetBrains Mono for labels, numbers or decoration.
- **Don't** reuse a chart's categorical palette as a series ink, or a series ink as a chart category.
