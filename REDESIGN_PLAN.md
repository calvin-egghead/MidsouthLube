# Mid South Lubricants Website Redesign Plan

Status: Planning baseline for approval before implementation

## 1. Project direction

### Design read

A trust-first B2B industrial redesign for plant managers, maintenance teams, food-safety leads, and procurement buyers. The visual language should be modern, technical, direct, and distinctly human, with cobalt blue as the single accent color.

### Redesign mode

This is a visual and content overhaul with structural preservation:

- Preserve the company name, logo, product data, product-detail URLs, and core business story.
- Preserve the five requested primary routes.
- Keep the current WordPress and WooCommerce product foundation unless a platform migration is explicitly approved.
- Replace the generic visual language, duplicated page sections, weak copy, and inconsistent hierarchy.

### Design dials

- Design variance: 6/10 - asymmetric enough to feel intentional, but not experimental.
- Motion intensity: 3/10 - hover, focus, accordion, and subtle reveal motion only.
- Visual density: 5/10 - enough technical detail for B2B buyers without becoming a catalog wall.

### Primary goals

1. Help a buyer quickly understand what Mid South sells and which products fit their operating conditions.
2. Establish technical credibility around food-grade, high-temperature, low-temperature, hydraulic, compressor, and heat-transfer applications.
3. Turn product browsing into qualified quote requests and direct product inquiries.
4. Make the company feel experienced, accessible, and real.
5. Fix the current semantic, content, accessibility, mobile, performance, and SEO weaknesses.

### Primary conversion paths

- Browse products
- Find a lubricant by application
- Request a quote
- Ask for product-selection help
- Contact the team

The site should use one label per intent. The primary conversion label will be **Request a Quote**. The main catalog label will be **Browse Products**.

## 2. Current-site audit

The live site was reviewed on June 28, 2026, along with the supplied `midsouthlube.com-design.md` brief.

### What is worth preserving

- Clear niche in food-grade and demanding industrial lubrication.
- Real product inventory with individual product pages and variants.
- Strong founder story and more than 30 years of relevant experience.
- Existing deep navy brand association.
- Practical product claims around temperature, pressure, safety, and equipment uptime.
- Existing WordPress and WooCommerce infrastructure.

### What needs to change

- The homepage title currently reads `Mid South Lubricants - Your SUPER-powered WP Engine Site`.
- Homepage, About, Products, FAQ, and Contact currently have no visible H1.
- The reviewed primary pages have empty meta descriptions.
- Heading levels are used for styling rather than page structure, including paragraphs rendered as H2s.
- The desktop hero clips important text and imagery around a 1280px viewport.
- Page sections are heavily repeated, making About, Products, and FAQ feel like variations of the homepage.
- The FAQ content is generic and does not answer practical buyer questions about compliance, application, selection, ordering, or storage.
- The FAQ page is dominated by a full product list instead of focused support content.
- Contact includes placeholder addresses (`123 Sample St`) and duplicate location sections.
- A second Contact route points to `/?page_id=34`, creating an inconsistent path.
- CTA labels vary between `View Products`, `Learn More`, `Request Quote`, `Request a Quote`, and `Contact` without a clear hierarchy.
- Product price ranges are visually noisy, and one product currently exposes a `$0.01` minimum that should be validated.
- The attached palette introduces red and magenta accents that compete with the requested bold blue.
- The League Spartan and Libre Baskerville pairing feels more like a generated brand kit than a technical business system.

## 3. Information architecture

### Primary navigation

- Logo: Home
- Products
- About Us
- FAQ
- Contact
- Primary button: Request a Quote

The top navigation should stay on one line at desktop widths and collapse to an accessible menu below the chosen breakpoint.

### Preserved routes

| Page | Route | Purpose |
| --- | --- | --- |
| Homepage | `/` | Establish value, credibility, product categories, and next action |
| About Us | `/about-us/` | Build trust through history, expertise, and people |
| Product Catalog | `/products/` | Help buyers search, filter, compare, and enter product details |
| FAQ | `/faqs/` | Answer practical pre-sales, compliance, order, and support questions |
| Contact | `/contact-us/` | Capture qualified inquiries and provide direct contact details |

### Supporting content

- Preserve all existing `/product/.../` detail routes.
- Keep PDF resources accessible from product pages and the footer rather than adding another primary navigation item.
- Preserve legal, account, cart, checkout, and policy routes if WooCommerce remains the commerce platform.
- Redirect the legacy `/?page_id=34` contact path to `/contact-us/` if it is indexable or linked externally.

## 4. Visual system

### Color

Use one blue family for brand emphasis. Red remains reserved for form errors and warnings.

