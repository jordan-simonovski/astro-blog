import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default defineConfig(
  { ignores: ["dist/", ".astro/", "node_modules/", "public/"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,

  // Register jsx-a11y once, then apply its recommended rules to both Astro
  // templates and React components. Catches alt text, ARIA, labels, roles, etc.
  // Contrast is computed-style-only and is covered by the rendered axe audit.
  { plugins: { "jsx-a11y": jsxA11y } },
  {
    files: ["**/*.astro", "**/*.{jsx,tsx}"],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // Autofocus is deliberate on the dedicated /search page. This rule is a
      // best-practice opinion, not a WCAG failure; keep it off project-wide.
      "jsx-a11y/no-autofocus": "off",
    },
  },

  // Astro frontmatter is TypeScript; the compiler (`astro check`) resolves
  // globals like ImageMetadata. core no-undef only produces false positives here,
  // mirroring how typescript-eslint disables it for .ts/.tsx.
  {
    files: ["**/*.astro"],
    rules: { "no-undef": "off" },
  },

  // React components.
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // Generated declaration files legitimately use triple-slash references.
  {
    files: ["**/*.d.ts"],
    rules: { "@typescript-eslint/triple-slash-reference": "off" },
  },

  // Config files are CommonJS / Node scripts, not browser code.
  {
    files: ["*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    files: ["**/*.mjs", "*.config.*"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Prettier owns formatting; turn off any rules that fight it. Keep last.
  prettier
);
