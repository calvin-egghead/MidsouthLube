export const technicalDataSheets = [
  {
    productName: "MSL-C3 Food-Grade Heat Transfer Fluid",
    productCode: "MSL-C3",
    href: "/documents/tds/MSL-C3-technical-data-sheet.pdf",
  },
  {
    productName: "MSL-C5 High-Flash Food-Grade Heat Transfer Fluid",
    productCode: "MSL-C5",
    href: "/documents/tds/MSL-C5-technical-data-sheet.pdf",
  },
  {
    productName: "MSL-C13 Heat Transfer Oil",
    productCode: "MSL-C13",
    href: "/documents/tds/MSL-C13-technical-data-sheet.pdf",
  },
  {
    productName: "MSL-NXT 717 Premium Ammonia Refrigeration Compressor Oil",
    productCode: "MSL-NXT 717",
    href: "/documents/tds/MSL-NXT-717-technical-data-sheet.pdf",
  },
  {
    productName: "MSL-Rescue HTF HD Heavy-Duty Heat Transfer Cleaner Concentrate",
    productCode: "MSL-Rescue HTF HD",
    href: "/documents/tds/MSL-Rescue-HTF-HD-technical-data-sheet.pdf",
  },
  {
    productName: "SNFG Series Synthetic Food-Grade Oils",
    productCode: "SNFG Series",
    href: "/documents/tds/SNFG-series-technical-data-sheet.pdf",
  },
];

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

