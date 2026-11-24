import generateOgImage from "@utils/generateOgImage";
import { SITE } from "@config";
import type { APIRoute } from "astro";

// The site-wide social card (SITE.ogImage, /og.png), built with the same
// generator as the per-post cards so the two never drift apart.
export const GET: APIRoute = async () => {
  const svg = await generateOgImage("og", {
    // The band already carries the wordmark; the sheet carries the homepage title.
    title: "Jordan's Blog",
    subtitle: SITE.desc,
  });
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
};
