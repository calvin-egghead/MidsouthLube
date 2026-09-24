import { productUses } from "./productUses.js";

const documentsFor = ({ tds = null, sds = [] }) => [
  {
    type: "TDS",
    title: "Technical Data Sheet",
    description: "Product properties, performance data, and recommended applications.",
    href: tds,
    action: tds ? "download" : "request",
  },
  ...(sds.length ? sds : [{
    title: "Safety Data Sheet",
    description: "Safety, handling, storage, and emergency information.",
    href: null,
  }]).map((document) => ({
    type: "SDS",
    description: "Safety, handling, storage, and emergency information.",
    ...document,
    sourceHref: document.href || null,
    href: null,
    action: "request",
  })),
];

export const normalizeDashes = (value = "") => value
  .replace(/[\u2014\u2013]/g, "-")
  .replace(/&(?:mdash|ndash);|&#(?:8211|8212);/gi, "-");

export const normalizeHtml = (value = "") => normalizeDashes(value);
const productDefaults = {
  variations: [],
  packageSkus: [],
  labels: [],
  inStock: false,
  purchasable: false,
};

// Package SKU identifiers come from the supplied SKU directory, not TDS headings.
const packageSkuBases = new Map([
  ["MSL-2284SBAWHF", "MSL-2284SBAWHF"],
  ["MSL-2288", "MSL-2288SFGAWHF"],
  ["MSL-2584", "MSL-2584SFRHF"],
  ["MSL-4584", "MSL-4584FRFGHF"],
  ["MSL-C3", "MSL-C3FGHTF"],
  ["MSL-C5", "MSL-C5HFFGHTF"],
  ["MSL-C12", "MSL-C12FGLTHTF"],
  ["MSL-6488", "MSL-6488LTSSFL"],
  ["MSL-6831", "MSL-6831SFGLTCL"],
  ["MSL-NXT 717", "MSL-NXT717"],
  ["MSL-6061FGCF6", "MSL-6061FGCF6"],
  ["MSL-2015", "MSL-2015SCF8"],
  ["MSL-6321", "MSL-6321UCF10"],
  ["MSL-3045", "MSL-3045SHTSGG"],
  ["MSL-2087", "MSL-2087SFGEPACG"],
  ["MSL-3157", "MSL-3157SFGEPCSG"],
]);

const packageTypes = [
  ["1 Gallon Pail", "1P"],
  ["5 Gallon Pail", "5P"],
  ["55 Gallon Drum", "55D"],
  ["275 Gallon Tote", "275T"],
];

const fallbackImagesByCategory = [
  ["Freezer Lubes", "/images/application-cold.webp"],
  ["Thermal Fluid", "/images/application-heat.webp"],
  ["Compressor Fluid", "/images/application-compressor.webp"],
  ["Vacuum Pump Lubricant", "/images/application-compressor.webp"],
  ["Refrigeration Oil", "/images/product-ammonia-oil.webp"],
  ["Gear Fluid", "/images/product-chain-lubricant.webp"],
  ["Chain Lubricant", "/images/product-chain-lubricant.webp"],
  ["Grease", "/images/product-food-grade-grease.webp"],
  ["Penetrating Lubricant", "/images/technician-bearing.webp"],
  ["Hydraulic Fluid", "/images/product-hydraulic-fluid.webp"],
  ["Mineral Oil", "/images/product-hydraulic-fluid.webp"],
];

const genericProductImages = new Set([
  "/images/catalog/mid-south-container-family.webp",
  "/images/products-group.webp",
]);

const imageForCategories = (categories = []) => (
  fallbackImagesByCategory.find(([category]) => categories.includes(category))?.[1]
  || "/images/catalog/mid-south-container-family.webp"
);

const inferredCategoriesFor = (details) => {
  const text = `${details.name} ${details.shortDescriptionHtml || ""} ${details.descriptionHtml || ""} ${(details.features || []).join(" ")}`.toLowerCase();
  const categories = [];
  if (/food-grade|food grade|\bh1\b|ht-1|incidental food/.test(text)) categories.push("Food Grade");
  if (/hydraulic/.test(text)) categories.push("Hydraulic Fluid");
  if (/compressor/.test(text)) categories.push("Compressor Fluid");
  if (/gear/.test(text)) categories.push("Gear Fluid");
  if (/grease/.test(text)) categories.push("Grease");
  if (/freezer|low-temperature|low temperature|-40|cold/.test(text)) categories.push("Low Temperature");
  if (/high-temperature|high temperature|heat transfer|thermal|flash/.test(text)) categories.push("High Temperature");
  if (/heat transfer|thermal/.test(text)) categories.push("Thermal Fluid");
  if (/fire-resistant|fire resistant/.test(text)) categories.push("Fire Resistant");
  if (/biodegradable/.test(text)) categories.push("Biodegradable");
  if (/refrigeration|ammonia/.test(text)) categories.push("Refrigeration Oil");
  return categories;
};

const packageSkusFor = (primaryCode) => {
  const base = packageSkuBases.get(primaryCode);
  if (!base) return [];
  return packageTypes.map(([packaging, suffix]) => ({ packaging, sku: `${base}-${suffix}` }));
};

const mslFirstName = (name, primaryCode) => {
  if (!primaryCode || name.toLowerCase().startsWith(primaryCode.toLowerCase())) return name;
  return `${primaryCode} - ${name}`;
};

const product = ({ tds, sds, ...details }) => {
  const categories = [...new Set([...(details.categories || []), ...inferredCategoriesFor(details)])];
  const image = details.image && !genericProductImages.has(details.image)
    ? details.image
    : imageForCategories(categories);

  return {
    ...productDefaults,
    ...details,
    image,
    categories,
    uses: details.uses || productUses[details.id],
    name: mslFirstName(details.name, details.productCodes?.[0]),
    packageSkus: details.packageSkus ?? packageSkusFor(details.productCodes?.[0]),
    href: `/product/${details.slug}/`,
    documents: documentsFor({ tds, sds }),
  };
};

export const products = [
  product({
    id: "msl-c3",
    name: "MSL-C3 Food-Grade Heat Transfer Fluid",
    slug: "msl-c3-food-grade-heat-transfer-fluid",
    image: "/images/application-heat.webp",
    tds: "/documents/tds/MSL-C3-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/msl-c3-food-grade-heat-transfer-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>An HT-1 food-grade heat transfer fluid rated for applications with bulk temperatures up to 621°F (327°C).</p>",
    descriptionHtml: "<p>MSL-C3 uses highly pure base stocks free from the impurities and aromatic compounds common in many heat transfer fluids. It is formulated for clean operation, efficient thermal transfer, and long fluid life.</p><p><b>Operating range:</b> minimum temperature 32°F (0°C), maximum bulk temperature 621°F (327°C), and maximum film temperature 669°F (354°C).</p>",
    categories: ["Thermal Fluid"],
    productCodes: ["MSL-C3"],
    features: ["NSF HT-1 registered", "Supports clean operation and efficient thermal transfer", "Minimal odor"],
  }),
  product({
    id: "msl-c5",
    name: "MSL-C5 High-Flash Food-Grade Heat Transfer Fluid",
    slug: "msl-c5-high-flash-food-grade-heat-transfer-fluid",
    image: "/images/application-heat.webp",
    tds: "/documents/tds/MSL-C5-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/msl-c5-high-flash-food-grade-heat-transfer-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A high-flash food-grade heat transfer fluid for open and closed systems operating at very high temperatures.</p>",
    descriptionHtml: "<p>MSL-C5 combines pure base fluids with advanced additives to resist oxidation and fluid degradation. The formulation is designed for long service life in high-temperature systems with or without inert gas blanketing.</p><p><b>Operating range:</b> minimum temperature 59°F (15°C) and maximum bulk temperature 644°F (340°C).</p>",
    categories: ["Thermal Fluid"],
    productCodes: ["MSL-C5"],
    features: ["Suitable for incidental food-contact applications", "High flash point for added safety", "Resists fluid degradation", "Low varnishing tendency", "Low volatility"],
  }),
  product({
    id: "msl-nxt-717",
    name: "MSL-NXT 717 Premium Ammonia Refrigeration Compressor Oil",
    slug: "msl-nxt-717-ammonia-refrigeration-compressor-oil",
    image: "/images/catalog/Premium-Ammonia-Refigeration-Compressor-Oil-sm.webp",
    tds: "/documents/tds/MSL-NXT-717-technical-data-sheet.pdf",
    sds: [
      { title: "Safety Data Sheet - current, November 19, 2025", href: "source-documents/sds/nxt-717-sds-2025.pdf" },
      { title: "Safety Data Sheet - archived 2024 revision", href: "source-documents/sds/nxt-717-sds-2024.pdf" },
      { title: "Safety Data Sheet - archived legacy MSL-2033 name", href: "source-documents/sds/2033-nxt-717-legacy-sds.pdf" },
    ],
    shortDescriptionHtml: "<p>A hydrocracked ammonia refrigeration lubricant with low oil carryover and strong pumpability in extreme cold.</p>",
    descriptionHtml: "<p>MSL-NXT 717 is a next-generation, two-stage hydrocracked ammonia refrigeration compressor oil. Its reduced ammonia solubility limits viscosity dilution and oil carryover while supporting pumpability at evaporator temperatures down to -45°C.</p><p>The Grade 68 formulation is top-off compatible with most normal paraffinics, naphthenics, alkylbenzenes, PAOs, and single-stage hydrocracked products.</p>",
    categories: ["Refrigeration Oil"],
    productCodes: ["MSL-NXT 717"],
    features: ["Formulated for ammonia refrigeration systems", "Low oil carryover", "Long fluid life", "Reduced lubricant use", "Lower ammonia solubility", "Pumpable at evaporator temperatures down to -45°C", "Compatible with many competitive fluids without flushing"],
  }),
  product({
    id: "msl-2015",
    name: "Synthetic 8000 Hour Compressor Fluid",
    slug: "synthetic-8000-hour-compressor-fluid",
    image: "/images/catalog/Synthetic-8000-Hour-Compressor-Fluid-sm.webp",
    tds: "/documents/tds/MSL-2015-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet - ISO 46", href: "source-documents/sds/2015-46-synthetic-8000-hour-compressor-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A full-synthetic compressor fluid engineered for 8,000-plus hours of service and demanding operating conditions.</p>",
    descriptionHtml: "<p>MSL-2015 uses high-performance synthetic base stocks and additives to protect compressor components against wear, rust, corrosion, oxidation, and thermal breakdown.</p><p><b>Available grades:</b> ISO 32, 46, 68, and 100. The supplied SDS covers ISO 46.</p>",
    categories: ["Compressor Fluid"],
    productCodes: ["MSL-2015"],
    features: ["8,000-hour oil life at 100°C discharge temperature", "Excellent thermal stability", "Resists water contamination", "High flash point", "Protects against wear, rust, and corrosion"],
  }),
  product({
    id: "msl-2032",
    name: "Synthetic EP Gear Fluid",
    slug: "synthetic-ep-gear-fluid",
    image: "/images/product-chain-lubricant.webp",
    tds: "/documents/tds/MSL-2032-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/2032-synthetic-ep-gear-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A synthetic extreme-pressure gear fluid for heavy-load and high-temperature industrial applications.</p>",
    descriptionHtml: "<p>MSL-2032 combines enhanced extreme-pressure additives with a long-life synthetic formulation for demanding gear service. It is designed to maintain film strength, resist water contamination, and control carbon and varnish.</p><p><b>Available grades:</b> ISO 150, 220, 320, and 460.</p>",
    categories: ["Gear Fluid"],
    productCodes: ["MSL-2032"],
    features: ["Excellent lubricity and high film strength", "Long oil life", "Resists water contamination", "Controls carbon and varnish formation", "Protects against wear, rust, and corrosion"],
  }),
  product({
    id: "msl-2082",
    name: "Synthetic Food Grade Gear Fluid",
    slug: "synthetic-food-grade-gear-fluid",
    image: "/images/product-chain-lubricant.webp",
    tds: "/documents/tds/MSL-2082-technical-data-sheet.pdf",
    sds: [
      { title: "Safety Data Sheet - Grade 220, 2025 revision", href: "source-documents/sds/2082-220-synthetic-food-grade-gear-lubricant-sds.pdf" },
      { title: "Safety Data Sheet - archived general 2082 document", href: "source-documents/sds/2082-food-grade-high-temperature-gear-lubricant-sds.pdf" },
    ],
    shortDescriptionHtml: "<p>A synthetic H1 food-grade gear fluid for a wide range of gear applications, with oxidation stability, film strength, and wear protection.</p>",
    descriptionHtml: "<p>MSL-2082 meets H1 requirements for incidental food contact (FDA 21 CFR 178.3570). It is formulated for long fluid life, oxidation stability, film strength, lubricity, and wear protection, while protecting gears from rust and corrosion and providing water separability.</p><p><b>TDS grades:</b> ISO 150, 220, 320, and 460. Confirm the appropriate grade with Mid South for the application.</p>",
    categories: ["Gear Fluid"],
    productCodes: ["MSL-2082"],
    features: ["Meets H1 requirements for incidental food contact", "Excellent wear protection", "Oxidative stability", "Rust and corrosion protection", "Outstanding water separability"],
  }),
  product({
    id: "msl-2087",
    name: "Synthetic Food Grade EP Aluminum Complex Grease",
    slug: "synthetic-food-grade-ep-aluminum-complex-grease",
    image: "/images/catalog/Synthetic-Food-Grade-EP-Aluminum-Complex-Grease-10X1-Case.webp",
    tds: "/documents/tds/MSL-2087-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/2087-synthetic-food-grade-aluminum-complex-grease-sds.pdf" }],
    shortDescriptionHtml: "<p>A synthetic H1 aluminum-complex grease for demanding food-processing environments.</p>",
    descriptionHtml: "<p>MSL-2087 uses synthetic base stocks and an aluminum-complex thickener system for thermal stability, water resistance, and protection in wet or heavily loaded food-processing applications.</p><p><b>Packaging:</b> case of ten 14-ounce tubes.</p>",
    categories: ["Grease"],
    productCodes: ["MSL-2087"],
    features: ["Meets H1 requirements for incidental food contact", "Excellent oxidative and thermal stability", "Resists water contamination", "Rust and corrosion control", "High flash point"],
  }),
  product({
    id: "msl-2090",
    name: "Base Oil",
    slug: "food-grade-white-oil",
    image: "/images/product-hydraulic-fluid.webp",
    tds: "/documents/tds/MSL-2090-technical-data-sheet.pdf",
    sds: [
      { title: "Safety Data Sheet - Grade 20", href: "source-documents/sds/2090-20-food-grade-white-oil-sds.pdf" },
      { title: "Safety Data Sheet - Grade 22", href: "source-documents/sds/2090-22-food-grade-white-oil-sds.pdf" },
    ],
    shortDescriptionHtml: "<p>A high-purity base oil series produced using a two-stage hydrogenation process for purity and stability.</p>",
    descriptionHtml: "<p>MSL-2090 Base Oil meets the FDA requirements stated in the TDS (21 CFR 172.878 and 21 CFR 178.3620a) and USDA requirements for use in federally inspected meat and poultry plants. The TDS identifies MSL-2090-20 as approved for direct food contact; this designation should not be generalized to every grade.</p><p><b>TDS properties table grades:</b> 4, 10, 22, 32, 46, 68, and 100. Supplied SDS sources cover Grades 20 and 22. Confirm the correct grade and application with Mid South.</p>",
    categories: ["Mineral Oil"],
    productCodes: ["MSL-2090", "MSL-2090-20", "MSL-2090-22"],
    packageSkus: [{ packaging: "55 Gallon Drum - Grade 20", sku: "MSL-2090BO-20-55D" }],
    labels: [{ option: "Grade 20 - 55 Gallon Drum", sku: "MSL-2090BO-20-55D", href: "/documents/labels/MSL-2090BO-20-55D-drum-label.pdf" }],
    features: ["High degree of purity", "No odor", "Meets USDA requirements stated in the TDS", "Passes ASTM D565 for carbonizable substances"],
  }),
  product({
    id: "msl-2066",
    name: "Synthetic Penetrating Lubricant",
    slug: "synthetic-penetrating-lubricant",
    image: "/images/product-hydraulic-fluid.webp",
    tds: "/documents/tds/MSL-2066-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet - Grade 22", href: "source-documents/sds/2066-22-synthetic-penetrating-lubricant-sds.pdf" }],
    shortDescriptionHtml: "<p>A light-viscosity synthetic spray that frees stuck parts, cleans deposits, and leaves long-lasting lubrication.</p>",
    descriptionHtml: "<p>MSL-2066 is a general-purpose penetrating spray lubricant for freeing stuck parts and removing surface rust and deposits. Its non-gumming film stays on metal to help resist water contamination, wear, rust, and corrosion.</p><p><b>TDS grade:</b> 8. The supplied SDS is labeled 2066-22, so confirm the appropriate grade when requesting it.</p>",
    categories: ["Penetrating Lubricant"],
    productCodes: ["MSL-2066"],
    features: ["Penetrates and cleans stuck parts", "Removes surface rust and deposits", "Resists water contamination", "Helps protect against wear, rust, and corrosion"],
  }),
  product({
    id: "msl-2243",
    name: "Mineral Oil AW Hydraulic Fluid",
    slug: "mineral-oil-aw-hydraulic-fluid",
    image: "/images/product-hydraulic-fluid.webp",
    tds: "/documents/tds/MSL-2243-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/2243-mineral-oil-aw-hydraulic-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A mineral-oil anti-wear hydraulic fluid for general industrial hydraulic systems.</p>",
    descriptionHtml: "<p>MSL-2243 is formulated for hydraulic equipment that requires dependable anti-wear protection, oxidation and corrosion control, foam suppression, and water separation.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2243"],
    features: ["Anti-wear formulation", "Oxidation and corrosion control", "Readily separates from water", "Foam suppression", "High flash point"],
  }),
  product({
    id: "msl-2244",
    name: "Semi-Synthetic AW Hydraulic Fluid",
    slug: "semi-synthetic-aw-hydraulic-fluid",
    image: "/images/product-hydraulic-fluid.webp",
    tds: "/documents/tds/MSL-2244-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/2244-semi-synthetic-aw-hydraulic-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A semi-synthetic anti-wear fluid for general-purpose industrial hydraulic systems.</p>",
    descriptionHtml: "<p>MSL-2244 combines mineral and synthetic base fluids for hydraulic applications that need balanced wear protection, fluid life, and cold-temperature performance.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2244"],
    features: ["Anti-wear protection", "Semi-synthetic formulation", "Rust and corrosion control", "Water-separation performance", "Suitable for general hydraulic service"],
  }),
  product({
    id: "msl-2284",
    name: "Synthetic Biodegradable Hydraulic Fluid",
    slug: "synthetic-biodegradable-hydraulic-fluid",
    image: "/images/catalog/Synthetic-Biodegradable-Hydraulic-Fluid-sm.webp",
    tds: "/documents/tds/MSL-2284-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet - ISO 46", href: "source-documents/sds/2284-46-biodegradable-hydraulic-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A zinc-free synthetic biodegradable fluid for hydraulic systems operating under severe conditions.</p>",
    descriptionHtml: "<p>MSL-2284SBAWHF combines synthetic base fluids and additives for long fluid life, water separation, low volatility, and protection against wear, rust, corrosion, carbon, and varnish deposits.</p><p><b>TDS grades:</b> ISO 32, 46, 68, and 100. The supplied SDS covers ISO 46.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2284SBAWHF", "2284"],
    features: ["Biodegradable synthetic formulation", "Zinc free", "Protects against wear, rust, and corrosion", "Readily separates from water", "Controls carbon and varnish deposits", "Low volatility"],
  }),
  product({
    id: "msl-2288",
    name: "Synthetic Food Grade AW Hydraulic Fluid",
    slug: "synthetic-food-grade-aw-hydraulic-fluid",
    image: "/images/product-hydraulic-fluid.webp",
    tds: "/documents/tds/MSL-2288-technical-data-sheet.pdf",
    sds: [
      { title: "Safety Data Sheet - ISO 32", href: "source-documents/sds/2288-32-synthetic-food-grade-hydraulic-fluid-sds.pdf" },
      { title: "Safety Data Sheet - ISO 46", href: "source-documents/sds/2288-46-synthetic-food-grade-hydraulic-fluid-sds.pdf" },
      { title: "Safety Data Sheet - ISO 68", href: "source-documents/sds/2288-68-synthetic-food-grade-hydraulic-fluid-sds.pdf" },
    ],
    shortDescriptionHtml: "<p>A biodegradable synthetic H1 hydraulic fluid with anti-wear protection for food-processing and environmentally sensitive applications.</p>",
    descriptionHtml: "<p>MSL-2288 resists sludge and varnish while providing wear, rust, and corrosion protection. It is formulated for hydraulic systems that require incidental-food-contact suitability or a biodegradable lubricant.</p><p><b>Available grades:</b> ISO 32, 46, 68, and 100. Supplied SDS documents cover ISO 32, 46, and 68.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2288"],
    labels: [
      { option: "ISO 46 - 275 Gallon Tote", sku: "MSL-2288SFGAWHF-46-275T", href: "/documents/labels/MSL-2288SFGAWHF-46-275T-tote-label.pdf" },
      { option: "ISO 68 - 55 Gallon Drum", sku: "MSL-2288SFGAWHF-68-55D", href: "/documents/labels/MSL-2288SFGAWHF-68-55D-drum-label.pdf" },
      { option: "ISO 68 - 275 Gallon Tote", sku: "MSL-2288SFGAWHF-68-275T", href: "/documents/labels/MSL-2288SFGAWHF-68-275T-tote-label.pdf" },
    ],
    features: ["Meets H1 requirements for incidental food contact", "Biodegradable formulation", "Protects against wear, rust, and corrosion", "Readily separates from water", "Controls carbon and varnish formation", "Low volatility"],
  }),
  product({
    id: "msl-2384",
    name: "Synthetic Multi-Viscosity AW Hydraulic Fluid",
    slug: "synthetic-multi-viscosity-aw-hydraulic-fluid",
    image: "/images/product-hydraulic-fluid.webp",
    tds: "/documents/tds/MSL-2384-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/2384-synthetic-multi-viscosity-aw-hydraulic-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A high-viscosity-index synthetic hydraulic fluid for protection across a broad operating-temperature range.</p>",
    descriptionHtml: "<p>MSL-2384 is designed to maintain useful fluidity in cold conditions while protecting hydraulic components against wear, rust, and copper corrosion in demanding service.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2384"],
    features: ["High viscosity index", "Maintains fluidity in cold temperatures", "Anti-wear protection", "Rust and corrosion control", "Excellent water separation"],
  }),
  product({
    id: "msl-2584",
    name: "Synthetic Fire-Resistant Hydraulic Fluid",
    slug: "synthetic-fire-resistant-hydraulic-fluid",
    image: "/images/catalog/Synthetic-Fire-Resistant-Hydraulic-Fluid-sm.webp",
    tds: "/documents/tds/MSL-2584-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/2584-synthetic-fire-resistant-hydraulic-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A synthetic hydraulic fluid engineered for fire resistance, pump protection, and long service life.</p>",
    descriptionHtml: "<p>MSL-2584 provides fire resistance without the maintenance demands of many water-glycol fluids. Its synthetic formulation supports oxidative stability, water separation, corrosion resistance, and anti-wear performance.</p><p><b>Available grades:</b> ISO 32, 46, 68, and 100.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2584"],
    features: ["High flash point", "Superior pump protection", "Readily separates from water", "Oxidative stability", "High viscosity index", "Protects against wear, rust, and corrosion"],
  }),
  product({
    id: "msl-4584",
    name: "Synthetic Fire-Resistant Food Grade Hydraulic Fluid",
    slug: "synthetic-fire-resistant-food-grade-hydraulic-fluid",
    image: "/images/catalog/Synthetic-Fire-Resistant-Food-Grade-Hydraulic-Fluid-sm.webp",
    tds: "/documents/tds/MSL-4584-technical-data-sheet.pdf",
    sds: [
      { title: "Safety Data Sheet - ISO 32", href: "source-documents/sds/4584-32-fire-resistant-food-grade-hydraulic-fluid-sds.pdf" },
      { title: "Safety Data Sheet - ISO 68", href: "source-documents/sds/4584-68-fire-resistant-food-grade-hydraulic-fluid-sds.pdf" },
    ],
    shortDescriptionHtml: "<p>A biodegradable fire-resistant hydraulic fluid formulated for food-processing equipment and broad operating temperatures.</p>",
    descriptionHtml: "<p>MSL-4584 is formulated to meet H1 requirements for incidental food contact and FDA 21 CFR 178.3570. It provides oxidative stability, corrosion resistance, anti-wear protection, and water separation for demanding hydraulic systems.</p><p><b>TDS grades:</b> ISO 22, 32, 46, and 68. Supplied package SKUs use the MSL-4584FRFGHF base code.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-4584"],
    features: ["Meets H1 requirements for incidental food contact", "Fire-resistant and biodegradable formulation", "Protects against wear, rust, and corrosion", "Readily separates from water", "High viscosity index", "Low volatility"],
  }),
  product({
    id: "dubois-2585-68",
    name: "FM Approved Fire Resistant EAL Hydraulic Fluid",
    slug: "2585-68-fire-resistant-hydraulic-fluid",
    image: "/images/catalog/Synthetic-Fire-Resistant-Hydraulic-Fluid-sm.webp",
    tds: "/documents/tds/MSL-2585-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet - ISO 68", href: "source-documents/sds/2585-68-fire-resistant-hydraulic-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>An ester-based, food-grade, fire-resistant EAL hydraulic fluid for moderate to severe duty applications.</p>",
    descriptionHtml: "<p>MSL-2585 is identified in its TDS as FM Approved Fire Resistant EAL Hydraulic Fluid. It offers oxidative stability, long fluid life, and rust and corrosion protection. It complies with 21 CFR 178.3570 for incidental food contact and is readily biodegradable according to OECD 301B.</p><p><b>TDS grade:</b> ISO 68. Confirm equipment compatibility and the appropriate application with Mid South.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2585"],
    features: ["FM Approved designation in the supplied TDS", "Food-grade formulation", "ISO 68 grade", "Readily biodegradable according to OECD 301B", "Long fluid life", "Rust and corrosion protection"],
  }),
  product({
    id: "frh-46",
    name: "FRH-46 Fire-Resistant Hydraulic Fluid",
    slug: "frh-46-fire-resistant-hydraulic-fluid",
    image: "/images/catalog/Synthetic-Fire-Resistant-Hydraulic-Fluid-sm.webp",
    shortDescriptionHtml: "<p>A quote-based ISO 46 fire-resistant hydraulic fluid for industrial hydraulic systems.</p>",
    descriptionHtml: "<p>FRH-46 is cataloged as a fire-resistant ISO 46 hydraulic fluid. Contact Mid South to confirm system compatibility, available package sizes, and the current technical and safety documentation.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["FRH-46"],
    features: ["ISO 46 viscosity grade", "Fire-resistant hydraulic service", "Quote-based ordering"],
  }),
  product({
    id: "msl-3045",
    name: "Synthetic High Temp Silica Gel Grease",
    slug: "synthetic-high-temperature-silica-gel-grease",
    image: "/images/catalog/Synthetic-High-Temperature-Silica-Gel-Grease_.webp",
    tds: "/documents/tds/MSL-3045-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/3045-synthetic-high-temperature-silica-gel-grease-sds.pdf" }],
    shortDescriptionHtml: "<p>A food-grade semi-fluid silica-gel grease for high-temperature bearing applications.</p>",
    descriptionHtml: "<p>MSL-3045 combines synthetic base stocks, silica-gel thickeners, and performance additives for thermal stability, water resistance, film strength, and corrosion control in severe service.</p><p>The formulation meets H1 requirements for incidental food contact and complies with FDA 21 CFR 178.3570. The properties table identifies the grade as MSL-3045-EP2.</p>",
    categories: ["Grease"],
    productCodes: ["MSL-3045", "MSL-3045-EP2"],
    features: ["Meets H1 requirements for incidental food contact", "Oxidative and thermal stability", "Resists water contamination", "High film strength", "Rust and corrosion control", "High flash point"],
  }),
  product({
    id: "blue-star-9600-40",
    name: "BLUE STAR XH 9650/460-1.5",
    slug: "blue-star-xh-9650-460-1-5",
    image: "/images/product-food-grade-grease.webp",
    tds: "/documents/tds/Blue-Star-XH-9650-460-1.5-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/blue-star-xh-9650-460-1.5-sds.pdf" }],
    shortDescriptionHtml: "<p>A water-resistant calcium sulfonate complex grease for rolling mill bearings, spindles, and other grease-lubricated parts.</p>",
    descriptionHtml: "<p>BLUE STAR XH 9650/460-1.5 is a calcium sulfonate complex thickened grease designed to protect work roll bearings, spindles, and other grease-lubricated parts from wear and corrosion. Its thickener system resists consistency breakdown after water or steam contamination, while a polymer system provides cohesive and adhesive properties.</p><p>The supplied TDS identifies this product as XH 9650/460-1.5. Contact Mid South for package availability and application guidance.</p>",
    categories: ["Grease"],
    productCodes: ["BLUE STAR XH 9650/460-1.5"],
    features: ["Water and steam contamination resistance", "Calcium sulfonate complex thickener", "Cohesive and adhesive polymer system", "Wear and corrosion protection"],
  }),
  product({
    id: "msl-6061",
    name: "6000 Hour Food-Grade Compressor Fluid",
    slug: "6000-hour-food-grade-compressor-fluid",
    image: "/images/catalog/6000-Hour-Food-Grade-Compresor-Fluid-sm.webp",
    tds: "/documents/tds/MSL-6061-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet - ISO 46", href: "source-documents/sds/6061-46-food-grade-compressor-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A synthetic H1 compressor fluid designed for extended drain intervals in food-processing operations.</p>",
    descriptionHtml: "<p>MSL-6061FGCF6 provides 4,000 to 6,000 hours of oil life at a 100°C discharge temperature while protecting against oxidation, water contamination, rust, corrosion, carbon, and varnish.</p><p><b>Available grades:</b> ISO 32, 46, 68, and 100. The supplied SDS covers ISO 46.</p>",
    categories: ["Compressor Fluid"],
    productCodes: ["MSL-6061FGCF6", "6061-46"],
    features: ["Meets H1 requirements for incidental food contact", "4,000-6,000-hour oil life at 100°C discharge temperature", "Oxidatively stable", "Resists water contamination", "Controls carbon and varnish formation", "High flash point"],
  }),
  product({
    id: "msl-6064",
    name: "8000 Hour Food Grade Compressor Fluid",
    slug: "8000-hour-food-grade-compressor-fluid",
    image: "/images/application-compressor.webp",
    tds: "/documents/tds/MSL-6064-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet - ISO 46", href: "source-documents/sds/6064-46-food-grade-compressor-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A long-life H1 compressor fluid for harsh environments and high-temperature food-processing applications.</p>",
    descriptionHtml: "<p>MSL-6064 is formulated for extended oil-drain intervals with strong carbon and varnish control. Its food-grade synthetic formulation is intended to protect compressor components under demanding operating conditions.</p><p><b>Available grades:</b> ISO 32, 46, 68, and 100. The supplied SDS covers ISO 46.</p>",
    categories: ["Compressor Fluid"],
    productCodes: ["MSL-6064"],
    features: ["Meets H1 requirements for incidental food contact", "8,000-hour oil life at 100°C discharge temperature", "Thermal and oxidative stability", "Controls carbon and varnish formation", "Resists water contamination", "High flash point"],
  }),
  product({
    id: "msl-6066",
    name: "Synthetic Food Grade Penetrating Lubricant",
    slug: "synthetic-food-grade-penetrating-lubricant",
    image: "/images/product-hydraulic-fluid.webp",
    tds: "/documents/tds/MSL-6066-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/6066-synthetic-food-grade-penetrating-lubricant-sds.pdf" }],
    shortDescriptionHtml: "<p>An H1 synthetic penetrating spray that cleans and frees stuck parts in food-processing environments.</p>",
    descriptionHtml: "<p>MSL-6066 meets H1 requirements for incidental food contact. It penetrates and cleans stuck parts, removes rust and deposits, and leaves a long-lasting, non-gumming lubricating film that protects metal against rust and corrosion.</p><p>The TDS identifies high film strength, water separation, low volatility, and oxidative stability. Confirm package availability with Mid South.</p>",
    categories: ["Penetrating Lubricant"],
    productCodes: ["MSL-6066"],
    features: ["Meets H1 incidental-food-contact requirements", "Penetrates and cleans stuck parts", "High film strength", "Rust control and water separation", "Low volatility"],
  }),
  product({
    id: "msl-6243",
    name: "Semi-Synthetic Vacuum Pump Lubricant",
    slug: "semi-synthetic-vacuum-pump-lubricant",
    image: "/images/application-compressor.webp",
    tds: "/documents/tds/MSL-6243-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet - ISO 68", href: "source-documents/sds/6243-68-semi-synthetic-vacuum-pump-lubricant-sds.pdf" }],
    shortDescriptionHtml: "<p>A low-vapor-pressure vacuum pump lubricant with thermal, chemical, and shear stability.</p>",
    descriptionHtml: "<p>MSL-6243 is designed for long fluid life and protection against wear, rust, corrosion, varnish, carbon, and sludge deposits in vacuum pumps. The formulation exceeds DIN 51506 VD-L requirements.</p><p><b>TDS grades:</b> ISO 32, 46, 68, and 100. The supplied SDS covers ISO 68.</p>",
    categories: ["Vacuum Pump Lubricant"],
    productCodes: ["MSL-6243"],
    features: ["Very low vapor pressure", "Excellent thermal and chemical stability", "Oxidative stability", "High flash point", "Low volatility", "Controls varnish, carbon, and sludge deposits"],
  }),
  product({
    id: "msl-6321",
    name: "Universal 10000 Hour Compressor Fluid",
    slug: "universal-10000-hour-compressor-fluid",
    image: "/images/catalog/Universal-10000-Hour-Compressor-Fluid-sm.webp",
    tds: "/documents/tds/MSL-6321-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet - ISO 46", href: "source-documents/sds/6321-46-universal-compressor-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A universal long-life compressor fluid compatible with most OEM PAG compressor lubricants.</p>",
    descriptionHtml: "<p>MSL-6321 is designed for top-off compatibility with a wide range of OEM and aftermarket rotary-screw compressor fluids, helping avoid flushing during changeover. It provides up to 10,000 hours of service with wear, corrosion, water-contamination, and sludge protection.</p><p><b>TDS grades:</b> ISO 32, 46, and 68. The supplied SDS covers ISO 46.</p>",
    categories: ["Compressor Fluid"],
    productCodes: ["MSL-6321"],
    features: ["10,000-hour oil life at 100°C discharge temperature", "Compatible with most OEM PAG compressor lubricants", "Resists water contamination", "Protects against wear, rust, and corrosion", "Helps reduce flushing during compatible changeovers"],
  }),
  product({
    id: "msl-6488",
    name: "Low Temperature Synthetic Silicone Freezer Lubricant",
    slug: "low-temperature-synthetic-silicone-freezer-lubricant",
    image: "/images/catalog/Low-Temperature-Synthetic-Silicone-Freezer-Lubricant-sm.webp",
    tds: "/documents/tds/MSL-6488-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/6488-low-temperature-silicone-freezer-lubricant-sds.pdf" }],
    shortDescriptionHtml: "<p>A food-grade silicone lubricant formulated for spiral freezers operating from -40°F to -80°F.</p>",
    descriptionHtml: "<p>MSL-6488 provides clean lubrication, film strength, wear protection, and deposit control in severe low-temperature freezer applications. It meets H1 requirements for incidental food contact.</p><p><b>TDS grades:</b> 32 and 220.</p>",
    categories: ["Freezer Lubes"],
    productCodes: ["MSL-6488"],
    features: ["Meets H1 requirements for incidental food contact", "Designed for -40°F to -80°F service", "Excellent low-temperature properties", "Enhanced film strength and wear protection", "Carbon and varnish control", "High flash point"],
  }),
  product({
    id: "msl-6831",
    name: "Synthetic Food Grade Low Temp Chain Lubricant",
    slug: "synthetic-food-grade-low-temperature-chain-lubricant",
    image: "/images/catalog/Synthetic-Food-Grade-Low-Temperature-Chain-Lubricant-sm.webp",
    tds: "/documents/tds/MSL-6831-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet - ISO 15", href: "source-documents/sds/6831-15-food-grade-low-temperature-chain-lubricant-sds.pdf" }],
    shortDescriptionHtml: "<p>An H1 chain lubricant engineered for spiral freezers and other extreme low-temperature applications.</p>",
    descriptionHtml: "<p>MSL-6831 combines synthetic base fluids and advanced additives for cold-temperature fluidity, anti-wear protection, and reliable chain coverage. It resists water washout, fling-off, rust, corrosion, and deposits.</p><p><b>TDS grades:</b> ISO 15, 22, and 32. The supplied SDS covers ISO 15.</p>",
    categories: ["Freezer Lubes"],
    productCodes: ["MSL-6831"],
    features: ["Meets H1 requirements for incidental food contact", "Maintains fluidity at very low temperatures", "Excellent film strength and anti-wear protection", "Resists water washout and fling-off", "Rust, corrosion, and deposit control"],
  }),
  product({
    id: "msl-c12",
    name: "MSL-C12 Food-Grade Low-Temperature Heat Transfer Fluid",
    slug: "msl-c12-food-grade-low-temperature-heat-transfer-fluid",
    image: "/images/application-heat.webp",
    tds: "/documents/tds/MSL-C12-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/msl-c12-food-grade-low-temperature-heat-transfer-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>An HT-1 food-grade heat transfer fluid for low-temperature systems with a 442°F maximum bulk temperature in its TDS properties table.</p>",
    descriptionHtml: "<p>MSL-C12 uses highly pure, clear base fluids free from many impurities and aromatic compounds found in conventional heat transfer oils. It is formulated for efficient heat transfer, clean operation, low-temperature performance, and long fluid life.</p>",
    categories: ["Thermal Fluid"],
    productCodes: ["MSL-C12", "MSL-C12FGLTHTF"],
    features: ["NSF HT-1 registered", "Meets requirements for incidental food contact", "Low varnishing tendency", "Supports clean operation and efficient thermal transfer", "Minimal odor"],
  }),
  product({
    id: "msl-2185",
    name: "Synthetic Food Grade Chain Lubricant with Tackifier",
    slug: "synthetic-food-grade-chain-lubricant-with-tackifier",
    tds: "/documents/tds/MSL-2185-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/2185-synthetic-food-grade-chain-lubricant-sds.pdf" }],
    shortDescriptionHtml: "<p>An H1 high-temperature chain lubricant with tackifier for wet food-processing environments.</p>",
    descriptionHtml: "<p>MSL-2185 resists water washout, thermal breakdown, carbon, and varnish formation. Its lubricity and film strength support once-through chain applications at temperatures up to 500°F.</p><p><b>TDS grades:</b> 22, 46, 68, and 100. Confirm the grade and package when requesting an SDS.</p>",
    categories: ["Food Grade", "Chain Lubricant"],
    productCodes: ["MSL-2185"],
    packageSkus: [
      { packaging: "5 Gallon Pail - Grade 22", sku: "MSL-2185-22" },
      { packaging: "55 Gallon Drum - Grade 22", sku: "MSL-2185SFGCLWT-22-55D" },
      { packaging: "5 Gallon Pail - Grade 68", sku: "MSL-2185SFGCLWT-68-5P" },
    ],
    labels: [
      { option: "Grade 22 - 5 Gallon Pail", sku: "MSL-2185-22", href: "/documents/labels/MSL-2185-22-pail-label.pdf" },
      { option: "Grade 22 - 55 Gallon Drum", sku: "MSL-2185SFGCLWT-22-55D", href: "/documents/labels/MSL-2185SFGCLWT-22-55D-drum-label.pdf" },
      { option: "Grade 68 - 5 Gallon Pail", sku: "MSL-2185SFGCLWT-68-5P", href: "/documents/labels/MSL-2185SFGCLWT-68-5P-pail-label.pdf" },
    ],
    features: ["H1 incidental-food-contact suitability", "Resists water washout", "Long oil life", "Controls carbon and varnish deposits", "High film strength"],
  }),
  product({
    id: "msl-2245",
    name: "Semi-Synthetic Food Grade AW Hydraulic Fluid",
    slug: "semi-synthetic-food-grade-aw-hydraulic-fluid",
    tds: "/documents/tds/MSL-2245-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "source-documents/sds/2245-semi-synthetic-food-grade-aw-hydraulic-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A zinc-free, food-grade anti-wear hydraulic fluid for modern pump systems.</p>",
    descriptionHtml: "<p>MSL-2245 uses an advanced anti-wear package to protect hydraulic equipment while supporting fluid life and energy efficiency. The TDS identifies oxidative and thermal stability, shear stability, and carbon and varnish control.</p><p><b>TDS grades:</b> ISO 32, 46, 68, and 100. The formula complies with 21 CFR 178.3570 for incidental-food-contact lubricants.</p>",
    categories: ["Hydraulic Fluid", "Food Grade"],
    productCodes: ["MSL-2245"],
    features: ["Zinc free", "Anti-wear pump protection", "Oxidative and thermal stability", "High viscosity index", "Shear stable"],
  }),
  product({
    id: "msl-3157",
    name: "Synthetic Food Grade EP Calcium Sulfonate Grease",
    slug: "synthetic-food-grade-ep-calcium-sulfonate-grease",
    tds: "/documents/tds/MSL-3157-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet - EP2", href: "source-documents/sds/msl-3157-ep2-food-grade-calcium-sulfonate-grease-sds.pdf" }],
    shortDescriptionHtml: "<p>An H1 extreme-pressure calcium sulfonate grease for severe food-processing applications.</p>",
    descriptionHtml: "<p>MSL-3157 uses over-based calcium-complex thickeners, antioxidants, and extreme-pressure anti-wear additives for wet and heavily loaded applications. The supplied TDS identifies Grade EP2 and cites USDA H1, ISO 21469, and FDA 21 CFR 178.3570 requirements.</p><p>Request the current SDS for the selected grade.</p>",
    categories: ["Grease", "Food Grade"],
    productCodes: ["MSL-3157", "MSL-3157SFGEPCSG"],
    features: ["H1 food-grade designation", "Extreme-pressure and anti-wear protection", "Suitable for water-prone applications", "High-temperature grease service", "Rust protection"],
  }),
  product({
    id: "msl-c13",
    name: "MSL-C13 Heat Transfer Oil",
    slug: "msl-c13-heat-transfer-oil",
    tds: "/documents/tds/MSL-C13-technical-data-sheet.pdf",
    shortDescriptionHtml: "<p>An industrial heat-transfer oil for systems operating up to 600°F.</p>",
    descriptionHtml: "<p>MSL-C13 is intended for heat-transfer applications that require thermal and oxidative stability, low volatility, and deposit control. The TDS lists Grades 20 and 40.</p><p>The supplied Grade 40 SDS has conflicting identifiers in its header and identification section. Request the current SDS from Mid South while that discrepancy is reviewed.</p>",
    categories: ["Thermal Fluid"],
    productCodes: ["MSL-C13"],
    features: ["Thermal and oxidative stability", "Low volatility and vapor pressure", "Deposit control", "TDS lists Grades 20 and 40"],
  }),
  product({
    id: "msl-rescue-htf-hd",
    name: "MSL-Rescue HTF HD Heavy-Duty Heat Transfer Cleaner Concentrate",
    slug: "msl-rescue-htf-hd-heat-transfer-cleaner-concentrate",
    tds: "/documents/tds/MSL-Rescue-HTF-HD-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet - MSL-5133-5", href: "source-documents/sds/msl-rescue-htf-hd-sds.pdf" }],
    shortDescriptionHtml: "<p>A concentrated cleaner for carbon, varnish, and hydrocarbon deposits in heat-transfer systems.</p>",
    descriptionHtml: "<p>MSL-Rescue HTF HD is added to existing heat-transfer fluid to clean fouled systems while they operate. The TDS recommends a 10% cleaner-to-fluid ratio, with up to 20% for heavily fouled systems; cleaning is typically completed within 48 hours.</p><p>The Safety Data Sheet uses the alternate product identifier MSL-5133-5.</p>",
    categories: ["Thermal Fluid"],
    productCodes: ["MSL-Rescue HTF HD", "MSL-5133-5"],
    features: ["Cleans operating heat-transfer systems", "Removes carbon and varnish deposits", "Fast acting", "Concentrated formulation"],
  }),
  product({
    id: "snfg-series",
    name: "SNFG Series of Synthetic Food Grade Oils",
    slug: "snfg-series-synthetic-food-grade-oils",
    tds: "/documents/tds/SNFG-series-technical-data-sheet.pdf",
    shortDescriptionHtml: "<p>A synthetic food-grade oil series for compressors, hydraulic systems, and airline systems.</p>",
    descriptionHtml: "<p>The SNFG series uses synthetic oils and food-grade additives for thermal and oxidative stability, extreme-pressure and anti-wear performance, low foaming, and water separation in food-processing equipment.</p><p>Request the current SDS for the selected grade.</p>",
    categories: ["Food Grade", "Compressor Fluid", "Hydraulic Fluid"],
    productCodes: ["SNFG"],
    features: ["Food-grade synthetic oil series", "Extreme-pressure and anti-wear protection", "Thermal and oxidative stability", "Water separation", "Low foaming"],
  }),
];

