# Mid South Lubricants website

React and Vite website for Mid South Lubricants.

## Local development

```bash
npm install
npm run dev
```

Run the complete verification suite with:

```bash
npm run check
```

The production build creates static HTML entry points for every public route and product page, plus `sitemap.xml` and `404.html`.

## Hosting

- Netlify and Cloudflare Pages can use `public/_redirects` as the fallback for unknown client-side routes.
- Vercel uses `vercel.json`, checking generated static files before falling back to the application shell.
- Other static hosts should serve an existing route's `index.html`, then use `/index.html` only for unmatched routes.

## Analytics

The application emits `page_view`, `phone_click`, `email_click`, `document_download`, and `form_prepare_email` events to `window.dataLayer` and as `mid-south-analytics` browser events.

To enable Google Tag Manager, copy `.env.example` to `.env.local` and set `VITE_GTM_ID`. Leave it blank to keep third-party analytics disabled. Configure consent and any downstream analytics tags in Google Tag Manager before production use.

## Technical documents

The public catalog contains 34 products and 33 downloadable Technical Data Sheets under `public/documents/tds/`; FRH-46 retains a Request TDS action because its sheet was not supplied. Safety Data Sheets remain request-only. Their source PDFs are stored under `source-documents/sds/` outside the published site. The catalog includes 68 verified package SKUs across 18 products from the Mid South SKU directory and supplied labels; products without verified SKUs remain quote-only. See `docs/product-audit-revision-checklist.md` for implementation status and `docs/source-document-inventory.md` for missing, unused, and inconsistent files.

## Before publication

- Have Mid South confirm product codes, grades, packaging, availability language, registration claims, biographies, phone number, email, and postal address.
- Have qualified counsel review the Privacy Policy and Website Terms for the business's final analytics, form, retention, and sales practices.
- Configure the production domain and submit the generated sitemap to search engines.
- When ready, replace both `mailto:` handlers with the planned Web3Forms integration.
