import { getCollection } from "astro:content";
import { SITE, STANDARD_SITE } from "@config";
import getSortedPosts from "@utils/getSortedPosts";
import { documentRkey, postPath, publicationUri } from "@utils/standardSite";

// The Standard.site records this site should have, for scripts/standard-site.mjs to write once the
// deploy is live. All of it is already public on the site itself.
export async function GET() {
  const posts = await getSortedPosts(await getCollection("blog"));
  // Two posts on one key or one page would publish records that can never both verify.
  for (const key of [
    documentRkey,
    (p: (typeof posts)[number]) => postPath(p.data),
  ]) {
    const seen = new Set<string>();
    for (const post of posts) {
      const k = key(post);
      if (seen.has(k))
        throw new Error(
          `Two posts share the Standard.site record or page ${k} (${post.id})`
        );
      seen.add(k);
    }
  }
  return Response.json({
    did: STANDARD_SITE.did,
    publication: {
      rkey: STANDARD_SITE.publicationRkey,
      record: {
        $type: "site.standard.publication",
        url: SITE.website.replace(/\/$/, ""),
        name: SITE.title,
        description: SITE.desc,
      },
    },
    documents: posts.map(post => ({
      rkey: documentRkey(post),
      record: {
        $type: "site.standard.document",
        site: publicationUri,
        path: postPath(post.data),
        title: post.data.title,
        description: post.data.description,
        publishedAt: post.data.pubDatetime.toISOString(),
        tags: post.data.tags,
      },
    })),
  });
}
