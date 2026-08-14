import { useEffect, useMemo, useState } from "react";
import { trackEvent, trackPageView } from "./analytics";
import {
  applications,
  faqs,
  featuredProducts,
  normalizeDashes,
  productCategories,
  products,
  technicalDataSheets,
} from "./data/siteData";

const contactEmail = "info@midsouthlube.com";
const contactPhone = "(318) 614-7948";
const contactPhoneHref = "tel:+13186147948";
const contactAddress = "1122 Garland Gin Road, Downsville, LA 71234";
const siteUrl = "https://midsouthlube.com";
const socialImage = `${siteUrl}/images/authentic/hero-poultry-brand.webp`;

const routeMeta = {
  "/": [
    "Food-Grade and Industrial Lubricants | Mid South Lubricants",
    "Specialty food-grade and industrial lubricants for safety, uptime, and demanding operating conditions.",
  ],
  "/products/": [
    "Product Catalog | Mid South Lubricants",
    "Browse six documented heat-transfer, refrigeration, and synthetic food-grade oil products from Mid South Lubricants.",
  ],
  "/about-us/": [
    "About Mid South Lubricants",
    "Meet Ray and Tracie Tatum and learn how Mid South combines technical experience with direct customer support.",
  ],
  "/faqs/": [
    "Lubrication FAQ | Mid South Lubricants",
    "Answers about lubricant selection, service intervals, food-grade requirements, packaging, and product support.",
  ],
  "/contact-us/": [
    "Request a Quote | Mid South Lubricants",
    "Contact Mid South Lubricants for product selection help, technical questions, and quote requests.",
  ],
  "/pdf-resources/": [
    "Technical Resources | Mid South Lubricants",
    "Request product specifications, registration details, and technical documents from Mid South Lubricants.",
  ],
  "/privacy-policy/": ["Privacy Policy | Mid South Lubricants", "Privacy information for the Mid South Lubricants website."],
  "/terms/": ["Website Terms | Mid South Lubricants", "Review the terms governing use of the Mid South Lubricants website and product information."],
};

const normalizePath = (pathname) => {
  if (pathname === "/") return "/";
  return `${pathname.replace(/\/+$/, "")}/`;
};

