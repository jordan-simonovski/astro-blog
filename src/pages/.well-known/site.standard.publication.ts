import { publicationUri } from "@utils/standardSite";

// Confirms the blog's Standard.site publication record belongs to this site: readers check that this
// answers with the same at:// address the record and the pages name.
export const GET = () =>
  new Response(publicationUri, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
