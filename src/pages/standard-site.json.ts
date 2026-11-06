import { getCollection } from "astro:content";
import { SITE, STANDARD_SITE } from "@config";
import getSortedPosts from "@utils/getSortedPosts";
import { documentRkey, postPath, publicationUri } from "@utils/standardSite";

// The Standard.site records this build should have, for scripts/standard-site.mjs to write. All of
// it is already public on the site itself.
export async function GET() {
  const posts = await getSortedPosts(await getCollection("blog"));
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
    documents: posts.map(({ data }) => ({
      rkey: documentRkey(data),
      record: {
        $type: "site.standard.document",
        site: publicationUri,
        path: postPath(data),
        title: data.title,
        description: data.description,
        publishedAt: data.pubDatetime.toISOString(),
        tags: data.tags,
      },
    })),
  });
}
