# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Engineers (SREs, platform and backend engineers) who arrive from Bluesky,
Mastodon, LinkedIn or Hacker News on a link to one specific post, and read that
long post in depth. Many land mid-site on a post page, not the homepage.

## Product Purpose

Jordan Simonovski's personal blog. Long-form writing on SRE, observability,
systems, and engineering leadership. Success is a reader finishing a long,
data-heavy post, trusting it, and following along (RSS, Bluesky, Standard.site,
Bridgy Fed).

## Positioning

Hands-on experiments with real data, reported honestly. Posts build real
things (OpenTelemetry on an ESP32 espresso machine, eval harnesses for agentic
RCA, the whole house piped into ClickHouse) and publish the result even when it
proves the author wrong. Leadership and culture essays sit alongside the
technical work with equal weight.

## Operating Context

- Readers come from social links, mostly one post per visit, often on phones.
- Posts are long (13–17 min reads) with charts, traces, dashboards, screenshots
  and code blocks.
- Inline SVG data-viz posts must survive the light/dark toggle (see the blog SVG
  chart pattern).
- Comments via giscus; RSS; open-social-web publishing (Standard.site, Bridgy Fed).

## Capabilities and Constraints

- Astro 6 static site, Tailwind v4, Markdown/MDX in `src/content/blog/`,
  expressive-code for code blocks, satori-generated OG images.
- Current approach is platform-first with near-zero client JS (PR #105). Not
  declared binding, but a strong default.
- Posts must pass the content-editor review before shipping (AGENTS.md).

## Brand Commitments

- The name/wordmark **JordanSimonov.ski** stays.
- A light theme, a dark theme, and a manual toggle stay.
- Current fonts (Literata, IBM Plex Mono) and palette are NOT binding.

## Evidence on Hand

13 published posts, real photos and screenshots in `src/assets/blog/`, themeable
inline SVG charts (`rca-*.svg`). No testimonials, metrics, or audience numbers;
do not invent them.

## Product Principles

1. The post is the product: reading comfort beats chrome.
2. Evidence is the voice: data, charts and traces are first-class content.
3. Honest over polished: the design should feel like a working notebook from a
   practitioner, not a vendor.
4. Every post page must stand alone for a reader arriving cold from social.

## Accessibility & Inclusion

WCAG 2.1 AA in both themes, enforced by `npm run a11y` (axe in Chromium).
