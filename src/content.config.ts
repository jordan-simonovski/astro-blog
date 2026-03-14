import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

import { blogSchema } from "./content/_schemas";

export const BLOG_PATH = "src/content/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: blogSchema,
});

export const collections = { blog };
