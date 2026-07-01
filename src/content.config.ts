import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = { blog };