const plainText = (value = "") => {
  const withoutTags = value.replace(/<[^>]*>/g, " ");
  if (typeof document === "undefined") return normalizeDashes(withoutTags);
  const element = document.createElement("textarea");
  element.innerHTML = withoutTags;
  return normalizeDashes(element.value).replace(/\s+/g, " ").replace(/\(\s+/g, "(").trim();
};

const setMetaContent = (selector, content) => {
  document.querySelector(selector)?.setAttribute("content", content);
};

const setStructuredData = (data) => {
  let script = document.querySelector("#structured-data");
  if (!script) {
    script = document.createElement("script");
    script.id = "structured-data";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mid South Lubricants",
  url: siteUrl,
  logo: `${siteUrl}/images/mid-south-logo.webp`,
  email: contactEmail,
  telephone: "+1-318-614-7948",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1122 Garland Gin Road",
    addressLocality: "Downsville",
    addressRegion: "LA",
    postalCode: "71234",
    addressCountry: "US",
  },
};

const updateSeo = ({ path, product, title, description, isNotFound = false }) => {
  const canonicalPath = product ? product.href : path;
  const canonicalUrl = new URL(canonicalPath, siteUrl).href;
  const image = product ? new URL(product.image, siteUrl).href : socialImage;
  const type = product ? "product" : "website";

  document.title = title;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[name="robots"]', isNotFound ? "noindex, follow" : "index, follow, max-image-preview:large");
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:type"]', type);
  setMetaContent('meta[property="og:url"]', canonicalUrl);
  setMetaContent('meta[property="og:image"]', image);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
  setMetaContent('meta[name="twitter:image"]', image);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl);

  if (product) {
    setStructuredData({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description,
      image,
      url: canonicalUrl,
      sku: product.productCodes[0] || undefined,
      brand: { "@type": "Brand", name: "Mid South Lubricants" },
    });
  } else if (path === "/faqs/") {
    setStructuredData({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  } else {
    setStructuredData(organizationData);
  }
};

function useRoute() {
  const [route, setRoute] = useState(() => ({
    path: normalizePath(window.location.pathname),
    search: window.location.search,
  }));

  useEffect(() => {
    const onPopState = () => setRoute({
      path: normalizePath(window.location.pathname),
      search: window.location.search,
    });
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (href) => {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) {
      window.location.href = href;
      return;
    }

    window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
    setRoute({ path: normalizePath(url.pathname), search: url.search });
    window.requestAnimationFrame(() => {
      if (url.hash) {
        document.querySelector(url.hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    });
  };

  return { path: route.path, search: route.search, navigate };
}

function Link({ href, navigate, children, className, onClick, ...props }) {
  const isExternal = /^(https?:|mailto:|tel:)/.test(href);

  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          isExternal ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) return;
        event.preventDefault();
        navigate(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function Brand({ navigate, compact = false, hidden = false }) {
  return (
    <Link
      className={`brand ${compact ? "brand--compact" : ""} ${hidden ? "brand--hero-hidden" : ""}`.trim()}
      href="/"
      navigate={navigate}
      aria-label="Mid South Lubricants home"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      <img src="/images/mid-south-logo.webp" alt="" width="54" height="54" />
      <span className="brand__name"><span>Mid South</span><span>Lubricants</span></span>
    </Link>
  );
}

function ButtonLink({ href, navigate, children, variant = "primary", className = "" }) {
  return <Link href={href} navigate={navigate} className={`button button--${variant} ${className}`.trim()}>{children}</Link>;
}

function Header({ navigate, currentPath }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [homeHeroVisible, setHomeHeroVisible] = useState(currentPath === "/");
  const showHomeHero = currentPath === "/" && homeHeroVisible;
  const nav = [
    ["Products", "/products/"],
    ["About Us", "/about-us/"],
    ["FAQ", "/faqs/"],
    ["Contact", "/contact-us/"],
  ];

  useEffect(() => {
    if (currentPath !== "/") return undefined;

    const hero = document.querySelector(".home-hero");
    if (!hero) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setHomeHeroVisible(entry.isIntersecting && entry.intersectionRatio > 0.32);
    }, { threshold: [0, 0.32, 1] });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [currentPath]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header ${currentPath === "/" ? `site-header--overlay ${showHomeHero ? "site-header--home-top" : "site-header--home-scrolled"}` : ""}`.trim()}>
        <div className="header-inner">
          <Brand navigate={navigate} compact hidden={showHomeHero} />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {nav.map(([label, href]) => {
              const active = currentPath === href || (href === "/products/" && currentPath.startsWith("/product/"));
              return <Link key={href} href={href} navigate={navigate} aria-current={active ? "page" : undefined}>{label}</Link>;
            })}
          </nav>
          <div className="header-actions">
            <a className="header-phone" href={contactPhoneHref}>{contactPhone}</a>
            <ButtonLink href="/contact-us/#quote" navigate={navigate} variant="primary">Talk to a Specialist</ButtonLink>
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          {nav.map(([label, href]) => {
            const active = currentPath === href || (href === "/products/" && currentPath.startsWith("/product/"));
            return <Link key={href} href={href} navigate={navigate} aria-current={active ? "page" : undefined}>{label}</Link>;
          })}
          <a className="mobile-menu__phone" href={contactPhoneHref}>{contactPhone}</a>
          <ButtonLink href="/contact-us/#quote" navigate={navigate}>Talk to a Specialist</ButtonLink>
        </nav>
      </div>
    </>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Brand navigate={navigate} />
          <p>High-performance lubricants designed for food-grade compliance, industrial durability, and reduced downtime.</p>
          <a href={contactPhoneHref}>{contactPhone}</a>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <span>{contactAddress}</span>
        </div>
        <div>
          <h2>Products</h2>
          <Link href="/products/?category=Food%20Grade" navigate={navigate}>Food-grade</Link>
          <Link href="/products/?category=Compressor%20Fluid" navigate={navigate}>Compressor oils</Link>
          <Link href="/products/?category=Heat%20Transfer%20Fluid" navigate={navigate}>Heat-transfer fluids</Link>
          <Link href="/products/?category=Cleaner" navigate={navigate}>System cleaner</Link>
        </div>
        <div>
          <h2>Company</h2>
          <Link href="/about-us/" navigate={navigate}>About Us</Link>
          <Link href="/faqs/" navigate={navigate}>FAQ</Link>
          <Link href="/pdf-resources/" navigate={navigate}>Technical Resources</Link>
          <Link href="/contact-us/" navigate={navigate}>Contact</Link>
        </div>
        <div>
          <h2>Applications</h2>
          <Link href="/products/?category=Low%20Temperature" navigate={navigate}>Low-temperature</Link>
          <Link href="/products/?category=Ammonia%20Refrigeration" navigate={navigate}>Ammonia refrigeration</Link>
          <Link href="/products/?category=Gear%20Oil" navigate={navigate}>Gear units</Link>
          <Link href="/products/?category=Hydraulic%20Fluid" navigate={navigate}>Hydraulic systems</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Mid South Lubricants. All rights reserved.</p>
        <div>
          <Link href="/privacy-policy/" navigate={navigate}>Privacy Policy</Link>
          <Link href="/terms/" navigate={navigate}>Terms</Link>
        </div>
      </div>
    </footer>
  );
}

function PageHero({ title, copy, image, imageAlt = "", imageWidth = 1536, imageHeight = 1024 }) {
  return (
    <section className="page-hero">
      <div className="page-hero__copy" data-reveal>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {image ? (
        <div className="page-hero__media" data-reveal>
          <div className="page-hero__media-core">
            <img src={image} alt={imageAlt} width={imageWidth} height={imageHeight} fetchPriority="high" />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ProductCard({ product, navigate }) {
  return (
    <Link className="product-card" href={product.href} navigate={navigate} data-reveal>
      <div className="product-card__image">
        <img src={product.image} alt={`${product.name} product`} width="504" height="634" loading="lazy" />
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p>{plainText(product.shortDescriptionHtml).split("Additional Information:")[0]}</p>
        <div className="product-card__footer">
          <strong>View Product</strong>
        </div>
      </div>
    </Link>
  );
}

function HomeLeadForm() {
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors = {};
    if (!data.get("name")?.trim()) nextErrors.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get("email") || "")) nextErrors.email = "Enter a valid work email.";
    if (!data.get("needs")?.trim()) nextErrors.needs = "Tell us what you are lubricating.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const lines = [
      `Name: ${data.get("name")}`,
      `Work email: ${data.get("email")}`,
      `Company: ${data.get("company") || "Not provided"}`,
      "",
      data.get("needs"),
    ];
    setSubmitted(true);
    trackEvent("form_prepare_email", { form_name: "home_recommendation" });
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent("Application recommendation request")}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <form className="home-lead-form" onSubmit={handleSubmit} noValidate>
      {submitted ? <div className="form-status" role="status"><strong>Your email app should open now.</strong><span>If it does not, email {contactEmail} directly.</span></div> : null}
      <div className="home-lead-form__grid">
        <label>
          <span>Name *</span>
          <input name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "home-name-error" : undefined} />
          {errors.name ? <small id="home-name-error" className="field-error">{errors.name}</small> : null}
        </label>
        <label>
          <span>Work email *</span>
          <input name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "home-email-error" : undefined} />
          {errors.email ? <small id="home-email-error" className="field-error">{errors.email}</small> : null}
        </label>
        <label>
          <span>Company</span>
          <input name="company" autoComplete="organization" />
        </label>
        <label>
          <span>What are you lubricating? *</span>
          <textarea name="needs" rows="3" aria-invalid={Boolean(errors.needs)} aria-describedby={errors.needs ? "home-needs-error" : undefined} />
          {errors.needs ? <small id="home-needs-error" className="field-error">{errors.needs}</small> : null}
        </label>
      </div>
      <button className="button button--primary" type="submit">Send My Request</button>
      <p className="home-lead-form__note">No sales runaround. A real person will follow up.</p>
    </form>
  );
}

function HomePage({ navigate }) {
  const [activeApplication, setActiveApplication] = useState(0);
  const active = applications[activeApplication];

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <h1 id="home-title" className="sr-only">Premium Lubricants for Poultry Processing</h1>
        <picture className="home-hero__picture">
          <source media="(max-width: 767px)" srcSet="/images/company/processing-line.jpg" type="image/jpeg" />
          <img
            className="home-hero__background"
            src="/images/authentic/hero-poultry-brand.webp"
            alt=""
            width="2560"
            height="1440"
            fetchPriority="high"
          />
        </picture>
        <div className="home-hero__mobile-content" aria-hidden="true">
          <img
            className="home-hero__mobile-logo"
            src="/images/mid-south-logo.webp"
            alt=""
            width="270"
            height="270"
            fetchPriority="high"
          />
          <div className="home-hero__mobile-message">
            <p className="home-hero__mobile-title">
              <span>Premium lubricants</span>
              for poultry processing
            </p>
            <p className="home-hero__mobile-tagline">
              Engineered for performance. Trusted in every plant.
            </p>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Mid South capabilities">
        <div className="proof-grid">
          <div><strong>Boost Efficiency</strong><span>Advanced oils and fluids keep critical systems running longer</span></div>
          <div><strong>Cut Costs</strong><span>Fewer breakdowns, less maintenance, better margins</span></div>
          <div><strong>Built to Last</strong><span>Engineered for extreme heat, cold, and pressure</span></div>
          <div><strong>30+ Years</strong><span>Specialty lubricant industry experience</span></div>
        </div>
      </section>

      <section className="section application-section" aria-labelledby="application-title">
        <div className="section-heading" data-reveal>
          <h2 id="application-title">Our Lubricants</h2>
          <p>Our focused catalog covers heat transfer systems, ammonia refrigeration, and food-processing equipment, with a current Technical Data Sheet for every product.</p>
        </div>
        <div className="application-browser">
          <div className="application-list" data-reveal>
            {applications.map((application, index) => (
              <button
                key={application.name}
                className={index === activeApplication ? "is-active" : ""}
                type="button"
                aria-pressed={index === activeApplication}
                onClick={() => setActiveApplication(index)}
                onMouseEnter={() => setActiveApplication(index)}
                onFocus={() => setActiveApplication(index)}
              >
                <span>{application.name}</span>
                <small>{application.copy}</small>
              </button>
            ))}
          </div>
          <div className="application-image" data-reveal>
            <img key={active.image} src={active.image} alt={`${active.name} application`} width="1536" height="1024" loading="lazy" />
            <ButtonLink href={`/products/?category=${encodeURIComponent(active.category)}`} navigate={navigate} variant="light">View Matching Products</ButtonLink>
          </div>
        </div>
      </section>

      <section className="featured-products-home" aria-labelledby="featured-title">
        <div className="featured-products-home__intro" data-reveal>
          <h2 id="featured-title">Top-Grade Products</h2>
          <p>Explore six documented products for heat transfer, refrigeration, food-processing, hydraulic, compressor, and gear applications.</p>
          <ButtonLink href="/products/" navigate={navigate} variant="text">View Products</ButtonLink>
        </div>
        <div className="featured-products-home__grid">
          {featuredProducts.slice(0, 3).map((product) => (
            <Link className="product-showcase" href={product.href} navigate={navigate} key={product.id} data-reveal>
              <div className="product-showcase__image">
                <img src={product.image} alt={`${product.name} product`} width="504" height="634" loading="lazy" />
              </div>
              <h3>{product.name}</h3>
              <span>View Product</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section about-preview" aria-labelledby="about-preview-title">
        <div className="about-preview__images" data-reveal>
          <img src="/images/authentic/ray-tracie-owners.webp" alt="Ray and Tracie Tatum, owners of Mid South Lubricants" width="1080" height="1395" loading="lazy" />
        </div>
        <div className="about-preview__copy" data-reveal>
          <h2 id="about-preview-title">The Best Team Around</h2>
          <p>Meet the folks who keep Mid South Lubricants running smoothly (so you can, too).</p>
          <ButtonLink href="/about-us/" navigate={navigate} variant="text">Meet Mid South</ButtonLink>
        </div>
      </section>

      <section id="recommendation" className="home-lead-section" aria-labelledby="recommendation-title">
        <div className="home-lead-section__copy" data-reveal>
          <h2 id="recommendation-title">Need help?</h2>
          <p>Let us know what you need and we’ll help you find the right solution. Whether you’re replacing a spec or building a system from scratch, our team’s here to help.</p>
          <div className="home-lead-section__direct">
            <span>Prefer to talk now?</span>
            <a href={contactPhoneHref}>{contactPhone}</a>
          </div>
        </div>
        <div data-reveal><HomeLeadForm /></div>
      </section>
    </>
  );
}

function ProductCatalog({ navigate }) {
  const initialCategory = new URLSearchParams(window.location.search).get("category") || "All Products";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(productCategories.includes(initialCategory) ? initialCategory : "All Products");
  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "All Products" || product.categories.includes(category);
      const haystack = [product.name, product.categories.join(" "), product.productCodes.join(" "), plainText(product.shortDescriptionHtml)].join(" ").toLowerCase();
      return matchesCategory && (!needle || haystack.includes(needle));
    });
  }, [query, category]);

  return (
    <>
      <PageHero title="Our Products" copy="Six specialty products for heat transfer, refrigeration, and food-processing equipment, each supported by a current Technical Data Sheet." image="/images/products-group.webp" />
      <section className="catalog section" aria-labelledby="catalog-results-title">
        <div className="catalog-controls" data-reveal>
          <div className="search-field">
            <label htmlFor="product-search">Search products</label>
            <input id="product-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, application, or product code" />
          </div>
          <div className="filter-field">
            <label htmlFor="product-category">Product category</label>
            <select id="product-category" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>All Products</option>
              {productCategories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
        <div className="catalog-summary">
          <h2 id="catalog-results-title">{filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}</h2>
          {(query || category !== "All Products") ? <button type="button" className="text-button" onClick={() => { setQuery(""); setCategory("All Products"); }}>Clear filters</button> : null}
        </div>
        {filteredProducts.length ? (
          <div className="product-grid">{filteredProducts.map((product) => <ProductCard product={product} navigate={navigate} key={product.id} />)}</div>
        ) : (
          <div className="empty-state" role="status">
            <h3>No matching products</h3>
            <p>Clear the filters or ask Mid South to help identify another option.</p>
            <ButtonLink href="/contact-us/#quote" navigate={navigate}>Get Selection Help</ButtonLink>
          </div>
        )}
      </section>
      <QuoteBand navigate={navigate} />
    </>
  );
}

function ProductPage({ product, navigate }) {
  const related = products.filter((item) => item.id !== product.id && item.categories.some((category) => product.categories.includes(category))).slice(0, 3);

  return (
    <>
      <div className="product-page">
        <div className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/" navigate={navigate}>Home</Link><span>/</span><Link href="/products/" navigate={navigate}>Products</Link><span>/</span><span aria-current="page">{product.name}</span>
        </div>
        <section className="product-hero">
          <div className="product-hero__image" data-reveal><img src={product.image} alt={`${product.name} product`} width="504" height="634" fetchPriority="high" /></div>
          <div className="product-hero__copy" data-reveal>
            <h1>{product.name}</h1>
            {product.productCodes.length ? <p className="product-code">Product code: {product.productCodes.join(", ")}</p> : null}
            <div className="rich-text rich-text--lead" dangerouslySetInnerHTML={{ __html: product.shortDescriptionHtml.split(/<h3/i)[0] }} />
            <div className="button-row">
              <ButtonLink href={`/contact-us/?product=${encodeURIComponent(product.name)}#quote`} navigate={navigate}>Request a Quote</ButtonLink>
              <a className="button button--secondary" href={contactPhoneHref}>Call {contactPhone}</a>
            </div>
          </div>
        </section>

        <section className="product-information section">
          <div className="product-description" data-reveal>
            <h2>Product details</h2>
            <div className="rich-text" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
          </div>
          <div className="product-features" data-reveal>
            <h2>Key features</h2>
            {product.features.length ? <ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul> : <p>Contact Mid South for application details and current technical documentation.</p>}
          </div>
        </section>

        <section id="documents" className="section product-documents" aria-labelledby="product-documents-title">
          <div className="section-heading">
            <h2 id="product-documents-title">Technical &amp; safety documents</h2>
            <p>Download the manufacturer’s current Technical Data Sheet (TDS) and Safety Data Sheet (SDS) when available.</p>
          </div>
          <div className="document-download-grid">
            {product.documents.map((document) => (
              <article key={document.type}>
                <span className="document-type">{document.type}</span>
                <h3>{document.title}</h3>
                <p>{document.description}</p>
                {document.href ? (
                  <a className="button button--secondary" href={document.href} download>Download {document.type} PDF</a>
                ) : (
                  <ButtonLink
                    href={`/contact-us/?product=${encodeURIComponent(product.name)}&document=${document.type}#quote`}
                    navigate={navigate}
                    variant="secondary"
                  >
                    Request {document.type} PDF
                  </ButtonLink>
                )}
              </article>
            ))}
          </div>
        </section>

        {product.packageSkus.length ? <section className="section options-section" aria-labelledby="package-skus-title">
          <div className="section-heading">
            <h2 id="package-skus-title">Package SKU directory</h2>
            <p>Current package-level SKUs supplied by Mid South. Confirm the required grade and availability when requesting a quote.</p>
          </div>
          <p className="table-scroll-hint">Swipe horizontally to view all package details.</p>
          <div className="variation-table-wrap" tabIndex="0" role="region" aria-label={`${product.name} package SKU directory`}>
            <table className="variation-table variation-table--compact">
              <thead><tr><th>Packaging</th><th>Package SKU</th></tr></thead>
              <tbody>{product.packageSkus.map((item) => (
                <tr key={item.sku}><td>{item.packaging}</td><td><code>{item.sku}</code></td></tr>
              ))}</tbody>
            </table>
          </div>
        </section> : null}

        {product.labels.length ? <section className="section product-documents" aria-labelledby="product-labels-title">
          <div className="section-heading">
            <h2 id="product-labels-title">Printable product labels</h2>
            <p>Production-ready PDF labels supplied by Mid South for the exact SKUs and package sizes below.</p>
          </div>
          <div className="label-download-grid">
            {product.labels.map((label) => (
              <article key={label.href}>
                <span>{label.option}</span>
                <h3>{label.sku}</h3>
                <a className="button button--secondary" href={label.href} download>Download PDF Label</a>
              </article>
            ))}
          </div>
        </section> : null}

        {product.variations.length ? <section className="section options-section" aria-labelledby="options-title">
          <div className="section-heading">
            <h2 id="options-title">Available options</h2>
            <p>Confirm the required grade, package size, and availability when requesting a quote.</p>
          </div>
          <p className="table-scroll-hint">Swipe horizontally to view all option details.</p>
          <div className="variation-table-wrap" tabIndex="0" role="region" aria-label={`${product.name} available options`}>
              <table className="variation-table">
                <thead><tr><th>Option</th><th>SKU</th><th>Availability</th></tr></thead>
                <tbody>{product.variations.map((variation) => (
                  <tr key={variation.id}><td>{variation.option}</td><td><code>{variation.sku}</code></td><td>{variation.inStock ? "Available" : "Ask for availability"}</td></tr>
                ))}</tbody>
              </table>
          </div>
        </section> : null}

        {related.length ? <section className="section related-products"><div className="section-heading"><h2>Related products</h2></div><div className="product-grid product-grid--three">{related.map((item) => <ProductCard key={item.id} product={item} navigate={navigate} />)}</div></section> : null}
      </div>
      <QuoteBand navigate={navigate} productName={product.name} />
    </>
  );
}

function AboutPage({ navigate }) {
  return (
    <>
      <PageHero
        title="About Mid South"
        copy="We provide innovative lubrication solutions tailored for the demands of modern manufacturing operations."
        image="/images/authentic/processing-conveyor-wide.webp"
        imageAlt="A food-processing conveyor and production line"
        imageWidth={904}
        imageHeight={339}
      />
      <section className="section story-section">
        <div className="story-section__heading" data-reveal>
          <h2>Why We Started</h2>
          <p>Built on field experience, direct support, and relationships that last.</p>
        </div>
        <div className="story-section__copy" data-reveal>
          <p>After decades of experience in the specialty lubricants industry, we saw an opportunity to do things differently. We wanted to create a company built not only on quality products, but also on trust, service, and relationships. For us, this business isn’t just about selling lubricants; it’s about solving problems, treating people right, and building something lasting for our family and community.</p>
          <p>Mid South Lubricants was founded with a simple vision: to combine Ray’s 30+ years of expertise with Tracie’s dedication to care and connection, creating a business that feels personal. We believe in working hard, listening to our customers, and growing a company we can one day pass down to the next generation.</p>
        </div>
        <div className="story-section__media" data-reveal>
          <img src="/images/authentic/processing-conveyor-overview.webp" alt="Food-processing conveyors installed on a production floor" width="782" height="391" loading="lazy" />
        </div>
      </section>
      <section className="leadership-section" aria-labelledby="leadership-title">
        <div className="leadership-intro" data-reveal>
          <h2 id="leadership-title">Owner-led. Customer close.</h2>
          <p>Ray and Tracie pair deep industry experience with the kind of direct, personal support that shaped Mid South from the beginning.</p>
        </div>
        <div className="leadership-list">
          <article className="leader-profile leader-profile--ray">
            <div className="leader-profile__media" data-reveal>
              <div className="leader-profile__portrait">
                <img src="/images/company/ray-tatum.webp" alt="Ray Tatum" width="575" height="816" loading="lazy" />
              </div>
            </div>
            <div className="leader-profile__copy" data-reveal>
              <p className="leader-profile__role">Co-Owner, CEO</p>
              <h3>Ray Tatum</h3>
              <p>Born and raised in Winnsboro, Louisiana, Ray has spent more than 30 years in the industry. He started as a safety engineer at ConAgra in Farmerville, moved into plant management, and built a 25-year career in capital sales.</p>
              <p>Ray holds a Bachelor of Science in Aviation from Louisiana Tech University, with a minor in Industrial Safety &amp; Technology from LSU. He is driven by practical problem solving, strong customer service, and the goal of building a trusted business for the next generation.</p>
              <dl className="leader-profile__facts">
                <div><dt>Experience</dt><dd>30+ years</dd></div>
                <div><dt>Focus</dt><dd>Technical solutions and customer support</dd></div>
              </dl>
            </div>
          </article>
          <article className="leader-profile leader-profile--tracie">
            <div className="leader-profile__media" data-reveal>
              <div className="leader-profile__portrait">
                <img src="/images/company/tracie-tatum.webp" alt="Tracie Tatum" width="1179" height="1171" loading="lazy" />
              </div>
            </div>
            <div className="leader-profile__copy" data-reveal>
              <p className="leader-profile__role">Co-Owner, CFO</p>
              <h3>Tracie Tatum</h3>
              <p>Originally from Del Mar, California, Tracie is the Co-Owner and CFO of Mid South Lubricants. Alongside more than 30 years supporting Ray in business, she built her own career as a nurse and brings that same sense of care to the company.</p>
              <p>Tracie focuses on customer relationships, careful listening, and building a company rooted in genuine connection. Her long-term vision is to grow Mid South into a business the family can be proud to pass down.</p>
              <dl className="leader-profile__facts">
                <div><dt>Background</dt><dd>Nursing and business operations</dd></div>
                <div><dt>Focus</dt><dd>Relationships and financial stewardship</dd></div>
              </dl>
            </div>
          </article>
        </div>
      </section>
      <section className="section principles-section" aria-labelledby="principles-title">
        <div><h2 id="principles-title">What to Expect</h2><p>Technical knowledge matters most when it turns into clear, useful support.</p></div>
        <div className="principles-list">
          <article><h3>Listen First</h3><p>Start with the equipment, conditions, and operating problem.</p></article>
          <article><h3>Match the Application</h3><p>Consider temperature, load, service interval, and compliance needs.</p></article>
          <article><h3>Stay Accessible</h3><p>Provide direct communication from quote through product selection.</p></article>
          <article><h3>Think Long-Term</h3><p>Focus on relationships, reliability, and practical results.</p></article>
        </div>
      </section>
      <QuoteBand navigate={navigate} />
    </>
  );
}

function FaqPage({ navigate }) {
  return (
    <>
      <PageHero
        title="FAQs"
        copy="Discover answers to your most pressing questions about our lubrication solutions and products."
        image="/images/authentic/poultry-processing-line.webp"
        imageAlt="Poultry moving through an automated processing line"
        imageWidth={678}
        imageHeight={451}
      />
      <section className="section faq-section">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0} data-reveal>
              <summary><span>{faq.question}</span><span aria-hidden="true">+</span></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
        <aside className="faq-aside" data-reveal><h2>Application Help</h2><p>Temperature, load, environment, and equipment design can change the recommendation.</p><ButtonLink href="/contact-us/#quote" navigate={navigate}>Get Selection Help</ButtonLink></aside>
      </section>
    </>
  );
}

function ContactForm() {
  const searchParams = new URLSearchParams(window.location.search);
  const productName = searchParams.get("product") || "";
  const documentType = searchParams.get("document") || "";
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors = {};
    if (!data.get("name")?.trim()) nextErrors.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(data.get("email") || "")) nextErrors.email = "Enter a valid email address.";
    if (!data.get("needs")?.trim()) nextErrors.needs = "Describe the equipment or lubricant need.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const lines = [
      `Name: ${data.get("name")}`,
      `Company: ${data.get("company") || "Not provided"}`,
      `Phone: ${data.get("phone") || "Not provided"}`,
      `Product category: ${data.get("category")}`,
      `Lubricant type: ${data.get("type")}`,
      "",
      data.get("needs"),
    ];
    const subject = documentType && productName
      ? `${documentType} request: ${productName}`
      : productName ? `Quote request: ${productName}` : "Lubricant quote request";
    setSubmitted(true);
    trackEvent("form_prepare_email", { form_name: "quote_request", product_name: productName || undefined, document_type: documentType || undefined });
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <form id="quote" className="quote-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading"><h2>Your Application</h2><p>Required fields are marked with an asterisk.</p></div>
      {submitted ? <div className="form-status" role="status"><strong>Your email app should open now.</strong><span>If it does not, email {contactEmail} directly.</span></div> : null}
      <div className="form-grid">
        <label><span>Full name *</span><input name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name ? <small id="name-error" className="field-error">{errors.name}</small> : null}</label>
        <label><span>Company name</span><input name="company" autoComplete="organization" /></label>
        <label><span>Email *</span><input name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />{errors.email ? <small id="email-error" className="field-error">{errors.email}</small> : null}</label>
        <label><span>Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
        <label><span>Product category</span><select name="category" defaultValue="Food-grade"><option>Food-grade</option><option>Industrial</option><option>Refrigeration</option><option>Other</option></select></label>
        <label><span>Product type</span><select name="type" defaultValue="Heat Transfer"><option>Heat Transfer</option><option>Ammonia Refrigeration</option><option>Compressor Oil</option><option>Food-Grade Oil</option><option>Gear Oil</option><option>Hydraulic Oil</option><option>System Cleaner</option><option>Other</option></select></label>
        <label className="form-grid__wide"><span>Describe your lubricant needs *</span><textarea name="needs" rows="6" defaultValue={documentType && productName ? `Please send me the current ${documentType} PDF for ${productName}.` : productName ? `I would like information and availability for ${productName}.` : ""} aria-invalid={Boolean(errors.needs)} aria-describedby={errors.needs ? "needs-error" : undefined} />{errors.needs ? <small id="needs-error" className="field-error">{errors.needs}</small> : null}</label>
      </div>
      <button className="button button--primary" type="submit">Prepare Email</button>
    </form>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Mid South"
        copy="Reach out to us for any inquiries or support regarding our lubrication solutions."
        image="/images/authentic/poultry-line-closeup.webp"
        imageAlt="Poultry processing equipment in operation"
        imageWidth={678}
        imageHeight={451}
      />
      <section className="contact-layout section">
        <div className="contact-details" data-reveal>
          <h2>Get in Touch</h2>
          <p>We would love to speak with you. Feel free to reach out using the details below.</p>
          <div className="contact-method"><span>Email</span><a href={`mailto:${contactEmail}`}>{contactEmail}</a><p>For inquiries or support, please reach out to us anytime.</p></div>
          <div className="contact-method"><span>Phone</span><a href={contactPhoneHref}>{contactPhone}</a><p>Call us for immediate assistance with your lubrication needs.</p></div>
          <div className="contact-method"><span>Location</span><strong>{contactAddress}</strong><p>We offer personalized service from our Louisiana headquarters.</p></div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}

function ResourcesPage({ navigate }) {
  const groups = [
    ["Food-grade registrations", "Request H1, HT-1, and other product-specific registration details."],
    ["Product specifications", "Ask for current viscosity, temperature, compatibility, and performance information."],
    ["Application support", "Share an existing specification or operating problem for product-selection help."],
    ["Packaging and availability", "Confirm grades, package sizes, and current stock."],
  ];
  return (
    <>
      <PageHero
        title="Resources"
        copy="Download the Technical Data Sheet for every product in the current Mid South Lubricants catalog."
        image="/images/authentic/processing-conveyor-overview.webp"
        imageAlt="A food-processing conveyor system on the production floor"
        imageWidth={782}
        imageHeight={391}
      />
      <section className="section resources-section">
        <div className="resources-intro">
          <h2>Technical data sheets</h2>
          <p>Current product properties, performance data, and recommended applications supplied by Mid South Lubricants and its manufacturing partners.</p>
        </div>
        <div className="resource-grid label-resource-grid">
          {technicalDataSheets.map((document) => (
            <article key={document.href}>
              <span className="resource-kicker">Technical Data Sheet</span>
              <h3>{document.productName}</h3>
              <p>{document.productCode}</p>
              <a className="button button--text" href={document.href} download>Download TDS PDF</a>
            </article>
          ))}
        </div>
      </section>
      <section className="section resource-support" aria-labelledby="resource-support-title">
        <div className="section-heading">
          <h2 id="resource-support-title">Need another document?</h2>
          <p>Contact Mid South for product-specific registrations, specifications, and application support.</p>
        </div>
        <div className="resource-grid">{groups.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p><ButtonLink href="/contact-us/#quote" navigate={navigate} variant="text">Request Documents</ButtonLink></article>)}</div>
      </section>
      <QuoteBand navigate={navigate} />
    </>
  );
}

