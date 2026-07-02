import { useEffect, useState } from "react";

const applications = [
  {
    name: "Food-grade greases",
    copy: "Food-grade greases for high-temperature bearings and processing equipment.",
    image: "/images/application-food.webp",
  },
  {
    name: "Compressor and hydraulic fluids",
    copy: "Compressor and hydraulic fluids built for demanding industrial service.",
    image: "/images/application-compressor.webp",
  },
  {
    name: "Low-temperature and refrigeration",
    copy: "Chain lubricants and compressor oils for freezers and ammonia refrigeration.",
    image: "/images/application-cold.webp",
  },
  {
    name: "Heat-transfer fluids",
    copy: "Thermal stability for demanding heat-transfer applications.",
    image: "/images/application-heat.webp",
  },
];

const outcomes = [
  {
    number: "01",
    title: "Support food-safety requirements",
    copy: "Choose formulas suited to sensitive processing environments.",
  },
  {
    number: "02",
    title: "Reduce avoidable downtime",
    copy: "Protect critical components with lubrication matched to the job.",
  },
  {
    number: "03",
    title: "Perform in extreme conditions",
    copy: "Maintain protection through high heat, freezing cold, and heavy loads.",
  },
];

const products = [
  {
    name: "Synthetic Food-Grade EP Calcium Sulfonate Grease",
    description: "High-performance grease for food-processing bearings and equipment.",
    image: "/images/product-food-grade-grease.webp",
    href: "/product/synthetic-food-grade-ep-calcium-sulfonate-grease/",
  },
  {
    name: "Premium Ammonia Refrigeration Compressor Oil",
    description: "Compressor oil formulated for ammonia refrigeration systems.",
    image: "/images/product-ammonia-oil.webp",
    href: "/product/premium-ammonia-refrigeration-compressor-oil/",
  },
  {
    name: "Synthetic Food-Grade Low Temperature Chain Lubricant",
    description: "Synthetic lubricant for conveyors and equipment in cold environments.",
    image: "/images/product-chain-lubricant.webp",
    href: "/product/synthetic-food-grade-low-temperature-chain-lubricant/",
  },
  {
    name: "Synthetic Biodegradable Hydraulic Fluid",
    description: "Biodegradable hydraulic fluid for environmentally sensitive operations.",
    image: "/images/product-hydraulic-fluid.webp",
    href: "/product/synthetic-biodegradable-hydraulic-fluid/",
  },
];

const selectionInputs = [
  {
    title: "Application",
    copy: "Tell us what equipment or process the lubricant will serve.",
  },
  {
    title: "Operating temperature",
    copy: "Share the typical low and high temperatures in your operation.",
  },
  {
    title: "Load and speed",
    copy: "Provide the operating loads, speeds, and service intervals.",
  },
  {
    title: "Compliance needs",
    copy: "Include any food-safety, environmental, or industry requirements.",
  },
];

function Brand({ light = false }) {
  return (
    <span className={`brand ${light ? "brand--light" : ""}`}>
      <span className="brand-name">
        <span>Mid South</span>
        <span>Lubricants</span>
      </span>
    </span>
  );
}

