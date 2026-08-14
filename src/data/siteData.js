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

const documentsFor = (tds) => {
  return [
    {
      type: "TDS",
      title: "Technical Data Sheet",
      description: "Product properties, performance data, and recommended applications.",
      href: tds,
    },
    {
      type: "SDS",
      title: "Safety Data Sheet",
      description: "Safety, handling, storage, and emergency information.",
      href: null,
    },
  ];
};

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

const product = ({ tds, ...details }) => ({
  ...productDefaults,
  ...details,
  href: `/product/${details.slug}/`,
  documents: documentsFor(tds),
});

export const products = [
  product({
    id: "msl-c3",
    name: "MSL-C3 Food-Grade Heat Transfer Fluid",
    slug: "msl-c3-food-grade-heat-transfer-fluid",
    image: "/images/catalog/Caldera-3-Food-Grade-Heat-Transfer-Fluid-sm.webp",
    tds: "/documents/tds/MSL-C3-technical-data-sheet.pdf",
    shortDescriptionHtml: "<p>An HT-1 food-grade heat transfer fluid rated for applications with bulk temperatures up to 621°F (327°C).</p>",
    descriptionHtml: "<p>MSL-C3 uses highly pure base stocks free from the impurities and aromatic compounds common in many heat transfer fluids. It is formulated for clean operation, efficient thermal transfer, and long fluid life.</p><p><b>Operating range:</b> minimum temperature 32°F (0°C), maximum bulk temperature 621°F (327°C), and maximum film temperature 669°F (354°C).</p>",
    categories: ["Food Grade", "Heat Transfer Fluid"],
    productCodes: ["MSL-C3"],
    features: ["NSF HT-1 registered", "Supports clean operation and efficient thermal transfer", "Minimal odor"],
  }),
  product({
    id: "msl-c5",
    name: "MSL-C5 High-Flash Food-Grade Heat Transfer Fluid",
    slug: "msl-c5-high-flash-food-grade-heat-transfer-fluid",
    image: "/images/catalog/Caldera-5-High-Flash-Food-Grade-Heat-Transfer-Fluid-sm.webp",
    tds: "/documents/tds/MSL-C5-technical-data-sheet.pdf",
    shortDescriptionHtml: "<p>A high-flash food-grade heat transfer fluid for open and closed systems operating at very high temperatures.</p>",
    descriptionHtml: "<p>MSL-C5 combines pure base fluids with advanced additives to resist oxidation and fluid degradation. The formulation is designed for long service life in high-temperature systems with or without inert gas blanketing.</p><p><b>Operating range:</b> minimum temperature 59°F (15°C) and maximum bulk temperature 644°F (340°C).</p>",
    categories: ["Food Grade", "Heat Transfer Fluid"],
    productCodes: ["MSL-C5"],
    features: ["Suitable for incidental food-contact applications", "High flash point for added safety", "Resists fluid degradation", "Low varnishing tendency", "Low volatility"],
  }),
  product({
    id: "msl-c13",
    name: "MSL-C13 Heat Transfer Oil",
    slug: "msl-c13-heat-transfer-oil",
    image: "/images/products-group.webp",
    tds: "/documents/tds/MSL-C13-technical-data-sheet.pdf",
    shortDescriptionHtml: "<p>A non-toxic, non-hazardous heat transfer oil designed for applications operating at temperatures up to 600°F.</p>",
    descriptionHtml: "<p>MSL-C13 is a cost-conscious heat transfer oil for systems that require an environmentally friendly fluid. It is available in Grades 20 and 40.</p><p>The formulation provides thermal and oxidative stability with low volatility, low vapor pressure, and deposit control that helps keep heat transfer systems clean.</p>",
    categories: ["Heat Transfer Fluid", "Industrial"],
    productCodes: ["MSL-C13"],
    features: ["Excellent thermal and oxidative stability", "Very low volatility and vapor pressure", "Deposit control for system cleanliness", "Environmentally friendly", "Non-toxic and non-hazardous"],
  }),
  product({
    id: "msl-nxt-717",
    name: "MSL-NXT 717 Premium Ammonia Refrigeration Compressor Oil",
    slug: "msl-nxt-717-ammonia-refrigeration-compressor-oil",
    image: "/images/catalog/Premium-Ammonia-Refigeration-Compressor-Oil-sm.webp",
    tds: "/documents/tds/MSL-NXT-717-technical-data-sheet.pdf",
    shortDescriptionHtml: "<p>A hydrocracked ammonia refrigeration lubricant with low oil carryover and strong pumpability in extreme cold.</p>",
    descriptionHtml: "<p>MSL-NXT 717 is a next-generation, two-stage hydrocracked ammonia refrigeration compressor oil. Its reduced ammonia solubility limits viscosity dilution and oil carryover while supporting pumpability at evaporator temperatures down to -45°C.</p><p>The Grade 68 formulation is top-off compatible with most normal paraffinics, naphthenics, alkylbenzenes, PAOs, and single-stage hydrocracked products.</p>",
    categories: ["Ammonia Refrigeration", "Compressor Fluid", "Low Temperature", "Refrigeration Lubricant"],
    productCodes: ["MSL-NXT 717"],
    features: ["Formulated for ammonia refrigeration systems", "Low oil carryover", "Long fluid life", "Reduced lubricant use", "Lower ammonia solubility", "Pumpable at evaporator temperatures down to -45°C", "Compatible with many competitive fluids without flushing"],
  }),
  product({
    id: "msl-rescue-htf-hd",
    name: "MSL-Rescue HTF HD Heavy-Duty Heat Transfer Cleaner Concentrate",
    slug: "msl-rescue-htf-hd-heat-transfer-cleaner-concentrate",
    image: "/images/cta-bearing.webp",
    tds: "/documents/tds/MSL-Rescue-HTF-HD-technical-data-sheet.pdf",
    shortDescriptionHtml: "<p>A fast-acting concentrated cleaner for removing carbon, varnish, and hydrocarbon deposits from heat transfer systems.</p>",
    descriptionHtml: "<p>MSL-Rescue HTF HD is added to existing heat transfer fluid so the system can be cleaned while it remains in operation. Maintaining system cleanliness helps prevent efficiency losses caused by fouling.</p><p><b>Recommended concentration:</b> 10% cleaner to heat transfer fluid. Heavily fouled systems may require a concentration of up to 20%.</p>",
    categories: ["Cleaner", "Heat Transfer Fluid", "Industrial"],
    productCodes: ["MSL-Rescue HTF HD"],
    features: ["Designed for heavily fouled systems", "Cleans while the system remains in operation", "Typically cleans the system within 48 hours"],
  }),
  product({
    id: "snfg-series",
    name: "SNFG Series Synthetic Food-Grade Oils",
    slug: "snfg-series-synthetic-food-grade-oils",
    image: "/images/product-hydraulic-fluid.webp",
    tds: "/documents/tds/SNFG-series-technical-data-sheet.pdf",
    shortDescriptionHtml: "<p>PAO synthetic food-grade oils for pumps, gear units, compressors, mixers, saws, hydraulic units, and air-line systems.</p>",
    descriptionHtml: "<p>The SNFG Series combines PAO synthetic base oils with NSF-approved additives for thermal stability, oxidation resistance, anti-wear performance, and extreme-pressure protection in food-processing equipment.</p><p><b>Available grades:</b> SNFG 22, 32, 46, 68, 100, 150, 220, 320, 460, and 680. The series is intended for meat and poultry packing plants, beverage plants, canneries, bakeries, food packaging, and other industrial food-processing operations.</p>",
    categories: ["Compressor Fluid", "Food Grade", "Gear Oil", "Hydraulic Fluid"],
    productCodes: ["SNFG Series"],
    features: ["Extreme-pressure and anti-wear protection", "Wide operating-temperature range", "Efficient water separation", "Low toxicity", "High oxidation resistance", "Formulated in compliance with 21 CFR 178.3570"],
  }),
];

