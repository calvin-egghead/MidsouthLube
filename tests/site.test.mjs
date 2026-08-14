import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { products, technicalDataSheets } from "../src/data/siteData.js";

const root = resolve(import.meta.dirname, "..");
const siteData = await readFile(resolve(root, "src/data/siteData.js"), "utf8");
const app = await readFile(resolve(root, "src/App.jsx"), "utf8");

test("the public catalog includes every supplied document-backed product", () => {
  assert.equal(products.length, 26);
  assert.equal(technicalDataSheets.length, 6);
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length);
  assert.equal(new Set(products.map((product) => product.name)).size, products.length);
  assert.deepEqual(
    new Set(products.map((product) => product.documents.find((document) => document.type === "TDS")?.href).filter(Boolean)),
    new Set(technicalDataSheets.map((document) => document.href)),
  );
  const suppliedSds = products.flatMap((product) => product.documents)
    .filter((document) => document.type === "SDS" && document.href);
  assert.equal(suppliedSds.length, 30);
  assert.equal(new Set(suppliedSds.map((document) => document.href)).size, suppliedSds.length);
});

test("all declared downloadable files exist", async () => {
  const paths = [...`${siteData}\n${app}`.matchAll(/["'`](\/documents\/[^"'`?}]+)["'`]/g)].map((match) => match[1]);
  assert.ok(paths.length >= 8, "expected the SKU directory and supplied labels");
  await Promise.all(paths.map((path) => access(resolve(root, "public", path.slice(1)))));
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