const packageSkuBases = new Map([
  ["MSL-2284SBAWHF", "MSL-2284SBAWHF"],
  ["MSL-2288SFGAWHF", "MSL-2288SFGAWHF"],
  ["MSL-2584SFRHF", "MSL-2584SFRHF"],
  ["MSL-4584SFRGHF", "MSL-4584FRFGHF"],
  ["MSL-C3", "MSL-C3FGHTF"],
  ["MSL-C5", "MSL-C5HFFGHTF"],
  ["MSL-C12", "MSL-C12FGLTHTF"],
  ["MSL-6488LTSSFL", "MSL-6488LTSSFL"],
  ["MSL-6831SFGLTCL", "MSL-6831SFGLTCL"],
  ["MSL-NXT 717", "MSL-NXT717"],
  ["MSL-6061FGCF6", "MSL-6061FGCF6"],
  ["MSL-2015SCF8", "MSL-2015SCF8"],
  ["MSL-6321UCF10", "MSL-6321UCF10"],
  ["MSL-3045SHTSGG", "MSL-3045SHTSGG"],
  ["MSL-2087SFGEPACG", "MSL-2087SFGEPACG"],
  ["MSL-3157SFGEPCSG", "MSL-3157SFGEPCSG"],
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
    uses: details.uses || [
      `${categories[0] || "General"} application - client use case pending`,
      "Secondary equipment use - client use case pending",
      "Operating-condition use - client use case pending",
    ],
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
    sds: [{ title: "Safety Data Sheet", href: "/documents/sds/msl-c3-food-grade-heat-transfer-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>An HT-1 food-grade heat transfer fluid rated for applications with bulk temperatures up to 621°F (327°C).</p>",
    descriptionHtml: "<p>MSL-C3 uses highly pure base stocks free from the impurities and aromatic compounds common in many heat transfer fluids. It is formulated for clean operation, efficient thermal transfer, and long fluid life.</p><p><b>Operating range:</b> minimum temperature 32°F (0°C), maximum bulk temperature 621°F (327°C), and maximum film temperature 669°F (354°C).</p>",
    categories: ["Thermal Fluid"],
    productCodes: ["MSL-C3", "MSL-C3FGHTF"],
    features: ["NSF HT-1 registered", "Supports clean operation and efficient thermal transfer", "Minimal odor"],
  }),
  product({
    id: "msl-c5",
    name: "MSL-C5 High-Flash Food-Grade Heat Transfer Fluid",
    slug: "msl-c5-high-flash-food-grade-heat-transfer-fluid",
    image: "/images/application-heat.webp",
    tds: "/documents/tds/MSL-C5-technical-data-sheet.pdf",
    sds: [{ title: "Safety Data Sheet", href: "/documents/sds/msl-c5-high-flash-food-grade-heat-transfer-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A high-flash food-grade heat transfer fluid for open and closed systems operating at very high temperatures.</p>",
    descriptionHtml: "<p>MSL-C5 combines pure base fluids with advanced additives to resist oxidation and fluid degradation. The formulation is designed for long service life in high-temperature systems with or without inert gas blanketing.</p><p><b>Operating range:</b> minimum temperature 59°F (15°C) and maximum bulk temperature 644°F (340°C).</p>",
    categories: ["Thermal Fluid"],
    productCodes: ["MSL-C5", "MSL-C5HFFGHTF"],
    features: ["Suitable for incidental food-contact applications", "High flash point for added safety", "Resists fluid degradation", "Low varnishing tendency", "Low volatility"],
  }),
  product({
    id: "msl-nxt-717",
    name: "MSL-NXT 717 Premium Ammonia Refrigeration Compressor Oil",
    slug: "msl-nxt-717-ammonia-refrigeration-compressor-oil",
    image: "/images/catalog/Premium-Ammonia-Refigeration-Compressor-Oil-sm.webp",
    tds: "/documents/tds/MSL-NXT-717-technical-data-sheet.pdf",
    sds: [
      { title: "Safety Data Sheet - current revision", href: "/documents/sds/nxt-717-sds-2025.pdf" },
      { title: "Safety Data Sheet - 2024 revision", href: "/documents/sds/nxt-717-sds-2024.pdf" },
      { title: "Safety Data Sheet - legacy 2033 name", href: "/documents/sds/2033-nxt-717-legacy-sds.pdf" },
    ],
    shortDescriptionHtml: "<p>A hydrocracked ammonia refrigeration lubricant with low oil carryover and strong pumpability in extreme cold.</p>",
    descriptionHtml: "<p>MSL-NXT 717 is a next-generation, two-stage hydrocracked ammonia refrigeration compressor oil. Its reduced ammonia solubility limits viscosity dilution and oil carryover while supporting pumpability at evaporator temperatures down to -45°C.</p><p>The Grade 68 formulation is top-off compatible with most normal paraffinics, naphthenics, alkylbenzenes, PAOs, and single-stage hydrocracked products.</p>",
    categories: ["Refrigeration Oil"],
    productCodes: ["MSL-NXT 717", "2033", "2033-68"],
    features: ["Formulated for ammonia refrigeration systems", "Low oil carryover", "Long fluid life", "Reduced lubricant use", "Lower ammonia solubility", "Pumpable at evaporator temperatures down to -45°C", "Compatible with many competitive fluids without flushing"],
  }),
  product({
    id: "msl-2015",
    name: "Synthetic 8000 Hour Compressor Fluid",
    slug: "synthetic-8000-hour-compressor-fluid",
    image: "/images/catalog/Synthetic-8000-Hour-Compressor-Fluid-sm.webp",
    sds: [{ title: "Safety Data Sheet - ISO 46", href: "/documents/sds/2015-46-synthetic-8000-hour-compressor-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A full-synthetic compressor fluid engineered for 8,000-plus hours of service and demanding operating conditions.</p>",
    descriptionHtml: "<p>MSL-2015 uses high-performance synthetic base stocks and additives to protect compressor components against wear, rust, corrosion, oxidation, and thermal breakdown.</p><p><b>Available grades:</b> ISO 32, 46, 68, and 100. The supplied SDS covers ISO 46.</p>",
    categories: ["Compressor Fluid"],
    productCodes: ["MSL-2015SCF8", "2015-46"],
    features: ["8,000-hour oil life at 100°C discharge temperature", "Excellent thermal stability", "Resists water contamination", "High flash point", "Protects against wear, rust, and corrosion"],
  }),
  product({
    id: "msl-2032",
    name: "Synthetic EP Gear Fluid",
    slug: "synthetic-ep-gear-fluid",
    image: "/images/product-chain-lubricant.webp",
    sds: [{ title: "Safety Data Sheet", href: "/documents/sds/2032-synthetic-ep-gear-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A synthetic extreme-pressure gear fluid for heavy-load and high-temperature industrial applications.</p>",
    descriptionHtml: "<p>MSL-2032 combines enhanced extreme-pressure additives with a long-life synthetic formulation for demanding gear service. It is designed to maintain film strength, resist water contamination, and control carbon and varnish.</p><p><b>Available grades:</b> ISO 150, 220, 320, and 460.</p>",
    categories: ["Gear Fluid"],
    productCodes: ["MSL-2032", "2032"],
    features: ["Excellent lubricity and high film strength", "Long oil life", "Resists water contamination", "Controls carbon and varnish formation", "Protects against wear, rust, and corrosion"],
  }),
  product({
    id: "msl-2082",
    name: "Food-Grade High-Temperature Gear Lubricant",
    slug: "food-grade-high-temperature-gear-lubricant",
    image: "/images/product-chain-lubricant.webp",
    sds: [{ title: "Safety Data Sheet", href: "/documents/sds/2082-food-grade-high-temperature-gear-lubricant-sds.pdf" }],
    shortDescriptionHtml: "<p>A food-grade gear lubricant for equipment operating under elevated temperatures.</p>",
    descriptionHtml: "<p>MSL-2082 is intended for high-temperature gear lubrication in food-processing and other clean-industry equipment. Select the grade to match the equipment manufacturer's viscosity and operating-temperature requirements.</p>",
    categories: ["Gear Fluid"],
    productCodes: ["MSL-2082", "2082"],
    features: ["Food-grade formulation", "Designed for elevated-temperature gear service", "Supports wear protection under load", "Suitable for food-processing equipment"],
  }),
  product({
    id: "msl-2087",
    name: "Synthetic Food-Grade EP Aluminum Complex Grease",
    slug: "synthetic-food-grade-ep-aluminum-complex-grease",
    image: "/images/catalog/Synthetic-Food-Grade-EP-Aluminum-Complex-Grease-10X1-Case.webp",
    sds: [{ title: "Safety Data Sheet", href: "/documents/sds/2087-synthetic-food-grade-aluminum-complex-grease-sds.pdf" }],
    shortDescriptionHtml: "<p>A synthetic H1 aluminum-complex grease for demanding food-processing environments.</p>",
    descriptionHtml: "<p>MSL-2087SFGEPACG uses synthetic base stocks and an aluminum-complex thickener system for thermal stability, water resistance, and protection in wet or heavily loaded food-processing applications.</p><p><b>Packaging:</b> case of ten 14-ounce tubes.</p>",
    categories: ["Grease"],
    productCodes: ["MSL-2087SFGEPACG", "2087"],
    features: ["Meets H1 requirements for incidental food contact", "Excellent oxidative and thermal stability", "Resists water contamination", "Rust and corrosion control", "High flash point"],
  }),
  product({
    id: "msl-2090",
    name: "Food-Grade White Oil",
    slug: "food-grade-white-oil",
    image: "/images/product-hydraulic-fluid.webp",
    sds: [
      { title: "Safety Data Sheet - Grade 20", href: "/documents/sds/2090-20-food-grade-white-oil-sds.pdf" },
      { title: "Safety Data Sheet - Grade 22", href: "/documents/sds/2090-22-food-grade-white-oil-sds.pdf" },
    ],
    shortDescriptionHtml: "<p>A highly refined food-grade white mineral oil for general industrial lubrication where a clean, colorless oil is required.</p>",
    descriptionHtml: "<p>MSL-2090 is supplied in Grades 20 and 22 for lubrication applications requiring food-grade white oil. Confirm the appropriate grade and incidental-contact requirements with Mid South before use.</p>",
    categories: ["Mineral Oil"],
    productCodes: ["MSL-2090", "2090-20", "2090-22"],
    features: ["Highly refined white mineral oil", "Clean, colorless formulation", "Available in two grades", "Intended for industrial lubrication"],
  }),
  product({
    id: "msl-2066",
    name: "Synthetic Penetrating Lubricant",
    slug: "synthetic-penetrating-lubricant",
    image: "/images/product-hydraulic-fluid.webp",
    shortDescriptionHtml: "<p>A quote-based synthetic penetrating lubricant for industrial maintenance applications.</p>",
    descriptionHtml: "<p>MSL-2066 is cataloged as a synthetic penetrating lubricant. Contact Mid South for available package sizes, technical documentation, and application guidance.</p>",
    categories: ["Penetrating Lubricant"],
    productCodes: ["MSL-2066", "2066"],
    features: ["Synthetic penetrating lubricant", "Quote-based ordering", "Application guidance available from Mid South"],
  }),
  product({
    id: "msl-2243",
    name: "Mineral Oil AW Hydraulic Fluid",
    slug: "mineral-oil-aw-hydraulic-fluid",
    image: "/images/product-hydraulic-fluid.webp",
    sds: [{ title: "Safety Data Sheet", href: "/documents/sds/2243-mineral-oil-aw-hydraulic-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A mineral-oil anti-wear hydraulic fluid for general industrial hydraulic systems.</p>",
    descriptionHtml: "<p>MSL-2243 is formulated for hydraulic equipment that requires dependable anti-wear protection, oxidation and corrosion control, foam suppression, and water separation.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2243", "2243"],
    features: ["Anti-wear formulation", "Oxidation and corrosion control", "Readily separates from water", "Foam suppression", "High flash point"],
  }),
  product({
    id: "msl-2244",
    name: "Semi-Synthetic AW Hydraulic Fluid",
    slug: "semi-synthetic-aw-hydraulic-fluid",
    image: "/images/product-hydraulic-fluid.webp",
    sds: [{ title: "Safety Data Sheet", href: "/documents/sds/2244-semi-synthetic-aw-hydraulic-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A semi-synthetic anti-wear fluid for general-purpose industrial hydraulic systems.</p>",
    descriptionHtml: "<p>MSL-2244 combines mineral and synthetic base fluids for hydraulic applications that need balanced wear protection, fluid life, and cold-temperature performance.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2244", "2244"],
    features: ["Anti-wear protection", "Semi-synthetic formulation", "Rust and corrosion control", "Water-separation performance", "Suitable for general hydraulic service"],
  }),
  product({
    id: "msl-2284",
    name: "Synthetic Biodegradable Hydraulic Fluid",
    slug: "synthetic-biodegradable-hydraulic-fluid",
    image: "/images/catalog/Synthetic-Biodegradable-Hydraulic-Fluid-sm.webp",
    shortDescriptionHtml: "<p>A zinc-free synthetic biodegradable fluid for hydraulic systems operating under severe conditions.</p>",
    descriptionHtml: "<p>MSL-2284SBAWHF combines synthetic base fluids and additives for long fluid life, water separation, low volatility, and protection against wear, rust, corrosion, carbon, and varnish deposits.</p><p><b>Available grades:</b> ISO 32, 46, and 68.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2284SBAWHF", "2284"],
    features: ["Biodegradable synthetic formulation", "Zinc free", "Protects against wear, rust, and corrosion", "Readily separates from water", "Controls carbon and varnish deposits", "Low volatility"],
  }),
  product({
    id: "msl-2288",
    name: "Synthetic Food-Grade AW Hydraulic Fluid",
    slug: "synthetic-food-grade-aw-hydraulic-fluid",
    image: "/images/product-hydraulic-fluid.webp",
    sds: [
      { title: "Safety Data Sheet - ISO 32", href: "/documents/sds/2288-32-synthetic-food-grade-hydraulic-fluid-sds.pdf" },
      { title: "Safety Data Sheet - ISO 46", href: "/documents/sds/2288-46-synthetic-food-grade-hydraulic-fluid-sds.pdf" },
      { title: "Safety Data Sheet - ISO 68", href: "/documents/sds/2288-68-synthetic-food-grade-hydraulic-fluid-sds.pdf" },
    ],
    shortDescriptionHtml: "<p>A biodegradable synthetic H1 hydraulic fluid with anti-wear protection for food-processing and environmentally sensitive applications.</p>",
    descriptionHtml: "<p>MSL-2288SFGAWHF resists sludge and varnish while providing wear, rust, and corrosion protection. It is formulated for hydraulic systems that require incidental-food-contact suitability or a biodegradable lubricant.</p><p><b>Available grades:</b> ISO 32, 46, 68, and 100. Supplied SDS documents cover ISO 32, 46, and 68.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2288SFGAWHF", "2288"],
    features: ["Meets H1 requirements for incidental food contact", "Biodegradable formulation", "Protects against wear, rust, and corrosion", "Readily separates from water", "Controls carbon and varnish formation", "Low volatility"],
  }),
  product({
    id: "msl-2384",
    name: "Synthetic Multi-Viscosity AW Hydraulic Fluid",
    slug: "synthetic-multi-viscosity-aw-hydraulic-fluid",
    image: "/images/product-hydraulic-fluid.webp",
    sds: [{ title: "Safety Data Sheet", href: "/documents/sds/2384-synthetic-multi-viscosity-aw-hydraulic-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A high-viscosity-index synthetic hydraulic fluid for protection across a broad operating-temperature range.</p>",
    descriptionHtml: "<p>MSL-2384 is designed to maintain useful fluidity in cold conditions while protecting hydraulic components against wear, rust, and copper corrosion in demanding service.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2384", "2384"],
    features: ["High viscosity index", "Maintains fluidity in cold temperatures", "Anti-wear protection", "Rust and corrosion control", "Excellent water separation"],
  }),
  product({
    id: "msl-2584",
    name: "Synthetic Fire-Resistant Hydraulic Fluid",
    slug: "synthetic-fire-resistant-hydraulic-fluid",
    image: "/images/catalog/Synthetic-Fire-Resistant-Hydraulic-Fluid-sm.webp",
    sds: [{ title: "Safety Data Sheet", href: "/documents/sds/2584-synthetic-fire-resistant-hydraulic-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A synthetic hydraulic fluid engineered for fire resistance, pump protection, and long service life.</p>",
    descriptionHtml: "<p>MSL-2584SFRHF provides fire resistance without the maintenance demands of many water-glycol fluids. Its synthetic formulation supports oxidative stability, water separation, corrosion resistance, and anti-wear performance.</p><p><b>Available grades:</b> ISO 32, 46, 68, and 100.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-2584SFRHF", "2584"],
    features: ["High flash point", "Superior pump protection", "Readily separates from water", "Oxidative stability", "High viscosity index", "Protects against wear, rust, and corrosion"],
  }),
  product({
    id: "msl-4584",
    name: "Synthetic Fire-Resistant Food-Grade Hydraulic Fluid",
    slug: "synthetic-fire-resistant-food-grade-hydraulic-fluid",
    image: "/images/catalog/Synthetic-Fire-Resistant-Food-Grade-Hydraulic-Fluid-sm.webp",
    shortDescriptionHtml: "<p>A biodegradable fire-resistant hydraulic fluid formulated for food-processing equipment and broad operating temperatures.</p>",
    descriptionHtml: "<p>MSL-4584SFRGHF is formulated to meet H1 requirements for incidental food contact and FDA 21 CFR 178.3570. It provides oxidative stability, corrosion resistance, anti-wear protection, and water separation for demanding hydraulic systems.</p><p><b>SKU note:</b> supplied package SKUs use the MSL-4584FRFGHF base code.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["MSL-4584SFRGHF", "MSL-4584FRFGHF", "4584"],
    features: ["Meets H1 requirements for incidental food contact", "Fire-resistant and biodegradable formulation", "Protects against wear, rust, and corrosion", "Readily separates from water", "High viscosity index", "Low volatility"],
  }),
  product({
    id: "dubois-2585-68",
    name: "2585-68 Fire-Resistant Hydraulic Fluid",
    slug: "2585-68-fire-resistant-hydraulic-fluid",
    image: "/images/catalog/Synthetic-Fire-Resistant-Hydraulic-Fluid-sm.webp",
    sds: [{ title: "Safety Data Sheet - ISO 68", href: "/documents/sds/2585-68-fire-resistant-hydraulic-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A DuBois industrial hydraulic functional fluid formulated for fire-resistant service.</p>",
    descriptionHtml: "<p>DuBois 2585-68 FRHF is an ISO 68 hydraulic fluid for industrial applications requiring a fire-resistant functional fluid. Review the supplied SDS and confirm equipment compatibility with Mid South before use.</p>",
    categories: ["Hydraulic Fluid"],
    productCodes: ["2585-68", "FRHF"],
    features: ["Fire-resistant hydraulic functional fluid", "ISO 68 grade", "Intended for industrial use", "Not classified as hazardous under the supplied GHS safety data sheet"],
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
    name: "Synthetic High-Temperature Silica Gel Grease",
    slug: "synthetic-high-temperature-silica-gel-grease",
    image: "/images/catalog/Synthetic-High-Temperature-Silica-Gel-Grease_.webp",
    shortDescriptionHtml: "<p>A food-grade semi-fluid silica-gel grease for high-temperature bearing applications.</p>",
    descriptionHtml: "<p>MSL-3045SHTSGG combines synthetic base stocks, silica-gel thickeners, and performance additives for thermal stability, water resistance, film strength, and corrosion control in severe service.</p><p>The formulation meets H1 requirements for incidental food contact and complies with FDA 21 CFR 178.3570.</p>",
    categories: ["Grease"],
    productCodes: ["MSL-3045SHTSGG", "3045"],
    features: ["Meets H1 requirements for incidental food contact", "Oxidative and thermal stability", "Resists water contamination", "High film strength", "Rust and corrosion control", "High flash point"],
  }),
  product({
    id: "blue-star-9600-40",
    name: "Blue Star 9600/40 Grease",
    slug: "blue-star-9600-40-grease",
    image: "/images/product-food-grade-grease.webp",
    shortDescriptionHtml: "<p>A quote-based grease cataloged under the Blue Star 9600/40 product number.</p>",
    descriptionHtml: "<p>Blue Star 9600/40 is available through Mid South by quote. Contact the team to confirm application requirements, package availability, and the current technical and safety documentation.</p>",
    categories: ["Grease"],
    productCodes: ["Blue Star 9600/40", "9600/40"],
    features: ["Grease product", "Quote-based ordering", "Application guidance available from Mid South"],
  }),
  product({
    id: "msl-6061",
    name: "6000 Hour Food-Grade Compressor Fluid",
    slug: "6000-hour-food-grade-compressor-fluid",
    image: "/images/catalog/6000-Hour-Food-Grade-Compresor-Fluid-sm.webp",
    sds: [{ title: "Safety Data Sheet - ISO 46", href: "/documents/sds/6061-46-food-grade-compressor-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A synthetic H1 compressor fluid designed for extended drain intervals in food-processing operations.</p>",
    descriptionHtml: "<p>MSL-6061FGCF6 provides 4,000 to 6,000 hours of oil life at a 100°C discharge temperature while protecting against oxidation, water contamination, rust, corrosion, carbon, and varnish.</p><p><b>Available grades:</b> ISO 32, 46, 68, and 100. The supplied SDS covers ISO 46.</p>",
    categories: ["Compressor Fluid"],
    productCodes: ["MSL-6061FGCF6", "6061-46"],
    features: ["Meets H1 requirements for incidental food contact", "4,000-6,000-hour oil life at 100°C discharge temperature", "Oxidatively stable", "Resists water contamination", "Controls carbon and varnish formation", "High flash point"],
  }),
  product({
    id: "msl-6064",
    name: "8000 Hour Food-Grade Compressor Fluid",
    slug: "8000-hour-food-grade-compressor-fluid",
    image: "/images/application-compressor.webp",
    sds: [{ title: "Safety Data Sheet - ISO 46", href: "/documents/sds/6064-46-food-grade-compressor-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A long-life H1 compressor fluid for harsh environments and high-temperature food-processing applications.</p>",
    descriptionHtml: "<p>MSL-6064 is formulated for extended oil-drain intervals with strong carbon and varnish control. Its food-grade synthetic formulation is intended to protect compressor components under demanding operating conditions.</p><p><b>Available grades:</b> ISO 32, 46, 68, and 100. The supplied SDS covers ISO 46.</p>",
    categories: ["Compressor Fluid"],
    productCodes: ["MSL-6064", "6064-46"],
    features: ["Meets H1 requirements for incidental food contact", "8,000-hour oil life at 100°C discharge temperature", "Thermal and oxidative stability", "Controls carbon and varnish formation", "Resists water contamination", "High flash point"],
  }),
  product({
    id: "msl-6066",
    name: "Synthetic Food-Grade Penetrating Lubricant",
    slug: "synthetic-food-grade-penetrating-lubricant",
    image: "/images/product-hydraulic-fluid.webp",
    shortDescriptionHtml: "<p>A quote-based synthetic food-grade penetrating lubricant for maintenance applications.</p>",
    descriptionHtml: "<p>MSL-6066 is cataloged as a synthetic food-grade penetrating lubricant. Contact Mid South to confirm application requirements, available package sizes, and the current technical and safety documentation.</p>",
    categories: ["Penetrating Lubricant"],
    productCodes: ["MSL-6066", "6066"],
    features: ["Synthetic penetrating lubricant", "Food-grade product designation", "Quote-based ordering"],
  }),
  product({
    id: "msl-6243",
    name: "Semi-Synthetic Vacuum Pump Lubricant",
    slug: "semi-synthetic-vacuum-pump-lubricant",
    image: "/images/application-compressor.webp",
    sds: [{ title: "Safety Data Sheet - ISO 68", href: "/documents/sds/6243-68-semi-synthetic-vacuum-pump-lubricant-sds.pdf" }],
    shortDescriptionHtml: "<p>A low-vapor-pressure vacuum pump lubricant with thermal, chemical, and shear stability.</p>",
    descriptionHtml: "<p>MSL-6243 is designed for long fluid life and protection against wear, rust, corrosion, varnish, carbon, and sludge deposits in vacuum pumps. The formulation exceeds DIN 51506 VD-L requirements.</p><p><b>Available grades:</b> ISO 22, 32, 46, 68, and 100. The supplied SDS covers ISO 68.</p>",
    categories: ["Vacuum Pump Lubricant"],
    productCodes: ["MSL-6243", "6243-68"],
    features: ["Very low vapor pressure", "Excellent thermal and chemical stability", "Oxidative stability", "High flash point", "Low volatility", "Controls varnish, carbon, and sludge deposits"],
  }),
  product({
    id: "msl-6321",
    name: "Universal 10000 Hour Compressor Fluid",
    slug: "universal-10000-hour-compressor-fluid",
    image: "/images/catalog/Universal-10000-Hour-Compressor-Fluid-sm.webp",
    sds: [{ title: "Safety Data Sheet - ISO 46", href: "/documents/sds/6321-46-universal-compressor-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>A universal long-life compressor fluid compatible with most OEM PAG compressor lubricants.</p>",
    descriptionHtml: "<p>MSL-6321UCF10 is designed for top-off compatibility with a wide range of OEM and aftermarket rotary-screw compressor fluids, helping avoid flushing during changeover. It provides up to 10,000 hours of service with wear, corrosion, water-contamination, and sludge protection.</p><p><b>Available grades:</b> ISO 32 and 46. The supplied SDS covers ISO 46.</p>",
    categories: ["Compressor Fluid"],
    productCodes: ["MSL-6321UCF10", "6321-46"],
    features: ["10,000-hour oil life at 100°C discharge temperature", "Compatible with most OEM PAG compressor lubricants", "Resists water contamination", "Protects against wear, rust, and corrosion", "Helps reduce flushing during compatible changeovers"],
  }),
  product({
    id: "msl-6488",
    name: "Low-Temperature Synthetic Silicone Freezer Lubricant",
    slug: "low-temperature-synthetic-silicone-freezer-lubricant",
    image: "/images/catalog/Low-Temperature-Synthetic-Silicone-Freezer-Lubricant-sm.webp",
    shortDescriptionHtml: "<p>A food-grade silicone lubricant formulated for spiral freezers operating from -40°F to -80°F.</p>",
    descriptionHtml: "<p>MSL-6488LTSSFL provides clean lubrication, film strength, wear protection, and deposit control in severe low-temperature freezer applications. It meets H1 requirements for incidental food contact.</p>",
    categories: ["Freezer Lubes"],
    productCodes: ["MSL-6488LTSSFL", "6488"],
    features: ["Meets H1 requirements for incidental food contact", "Designed for -40°F to -80°F service", "Excellent low-temperature properties", "Enhanced film strength and wear protection", "Carbon and varnish control", "High flash point"],
  }),
  product({
    id: "msl-6831",
    name: "Synthetic Food-Grade Low-Temperature Chain Lubricant",
    slug: "synthetic-food-grade-low-temperature-chain-lubricant",
    image: "/images/catalog/Synthetic-Food-Grade-Low-Temperature-Chain-Lubricant-sm.webp",
    sds: [{ title: "Safety Data Sheet - ISO 15", href: "/documents/sds/6831-15-food-grade-low-temperature-chain-lubricant-sds.pdf" }],
    shortDescriptionHtml: "<p>An H1 chain lubricant engineered for spiral freezers and other extreme low-temperature applications.</p>",
    descriptionHtml: "<p>MSL-6831SFGLTCL combines synthetic base fluids and advanced additives for cold-temperature fluidity, anti-wear protection, and reliable chain coverage. It resists water washout, fling-off, rust, corrosion, and deposits.</p><p><b>Supplied grade:</b> ISO 15.</p>",
    categories: ["Freezer Lubes"],
    productCodes: ["MSL-6831SFGLTCL", "6831-15"],
    features: ["Meets H1 requirements for incidental food contact", "Maintains fluidity at very low temperatures", "Excellent film strength and anti-wear protection", "Resists water washout and fling-off", "Rust, corrosion, and deposit control"],
  }),
  product({
    id: "msl-c12",
    name: "MSL-C12 Food-Grade Low-Temperature Heat Transfer Fluid",
    slug: "msl-c12-food-grade-low-temperature-heat-transfer-fluid",
    image: "/images/application-heat.webp",
    sds: [{ title: "Safety Data Sheet", href: "/documents/sds/msl-c12-food-grade-low-temperature-heat-transfer-fluid-sds.pdf" }],
    shortDescriptionHtml: "<p>An HT-1 food-grade heat transfer fluid for low-temperature systems operating up to 450°F (232°C).</p>",
    descriptionHtml: "<p>MSL-C12 uses highly pure, clear base fluids free from many impurities and aromatic compounds found in conventional heat transfer oils. It is formulated for efficient heat transfer, clean operation, low-temperature performance, and long fluid life.</p>",
    categories: ["Thermal Fluid"],
    productCodes: ["MSL-C12", "MSL-C12FGLTHTF"],
    features: ["NSF HT-1 registered", "Meets requirements for incidental food contact", "Low varnishing tendency", "Supports clean operation and efficient thermal transfer", "Minimal odor"],
  }),
];

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
