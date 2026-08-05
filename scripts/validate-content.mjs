import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const contentDir = join(root, "src", "content", "blog");
const seenSlugs = new Map();
const errors = [];

async function listMarkdown(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listMarkdown(fullPath));
    } else if (extname(entry.name).toLowerCase() === ".md") {
      files.push(fullPath);
    }
  }
  return files;
}

const paths = await listMarkdown(contentDir);

for (const path of paths) {
  const relPath = relative(contentDir, path).replace(/\\/g, "/");
  const source = await readFile(path, "utf8");
  const { data, content } = matter(source);
  const slug = relPath.replace(/\.md$/i, "").replace(/\/index$/i, "").split("/").pop().toLowerCase();

  if (seenSlugs.has(slug)) {
    errors.push(`${relPath}: duplicate slug with ${seenSlugs.get(slug)}`);
  } else {
    seenSlugs.set(slug, relPath);
  }

  if (!data.title) errors.push(`${relPath}: title is required`);
  if (!data.date) errors.push(`${relPath}: date is required`);
  if (/^#\s+/m.test(content)) errors.push(`${relPath}: body headings must start at H2 because the layout supplies H1`);

  const publishedAt = data.date ? new Date(data.date) : undefined;
  const updatedAt = data.updatedDate ? new Date(data.updatedDate) : undefined;
  if (publishedAt && updatedAt && updatedAt < publishedAt) {
    errors.push(`${relPath}: updatedDate cannot be earlier than date`);
  }

  if (data.milestones) {
    if (!Array.isArray(data.milestones)) {
      errors.push(`${relPath}: milestones must be a list`);
    } else {
      let previousDate;
      for (const [index, milestone] of data.milestones.entries()) {
        const milestoneDate = milestone?.date ? new Date(milestone.date) : undefined;
        if (!milestoneDate || Number.isNaN(milestoneDate.valueOf())) {
          errors.push(`${relPath}: milestone ${index + 1} requires a valid date`);
        }
        if (!milestone?.text?.trim()) {
          errors.push(`${relPath}: milestone ${index + 1} requires text`);
        }
        if (previousDate && milestoneDate && milestoneDate < previousDate) {
          errors.push(`${relPath}: milestones must be stored in ascending date order`);
        }
        if (milestoneDate) previousDate = milestoneDate;
      }
    }
  }

  for (const match of content.matchAll(/!\[([^\]]*)\]\((\/images\/[^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
    const [, alt, imagePath] = match;
    if (!alt.trim()) errors.push(`${relPath}: image ${imagePath} requires meaningful alt text`);

    const localPath = join(root, "public", imagePath.replace(/^\//, ""));
    if (!existsSync(localPath)) {
      errors.push(`${relPath}: image ${imagePath} does not exist`);
      continue;
    }
    if ((await stat(localPath)).size > 5 * 1024 * 1024) {
      errors.push(`${relPath}: image ${imagePath} exceeds the 5 MB upload limit`);
    }
  }
}

if (errors.length) {
  console.error(`Content validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`Validated ${seenSlugs.size} post(s).`);