| Token | Proposed value | Use |
| --- | --- | --- |
| Ink | `#0B1733` | Headlines, dark text, footer |
| Brand blue | `#165DDB` | Primary buttons, links, focus, active states |
| Brand blue dark | `#0D43A7` | Hover and selected states |
| Blue tint | `#EAF1FF` | Quiet emphasis and selected filters |
| Page | `#FFFFFF` | Main background |
| Surface | `#F5F8FC` | Alternate sections and filter area |
| Border | `#D7E0EC` | Dividers, inputs, tables |
| Muted text | `#58677D` | Secondary copy |
| Success | `#147A52` | Verified availability or success only |
| Error | `#B42318` | Validation and destructive states only |

No gradients, glow effects, magenta accents, decorative red, or pure black.

### Typography

- Primary family: IBM Plex Sans, self-hosted with `font-display: swap`.
- Technical labels and SKUs: IBM Plex Mono, used sparingly.
- One sans-serif family carries headings, body copy, navigation, buttons, and forms.
- No editorial serif accent.
- Body copy should stay between 16px and 18px with a 1.55 to 1.7 line height.
- Headings use controlled weight and scale, not oversized type.
- Paragraphs should generally stay below 68 characters per line.

### Spacing and layout

- 4px base grid with an 8px working rhythm.
- Content width: 1200px to 1280px maximum.
- Page gutters: 20px mobile, 32px tablet, 48px desktop.
- Section spacing: 72px mobile, 104px desktop.
- Header height: 68px to 72px desktop.
- Use CSS Grid for responsive product and content layouts.
- All multi-column sections collapse explicitly below 768px.

### Shape and depth

- Cards: 10px radius.
- Inputs: 8px radius.
- Buttons: 8px radius.
- Use spacing, borders, and tonal surfaces before shadows.
- If a shadow is necessary, keep it small and blue-gray tinted.
- Do not wrap every section in cards.

### Motion

- 160ms to 240ms state transitions for buttons, links, filters, and accordions.
- Small opacity and vertical reveal for major content only.
- No parallax, marquees, scroll hijacking, looping animation, or decorative motion.
- All motion must respect `prefers-reduced-motion`.

### Photography and product imagery

The finished site needs real, high-resolution assets. Avoid anonymous stock photos of gears or generic factories.

Required shot list:

1. Hero image showing a real product in an authentic food-processing or industrial context.
2. Clean 1:1 product images for every catalog item.
3. Two or three application images: food processing, refrigeration/freezer, and industrial equipment.
4. Professional environmental portraits of Ray and Tracie.
5. Company or facility detail photography for About.
6. Product certificate and technical-document thumbnails where applicable.

## 5. Shared component system

- Accessible header and mobile menu
- Breadcrumbs on all interior and product-detail pages
- Primary, secondary, and text-link button styles
- Section heading and short introductory copy
- Product card with image, product name, application tags, key property, and action
- Search and filter controls with URL-backed state
- Application/category navigation
- Technical specification groups
- Compliance/certification list
- Document download row
- FAQ accordion with native button semantics
- Quote/contact form with inline errors and success state
- Direct-contact block
- Focused final CTA band
- Footer with product, company, support, and legal links
- Empty, loading, no-result, error, and success states

## 6. Page blueprints

### Homepage

Purpose: explain the business in one screen, then guide visitors by operating need.

1. Header
2. Asymmetric split hero
   - Suggested H1: `Specialty lubricants for demanding operations.`
   - Suggested support line: `Food-grade and industrial formulas built for safety, uptime, and extreme conditions.`
   - Actions: Browse Products, Request a Quote
   - Real application or product-family image
3. Credibility band
   - Only verified claims, certifications, years of experience, or industries served
4. Shop by application
   - Food-grade greases
   - Compressor and hydraulic fluids
   - Low-temperature and refrigeration
   - Heat-transfer fluids
5. Operating outcomes
   - Safety and compliance
   - Equipment uptime
   - Performance across temperature extremes
   - Presented with dividers and supporting photography, not three equal feature cards
6. Featured products
   - Four products chosen by business priority and buyer demand
7. Product-selection help
   - A short decision guide based on application, temperature, load, and compliance requirement
8. Why Mid South
   - Founder-led expertise, personal service, and real problem solving
9. Focused quote CTA
10. Footer

The homepage should not repeat a full FAQ, full team biography, or full catalog.

### About Us

Purpose: make expertise and relationships believable.

1. Interior hero with concise mission and real portrait or facility image
2. Company story and why Mid South was founded
3. Experience timeline using verified dates only
4. Technical and service principles
5. Founder profiles for Ray and Tracie with concise bios
6. Industries and operating environments served
7. CTA: Request a Quote

