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

The public catalog maps the six supplied Technical Data Sheets under `public/documents/tds/` and the supplied product- and grade-specific Safety Data Sheets under `public/documents/sds/`. Each product-to-document mapping lives in `src/data/siteData.js`. Missing documents are requested from Mid South and must never be created or inferred from marketing copy.

## Before publication

- Have Mid South confirm product codes, grades, packaging, availability language, registration claims, biographies, phone number, email, and postal address.
- Have qualified counsel review the Privacy Policy and Website Terms for the business's final analytics, form, retention, and sales practices.
- Configure the production domain and submit the generated sitemap to search engines.
- When ready, replace both `mailto:` handlers with the planned Web3Forms integration.
