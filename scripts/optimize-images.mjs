import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { extname, join, parse } from "node:path";
import sharp from "sharp";

const imageDir = join(process.cwd(), "public", "images");
const cacheDir = join(process.cwd(), ".cache");
const supported = new Set([".jpg", ".jpeg", ".png"]);
const manifest = {};

await mkdir(cacheDir, { recursive: true });

for (const name of await readdir(imageDir)) {
  const extension = extname(name).toLowerCase();
  if (!supported.has(extension) || name.includes(".optimized.")) continue;

  const input = join(imageDir, name);
  const outputName = `${parse(name).name}.optimized.webp`;
  const output = join(imageDir, outputName);
  const inputStats = await stat(input);

  let shouldWrite = true;
  try {
    shouldWrite = (await stat(output)).mtimeMs < inputStats.mtimeMs;
  } catch {
    // The optimized derivative does not exist yet.
  }

  let info;
  if (shouldWrite) {
    info = await sharp(input)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(output);
  } else {
    info = await sharp(output).metadata();
  }

  manifest[`/images/${name}`] = {
    src: `/images/${outputName}`,
    width: info.width,
    height: info.height
  };
}

await writeFile(join(cacheDir, "image-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Prepared ${Object.keys(manifest).length} optimized image(s).`);
