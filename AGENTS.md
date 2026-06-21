# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single product: a static blog built with **Astro** (AstroPaper theme),
using React, TailwindCSS, and TypeScript. There is no backend or database.

Standard commands live in `package.json` (`scripts`) and the README "Commands" table.
Notes that are non-obvious:

- **Node `>=22.12.0`** is required (see `package.json` `engines`).
- **Dev server runs on `http://localhost:4321/`**, not `localhost:3000` as the README
  claims. The README port is stale for this Astro version.
- `npm run dev` launches `astro check --watch & astro dev` (a type-check watcher plus the
  dev server). Use `npm run start` if you want only the dev server without the watcher.
- **`npm run lint` is a no-op** (`echo "lint disabled"`). Type checking is done via
  `npm run check` (which runs `astro check`). Use that as the real static-analysis gate.
- `npm run format:check` currently reports pre-existing Prettier style issues across many
  files. This is the repo's committed state, not an environment problem; do not mass-format
  unless asked.
- Blog posts are markdown in `src/content/blog/`. A post's URL slug is derived from its
  `title` frontmatter, not its filename (e.g. title "Cursor Cloud Environment Check" ->
  `/posts/cursor-cloud-environment-check/`). Content hot-reloads in the dev server.
- `npm run build` runs `astro check && astro build` and outputs static files to `dist/`.
