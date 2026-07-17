import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const manifestPath = resolve(".cache/image-manifest.json");

function loadManifest() {
  if (!existsSync(manifestPath)) return {};
  try {
    return JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    return {};
  }
}

function visitImages(node, manifest) {
  if (node?.type === "element" && node.tagName === "img") {
    node.properties ??= {};
    node.properties.loading ??= "lazy";
    node.properties.decoding ??= "async";

    const image = manifest[node.properties.src];
    if (image) {
      node.properties.src = image.src;
      node.properties.width = image.width;
      node.properties.height = image.height;
    }
  }

  if (
    node?.type === "element" &&
    Array.isArray(node.properties?.className) &&
    node.properties.className.includes("katex-display")
  ) {
    node.properties.tabIndex ??= 0;
  }

  for (const child of node?.children ?? []) visitImages(child, manifest);
}

export function rehypeOptimizeImages() {
  return (tree) => visitImages(tree, loadManifest());
}
