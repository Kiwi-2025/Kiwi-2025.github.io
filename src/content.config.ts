import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blogSchema = z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
    series: z.string().optional(),
    canonicalUrl: z.string().url().refine((value) => value.startsWith("https://"), {
      message: "canonicalUrl must use HTTPS"
    }).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    milestones: z.array(z.object({
      date: z.coerce.date(),
      text: z.string()
    })).optional()
  }).superRefine((data, context) => {
    if (data.updatedDate && data.updatedDate < data.date) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["updatedDate"],
        message: "updatedDate cannot be earlier than date"
      });
    }

    for (let index = 1; index < (data.milestones?.length ?? 0); index += 1) {
      if (data.milestones![index].date < data.milestones![index - 1].date) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["milestones", index, "date"],
          message: "milestones must be stored in ascending date order"
        });
      }
    }
  });

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: blogSchema
});

export const collections = { blog };
