import type { CollectionEntry } from "astro:content";
import { STANDARD_SITE } from "@config";
import slugify from "@utils/slugify";

// Standard.site: the blog as records in the author's own atproto (Bluesky) account, so open-network
// readers can find and follow it. The pages link to those records; scripts/standard-site.mjs writes
// them. Record keys are derived, not stored, so every build links to the same records.

const ALPHABET = "234567abcdefghijklmnopqrstuvwxyz";

/** A record key in atproto's TID format: microseconds since 1970 plus a 10-bit clock id from `seed`. */
export function tid(at: Date, seed: string): string {
  let clock = 0;
  for (const c of seed) clock = (clock * 31 + c.charCodeAt(0)) % 1024;
  let n = ((BigInt(at.getTime()) * 1000n) << 10n) | BigInt(clock);
  let out = "";
  for (let i = 0; i < 13; i++) {
    out = ALPHABET[Number(n & 31n)] + out;
    n >>= 5n;
  }
  return out;
}

export const publicationUri = `at://${STANDARD_SITE.did}/site.standard.publication/${STANDARD_SITE.publicationRkey}`;

/** Where a post lives on the site, as its document record names it. */
export const postPath = (data: CollectionEntry<"blog">["data"]) =>
  `/posts/${slugify(data)}/`;

export const documentRkey = (data: CollectionEntry<"blog">["data"]) =>
  tid(data.pubDatetime, slugify(data));

export const documentUri = (data: CollectionEntry<"blog">["data"]) =>
  `at://${STANDARD_SITE.did}/site.standard.document/${documentRkey(data)}`;
