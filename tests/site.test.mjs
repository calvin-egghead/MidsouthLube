import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { catalogCategoryGroups, products, technicalDataSheets } from "../src/data/siteData.js";

const root = resolve(import.meta.dirname, "..");
const siteData = await readFile(resolve(root, "src/data/siteData.js"), "utf8");
const app = await readFile(resolve(root, "src/App.jsx"), "utf8");

test("the public catalog implements the client-approved 28-product taxonomy", () => {
  assert.equal(products.length, 28);
  assert.equal(technicalDataSheets.length, 6);
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length);
  assert.equal(new Set(products.map((product) => product.name)).size, products.length);
  const resourceTds = new Set(technicalDataSheets.map((document) => document.href));
  const catalogTds = products
    .map((product) => product.documents.find((document) => document.type === "TDS")?.href)
    .filter(Boolean);
  assert.ok(catalogTds.every((href) => resourceTds.has(href)));
  const suppliedSds = products.flatMap((product) => product.documents)
    .filter((document) => document.type === "SDS" && document.sourceHref);
  const downloadableSds = products.flatMap((product) => product.documents)
    .filter((document) => document.type === "SDS" && document.href);
  assert.equal(suppliedSds.length, 25);
  assert.equal(downloadableSds.length, 0);
  assert.equal(new Set(suppliedSds.map((document) => document.sourceHref)).size, suppliedSds.length);
});

test("the supplied umbrella catalog includes all package SKUs", () => {
  const packageProducts = products.filter((product) => product.packageSkus.length);
  const packageSkus = packageProducts.flatMap((product) => product.packageSkus);
  assert.equal(packageProducts.length, 15);
  assert.equal(packageSkus.length, 60);
  assert.equal(new Set(packageSkus.map((item) => item.sku)).size, 60);
  assert.ok(packageSkus.some((item) => item.sku === "MSL-6831SFGLTCL-5P"));
  assert.ok(packageSkus.some((item) => item.sku === "MSL-6321UCF10-275T"));
});

test("category filters include the client-supplied product map plus inferred multi-use filters", () => {
  const expected = new Map([
    ["Freezer Lubes", ["MSL-6488LTSSFL", "MSL-6831SFGLTCL"]],
    ["Mineral Oil", ["MSL-2090"]],
    ["Compressor Fluid", ["MSL-2015SCF8", "MSL-6061FGCF6", "MSL-6064", "MSL-6321UCF10"]],
    ["Gear Fluid", ["MSL-2032", "MSL-2082"]],
    ["Refrigeration Oil", ["MSL-NXT 717"]],
    ["Vacuum Pump Lubricant", ["MSL-6243"]],
    ["Thermal Fluid", ["MSL-C3", "MSL-C5", "MSL-C12"]],
    ["Penetrating Lubricant", ["MSL-2066", "MSL-6066"]],
    ["Hydraulic Fluid", ["MSL-2243", "MSL-2244", "MSL-2284SBAWHF", "MSL-2288SFGAWHF", "MSL-2384", "MSL-2584SFRHF", "MSL-4584SFRGHF", "2585-68", "FRH-46"]],
    ["Grease", ["MSL-2087SFGEPACG", "MSL-3045SHTSGG", "Blue Star 9600/40"]],
  ]);

  for (const label of ["All Products", ...expected.keys(), "Food Grade", "High Temperature", "Low Temperature", "Fire Resistant", "Biodegradable"]) {
    assert.ok(catalogCategoryGroups.some((group) => group.label === label), label);
  }
  for (const [category, codes] of expected) {
    const actual = products
      .filter((product) => product.categories.includes(category))
      .map((product) => product.productCodes[0]);
    for (const code of codes) assert.ok(actual.includes(code), `${category}: ${code}`);
  }
  assert.ok(products.some((product) => product.categories.length > 1));
  assert.ok(products.every((product) => product.uses.length >= 3));
});

test("public catalog names are MSL-first and exclude the retired label", () => {
  for (const product of products) {
    assert.ok(product.name.toLowerCase().startsWith(product.productCodes[0].toLowerCase()), product.name);
  }
  assert.doesNotMatch(siteData, /Caldera/i);
  assert.doesNotMatch(app, /Caldera/i);
});

test("quote requests capture package, quote, and purchase-order references", () => {
  for (const field of ["productCode", "packageSize", "sku", "quantity", "quoteNumber", "poNumber"]) {
    assert.match(app, new RegExp(`name=["']${field}["']`));
  }
});

test("catalog exposes document actions without making SDS downloadable", () => {
  assert.match(app, /Download \{document\.type\}/);
  assert.match(app, /Request \{document\.type\}/);
  assert.doesNotMatch(app, /Download SDS/);
  assert.match(app, /product-card__documents/);
});

test("all declared downloadable files exist", async () => {
  const paths = [...`${siteData}\n${app}`.matchAll(/["'`](\/documents\/[^"'`?}]+)["'`]/g)].map((match) => match[1]);
  assert.ok(paths.length >= 8, "expected the SKU directory and supplied labels");
  await Promise.all(paths.map((path) => access(resolve(root, "public", path.slice(1)))));
  await access(resolve(root, "public/images/catalog/mid-south-container-family.webp"));
});

test("legal pages contain substantive content", () => {
  assert.match(app, /Information you provide/);
  assert.match(app, /Safety and compliance/);
  assert.doesNotMatch(app, /unreviewed WordPress sample language/i);
});

test("form delivery remains mailto until the planned Web3Forms migration", () => {
  assert.equal((app.match(/window\.location\.href = `mailto:/g) || []).length, 2);
  assert.doesNotMatch(app, /api\.web3forms\.com/);
});