export const technicalDataSheets = products.flatMap((product) => (
  product.documents
    .filter((document) => document.type === "TDS" && document.href)
    .map((document) => ({
      productName: product.name,
      productCode: product.productCodes[0],
      href: document.href,
    }))
));

export const productCategories = [...new Set(products.flatMap((product) => product.categories))]
  .sort((a, b) => a.localeCompare(b));

export const catalogCategoryGroups = [
  { label: "All Products", categories: [] },
  { label: "Food Grade", categories: ["Food Grade"] },
  { label: "Freezer Lubes", categories: ["Freezer Lubes"] },
  { label: "Low Temperature", categories: ["Low Temperature"] },
  { label: "High Temperature", categories: ["High Temperature"] },
  { label: "Mineral Oil", categories: ["Mineral Oil"] },
  { label: "Compressor Fluid", categories: ["Compressor Fluid"] },
  { label: "Gear Fluid", categories: ["Gear Fluid"] },
  { label: "Refrigeration Oil", categories: ["Refrigeration Oil"] },
  { label: "Vacuum Pump Lubricant", categories: ["Vacuum Pump Lubricant"] },
  { label: "Thermal Fluid", categories: ["Thermal Fluid"] },
  { label: "Penetrating Lubricant", categories: ["Penetrating Lubricant"] },
  { label: "Hydraulic Fluid", categories: ["Hydraulic Fluid"] },
  { label: "Fire Resistant", categories: ["Fire Resistant"] },
  { label: "Biodegradable", categories: ["Biodegradable"] },
  { label: "Grease", categories: ["Grease"] },
];

