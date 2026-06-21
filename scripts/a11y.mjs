// Rendered accessibility audit.
//
// Builds are NOT done here; `npm run a11y` runs `astro build` first. This script
// boots `astro preview`, discovers every route from the generated sitemap, and
// runs axe-core (WCAG 2.0/2.1 A + AA, which includes color-contrast) against each
// page in headless Chromium. Exits non-zero if any page has a violation.
//
// Why a real browser: color contrast depends on computed styles. Static linters
// cannot see it. This is the only layer that catches the contrast issues.

import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const PORT = Number(process.env.A11Y_PORT ?? 4321);
const STARTUP_TIMEOUT_MS = 30_000;
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

// Routes that never appear in the sitemap but should still be audited.
const EXTRA_PATHS = ["/this-route-does-not-exist-404-a11y-check"];

function startPreview() {
  const child = spawn("npm", ["run", "preview", "--", "--port", String(PORT)], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  const base = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`preview did not start within ${STARTUP_TIMEOUT_MS}ms`));
    }, STARTUP_TIMEOUT_MS);

    const onData = data => {
      const text = data.toString();
      process.stdout.write(text);
      const match = text.match(/http:\/\/(?:localhost|127\.0\.0\.1):\d+/);
      if (match) {
        clearTimeout(timer);
        resolve(match[0]);
      }
    };

    child.stdout.on("data", onData);
    child.stderr.on("data", d => process.stderr.write(d.toString()));
    child.on("exit", code => {
      clearTimeout(timer);
      reject(new Error(`preview exited early with code ${code}`));
    });
  });

  return { child, base };
}

async function discoverPaths(base) {
  const index = await fetch(`${base}/sitemap-index.xml`);
  if (!index.ok) {
    throw new Error(
      `sitemap-index.xml not found (status ${index.status}); is the sitemap integration enabled?`
    );
  }
  const indexXml = await index.text();
  const sitemapUrls = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    m => m[1]
  );

  const paths = new Set();
  for (const sitemapUrl of sitemapUrls) {
    const path = new URL(sitemapUrl).pathname;
    const res = await fetch(`${base}${path}`);
    const xml = await res.text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      paths.add(new URL(m[1]).pathname);
    }
  }
  for (const p of EXTRA_PATHS) paths.add(p);

  return [...paths].sort();
}

async function auditPage(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .analyze();
  return violations;
}

function reportPage(path, violations) {
  if (violations.length === 0) {
    console.log(`  ok   ${path}`);
    return;
  }
  console.log(`  FAIL ${path}`);
  for (const v of violations) {
    console.log(`       [${v.impact ?? "n/a"}] ${v.id}: ${v.help}`);
    console.log(`             ${v.helpUrl}`);
    for (const node of v.nodes) {
      console.log(`             - ${node.target.join(" ")}`);
    }
  }
}

async function main() {
  const { child, base } = startPreview();
  const baseUrl = await base;
  const browser = await chromium.launch();
  let total = 0;

  try {
    const paths = await discoverPaths(baseUrl);
    console.log(
      `\nAuditing ${paths.length} pages with axe-core (${WCAG_TAGS.join(", ")}):\n`
    );

    const context = await browser.newContext();
    const page = await context.newPage();
    for (const path of paths) {
      const violations = await auditPage(page, `${baseUrl}${path}`);
      reportPage(path, violations);
      total += violations.length;
    }
  } finally {
    await browser.close();
    child.kill("SIGTERM");
  }

  console.log(`\n${total} accessibility violation(s) found.`);
  process.exit(total === 0 ? 0 : 1);
}

main().catch(err => {
  console.error(`\na11y audit failed: ${err.message}`);
  process.exit(1);
});