function LegalPage({ type }) {
  const isPrivacy = type === "privacy";
  const sections = isPrivacy ? [
    ["Information you provide", <><p>When you contact us by phone or email, you may provide your name, email address, phone number, company, and details about your equipment or lubricant needs.</p><p>The website currently prepares an email in your device's email application. The website does not transmit or store that message before you choose to send it.</p></>],
    ["Information collected automatically", <p>Our web host may process standard technical information such as IP address, browser type, requested pages, timestamps, and security logs. We may enable privacy-conscious website analytics to understand aggregate traffic and actions such as document downloads or phone-link clicks.</p>],
    ["How we use information", <p>We use information to respond to inquiries, recommend products, prepare quotes, provide requested documents, maintain website security, understand site performance, and comply with legal obligations.</p>],
    ["Sharing", <p>We do not sell personal information. We may share information with service providers that support hosting, email, security, or analytics, and when required by law or necessary to protect our rights.</p>],
    ["Retention and security", <p>We retain correspondence only as long as reasonably necessary for customer service, business records, and legal obligations. No transmission or storage system can be guaranteed completely secure.</p>],
    ["Your choices", <p>You may contact us to request access to, correction of, or deletion of personal information we maintain, subject to applicable legal and recordkeeping requirements. Browser settings can limit cookies and similar technologies.</p>],
    ["Children's privacy", <p>This business website is not directed to children under 13, and we do not knowingly collect personal information from children.</p>],
    ["Policy changes", <p>We may update this policy as the website and our practices change. The effective date below identifies the latest revision.</p>],
  ] : [
    ["Website purpose", <p>This website provides general information about Mid South Lubricants, its products, and related services. Website content is not a substitute for equipment-manufacturer instructions, a current Technical Data Sheet, a current Safety Data Sheet, or application-specific technical advice.</p>],
    ["Product information", <p>Product descriptions, grades, packaging, availability, registrations, and specifications may change. Confirm all requirements with Mid South Lubricants before ordering or using a product. Images may represent a product family rather than the exact grade or package supplied.</p>],
    ["Safety and compliance", <p>Users are responsible for reviewing current safety documentation, confirming material compatibility, following equipment instructions, and determining whether a product is suitable for the intended application. Food-grade or other regulatory requirements must be confirmed for the specific product and use.</p>],
    ["Quotes and orders", <p>Website inquiries are requests for information only. They do not create an order or binding agreement. Pricing, freight, taxes, payment terms, availability, and delivery are subject to a written quote or order confirmation from Mid South Lubricants.</p>],
    ["Intellectual property", <p>The website design, text, graphics, logo, product information, and other materials are owned by or licensed to Mid South Lubricants and may not be reproduced or used commercially without permission.</p>],
    ["Third-party materials", <p>Linked documents, registrations, standards, and third-party names remain subject to their owners' terms. We are not responsible for third-party websites or materials.</p>],
    ["Disclaimer and limitation", <p>The website is provided on an as-available basis without warranties concerning uninterrupted access or complete accuracy. To the extent permitted by law, Mid South Lubricants is not liable for indirect or consequential losses arising from use of this website.</p>],
    ["Governing law", <p>These terms are governed by the laws of the State of Louisiana, without regard to conflict-of-law principles. If any provision is unenforceable, the remaining provisions continue in effect.</p>],
    ["Changes", <p>We may update these terms as the website or our business practices change. Continued use after an update constitutes acceptance of the revised terms.</p>],
  ];
  return (
    <section className="legal-page section">
      <h1>{isPrivacy ? "Privacy Policy" : "Website Terms"}</h1>
      <p className="legal-effective">Effective August 10, 2026</p>
      <p className="legal-intro">{isPrivacy
        ? "This policy explains how Mid South Lubricants handles information associated with this website and direct business inquiries."
        : "These terms govern use of the Mid South Lubricants website. By using the site, you agree to these terms."}</p>
      <div className="legal-sections">
        {sections.map(([heading, content]) => <section key={heading}><h2>{heading}</h2>{content}</section>)}
      </div>
      <div className="legal-notice"><h2>Contact us</h2><p>Questions about {isPrivacy ? "this policy or personal information" : "these terms"} may be sent to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>, discussed by phone at <a href={contactPhoneHref}>{contactPhone}</a>, or mailed to {contactAddress}.</p></div>
    </section>
  );
}

function NotFoundPage({ navigate }) {
  return <section className="not-found section"><h1>Page Not Found</h1><p>Browse the product catalog or return to the homepage.</p><div className="button-row"><ButtonLink href="/products/" navigate={navigate}>Browse Products</ButtonLink><ButtonLink href="/" navigate={navigate} variant="secondary">Go Home</ButtonLink></div></section>;
}

function QuoteBand({ navigate, productName = "" }) {
  const href = productName ? `/contact-us/?product=${encodeURIComponent(productName)}#quote` : "/contact-us/#quote";
  return <section className="quote-band"><div><h2>Get Your Custom Quote Today</h2><p>Let us know what you need and we’ll help you find the right solution. Whether you’re replacing a spec or building a system from scratch, our team’s here to help.</p></div><ButtonLink href={href} navigate={navigate} variant="light">Request a Quote</ButtonLink></section>;
}

function App() {
  const { path, search, navigate } = useRoute();
  const productMatch = path.match(/^\/product\/([^/]+)\/$/);
  const product = productMatch ? products.find((item) => item.slug === productMatch[1]) : null;

  useEffect(() => {
    const isNotFound = !product && !routeMeta[path];
    const [title, description] = product
      ? [`${product.name} | Mid South Lubricants`, plainText(product.shortDescriptionHtml).slice(0, 155)]
      : routeMeta[path] || ["Page Not Found | Mid South Lubricants", "Browse Mid South Lubricants products and company information."];
    updateSeo({ path, product, title, description, isNotFound });
    trackPageView(`${path}${search}`);
  }, [path, product, search]);

  useEffect(() => {
    const trackDocumentClick = (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (href.startsWith("tel:")) trackEvent("phone_click", { link_url: href });
      else if (href.startsWith("mailto:")) trackEvent("email_click", { link_url: href });
      else if (link.hasAttribute("download") || /\.pdf(?:$|\?)/i.test(href)) {
        trackEvent("document_download", { file_url: href, link_text: link.textContent.trim() });
      }
    };
    document.addEventListener("click", trackDocumentClick);
    return () => document.removeEventListener("click", trackDocumentClick);
  }, []);

  useEffect(() => {
    if (!window.location.hash) return undefined;
    const timer = window.setTimeout(() => {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [path, search]);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.1 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [path]);

  let page;
  if (path === "/") page = <HomePage navigate={navigate} />;
  else if (path === "/products/" || path === "/shop/") page = <ProductCatalog key={search} navigate={navigate} />;
  else if (product) page = <ProductPage product={product} navigate={navigate} />;
  else if (path === "/about-us/") page = <AboutPage navigate={navigate} />;
  else if (path === "/faqs/") page = <FaqPage navigate={navigate} />;
  else if (path === "/contact-us/") page = <ContactPage key={search} />;
  else if (path === "/pdf-resources/") page = <ResourcesPage navigate={navigate} />;
  else if (path === "/privacy-policy/") page = <LegalPage type="privacy" />;
  else if (path === "/terms/") page = <LegalPage type="terms" />;
  else page = <NotFoundPage navigate={navigate} />;

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header key={path} navigate={navigate} currentPath={path} />
      <main id="main-content">{page}</main>
      <Footer navigate={navigate} />
    </div>
  );
}

export default App;
