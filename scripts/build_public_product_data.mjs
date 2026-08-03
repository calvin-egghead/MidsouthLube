import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const archiveRoot = resolve(projectRoot, "old-site-archive/raw");
const outputRoot = resolve(projectRoot, "src/data/generated");

const readJson = async (filename) => JSON.parse(
  await readFile(resolve(archiveRoot, filename), "utf8"),
);

const products = (await readJson("products-store.json")).map((product) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  short_description: product.short_description,
  description: product.description,
  images: product.images.map(({ src }) => ({ src })),
  categories: product.categories.map(({ name }) => ({ name })),
  tags: product.tags.map(({ name }) => ({ name })),
  attributes: product.attributes.map((attribute) => ({
    has_variations: attribute.has_variations,
    terms: attribute.terms.map(({ name }) => ({ name })),
  })),
  variations: product.variations.map((variation) => ({
    id: variation.id,
    attributes: variation.attributes.map(({ value }) => ({ value })),
  })),
  is_purchasable: product.is_purchasable,
  is_in_stock: product.is_in_stock,
}));

const variations = (await readJson("product-variations.json")).map((variation) => ({
  id: variation.id,
  sku: variation.sku,
  variation: variation.variation,
  is_purchasable: variation.is_purchasable,
  is_in_stock: variation.is_in_stock,
}));

await mkdir(outputRoot, { recursive: true });

await Promise.all([
  writeFile(resolve(outputRoot, "products.json"), `${JSON.stringify(products, null, 2)}\n`),
  writeFile(resolve(outputRoot, "variations.json"), `${JSON.stringify(variations, null, 2)}\n`),
]);