export const featuredProductSlugs = [
  "msl-c3-food-grade-heat-transfer-fluid",
  "msl-nxt-717-ammonia-refrigeration-compressor-oil",
  "msl-c12-food-grade-low-temperature-heat-transfer-fluid",
];

export const featuredProducts = featuredProductSlugs
  .map((slug) => products.find((product) => product.slug === slug))
  .filter(Boolean);

export const applications = [
  {
    name: "Freezer Lubes",
    copy: "Low-temperature lubricants for freezer chains and equipment.",
    image: "/images/application-cold.webp",
    category: "Freezer Lubes",
  },
  {
    name: "Mineral Oil",
    copy: "Highly refined oils for clean industrial lubrication.",
    image: "/images/product-hydraulic-fluid.webp",
    category: "Mineral Oil",
  },
  {
    name: "Compressor Fluid",
    copy: "Long-life fluids for demanding compressor service.",
    image: "/images/application-compressor.webp",
    category: "Compressor Fluid",
  },
  {
    name: "Gear Fluid",
    copy: "High-film-strength lubrication for industrial gear systems.",
    image: "/images/product-chain-lubricant.webp",
    category: "Gear Fluid",
  },
  {
    name: "Refrigeration Oil",
    copy: "Low-carryover oils for ammonia refrigeration systems.",
    image: "/images/product-ammonia-oil.webp",
    category: "Refrigeration Oil",
  },
  {
    name: "Vacuum Pump Lubricant",
    copy: "Purpose-built lubrication for industrial vacuum pumps.",
    image: "/images/technician-bearing.webp",
    category: "Vacuum Pump Lubricant",
  },
  {
    name: "Thermal Fluid",
    copy: "Heat-transfer fluids for high- and low-temperature systems.",
    image: "/images/application-heat.webp",
    category: "Thermal Fluid",
  },
  {
    name: "Penetrating Lubricant",
    copy: "Synthetic penetrating oils for industrial maintenance.",
    image: "/images/technician-bearing.webp",
    category: "Penetrating Lubricant",
  },
  {
    name: "Hydraulic Fluid",
    copy: "Anti-wear fluids for standard and specialized hydraulic systems.",
    image: "/images/product-hydraulic-fluid.webp",
    category: "Hydraulic Fluid",
  },
  {
    name: "Grease",
    copy: "Specialty greases for heat, water, load, and food-processing conditions.",
    image: "/images/product-food-grade-grease.webp",
    category: "Grease",
  },
];

