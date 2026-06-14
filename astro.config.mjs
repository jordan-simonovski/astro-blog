import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
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
    react(),
    // expressiveCode must run before mdx() so it owns code-block rendering.
    expressiveCode({
      themes: ["one-light", "one-dark-pro"],
      // Site toggles `html[data-theme="light|dark"]`; match on theme.type
      // (light/dark) rather than theme name, and don't let the OS media query
      // override the explicit toggle.
      themeCssSelector: theme => `[data-theme="${theme.type}"]`,
      useDarkModeMediaQuery: false,
      styleOverrides: {
        borderRadius: "0.375rem",
        codeFontFamily: "inherit",
      },
    }),
    mdx(),
    sitemap({
      filter: page => (SITE.showArchives ?? true) || !page.endsWith("/archives"),
    }),
    // Must run last so it minifies the final emitted output. Image is left to
    // Astro's own image service (and the satori OG PNGs); re-compressing them
    // here only adds build time.
    compress({ Image: false }),
  ],
  markdown: {
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
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
      // `Comments` is behind `client:visible`, so giscus isn't seen in Vite's
      // initial dep scan. Pre-bundle it (and React) so Vite doesn't re-optimize
      // at runtime, which would invalidate the dev-toolbar entrypoint and throw
      // NS_ERROR_CORRUPTED_CONTENT / 504. See withastro/astro#16766.
      include: ["@giscus/react", "react", "react-dom/client"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
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
