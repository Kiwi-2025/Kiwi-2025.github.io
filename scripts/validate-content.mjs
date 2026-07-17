import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const contentDir = join(root, "src", "content", "blog");
const seenSlugs = new Map();
const errors = [];

for (const name of await readdir(contentDir)) {
  if (extname(name).toLowerCase() !== ".md") continue;

  const path = join(contentDir, name);
  const source = await readFile(path, "utf8");
  const { data, content } = matter(source);
  const slug = basename(name, extname(name)).toLowerCase();

  if (seenSlugs.has(slug)) {
    errors.push(`${name}: duplicate slug with ${seenSlugs.get(slug)}`);
  }
  seenSlugs.set(slug, name);

  if (!data.title) errors.push(`${name}: title is required`);
  if (!data.date) errors.push(`${name}: date is required`);
  if (!data.draft && !data.description) errors.push(`${name}: published posts require a description`);
  if (/^#\s+/m.test(content)) errors.push(`${name}: body headings must start at H2 because the layout supplies H1`);

  const publishedAt = data.date ? new Date(data.date) : undefined;
  const updatedAt = data.updatedDate ? new Date(data.updatedDate) : undefined;
  if (publishedAt && updatedAt && updatedAt < publishedAt) {
    errors.push(`${name}: updatedDate cannot be earlier than date`);
  }
  if (data.canonicalUrl && !/^https:\/\//i.test(data.canonicalUrl)) {
    errors.push(`${name}: canonicalUrl must be a complete HTTPS URL`);
  }

  if (data.milestones) {
    if (!Array.isArray(data.milestones)) {
      errors.push(`${name}: milestones must be a list`);
    } else {
      let previousDate;
      for (const [index, milestone] of data.milestones.entries()) {
        const milestoneDate = milestone?.date ? new Date(milestone.date) : undefined;
        if (!milestoneDate || Number.isNaN(milestoneDate.valueOf())) {
          errors.push(`${name}: milestone ${index + 1} requires a valid date`);
        }
        if (!milestone?.text?.trim()) {
          errors.push(`${name}: milestone ${index + 1} requires text`);
        }
        if (previousDate && milestoneDate && milestoneDate < previousDate) {
          errors.push(`${name}: milestones must be stored in ascending date order`);
        }
        if (milestoneDate) previousDate = milestoneDate;
      }
    }
  }

  for (const match of content.matchAll(/!\[([^\]]*)\]\((\/images\/[^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
    const [, alt, imagePath] = match;
    if (!alt.trim()) errors.push(`${name}: image ${imagePath} requires meaningful alt text`);

    const localPath = join(root, "public", imagePath.replace(/^\//, ""));
    if (!existsSync(localPath)) {
      errors.push(`${name}: image ${imagePath} does not exist`);
      continue;
    }
    if ((await stat(localPath)).size > 5 * 1024 * 1024) {
      errors.push(`${name}: image ${imagePath} exceeds the 5 MB upload limit`);
    }
  }
}

if (errors.length) {
  console.error(`Content validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`Validated ${seenSlugs.size} post(s).`);
