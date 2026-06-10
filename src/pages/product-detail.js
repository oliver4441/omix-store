import { products, addToCart } from "../data/products.js";

export function renderProductDetail(slug) {
  const p = products.find(p => p.slug === slug);
  if (!p) {
    return `
      <div class="breadcrumb container">
        <a href="#home" data-nav>Home</a> <span>/</span>
        <a href="#products" data-nav>Products</a>
      </div>
      <div class="empty-state" style="padding-top:40px;">
        <div class="icon">🔍</div>
        <h2>Product Not Found</h2>
        <p>This product doesn't exist or has been removed.</p>
        <a href="#products" class="btn-primary" data-nav>← Back to Products</a>
      </div>
    `;
  }

  const icons = { software: "💻", books: "📚", services: "🛠️", projects: "📦" };
  const related = products.filter(r => r.category === p.category && r.id !== p.id).slice(0, 3);

  return `
    <div class="breadcrumb container">
      <a href="#home" data-nav>Home</a> <span>/</span>
      <a href="#products" data-nav>Products</a> <span>/</span>
      <span>${p.name}</span>
    </div>

    <section class="section">
      <div class="container fade-in">
        <div class="detail-grid">
          <div class="detail-img">
            ${icons[p.category] || "📦"}
            ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
          </div>
          <div class="detail-info">
            <div class="cat">${p.category}</div>
            <h1>${p.name}</h1>
            <div class="tagline">${p.tagline}</div>
            <div class="desc">${p.description}</div>

            <div class="detail-price">
              <span class="current">KES ${p.price.toLocaleString()}</span>
              ${p.originalPrice ? `<span class="old">KES ${p.originalPrice.toLocaleString()}</span>` : ""}
              ${p.originalPrice ? `<span class="save">Save ${Math.round((1 - p.price / p.originalPrice) * 100)}%</span>` : ""}
            </div>

            <div class="detail-features">
              <h3>✓ What's Included</h3>
              <ul>
                ${p.features.map(f => `<li>${f}</li>`).join("")}
              </ul>
            </div>

            <div class="detail-actions">
              <button class="btn-primary" onclick="addToCartAndNotify('${p.slug}')" style="flex:1;">
                🛒 Add to Cart
              </button>
              <a href="https://wa.me/254725220515?text=${encodeURIComponent(`Hi! I'm interested in "${p.name}" (KES ${p.price.toLocaleString()}).`)}" target="_blank" class="btn-secondary" style="flex:1;text-align:center;">
                💬 Inquire
              </a>
            </div>

            <div class="payment-note">
              💳 M-Pesa Payment — You'll receive an STK Push on your phone after checkout. Digital products delivered instantly.
            </div>
          </div>
        </div>
      </div>
    </section>

    ${related.length > 0 ? `
      <section class="related-section section-soft">
        <div class="container fade-in">
          <h2>More ${p.category.charAt(0).toUpperCase() + p.category.slice(1)}</h2>
          <div class="related-grid">
            ${related.map(r => `
              <a href="#product-detail?slug=${r.slug}" class="related-card" data-nav>
                <div class="cat">${r.category}</div>
                <h3>${r.name}</h3>
                <div class="tagline">${r.tagline}</div>
                <div class="price">KES ${r.price.toLocaleString()}</div>
              </a>
            `).join("")}
          </div>
        </div>
      </section>
    ` : ""}
  `;
}

// Make addToCart accessible from inline onclick
window.addToCartAndNotify = function(slug) {
  const p = products.find(p => p.slug === slug);
  if (p) {
    addToCart(p);
    // Dispatch a custom event so main.js can update the badge
    window.dispatchEvent(new CustomEvent("cart-updated"));
    alert("✅ Added to cart!");
  }
};
