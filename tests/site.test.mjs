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
  assert.equal(technicalDataSheets.length, 24);
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length);
  assert.equal(new Set(products.map((product) => product.name)).size, products.length);
  const resourceTds = new Set(technicalDataSheets.map((document) => document.href));
  const catalogTds = products
    .map((product) => product.documents.find((document) => document.type === "TDS")?.href)
    .filter(Boolean);
  assert.deepEqual(new Set(catalogTds), resourceTds);
  const requestTdsCodes = products
    .filter((product) => product.documents.some((document) => document.type === "TDS" && document.action === "request"))
    .map((product) => product.productCodes[0]);
  assert.deepEqual(requestTdsCodes, [
    "MSL-2284SBAWHF",
    "FRH-46",
    "MSL-6061FGCF6",
    "MSL-C12",
  ]);
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
    ["Freezer Lubes", ["MSL-6488", "MSL-6831"]],
    ["Mineral Oil", ["MSL-2090"]],
    ["Compressor Fluid", ["MSL-2015", "MSL-6061FGCF6", "MSL-6064", "MSL-6321"]],
    ["Gear Fluid", ["MSL-2032", "MSL-2082"]],
    ["Refrigeration Oil", ["MSL-NXT 717"]],
    ["Vacuum Pump Lubricant", ["MSL-6243"]],
    ["Thermal Fluid", ["MSL-C3", "MSL-C5", "MSL-C12"]],
    ["Penetrating Lubricant", ["MSL-2066", "MSL-6066"]],
    ["Hydraulic Fluid", ["MSL-2243", "MSL-2244", "MSL-2284SBAWHF", "MSL-2288", "MSL-2384", "MSL-2584", "MSL-4584", "MSL-2585", "FRH-46"]],
    ["Grease", ["MSL-2087", "MSL-3045", "BLUE STAR XH 9650/460-1.5"]],
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

test("downloadable TDS identities match the codes and headings inside the supplied sheets", () => {
  const identities = [
    ["msl-c3", "MSL-C3", "Food-Grade Heat Transfer Fluid", "MSL-C3"],
    ["msl-c5", "MSL-C5", "High-Flash Food-Grade Heat Transfer Fluid", "MSL-C5"],
    ["msl-nxt-717", "MSL-NXT 717", "Premium Ammonia Refrigeration Compressor Oil", "MSL-NXT-717"],
    ["msl-2015", "MSL-2015", "Synthetic 8000 Hour Compressor Fluid", "MSL-2015"],
    ["msl-2032", "MSL-2032", "Synthetic EP Gear Fluid", "MSL-2032"],
    ["msl-2082", "MSL-2082", "Synthetic Food Grade Gear Fluid", "MSL-2082"],
    ["msl-2087", "MSL-2087", "Synthetic Food Grade EP Aluminum Complex Grease", "MSL-2087"],
    ["msl-2090", "MSL-2090", "Base Oil", "MSL-2090"],
    ["msl-2066", "MSL-2066", "Synthetic Penetrating Lubricant", "MSL-2066"],
    ["msl-2243", "MSL-2243", "Mineral Oil AW Hydraulic Fluid", "MSL-2243"],
    ["msl-2244", "MSL-2244", "Semi-Synthetic AW Hydraulic Fluid", "MSL-2244"],
    ["msl-2288", "MSL-2288", "Synthetic Food Grade AW Hydraulic Fluid", "MSL-2288"],
    ["msl-2384", "MSL-2384", "Synthetic Multi-Viscosity AW Hydraulic Fluid", "MSL-2384"],
    ["msl-2584", "MSL-2584", "Synthetic Fire-Resistant Hydraulic Fluid", "MSL-2584"],
    ["msl-4584", "MSL-4584", "Synthetic Fire-Resistant Food Grade Hydraulic Fluid", "MSL-4584"],
    ["dubois-2585-68", "MSL-2585", "FM Approved Fire Resistant EAL Hydraulic Fluid", "MSL-2585"],
    ["msl-3045", "MSL-3045", "Synthetic High Temp Silica Gel Grease", "MSL-3045"],
    ["blue-star-9600-40", "BLUE STAR XH 9650/460-1.5", "", "Blue-Star-XH-9650-460-1.5"],
    ["msl-6064", "MSL-6064", "8000 Hour Food Grade Compressor Fluid", "MSL-6064"],
    ["msl-6066", "MSL-6066", "Synthetic Food Grade Penetrating Lubricant", "MSL-6066"],
    ["msl-6243", "MSL-6243", "Semi-Synthetic Vacuum Pump Lubricant", "MSL-6243"],
    ["msl-6321", "MSL-6321", "Universal 10000 Hour Compressor Fluid", "MSL-6321"],
    ["msl-6488", "MSL-6488", "Low Temperature Synthetic Silicone Freezer Lubricant", "MSL-6488"],
    ["msl-6831", "MSL-6831", "Synthetic Food Grade Low Temp Chain Lubricant", "MSL-6831"],
  ];
  assert.equal(identities.length, technicalDataSheets.length);
  for (const [id, code, heading, fileBase] of identities) {
    const product = products.find((product) => product.id === id);
    assert.ok(product, id);
    assert.equal(product.productCodes[0], code, id);
    assert.ok([code, `${code} ${heading}`, `${code} - ${heading}`].includes(product.name), id);
    assert.equal(product.documents.find((document) => document.type === "TDS").href,
      `/documents/tds/${fileBase}-technical-data-sheet.pdf`, id);
    const relatedCodes = id === "msl-2090" ? ["MSL-2090-20"]
      : id === "msl-3045" ? ["MSL-3045-EP2"] : [];
    assert.deepEqual(product.productCodes.slice(1), relatedCodes, id);
  }
  const gear = products.find((product) => product.id === "msl-2082");
  assert.ok(!gear.categories.includes("High Temperature"));
  assert.ok(products.find((product) => product.id === "dubois-2585-68").categories.includes("Food Grade"));
  assert.equal(gear.href, "/product/food-grade-high-temperature-gear-lubricant/");
  assert.equal(products.find((product) => product.id === "blue-star-9600-40").href,
    "/product/blue-star-9600-40-grease/");
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