export const faqs = [
  {
    question: "What is lubrication?",
    answer: "Lubrication is the process of applying a substance to reduce friction between surfaces. It helps to minimize wear and tear on machinery. Proper lubrication is essential for maintaining operational efficiency.",
  },
  {
    question: "Why is it important?",
    answer: "Effective lubrication prolongs the life of equipment and reduces maintenance costs. It also enhances performance and reliability. Neglecting lubrication can lead to costly breakdowns.",
  },
  {
    question: "How often should I lubricate?",
    answer: "The frequency of lubrication depends on the type of equipment and its usage. Regular inspections can help determine the right schedule. Always refer to the manufacturer’s guidelines for specific recommendations.",
  },
  {
    question: "What products do you offer?",
    answer: "Our catalog includes food-grade and industrial heat transfer fluids, compressor and refrigeration oils, hydraulic fluids, gear and chain lubricants, greases, white oil, a vacuum-pump lubricant, and a heat-transfer-system cleaner. Supplied TDS and SDS documents are available from each product page.",
  },
  {
    question: "How do I choose the right lubricant?",
    answer: "Choosing the right lubricant depends on factors like temperature, load, and environmental conditions. Consult our product guides for detailed information. Our team is also available to assist you in making the best choice.",
  },
];

export const selectionDetails = [
  ["Application", "Equipment or process the lubricant will serve."],
  ["Temperature", "Typical low and high operating temperatures."],
  ["Load and speed", "Operating loads, speeds, and service intervals."],
  ["Requirements", "Food-safety, environmental, or industry requirements."],
];
