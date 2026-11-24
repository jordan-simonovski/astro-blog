import type { CollectionEntry } from "astro:content";

// The paperback series every post is filed under. Page colour lives in CSS
// (`[data-series]` in base.css); `band` mirrors it for the generated OG cards,
// which can't read CSS. Name and code always travel with the colour.
export const SERIES = {
  observability: { name: "Observability", code: "Obs", band: "#1D5FB4" },
  leadership: { name: "Leadership", code: "Lead", band: "#6B3FA0" },
  lab: { name: "Lab", code: "Lab", band: "#1F7A4D" },
} as const;

export type SeriesKey = keyof typeof SERIES;
export const SERIES_KEYS = Object.keys(SERIES) as SeriesKey[];

type Post = CollectionEntry<"blog">;

const byDateAsc = (a: Post, b: Post) =>
  a.data.pubDatetime.getTime() - b.data.pubDatetime.getTime();

/** Posts in one series, oldest first, so index + 1 is the series number. */
export const postsInSeries = (posts: Post[], series: SeriesKey) =>
  posts.filter(p => p.data.series === series).sort(byDateAsc);

/** "07"-style number of a post within its series. */
export const seriesNumber = (posts: Post[], post: Post) => {
  const index = postsInSeries(posts, post.data.series).findIndex(
    p => p.id === post.id
  );
  return String(index + 1).padStart(2, "0");
};
