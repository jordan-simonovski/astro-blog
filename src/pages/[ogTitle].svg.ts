import { getCollection } from "astro:content";
import generateOgImage from "@utils/generateOgImage";
import slugify from "@utils/slugify";
import type { APIRoute } from "astro";

const postImportResult = await getCollection("blog", ({ data }) => !data.draft);
const posts = Object.values(postImportResult);

export function getStaticPaths() {
  return posts
    .filter(({ data }) => !data.ogImage)
    .map(({ data }) => ({
      // Use the slug, not the raw title, so the og:image URL has no spaces,
      // parentheses or emoji — those break unfurlers on Slack/X/LinkedIn.
      params: { ogTitle: slugify(data) },
      props: { title: data.title },
    }));
}

export const GET: APIRoute = async ({ params, props }) => {
  const svg = await generateOgImage(
    props.title as string,
    params.ogTitle as string
  );
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
};
