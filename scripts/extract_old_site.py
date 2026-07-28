#!/usr/bin/env python3
"""Build human-readable reports from the public Mid South Lubricants APIs."""

from __future__ import annotations

import csv
import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "old-site-archive"
RAW = ARCHIVE / "raw"
CONTENT = ARCHIVE / "content"


class TextExtractor(HTMLParser):
    BLOCKS = {
        "address", "article", "aside", "blockquote", "br", "div", "dl", "dt",
        "dd", "figcaption", "figure", "footer", "form", "h1", "h2", "h3",
        "h4", "h5", "h6", "header", "hr", "li", "main", "nav", "ol", "p",
        "section", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul",
    }

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "svg", "noscript"}:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        if tag in self.BLOCKS:
            self.parts.append("\n")
        if tag == "li":
            self.parts.append("- ")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "svg", "noscript"}:
            if self.skip_depth:
                self.skip_depth -= 1
            return
        if not self.skip_depth and tag in self.BLOCKS:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self.skip_depth:
            self.parts.append(data)

    def text(self) -> str:
        value = "".join(self.parts).replace("\xa0", " ")
        value = re.sub(r"[ \t]+", " ", value)
        value = re.sub(r" *\n *", "\n", value)
        value = re.sub(r"\n{3,}", "\n\n", value)
        lines: list[str] = []
        previous = None
        for raw_line in value.splitlines():
            line = raw_line.strip()
            if not line:
                if lines and lines[-1] != "":
                    lines.append("")
                continue
            # Elementor commonly emits the same responsive text more than once.
            if line == previous:
                continue
            lines.append(line)
            previous = line
        return "\n".join(lines).strip()


class LinkExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[dict[str, str]] = []
        self.current: dict[str, str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag == "a" and attributes.get("href"):
            self.current = {"url": attributes["href"] or "", "text": ""}

    def handle_data(self, data: str) -> None:
        if self.current is not None:
            self.current["text"] += data

    def handle_endtag(self, tag: str) -> None:
        if tag == "a" and self.current is not None:
            self.current["text"] = re.sub(r"\s+", " ", self.current["text"]).strip()
            self.links.append(self.current)
            self.current = None


def textify(value: str | None) -> str:
    parser = TextExtractor()
    parser.feed(value or "")
    return html.unescape(parser.text())


def load(name: str):
    return json.loads((RAW / name).read_text(encoding="utf-8"))


def money(prices: dict | None, key: str = "price") -> str:
    if not prices or prices.get(key) in {None, ""}:
        return "Not listed"
    minor = prices.get("currency_minor_unit", 2)
    amount = int(prices[key]) / (10 ** minor)
    return f"{prices.get('currency_symbol', '$')}{amount:,.{minor}f}"


def product_price(product: dict) -> str:
    prices = product.get("prices") or {}
    price_range = prices.get("price_range")
    if price_range:
        lo = money({**prices, "price": price_range.get("min_amount")})
        hi = money({**prices, "price": price_range.get("max_amount")})
        return lo if lo == hi else f"{lo}–{hi}"
    return money(prices)


def write_pages(pages: list[dict]) -> None:
    out = [
        "# Page content",
        "",
        "Text extracted from the public WordPress REST API. Repeated Elementor responsive copies are reduced only when they are exactly duplicated on adjacent lines. Raw HTML remains in `../raw/pages.json`.",
        "",
    ]
    for page in sorted(pages, key=lambda item: item["id"]):
        out.extend([
            f"## {html.unescape(page['title']['rendered'])}",
            "",
            f"- ID: `{page['id']}`",
            f"- Slug: `{page['slug']}`",
            f"- URL: {page['link']}",
            f"- Published: {page['date']}",
            f"- Last modified: {page['modified']}",
            "",
            textify(page.get("content", {}).get("rendered")) or "_No rendered body content returned._",
            "",
        ])
    (CONTENT / "pages.md").write_text("\n".join(out).rstrip() + "\n", encoding="utf-8")


def write_products(products: list[dict], variations: list[dict]) -> None:
    variation_by_id = {item["id"]: item for item in variations}
    out = [
        "# Product catalog",
        "",
        "Public WooCommerce Store API data, including descriptions, categories, tags, images, option labels, prices, and availability at extraction time.",
        "",
    ]
    rows = []
    variation_rows = []
    for product in sorted(products, key=lambda item: item["name"].lower()):
        categories = ", ".join(item["name"] for item in product.get("categories", [])) or "None"
        tags = ", ".join(item["name"] for item in product.get("tags", [])) or "None"
        images = [item.get("src", "") for item in product.get("images", []) if item.get("src")]
        features = []
        options = []
        for attribute in product.get("attributes", []):
            names = [term["name"] for term in attribute.get("terms", [])]
            if attribute.get("has_variations"):
                options.extend(names)
            else:
                features.extend(names)
        out.extend([
            f"## {product['name']}",
            "",
            f"- Product ID: `{product['id']}`",
            f"- Slug: `{product['slug']}`",
            f"- URL: {product['permalink']}",
            f"- Type: {product.get('type', 'Unknown')}",
            f"- SKU: {product.get('sku') or 'Not set'}",
            f"- Categories: {categories}",
            f"- Tags / product codes: {tags}",
            f"- Listed price range: {product_price(product)}",
            f"- Purchasable: {'Yes' if product.get('is_purchasable') else 'No'}",
            f"- In stock: {'Yes' if product.get('is_in_stock') else 'No'}",
            f"- On backorder: {'Yes' if product.get('is_on_backorder') else 'No'}",
            f"- Rating / reviews: {product.get('average_rating', '0')} / {product.get('review_count', 0)}",
        ])
        for image_url in images:
            out.append(f"- Image: {image_url}")
        out.extend(["", "### Full description", "", textify(product.get("description")) or "_None._", ""])
        out.extend(["### Short description / selling points", "", textify(product.get("short_description")) or "_None._", ""])
        if features:
            out.extend(["### Structured feature attributes", ""])
            out.extend(f"- {item}" for item in features)
            out.append("")
        if options:
            out.extend(["### Options and prices", "", "| Variation ID | SKU | Option | Price | In stock | Purchasable |", "| ---: | --- | --- | ---: | :---: | :---: |"])
            variation_ids = [item["id"] for item in product.get("variations", [])]
            option_by_id = {
                item["id"]: "; ".join(
                    f"{part['name']}: {part['value']}"
                    for part in item.get("attributes", [])
                    if part.get("value") not in {None, ""}
                )
                for item in product.get("variations", [])
            }
            for index, variation_id in enumerate(variation_ids):
                detail = variation_by_id.get(variation_id, {})
                option = option_by_id.get(variation_id) or detail.get("variation") or (options[index] if index < len(options) else "")
                out.append(
                    f"| {variation_id} | {detail.get('sku') or 'Not set'} | {option.replace('|', '\\|')} | {money(detail.get('prices'))} | "
                    f"{'Yes' if detail.get('is_in_stock') else 'No'} | {'Yes' if detail.get('is_purchasable') else 'No'} |"
                )
                variation_rows.append({
                    "variation_id": variation_id,
                    "parent_product_id": product["id"],
                    "product": product["name"],
                    "sku": detail.get("sku", ""),
                    "option": option,
                    "price": money(detail.get("prices")),
                    "is_in_stock": detail.get("is_in_stock", False),
                    "is_purchasable": detail.get("is_purchasable", False),
                    "add_to_cart_url": (detail.get("add_to_cart") or {}).get("url", ""),
                })
            out.append("")
        rows.append({
            "id": product["id"],
            "name": product["name"],
            "slug": product["slug"],
            "url": product["permalink"],
            "type": product.get("type", ""),
            "sku": product.get("sku", ""),
            "categories": categories,
            "tags_or_product_codes": tags,
            "price_range": product_price(product),
            "is_purchasable": product.get("is_purchasable", False),
            "is_in_stock": product.get("is_in_stock", False),
            "variation_count": len(product.get("variations", [])),
            "image_urls": " | ".join(images),
        })
    (CONTENT / "products.md").write_text("\n".join(out).rstrip() + "\n", encoding="utf-8")
    with (CONTENT / "products.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    with (CONTENT / "variations.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(variation_rows[0]))
        writer.writeheader()
        writer.writerows(variation_rows)


def write_media(media: list[dict]) -> None:
    fieldnames = ["id", "date", "modified", "mime_type", "title", "alt_text", "caption", "description", "source_url", "filename", "width", "height", "filesize_bytes"]
    with (CONTENT / "media.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for item in sorted(media, key=lambda value: value["id"]):
            details = item.get("media_details") or {}
            source_url = item.get("source_url", "")
            writer.writerow({
                "id": item["id"],
                "date": item.get("date", ""),
                "modified": item.get("modified", ""),
                "mime_type": item.get("mime_type", ""),
                "title": textify(item.get("title", {}).get("rendered")),
                "alt_text": item.get("alt_text", ""),
                "caption": textify(item.get("caption", {}).get("rendered")),
                "description": textify(item.get("description", {}).get("rendered")),
                "source_url": source_url,
                "filename": Path(urlparse(source_url).path).name,
                "width": details.get("width", ""),
                "height": details.get("height", ""),
                "filesize_bytes": details.get("filesize", ""),
            })


def write_structure(pages: list[dict], products: list[dict], categories: list[dict], tags: list[dict], navigation: list[dict]) -> None:
    out = ["# Site structure", "", "## Published pages", "", "| ID | Title | Slug | URL | Modified |", "| ---: | --- | --- | --- | --- |"]
    for page in sorted(pages, key=lambda item: item["id"]):
        out.append(f"| {page['id']} | {html.unescape(page['title']['rendered'])} | `{page['slug']}` | {page['link']} | {page['modified']} |")
    out.extend(["", "## Product routes", "", "| ID | Product | URL |", "| ---: | --- | --- |"])
    for product in sorted(products, key=lambda item: item["name"].lower()):
        out.append(f"| {product['id']} | {product['name']} | {product['permalink']} |")
    out.extend(["", "## Product categories", ""])
    for item in sorted(categories, key=lambda value: value["name"].lower()):
        out.append(f"- {item['name']} (`{item['slug']}`; {item.get('count', 0)} products): {item.get('link', '')}")
    out.extend(["", "## Product tags / codes", ""])
    for item in sorted(tags, key=lambda value: value["name"].lower()):
        out.append(f"- {item['name']} (`{item['slug']}`; {item.get('count', 0)} products): {item.get('link', '')}")
    out.extend(["", "## Block navigation records", ""])
    for item in navigation:
        out.extend([f"### {html.unescape(item['title']['rendered'])}", "", textify(item.get("content", {}).get("rendered")) or "_No rendered navigation content._", ""])
    (CONTENT / "site-structure.md").write_text("\n".join(out).rstrip() + "\n", encoding="utf-8")


def write_links(records: list[tuple[str, dict]]) -> None:
    rows = []
    for record_type, item in records:
        body = item.get("content", {}).get("rendered", "")
        parser = LinkExtractor()
        parser.feed(body)
        for link in parser.links:
            rows.append({
                "record_type": record_type,
                "record_id": item["id"],
                "record_title": html.unescape(item.get("title", {}).get("rendered", "")),
                "record_url": item.get("link", ""),
                "anchor_text": link["text"],
                "target_url": html.unescape(link["url"]),
            })
    fieldnames = ["record_type", "record_id", "record_title", "record_url", "anchor_text", "target_url"]
    with (CONTENT / "links.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_metadata(records: list[tuple[str, dict]]) -> None:
    fieldnames = ["record_type", "id", "title", "slug", "url", "modified", "seo_title", "meta_description", "canonical", "robots_index", "robots_follow", "og_title", "og_description", "og_image"]
    with (CONTENT / "metadata.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for record_type, item in records:
            seo = item.get("yoast_head_json") or {}
            og_images = seo.get("og_image") or []
            writer.writerow({
                "record_type": record_type,
                "id": item["id"],
                "title": html.unescape(item.get("title", {}).get("rendered", "")),
                "slug": item.get("slug", ""),
                "url": item.get("link", ""),
                "modified": item.get("modified", ""),
                "seo_title": html.unescape(seo.get("title", "")),
                "meta_description": html.unescape(seo.get("description", "")),
                "canonical": seo.get("canonical", ""),
                "robots_index": (seo.get("robots") or {}).get("index", ""),
                "robots_follow": (seo.get("robots") or {}).get("follow", ""),
                "og_title": html.unescape(seo.get("og_title", "")),
                "og_description": html.unescape(seo.get("og_description", "")),
                "og_image": " | ".join(image.get("url", "") for image in og_images),
            })


def main() -> None:
    CONTENT.mkdir(parents=True, exist_ok=True)
    pages = load("pages.json")
    products = load("products-store.json")
    products_wp = load("products-wp.json")
    variations = load("product-variations.json")
    media = load("media.json")
    categories = load("product-categories.json")
    tags = load("product-tags.json")
    navigation = load("navigation.json")
    write_pages(pages)
    write_products(products, variations)
    write_media(media)
    write_structure(pages, products, categories, tags, navigation)
    records = [("page", item) for item in pages] + [("product", item) for item in products_wp]
    write_links(records)
    write_metadata(records)


if __name__ == "__main__":
    main()
