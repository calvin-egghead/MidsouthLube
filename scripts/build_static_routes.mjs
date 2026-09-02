import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "../src/data/siteData.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = resolve(projectRoot, "dist");
const siteUrl = "https://midsouthlube.com";
const defaultImage = `${siteUrl}/images/hero-facility.webp`;

const baseHtml = await readFile(resolve(distRoot, "index.html"), "utf8");

const decodeText = (value = "") => value
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/\s+/g, " ")
  .trim();

const escapeHtml = (value = "") => value
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const routeData = [
  ["/", "Food-Grade and Industrial Lubricants | Mid South Lubricants", "Specialty food-grade and industrial lubricants for safety, uptime, and demanding operating conditions."],
  ["/products/", "Product Catalog | Mid South Lubricants", `Search ${products.length} specialty lubricants by product type, MSL number, package SKU, SDS, or TDS.`],
  ["/about-us/", "About Mid South Lubricants", "Meet Ray and Tracie Tatum and learn how Mid South combines technical experience with direct customer support."],
  ["/faqs/", "Lubrication FAQ | Mid South Lubricants", "Answers about lubricant selection, service intervals, food-grade requirements, packaging, and product support."],
  ["/contact-us/", "Request a Quote | Mid South Lubricants", "Contact Mid South Lubricants for product selection help, technical questions, and quote requests."],
  ["/pdf-resources/", "Technical Resources | Mid South Lubricants", "Download available product documents or request the current SDS and TDS from Mid South Lubricants."],
  ["/privacy-policy/", "Privacy Policy | Mid South Lubricants", "Learn how Mid South Lubricants handles information associated with this website and direct business inquiries."],
  ["/terms/", "Website Terms | Mid South Lubricants", "Review the terms governing use of the Mid South Lubricants website and product information."],
];

const productData = products.map((product) => ({
  path: product.href,
  title: `${decodeText(product.name)} | Mid South Lubricants`,
  description: decodeText(product.shortDescriptionHtml).slice(0, 155),
  image: product.image ? new URL(product.image, siteUrl).href : defaultImage,
  sku: product.productCodes[0] || undefined,
  product,
}));

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mid South Lubricants",
  url: siteUrl,
  logo: `${siteUrl}/images/mid-south-logo.webp`,
  email: "info@midsouthlube.com",
  telephone: "+1-318-614-7948",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1122 Garland Gin Road",
    addressLocality: "Downsville",
    addressRegion: "LA",
    postalCode: "71234",
    addressCountry: "US",
  },
};

const renderHtml = ({ path, title, description, image = defaultImage, sku }) => {
  const canonical = new URL(path, siteUrl).href;
  const schema = sku ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title.replace(/ \| Mid South Lubricants$/, ""),
    description,
    image,
    url: canonical,
    sku,
    brand: { "@type": "Brand", name: "Mid South Lubricants" },
  } : organizationSchema;

  return baseHtml
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<meta property="og:type" content="[^"]*"\s*\/>/, `<meta property="og:type" content="${sku ? "product" : "website"}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${image}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${image}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace("</head>", `    <script id="structured-data" type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderStaticFallback({ path, title, description })}</div>`);
};

const staticLink = (href, label) => `<a href="${href}">${escapeHtml(label)}</a>`;

const renderStaticProductCard = (product) => {
  const tds = product.documents.find((document) => document.type === "TDS" && document.href);
  const sds = product.documents.find((document) => document.type === "SDS");
  return `<article>
      <h2>${escapeHtml(decodeText(product.name))}</h2>
      <p>${escapeHtml(decodeText(product.shortDescriptionHtml))}</p>
      <p>${staticLink(product.href, "View product")}${tds ? ` ${staticLink(tds.href, "Download TDS")}` : ""} ${sds ? staticLink(`/contact-us/?product=${encodeURIComponent(product.name)}&code=${encodeURIComponent(product.productCodes[0] || "")}&document=SDS#quote`, "Request SDS") : ""}</p>
    </article>`;
};

const renderStaticFallback = ({ path, title, description }) => {
  const product = products.find((item) => item.href === path);
  if (product) {
    const tds = product.documents.find((document) => document.type === "TDS" && document.href);
    const sds = product.documents.find((document) => document.type === "SDS");
    return `<main class="static-fallback">
      <h1>${escapeHtml(decodeText(product.name))}</h1>
      <p>${escapeHtml(description)}</p>
      <h2>Multiple uses for product</h2>
      <ul>${product.uses.map((use) => `<li>${escapeHtml(use)}</li>`).join("")}</ul>
      <p>${staticLink("/products/", "Browse products")} ${staticLink(`/contact-us/?product=${encodeURIComponent(product.name)}&code=${encodeURIComponent(product.productCodes[0] || "")}#quote`, "Request a quote")}${tds ? ` ${staticLink(tds.href, "Download TDS")}` : ""} ${sds ? staticLink(`/contact-us/?product=${encodeURIComponent(product.name)}&code=${encodeURIComponent(product.productCodes[0] || "")}&document=SDS#quote`, "Request SDS") : ""}</p>
    </main>`;
  }

  if (path === "/products/") {
    return `<main class="static-fallback">
      <h1>Product Catalog</h1>
      <p>${escapeHtml(description)}</p>
      ${products.map(renderStaticProductCard).join("\n")}
    </main>`;
  }

  const routeHeading = title.replace(/ \| Mid South Lubricants$/, "");
  const links = [
    ["/products/", "Browse Products"],
    ["/contact-us/#quote", "Request a Quote"],
    ["/about-us/", "About Us"],
    ["/faqs/", "FAQ"],
  ];
  return `<main class="static-fallback">
    <h1>${escapeHtml(routeHeading)}</h1>
    <p>${escapeHtml(description)}</p>
    <nav aria-label="Static page links">${links.map(([href, label]) => staticLink(href, label)).join(" ")}</nav>
  </main>`;
};

const allRoutes = [
  ...routeData.map(([path, title, description]) => ({ path, title, description })),
  ...productData,
];

await Promise.all(allRoutes.filter(({ path }) => path !== "/").map(async (route) => {
  const output = resolve(distRoot, route.path.slice(1), "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, renderHtml(route));
}));

await writeFile(resolve(distRoot, "index.html"), renderHtml(allRoutes[0]));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(({ path }) => `  <url><loc>${new URL(path, siteUrl).href}</loc></url>`).join("\n")}
</urlset>
`;

await writeFile(resolve(distRoot, "sitemap.xml"), sitemap);

const notFoundHtml = renderHtml({
  path: "/404.html",
  title: "Page Not Found | Mid South Lubricants",
  description: "Browse Mid South Lubricants products and company information.",
}).replace('<meta name="robots" content="index, follow, max-image-preview:large" />', '<meta name="robots" content="noindex, follow" />');
await writeFile(resolve(distRoot, "404.html"), notFoundHtml);

console.log(`Generated ${allRoutes.length} indexable routes, sitemap.xml, and 404.html.`);
