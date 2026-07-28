# Mid South Lubricants old-site archive

Extracted on **July 20, 2026** from public endpoints associated with [midsouthlube.com](https://midsouthlube.com/).

## What was recovered

- 15 published WordPress pages and their rendered body HTML
- 1 default WordPress blog post and 1 default WordPress comment
- 16 WooCommerce products
- 63 product variations with option labels, SKUs, exact prices, stock flags, and add-to-cart URLs
- 14 product categories and 16 product-code tags
- 59 media records and all 59 original media files (about 6 MB)
- 1 block-navigation record, the public author record, robots rules, content-type and taxonomy definitions
- Public link inventory and SEO/meta inventory
- Internet Archive index plus its two distinct historical homepage captures

## Best starting points

- [`content/company-facts.md`](content/company-facts.md) — concise business, contact, leadership, positioning, and caveats
- [`content/pages.md`](content/pages.md) — extracted text of every published page
- [`content/products.md`](content/products.md) — complete human-readable catalog with descriptions, features, options, SKUs, prices, and availability
- [`content/products.csv`](content/products.csv) — one row per product
- [`content/variations.csv`](content/variations.csv) — one row per product variation
- [`content/site-structure.md`](content/site-structure.md) — routes, categories, tags, and navigation
- [`content/media.csv`](content/media.csv) — media metadata and original URLs
- [`content/links.csv`](content/links.csv) — every hyperlink found in page and product body content
- [`content/metadata.csv`](content/metadata.csv) — page/product SEO fields (the public records were blank)
- [`assets/`](assets/) — downloaded original media files
- [`raw/`](raw/) — unmodified API responses and historical HTML

## Source and fidelity notes

The live homepage returned a Cloudflare 403 to a direct HTML crawler, but the public WordPress and WooCommerce REST APIs returned the underlying content. The archive therefore treats those APIs as the canonical source for page copy and catalog data. The human-readable Markdown strips layout markup; the raw JSON preserves the returned HTML and metadata.

The WordPress media response header reported 60 items but returned 59 records in its single advertised page. All 59 returned records and source files are present. No public PDF attachment records were returned.

The Internet Archive has only two distinct historical states: a generic IIS “Under Construction” page from 2010 and a Squarespace “Coming Soon” page from 2025. Neither contains business or product content.

## Rebuild the readable reports

Run:

```sh
python3 scripts/extract_old_site.py
```

This regenerates the files in `content/` from the JSON in `raw/`.

