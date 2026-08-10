import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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
if (indexedRoutes < 20) failures.push(`sitemap.xml contains only ${indexedRoutes} routes`);

const appSource = await readFile(resolve(projectRoot, "src/App.jsx"), "utf8");
if (/[—–]/.test(appSource)) failures.push("src/App.jsx contains a forbidden long dash character");
if (/unreviewed WordPress sample language/i.test(appSource)) failures.push("placeholder legal language is still present");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${htmlFiles.length} HTML files and ${indexedRoutes} sitemap routes.`);
}
