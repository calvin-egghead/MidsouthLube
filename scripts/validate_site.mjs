import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { products, technicalDataSheets } from "../src/data/siteData.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = resolve(projectRoot, "dist");
const failures = [];

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return nested.flat();
};

const files = await walk(distRoot);
const htmlFiles = files.filter((file) => extname(file) === ".html");

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const required of ['name="description"', 'rel="canonical"', 'property="og:title"', 'id="structured-data"']) {
    if (!html.includes(required)) failures.push(`${file}: missing ${required}`);
  }

  const references = [...html.matchAll(/(?:src|href)="(\/(?!\/)[^"?#]+)(?:[?#][^"]*)?"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (reference === "/") continue;
    const target = reference.endsWith("/")
      ? resolve(distRoot, reference.slice(1), "index.html")
      : resolve(distRoot, reference.slice(1));
    try {
      await access(target);
    } catch {
      failures.push(`${file}: missing local target ${reference}`);
    }
  }
}

const sitemap = await readFile(resolve(distRoot, "sitemap.xml"), "utf8");
const indexedRoutes = (sitemap.match(/<loc>/g) || []).length;
const expectedIndexedRoutes = 8 + products.length;
if (indexedRoutes !== expectedIndexedRoutes) failures.push(`sitemap.xml contains ${indexedRoutes} routes; expected ${expectedIndexedRoutes}`);
if (products.length !== 28) failures.push(`public catalog contains ${products.length} products; expected 28`);
if (technicalDataSheets.length !== 6) failures.push(`resource library contains ${technicalDataSheets.length} Technical Data Sheets; expected 6`);
const safetyDataSheets = products.flatMap((product) => product.documents)
  .filter((document) => document.type === "SDS" && document.href);
if (safetyDataSheets.length !== 25) failures.push(`product catalog contains ${safetyDataSheets.length} downloadable Safety Data Sheets; expected 25`);
for (const product of products) {
  const documentTypes = new Set(product.documents.map((document) => document.type));
  if (!documentTypes.has("TDS") || !documentTypes.has("SDS")) failures.push(`${product.slug}: missing TDS or SDS workflow`);
}

const packageSkus = products.flatMap((product) => product.packageSkus);
if (packageSkus.length !== 60) failures.push(`product catalog contains ${packageSkus.length} package SKUs; expected 60`);
if (new Set(packageSkus.map((item) => item.sku)).size !== packageSkus.length) failures.push("package SKU directory contains duplicate SKUs");

const appSource = await readFile(resolve(projectRoot, "src/App.jsx"), "utf8");
if (/[—–]/.test(appSource)) failures.push("src/App.jsx contains a forbidden long dash character");
if (/unreviewed WordPress sample language/i.test(appSource)) failures.push("placeholder legal language is still present");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${htmlFiles.length} HTML files and ${indexedRoutes} sitemap routes.`);
}
