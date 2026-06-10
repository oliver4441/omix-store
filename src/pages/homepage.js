import { products, categories } from "../data/products.js";

export function renderHome() {
  const featured = products.slice(0, 6);

  return `
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-grid"></div>
      <div class="hero-content">
        <div class="hero-badge">
          <div class="hero-badge-dot"></div>
          Omix Systems — Kericho, Kenya
        </div>
        <h1>Software, Books &<br><span>Digital Solutions</span></h1>
        <p>From <strong>M-Pesa ready systems</strong> to <strong>KCSE revision resources</strong> — everything you need to power your school, business, or project.</p>
        <div class="hero-buttons">
          <a href="#products" class="btn-primary" data-nav>Browse Products →</a>
          <a href="#products?cat=software" class="btn-secondary" data-nav>View Software</a>
        </div>
        <div class="hero-stats">
          <div><div class="num">${products.length}+</div><div class="label">Products</div></div>
          <div><div class="num">5+</div><div class="label">Clients</div></div>
          <div><div class="num">100%</div><div class="label">M-Pesa Ready</div></div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section">
      <div class="container fade-in">
        <div class="section-title">
          <div class="pre">What We Offer</div>
          <h2>Browse by Category</h2>
          <p>Find exactly what you need — from software solutions to educational resources.</p>
        </div>
        <div class="cat-grid">
          ${categories.map(cat => `
            <a href="#products?cat=${cat.id}" class="cat-card" data-nav>
              <div class="icon">${cat.icon}</div>
              <h3>${cat.name}</h3>
              <p>${cat.desc}</p>
              <div class="count">${products.filter(p => p.category === cat.id).length} products →</div>
            </a>
          `).join("")}
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="section section-soft">
      <div class="container fade-in">
        <div class="section-title">
          <div class="pre">Featured Products</div>
          <h2>Our Top Picks</h2>
          <p>Our most popular products — trusted by schools, businesses, and individuals across Kenya.</p>
        </div>
        <div class="product-grid">
          ${featured.map(p => renderProductCard(p)).join("")}
        </div>
        <div style="text-align:center;margin-top:32px;">
          <a href="#products" class="btn-secondary" data-nav>View All Products →</a>
        </div>
      </div>
    </section>

    <!-- Why Omix -->
    <section class="section">
      <div class="container fade-in">
        <div class="section-title">
          <div class="pre">Why Us</div>
          <h2>Built for Kenya, By Kenyans</h2>
          <p>Every product we build is designed with the Kenyan market in mind — from M-Pesa integration to local hosting solutions.</p>
        </div>
        <div class="why-grid">
          <div class="why-card">
            <div class="icon">🇰🇪</div>
            <h3>Local Expertise</h3>
            <p>We understand Kenyan businesses, schools, and the unique challenges they face. Our solutions are tailored to you.</p>
          </div>
          <div class="why-card">
            <div class="icon">💳</div>
            <h3>M-Pesa Ready</h3>
            <p>All our products integrate with M-Pesa for seamless payments. No need for credit cards or international gateways.</p>
          </div>
          <div class="why-card">
            <div class="icon">🔧</div>
            <h3>Full Support</h3>
            <p>From installation to training, we don't just hand over code. We make sure you can actually use it.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section section-soft">
      <div class="container fade-in">
        <div class="section-title">
          <div class="pre">Questions</div>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div style="max-width:640px;margin:0 auto;">
          ${renderFaqs()}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section" style="text-align:center;">
      <div class="container fade-in">
        <h2 style="font-size:clamp(1.5rem,3vw,2.5rem);font-weight:700;margin-bottom:16px;">Need Something Custom Built?</h2>
        <p style="color:var(--text-muted);max-width:500px;margin:0 auto 32px;">Don't see what you're looking for? We build custom software, websites, and digital solutions tailored to your needs.</p>
        <div class="hero-buttons">
          <a href="https://wa.me/254725220515" target="_blank" class="btn-green">💬 WhatsApp Us</a>
          <a href="tel:+254725220515" class="btn-secondary">📞 0725 220 515</a>
        </div>
      </div>
    </section>
  `;
}

function renderProductCard(p) {
  const icons = { software: "💻", books: "📚", services: "🛠️", projects: "📦" };
  return `
    <a href="#product-detail?slug=${p.slug}" class="product-card" data-nav>
      <div class="thumb">
        ${icons[p.category] || "📦"}
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
      </div>
      <div class="body">
        <div class="cat">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="tagline">${p.tagline}</div>
        <div class="price-row">
          <span class="price">KES ${p.price.toLocaleString()}</span>
          ${p.originalPrice ? `<span class="price-old">KES ${p.originalPrice.toLocaleString()}</span>` : ""}
        </div>
      </div>
    </a>
  `;
}

function renderFaqs() {
  const faqs = [
    { q: "How do I buy a product?", a: "Browse our catalog, add items to your cart, and checkout. You'll receive M-Pesa STK Push on your phone to complete payment. Digital products are delivered instantly." },
    { q: "What payment methods do you accept?", a: "We primarily use M-Pesa (STK Push and Buy Goods Till). For larger projects we also accept bank transfers." },
    { q: "Do you offer support after purchase?", a: "Yes! Software products include 1 month of free support via WhatsApp. Custom projects include extended support." },
    { q: "Can I request custom modifications?", a: "Absolutely. If our existing products don't meet your exact needs, we offer customization services. Contact us via WhatsApp." },
  ];
  return faqs.map((f, i) => `
    <details class="glass-card" style="padding:16px 20px;margin-bottom:8px;cursor:pointer;">
      <summary style="font-weight:600;font-size:15px;cursor:pointer;">${f.q}</summary>
      <p style="color:var(--text-muted);font-size:14px;margin-top:12px;line-height:1.6;">${f.a}</p>
    </details>
  `).join("");
}
