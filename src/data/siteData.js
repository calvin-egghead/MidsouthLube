import productRecords from "./generated/products.json";
import variationRecords from "./generated/variations.json";

const variationById = new Map(variationRecords.map((variation) => [variation.id, variation]));

const packageSizes = [
  ["1 Gallon Pail", "1P"],
  ["5 Gallon Pail", "5P"],
  ["55 Gallon Drum", "55D"],
  ["275 Gallon Tote", "275T"],
];

const skuFamilyPrefixes = new Map([
  ["MSL-2284SBAWHF", "MSL-2284SBAWHF"],
  ["MSL-2288SFGAWHF", "MSL-2288SFGAWHF"],
  ["MSL-2584SFRHF", "MSL-2584SFRHF"],
  ["MSL-4584SFRGHF", "MSL-4584FRFGHF"],
  ["MSL-C3FGHTF", "MSL-C3FGHTF"],
  ["MSL-C5HFFGHTF", "MSL-C5HFFGHTF"],
  ["MSL-C12FGLTHTF", "MSL-C12FGLTHTF"],
  ["MSL-6488LTSSFL", "MSL-6488LTSSFL"],
  ["MSL-6831SFGLTCL", "MSL-6831SFGLTCL"],
  ["MSL-NXT717", "MSL-NXT717"],
  ["MSL-6061FGCF6", "MSL-6061FGCF6"],
  ["MSL-2015SCF8", "MSL-2015SCF8"],
  ["MSL-6321UCF10", "MSL-6321UCF10"],
  ["MSL-3045SHTSGG", "MSL-3045SHTSGG"],
  ["MSL-2087SFGEPACG", "MSL-2087SFGEPACG"],
  ["MSL-3157SFGEPCSG", "MSL-3157SFGEPCSG"],
]);

const labelsByProductCode = new Map([
  ["MSL-2090BO", [
    {
      sku: "MSL-2090BO-20-55D",
      option: "Grade 20 - 55 Gallon Drum",
      href: "/documents/labels/MSL-2090BO-20-55D-drum-label.pdf",
    },
  ]],
  ["MSL-2185SFGCLWT", [
    {
      sku: "MSL-2185-22",
      option: "Grade 22 - 5 Gallon Pail",
      href: "/documents/labels/MSL-2185-22-pail-label.pdf",
    },
    {
      sku: "MSL-2185SFGCLWT-22-55D",
      option: "Grade 22 - 55 Gallon Drum",
      href: "/documents/labels/MSL-2185SFGCLWT-22-55D-drum-label.pdf",
    },
    {
      sku: "MSL-2185SFGCLWT-68-5P",
      option: "Grade 68 - 5 Gallon Pail",
      href: "/documents/labels/MSL-2185SFGCLWT-68-5P-pail-label.pdf",
    },
  ]],
  ["MSL-2288SFGAWHF", [
    {
      sku: "MSL-2288SFGAWHF-46-275T",
      option: "ISO 46 - 275 Gallon Tote",
      href: "/documents/labels/MSL-2288SFGAWHF-46-275T-tote-label.pdf",
    },
    {
      sku: "MSL-2288SFGAWHF-68-55D",
      option: "ISO 68 - 55 Gallon Drum",
      href: "/documents/labels/MSL-2288SFGAWHF-68-55D-drum-label.pdf",
    },
    {
      sku: "MSL-2288SFGAWHF-68-275T",
      option: "ISO 68 - 275 Gallon Tote",
      href: "/documents/labels/MSL-2288SFGAWHF-68-275T-tote-label.pdf",
    },
  ]],
]);

const productCodeOverridesBySlug = new Map([
  ["caldera-5-high-flash-food-grade-heat-transfer-fluid", ["MSL-C5HFFGHTF"]],
]);

const documentFilesByProductCode = new Map([]);