The tone should be direct and personal. Avoid generic claims such as `industry leaders` unless supported by evidence.

### Product Catalog

Purpose: make a technical product range easy to narrow and compare.

1. Catalog hero with one H1 and a short selection explanation
2. Search by product name, use, or keyword
3. Filter groups
   - Application
   - Food-grade or industrial
   - Equipment type
   - Temperature condition
   - Product family
4. Active-filter summary and clear-all action
5. Product grid with consistent images and concise technical facts
6. Pagination or load-more behavior that preserves crawlable product links
7. No-results state with product-selection help
8. Request-a-quote CTA

Product card priority:

- Product name
- Plain-language application
- One or two verified performance properties
- Compliance/certification, if verified
- `View Product` action

Do not lead with a very large price range when pack sizes and variants make that range hard to interpret. Product detail pages should explain size, variant, lead time, technical documents, and quote/purchase behavior clearly.

### FAQ

Purpose: answer real pre-sales and support questions without becoming a product dump.

Suggested groups:

- Choosing the right lubricant
- Food-grade and safety requirements
- Temperature, load, and application conditions
- Ordering, pack sizes, shipping, and lead times
- Storage, handling, and shelf life
- Product documents and technical support

Use a search field and grouped accordions. Every answer must come from verified business or product information. Add a contact path when an answer depends on equipment details.

### Contact

Purpose: collect a qualified inquiry with low friction.

1. Clear page introduction
2. Direct email, phone, service area, and business hours
3. Inquiry form
   - Name
   - Work email
   - Company
   - Phone, optional
   - Inquiry type
   - Product or application, optional
   - Message
   - Consent statement if required
4. Product-selection prompt describing useful details to include
5. Submission success, validation, network-error, and retry states

Remove placeholder addresses and duplicate locations. Publish only verified contact information.

## 7. Content requirements

### Voice

- Specific, calm, and technically competent.
- Short sentences and concrete nouns.
- Explain the operating benefit after the technical claim.
- Prefer `helps reduce unplanned downtime` to abstract language such as `unlock performance`.
- Avoid `innovative`, `precision`, `smart lubrication`, and `built to last` unless the surrounding copy proves the claim.

### Facts to validate before writing final copy

- Exact founding year and approved experience claim.
- Certification and registration details for each product.
- Industries actively served.
- Shipping area and delivery expectations.
- Verified physical address, service area, and business hours.
- Current email and phone.
- Product categories and application mapping.
- Whether online purchase or quote-first is the preferred conversion.
- Whether displayed prices and the `$0.01` variant are intentional.
- Return, shipping, and privacy policies.

## 8. SEO plan

### Immediate fixes

- Give every indexable page one descriptive H1.
- Replace the current placeholder homepage title.
- Write a unique title and meta description for every primary page and product detail.
- Preserve canonical routes and current product URLs.
- Fix semantic heading order.
- Remove or redirect duplicate and legacy paths.
- Generate XML sitemaps and validate `robots.txt`.
- Add descriptive alt text to meaningful imagery and empty alt text to decorative imagery.
- Add Open Graph and social-sharing metadata.
- Ensure every product is reachable through crawlable HTML links.

### Suggested metadata direction

| Page | Title direction | Search intent |
| --- | --- | --- |
| Home | `Food-Grade & Industrial Lubricants | Mid South Lubricants` | Brand and category discovery |
| About | `About Mid South Lubricants | Specialty Lubrication Experience` | Trust and expertise |
| Products | `Food-Grade & Industrial Lubricant Products | Mid South` | Product catalog discovery |
| FAQ | `Lubricant Selection & Ordering FAQ | Mid South Lubricants` | Support and pre-sales questions |
| Contact | `Contact Mid South Lubricants | Product & Quote Support` | Branded contact and quote intent |

Final titles should be checked against actual character length and verified keyword research.

### Structured data

- `Organization` on the site root with verified business information.
- `WebSite` on the site root.
- `BreadcrumbList` on interior and product pages.
- `Product` with applicable `Offer`, availability, variants, images, brand, and identifiers on individual product pages.
- `FAQPage` only for visible FAQ content that meets current eligibility and content guidelines. Markup does not guarantee a rich result.

### Migration safeguards

- Export the current URL inventory before launch.
- Create a redirect map for every changed or removed URL.
- Compare pre-launch and post-launch canonicals, status codes, titles, descriptions, headings, index directives, and internal links.
- Preserve analytics events or document any renamed events.
- Submit the updated sitemap in Google Search Console after launch.

## 9. Accessibility and quality targets

