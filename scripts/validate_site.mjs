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
  if (!/<h1[\s>]/.test(html)) failures.push(`${file}: missing static h1 fallback`);

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
if (products.length !== 34) failures.push(`public catalog contains ${products.length} products; expected 34`);
if (technicalDataSheets.length !== 33) failures.push(`resource library contains ${technicalDataSheets.length} Technical Data Sheets; expected 33`);
const requestTechnicalDataSheets = products.flatMap((product) => product.documents)
  .filter((document) => document.type === "TDS" && document.action === "request");
if (requestTechnicalDataSheets.length !== 1 || !products.find((product) => product.id === "frh-46")?.documents.some((document) => document.type === "TDS" && document.action === "request")) failures.push("FRH-46 should be the only request-only Technical Data Sheet");
const safetyDataSheets = products.flatMap((product) => product.documents)
  .filter((document) => document.type === "SDS" && document.sourceHref);
const downloadableSafetyDataSheets = products.flatMap((product) => product.documents)
  .filter((document) => document.type === "SDS" && document.href);
if (safetyDataSheets.length !== 38) failures.push(`product catalog contains ${safetyDataSheets.length} source Safety Data Sheets; expected 38`);
if (downloadableSafetyDataSheets.length) failures.push("Safety Data Sheets must route through request workflow, not direct downloads");
if (files.some((file) => file.includes("/documents/sds/"))) failures.push("Safety Data Sheets are present in the published build");
for (const document of safetyDataSheets) {
  try {
    await access(resolve(projectRoot, document.sourceHref));
  } catch {
    failures.push(`missing private SDS source ${document.sourceHref}`);
  }
}
for (const product of products) {
  const documentTypes = new Set(product.documents.map((document) => document.type));
  if (!documentTypes.has("TDS") || !documentTypes.has("SDS")) failures.push(`${product.slug}: missing TDS or SDS workflow`);
  if (product.uses?.length !== 3 || product.uses.some((use) => /pending|placeholder/i.test(use))) failures.push(`${product.slug}: incomplete Application Fit copy`);
  if (!product.image) failures.push(`${product.slug}: missing product image`);
}

const packageSkus = products.flatMap((product) => product.packageSkus);
if (packageSkus.length !== 68) failures.push(`product catalog contains ${packageSkus.length} package SKUs; expected 68`);
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
