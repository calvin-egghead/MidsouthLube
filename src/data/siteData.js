import productRecords from "../../old-site-archive/raw/products-store.json";
import variationRecords from "../../old-site-archive/raw/product-variations.json";

const variationById = new Map(variationRecords.map((variation) => [variation.id, variation]));

export const normalizeDashes = (value = "") => value
  .replace(/[\u2014\u2013]/g, "-")
  .replace(/&(?:mdash|ndash);|&#(?:8211|8212);/gi, "-");

export const normalizeHtml = (value = "") => normalizeDashes(value);

export const formatMoney = (prices, key = "price") => {
  if (!prices || prices[key] === null || prices[key] === undefined || prices[key] === "") {
    return "Contact for pricing";
  }

  const divisor = 10 ** (prices.currency_minor_unit ?? 2);
  const amount = Number(prices[key]) / divisor;

  if (amount === 0.01) return "Confirm price";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: prices.currency_code || "USD",
  }).format(amount);
};

const priceRange = (product) => {
  const prices = product.prices || {};
  const range = prices.price_range;

  if (!range) return formatMoney(prices);

  if (range.min_amount === "1") return "Contact for pricing";

  const minimum = formatMoney({ ...prices, price: range.min_amount });
  const maximum = formatMoney({ ...prices, price: range.max_amount });
  return minimum === maximum ? minimum : `${minimum} - ${maximum}`;
};

const localImage = (source, slug) => {
  if (slug === "synthetic-high-temperature-silica-gel-grease") {
    return "/images/catalog/Synthetic-High-Temperature-Silica-Gel-Grease_.webp";
  }
  if (!source) return "/images/products-group.webp";
  return `/images/catalog/${source.split("/").pop()}`;
};

export const products = productRecords
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
        price: formatMoney(detail.prices),
        inStock: Boolean(detail.is_in_stock),
        purchasable: Boolean(detail.is_purchasable),
      };
    });

    return {
      id: product.id,
      name: normalizeDashes(product.name),
      slug: product.slug,
      href: `/product/${product.slug}/`,
      image: localImage(product.images[0]?.src, product.slug),
      descriptionHtml: normalizeHtml(product.description),
      shortDescriptionHtml: normalizeHtml(product.short_description),
      categories: product.categories.map((category) => normalizeDashes(category.name)),
      productCodes: product.tags.map((tag) => normalizeDashes(tag.name)),
      features: featureAttributes,
      variations,
      priceRange: priceRange(product),
      inStock: Boolean(product.is_in_stock),
      purchasable: Boolean(product.is_purchasable),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

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
    image: "/images/application-food.webp",
    category: "Grease",
  },
  {
    name: "Compressor and hydraulic fluids",
    copy: "Long-life fluids for compressors, hydraulic systems, and demanding industrial service.",
    image: "/images/application-compressor.webp",
    category: "Compressor Fluid",
  },
  {
    name: "Low-temperature and refrigeration",
    copy: "Chain lubricants and compressor oils for freezers and ammonia refrigeration systems.",
    image: "/images/application-cold.webp",
    category: "Low Temperature",
  },
  {
    name: "Heat-transfer fluids",
    copy: "Food-grade thermal fluids designed for clean operation across demanding temperature ranges.",
    image: "/images/application-heat.webp",
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