const documentsFor = (productCodes) => {
  const files = productCodes.map((code) => documentFilesByProductCode.get(code)).find(Boolean) || {};
  return [
    {
      type: "TDS",
      title: "Technical Data Sheet",
      description: "Product properties, performance data, and recommended applications.",
      href: files.tds || null,
    },
    {
      type: "SDS",
      title: "Safety Data Sheet",
      description: "Safety, handling, storage, and emergency information.",
      href: files.sds || null,
    },
  ];
};

const packageSkusFor = (productCodes) => {
  const prefix = productCodes.map((code) => skuFamilyPrefixes.get(code)).find(Boolean);
  if (!prefix) return [];
  return packageSizes.map(([packaging, suffix]) => ({
    packaging,
    sku: `${prefix}-${suffix}`,
  }));
};

export const normalizeDashes = (value = "") => value
  .replace(/[\u2014\u2013]/g, "-")
  .replace(/&(?:mdash|ndash);|&#(?:8211|8212);/gi, "-");

export const normalizeHtml = (value = "") => normalizeDashes(value);

const localImage = (source, slug) => {
  if (slug === "synthetic-high-temperature-silica-gel-grease") {
    return "/images/catalog/Synthetic-High-Temperature-Silica-Gel-Grease_.webp";
  }
  if (!source) return "/images/products-group.webp";
  return `/images/catalog/${source.split("/").pop()}`;
};

const archivedProducts = productRecords
  .map((product) => {
    const optionAttribute = product.attributes.find((attribute) => attribute.has_variations);
    const featureAttributes = product.attributes
      .filter((attribute) => !attribute.has_variations)
      .flatMap((attribute) => attribute.terms.map((term) => normalizeDashes(term.name)));
    const fallbackOptions = optionAttribute?.terms.map((term) => normalizeDashes(term.name)) || [];
    const variations = product.variations.map((summary, index) => {
      const detail = variationById.get(summary.id) || {};
      const summaryValue = summary.attributes.find((attribute) => attribute.value)?.value;
      const option = summaryValue || detail.variation || fallbackOptions[index] || "Option details on request";

      return {
        id: summary.id,
        sku: detail.sku || "Not assigned",
        option: normalizeDashes(option.replace(/^Available Options:\s*/i, "")),
        inStock: Boolean(detail.is_in_stock),
        purchasable: Boolean(detail.is_purchasable),
      };
    });

    const productCodes = productCodeOverridesBySlug.get(product.slug)
      || product.tags.map((tag) => normalizeDashes(tag.name));
    const labels = productCodes.flatMap((code) => labelsByProductCode.get(code) || []);

    return {
      id: product.id,
      name: normalizeDashes(product.name),
      slug: product.slug,
      href: `/product/${product.slug}/`,
      image: localImage(product.images[0]?.src, product.slug),
      descriptionHtml: normalizeHtml(product.description),
      shortDescriptionHtml: normalizeHtml(product.short_description),
      categories: product.categories.map((category) => normalizeDashes(category.name)),
      productCodes,
      features: featureAttributes,
      variations,
      packageSkus: packageSkusFor(productCodes),
      labels,
      documents: documentsFor(productCodes),
      inStock: Boolean(product.is_in_stock),
      purchasable: Boolean(product.is_purchasable),
    };
  });

const newProducts = [
  {
    id: "new-2090",
    name: "Food Grade White Oil",
    slug: "food-grade-white-oil",
    href: "/product/food-grade-white-oil/",
    image: "/images/products-group.webp",
    descriptionHtml: "<p>Food-grade white oil supplied by Mid South Lubricants for food-processing and related applications. Contact our team with the equipment, operating conditions, and required grade for selection support.</p><p><b>Current labeled option:</b> Grade 20 in a 55 gallon drum.</p>",
    shortDescriptionHtml: "<p>Food-grade white oil available in a Grade 20, 55 gallon drum configuration.</p>",
    categories: ["Food Grade", "White Oil"],
    productCodes: ["MSL-2090BO"],
    features: ["Food-grade formulation", "Made in the USA", "55 gallon drum label available"],
    variations: [
      {
        id: "msl-2090bo-20-55d",
        sku: "MSL-2090BO-20-55D",
        option: "Grade 20 - 55 Gallon Drum",
        inStock: false,
        purchasable: false,
      },
    ],
    packageSkus: [],
    labels: labelsByProductCode.get("MSL-2090BO"),
    documents: documentsFor(["MSL-2090BO"]),
    inStock: false,
    purchasable: false,
  },
  {
    id: "new-2185",
    name: "Synthetic Food Grade Chain Lubricant with Tackifier",
    slug: "synthetic-food-grade-chain-lubricant-with-tackifier",
    href: "/product/synthetic-food-grade-chain-lubricant-with-tackifier/",
    image: "/images/product-chain-lubricant.webp",
    descriptionHtml: "<p>Synthetic food-grade chain lubricant with tackifier for chain and conveyor applications. Contact Mid South Lubricants with the equipment, temperature range, and operating conditions for grade selection support.</p><p><b>Current labeled grades:</b> 22 and 68 in 5 gallon pails, plus Grade 22 in a 55 gallon drum.</p>",
    shortDescriptionHtml: "<p>Synthetic food-grade chain lubricant with tackifier, with current labels for Grade 22 and Grade 68 package options.</p>",
    categories: ["Chain Lubricant", "Food Grade"],
    productCodes: ["MSL-2185SFGCLWT"],
    features: ["Synthetic formulation", "Food-grade chain lubricant", "Tackified for chain and conveyor service", "Made in the USA"],
    variations: labelsByProductCode.get("MSL-2185SFGCLWT").map((label) => ({
      id: label.sku.toLowerCase(),
      sku: label.sku,
      option: label.option,
      inStock: false,
      purchasable: false,
    })),
    packageSkus: [],
    labels: labelsByProductCode.get("MSL-2185SFGCLWT"),
    documents: documentsFor(["MSL-2185SFGCLWT"]),
    inStock: false,
    purchasable: false,
  },
];

export const products = [...archivedProducts, ...newProducts]
  .sort((a, b) => a.name.localeCompare(b.name));

export const productLabels = products
  .flatMap((product) => product.labels.map((label) => ({ ...label, productName: product.name })));

export const skuDirectoryDocument = "/documents/Mid-South-product-SKU-directory.pdf";

export const productCategories = [...new Set(products.flatMap((product) => product.categories))]
  .sort((a, b) => a.localeCompare(b));

export const featuredProductSlugs = [
  "synthetic-food-grade-ep-calcium-sulfonate-grease",
  "premium-ammonia-refrigeration-compressor-oil",
  "synthetic-food-grade-low-temperature-chain-lubricant",
  "synthetic-biodegradable-hydraulic-fluid",
];

export const featuredProducts = featuredProductSlugs
  .map((slug) => products.find((product) => product.slug === slug))
  .filter(Boolean);

export const applications = [
  {
    name: "Food-grade greases",
    copy: "Greases for bearings and processing equipment where incidental food contact requirements matter.",
    image: "/images/authentic/poultry-line-closeup.webp",
    category: "Grease",
  },
  {
    name: "Compressor and hydraulic fluids",
    copy: "Long-life fluids for compressors, hydraulic systems, and demanding industrial service.",
    image: "/images/authentic/processing-conveyor-overview.webp",
    category: "Compressor Fluid",
  },
  {
    name: "Low-temperature and refrigeration",
    copy: "Chain lubricants and compressor oils for freezers and ammonia refrigeration systems.",
    image: "/images/authentic/poultry-processing-line.webp",
    category: "Low Temperature",
  },
  {
    name: "Heat-transfer fluids",
    copy: "Food-grade thermal fluids designed for clean operation across demanding temperature ranges.",
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
    answer: "We offer a range of lubrication products tailored for various applications. Our solutions include oils, greases, and specialty lubricants. Each product is designed to meet specific operational needs.",
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