export const productCategories = [...new Set(products.flatMap((product) => product.categories))]
  .sort((a, b) => a.localeCompare(b));

export const featuredProductSlugs = [
  "msl-c3-food-grade-heat-transfer-fluid",
  "msl-nxt-717-ammonia-refrigeration-compressor-oil",
  "snfg-series-synthetic-food-grade-oils",
];

export const featuredProducts = featuredProductSlugs
  .map((slug) => products.find((product) => product.slug === slug))
  .filter(Boolean);

export const applications = [
  {
    name: "Food-grade oils",
    copy: "Food-grade heat transfer and synthetic oils for demanding food-processing equipment.",
    image: "/images/authentic/poultry-line-closeup.webp",
    category: "Food Grade",
  },
  {
    name: "Synthetic equipment oils",
    copy: "PAO oils for compressors, hydraulic units, pumps, gear units, mixers, and saws.",
    image: "/images/authentic/processing-conveyor-overview.webp",
    category: "Compressor Fluid",
  },
  {
    name: "Ammonia refrigeration",
    copy: "Low-carryover compressor oil for reliable pumpability in extremely cold refrigeration service.",
    image: "/images/authentic/poultry-processing-line.webp",
    category: "Ammonia Refrigeration",
  },
  {
    name: "Heat transfer systems",
    copy: "Thermal fluids and a concentrated cleaner for high-temperature system performance.",
    image: "/images/authentic/processing-conveyor-wide.webp",
    category: "Heat Transfer Fluid",
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
    answer: "Our current catalog includes food-grade and industrial heat transfer fluids, ammonia refrigeration compressor oil, synthetic food-grade oils, and a heat transfer system cleaner. Each listed product includes a Technical Data Sheet.",
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
