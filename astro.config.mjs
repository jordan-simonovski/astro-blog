import { defineConfig, envField, fontProviders } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";
import { SITE } from "./src/config";

import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    // expressiveCode must run before mdx() so it owns code-block rendering.
    expressiveCode({
      themes: ["one-light", "one-dark-pro"],
      // Site toggles `html[data-theme="light|dark"]`; match on theme.type
      // (light/dark) rather than theme name, and don't let the OS media query
      // override the explicit toggle.
      themeCssSelector: theme => `[data-theme="${theme.type}"]`,
      useDarkModeMediaQuery: false,
      styleOverrides: {
        borderRadius: "0.125rem",
        codeFontFamily: "inherit",
        frames: { frameBoxShadowCssValue: "none" },
      },
    }),
    mdx(),
    sitemap({
      filter: page =>
        (SITE.showArchives ?? true) || !page.endsWith("/archives"),
    }),
    // Must run last so it minifies the final emitted output. Image is left to
    // Astro's own image service (and the satori OG PNGs); re-compressing them
    // here only adds build time.
    compress({ Image: false }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        remarkReadingTime,
        [
          remarkCollapse,
          {
            test: "Table of contents",
          },
        ],
      ],
    }),
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  // Self-hosted, preloaded, with auto-generated fallback metrics. Replaces the
  // hand-rolled Google Fonts <link> in Layout.astro (no extra DNS/connect, no
  // FOUT). OG image generation fetches its own font and is unaffected.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Cabin",
      cssVariable: "--font-ui",
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Libre Baskerville",
      cssVariable: "--font-content",
      weights: [400, 700],
      styles: ["normal", "italic"],
      fallbacks: ["Georgia", "serif"],
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-mono",
      weights: [400, 600],
      styles: ["normal"],
      fallbacks: ["monospace"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
});
