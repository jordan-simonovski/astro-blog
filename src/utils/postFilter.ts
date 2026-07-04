import type { CollectionEntry } from "astro:content";

// Drafts are hidden in production but visible when running `npm run dev`.
const postFilter = ({ data }: CollectionEntry<"blog">) =>
  import.meta.env.DEV || !data.draft;

export default postFilter;