- WCAG 2.2 Level AA target.
- Minimum 4.5:1 contrast for normal text and 3:1 for large text and component boundaries where applicable.
- Visible keyboard focus on every control.
- Full keyboard operation for navigation, filters, accordions, and forms.
- 44px minimum interactive target where practical.
- No placeholder-only form labels.
- Inline validation tied to the correct field.
- Status messages announced to assistive technology.
- Logical reading order and landmarks.
- Product filters remain usable at 320px width and 200% zoom.
- Reduced-motion support.

## 10. Performance targets

Use the current Core Web Vitals thresholds at the 75th percentile on mobile and desktop:

- LCP: 2.5 seconds or less
- INP: 200 milliseconds or less
- CLS: 0.1 or less

Implementation requirements:

- Preload the primary font subset and hero image only.
- Serve AVIF or WebP with responsive dimensions.
- Set explicit image width and height.
- Lazy-load below-the-fold imagery.
- Remove unused Elementor assets from redesigned templates if WordPress remains the platform.
- Avoid large animation libraries for this motion level.
- Cache catalog responses and optimize WooCommerce queries.
- Test on a mid-range mobile device with a throttled connection.

## 11. Recommended implementation path

The current site uses WordPress, Elementor, and WooCommerce. The lowest-risk production path is:

1. Keep WordPress and WooCommerce as the content, product, account, cart, and checkout foundation.
2. Build a lightweight custom block theme or custom theme templates for the five marketing pages and catalog views.
3. Remove Elementor dependence from redesigned templates where practical.
4. Preserve WooCommerce product and transactional URLs.
5. Use progressive enhancement for filters and accordions so core content remains accessible without JavaScript.

A headless rebuild should be treated as a separate platform project because it adds preview, cart, checkout, account, caching, deployment, and SEO-migration complexity.

The local workspace is currently empty. Before Phase 2 starts, the production theme repository, a sanitized site export, or an agreed prototype stack must be placed here.

## 12. Four-phase delivery plan

### Phase 1: Planning and content validation

Deliverables:

- Approved site architecture
- Approved visual tokens and typography
- Content inventory and fact-check list
- Product taxonomy and filter model
- Asset list
- SEO baseline export and redirect policy
- Homepage low-fidelity wireframe

Approval gate: visual direction, catalog behavior, conversion model, and implementation platform.

### Phase 2: Homepage

Deliverables:

- Shared header, footer, buttons, typography, spacing, and responsive container system
- Complete homepage
- Mobile, tablet, desktop, keyboard, and reduced-motion states
- Draft page metadata and Organization/WebSite schema
- Visual QA at 320px, 768px, 1024px, 1280px, and 1440px

Approval gate: homepage content, visual tone, imagery, and conversion hierarchy.

### Phase 3: Remaining pages

Build order:

1. Product Catalog and product-card system
2. Product-detail template adjustments
3. About Us
4. FAQ
5. Contact

Deliverables include all loading, empty, no-result, error, validation, and success states.

Approval gate: content accuracy, catalog filters, forms, product data, and responsive layouts.

### Phase 4: Layout and SEO audits

Layout and UX:

- Responsive visual regression pass
- Browser testing
- Keyboard and screen-reader smoke test
- Contrast, zoom, target-size, and reduced-motion checks
- Form and catalog edge cases

Technical and SEO:

- Lighthouse and Core Web Vitals review
- Crawl of old and new URLs
- Titles, descriptions, H1s, canonicals, robots, sitemap, schema, and Open Graph validation
- Broken-link and redirect-chain check
- Product structured-data validation
- Analytics and form-event verification

Launch:

- Backup and rollback point
- Redirect deployment
- Production crawl after release
- Search Console sitemap submission
- Monitoring for crawl errors, form failures, 404s, and indexing changes

## 13. Definition of done

The redesign is complete when:

- All five requested pages are implemented and responsive.
- Product and transactional routes continue to work.
- Every indexable page has one H1, a unique title, a unique description, and a canonical URL.
- Contact details and product claims are verified.
- Placeholder content and sample addresses are gone.
- Navigation works with keyboard and touch input.
- Forms have complete error and success behavior.
- Catalog search and filters work with empty and no-result states.
- WCAG 2.2 AA checks pass for the tested scope.
- Core Web Vitals targets are met in testing or remaining gaps are documented with owners.
- Structured data passes validation without critical errors.
- No critical visual defect exists at the target widths.
- The final site feels like one coherent technical brand, not a collection of templates.

## 14. Reference standards

- [W3C WCAG overview](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Google Core Web Vitals](https://web.dev/articles/vitals)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Google structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