function ButtonLink({ href, children, variant = "primary" }) {
  return (
    <a className={`button button--${variant}`} href={href}>
      <span>{children}</span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${menuOpen ? "menu-active" : ""}`}>
      <div className="header-inner">
        <a className="brand-link" href="#top" aria-label="Mid South Lubricants home">
          <Brand light />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#products">Products</a>
          <a href="#about">About Us</a>
          <a href="/faqs/">FAQ</a>
        </nav>
        <div className="header-actions">
          <ButtonLink href="#contact" variant="nav">Contact</ButtonLink>
          <button
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
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
      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
        <nav aria-label="Mobile navigation">
          <a href="#products" onClick={closeMenu}>Products</a>
          <a href="#about" onClick={closeMenu}>About Us</a>
          <a href="/faqs/" onClick={closeMenu}>FAQ</a>
          <ButtonLink href="#contact" variant="primary">Contact</ButtonLink>
        </nav>
      </div>
    </header>
  );
}

function App() {
  const [activeApplication, setActiveApplication] = useState(0);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="top" className="site-shell">
      <Header />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img
            className="hero-background"
            src="/images/hero-facility.webp"
            alt=""
            width="1536"
            height="1024"
            fetchPriority="high"
          />
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-copy" data-reveal>
            <h1 id="hero-title">Mid South Lubricants</h1>
            <p>
              Food-grade and industrial formulas built for safety, uptime, and extreme conditions.
            </p>
            <div className="hero-actions">
              <ButtonLink href="#contact" variant="light">Contact</ButtonLink>
            </div>
          </div>
        </section>

        <section className="proof-strip" aria-label="Mid South capabilities">
          <div className="proof-grid">
            <article data-reveal>
              <div>
                <h2>Food-grade options</h2>
                <p>Solutions for sensitive processing environments.</p>
              </div>
            </article>
            <article data-reveal>
              <div>
                <h2>Extreme-temperature formulas</h2>
                <p>Protection through high heat and freezing cold.</p>
              </div>
            </article>
            <article data-reveal>
              <div>
                <h2>Industrial durability</h2>
                <p>Built around equipment life and reliable operation.</p>
              </div>
            </article>
            <article data-reveal>
              <div>
                <h2>30+ years of experience</h2>
                <p>Practical technical knowledge and direct support.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="section applications" aria-labelledby="applications-title">
          <div className="section-heading" data-reveal>
            <h2 id="applications-title">Find the right formula for the job.</h2>
            <p>Purpose-built lubricants for the equipment and environments that keep your operation moving.</p>
          </div>
          <div className="application-index">
            <div className="application-list" data-reveal>
              {applications.map((item, index) => (
                <button
                  className={activeApplication === index ? "is-active" : ""}
                  type="button"
                  key={item.name}
                  aria-pressed={activeApplication === index}
                  onClick={() => setActiveApplication(index)}
                  onMouseEnter={() => setActiveApplication(index)}
                  onFocus={() => setActiveApplication(index)}
                >
                  <span className="application-number">0{index + 1}</span>
                  <span className="application-label">
                    <strong>{item.name}</strong>
                    <span>{item.copy}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="application-visual" data-reveal>
              <img
                key={applications[activeApplication].image}
                src={applications[activeApplication].image}
                alt={`${applications[activeApplication].name} application`}
                width="1536"
                height="1024"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="section outcomes" aria-labelledby="outcomes-title">
          <div className="outcomes-media" data-reveal>
            <img
              src="/images/technician-bearing.webp"
              alt="Technician applying lubricant to an industrial bearing"
              width="1536"
              height="1024"
              loading="lazy"
            />
          </div>
          <div className="outcomes-content" data-reveal>
            <h2 id="outcomes-title">Performance where failure costs more.</h2>
            <div className="outcome-list">
              {outcomes.map((outcome) => (
                <article key={outcome.number}>
                  <span className="outcome-number" aria-hidden="true">{outcome.number}</span>
                  <div>
                    <h3>{outcome.title}</h3>
                    <p>{outcome.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="section products" aria-labelledby="products-title">
          <div className="section-heading section-heading--with-link" data-reveal>
            <div>
              <h2 id="products-title">Proven formulas. Clear applications.</h2>
              <p>Explore a focused range of lubricants for food processing, refrigeration, and industrial systems.</p>
            </div>
            <a className="text-link" href="/products/">
              Browse Products
            </a>
          </div>
          <div className="product-gallery">
            {products.map((product) => (
              <a className="product-card" href={product.href} key={product.name} data-reveal>
                <div className="product-image">
                  <img src={product.image} alt="" width="1000" height="1000" loading="lazy" />
                </div>
                <div className="product-copy">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <span>View Product</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="selection" className="section selection" aria-labelledby="selection-title">
          <div className="selection-copy" data-reveal>
            <h2 id="selection-title">A better recommendation starts with the right details.</h2>
            <p>
              Share your application, operating conditions, and compliance needs. We will help narrow the options.
            </p>
            <ButtonLink href="#contact" variant="light">Get Selection Help</ButtonLink>
          </div>
          <div className="selection-grid">
            {selectionInputs.map(({ title, copy }) => (
              <div className="info-bezel" key={title} data-reveal>
                <article>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="section about" aria-labelledby="about-title">
          <div className="about-media media-bezel" data-reveal>
            <div className="media-core">
              <img
                src="/images/founders.webp"
                alt="Mid South Lubricants owners in an industrial facility"
                width="1536"
                height="1024"
                loading="lazy"
              />
            </div>
          </div>
          <div className="about-copy" data-reveal>
            <h2 id="about-title">Technical experience. Personal service.</h2>
            <p>
              Ray and Tracie built Mid South around practical problem solving, clear communication, and long-term customer relationships.
            </p>
            <div className="founder-lines">
              <p><strong>Ray Tatum</strong><span>Co-Owner and CEO</span></p>
              <p><strong>Tracie Tatum</strong><span>Co-Owner and CFO</span></p>
            </div>
            <a className="text-link" href="/about-us/">
              Learn about Mid South
            </a>
          </div>
        </section>

        <section id="contact" className="quote-cta" aria-labelledby="quote-title">
          <img src="/images/cta-bearing.webp" alt="" width="1792" height="1024" loading="lazy" />
          <div className="quote-overlay" aria-hidden="true" />
          <div className="quote-content" data-reveal>
            <h2 id="quote-title">Tell us what the equipment demands.</h2>
            <p>Replacing a spec or solving a lubrication problem? Share the details and we will help identify the right direction.</p>
            <ButtonLink href="mailto:info@midsouthlube.com?subject=Quote%20Request" variant="light">
              Contact
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer id="footer" className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand light />
            <a href="tel:+13186147948">+1 318-614-7948</a>
            <a href="mailto:info@midsouthlube.com">info@midsouthlube.com</a>
          </div>
          <div>
            <h2>Products</h2>
            <a href="/products/">Food-grade lubricants</a>
            <a href="/products/">Industrial fluids</a>
            <a href="/products/">Greases</a>
          </div>
          <div>
            <h2>Company</h2>
            <a href="/about-us/">About Us</a>
            <a href="/contact-us/">Contact</a>
            <a href="/pdf-resources/">Resources</a>
          </div>
          <div>
            <h2>Support</h2>
            <a href="/faqs/">FAQ</a>
            <a href="/contact-us/">Product support</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Mid South Lubricants. All rights reserved.</p>
          <div>
            <a href="/privacy-policy/">Privacy Policy</a>
            <a href="/terms/">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
