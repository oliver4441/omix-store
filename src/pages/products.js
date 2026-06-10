import { products, categories } from "../data/products.js";

export function renderProducts(activeCat) {
  const filtered = activeCat
    ? products.filter(p => p.category === activeCat)
    : products;

  const icons = { software: "💻", books: "📚", services: "🛠️", projects: "📦" };

  return `
    <div class="breadcrumb container">
      <a href="#home" data-nav>Home</a> <span>/</span>
      <span>${activeCat ? categories.find(c => c.id === activeCat)?.name : "All Products"}</span>
    </div>

    <section class="section">
      <div class="container fade-in">
        <div class="section-title">
          <div class="pre">${activeCat ? categories.find(c => c.id === activeCat)?.name || "Products" : "All Products"}</div>
          <h2>${activeCat ? categories.find(c => c.id === activeCat)?.name || "" : "Everything We Offer"}</h2>
          <p>${activeCat ? `Showing ${filtered.length} product${filtered.length !== 1 ? "s" : ""}` : "Browse our complete catalog of software, books, services, and projects."}</p>
        </div>

        <div class="filter-bar">
          <a href="#products" class="filter-btn${!activeCat ? " active" : ""}" data-nav>All</a>
          ${categories.map(cat => `
            <a href="#products?cat=${cat.id}" class="filter-btn${activeCat === cat.id ? " active" : ""}" data-nav>${cat.icon} ${cat.name}</a>
          `).join("")}
        </div>

        ${filtered.length > 0 ? `
          <div class="product-grid">
            ${filtered.map(p => `
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
            `).join("")}
          </div>
        ` : `
          <div class="empty-state">
            <div class="icon">📭</div>
            <h2>No products found</h2>
            <p>Try a different category</p>
            <a href="#products" class="btn-primary" data-nav>View All</a>
          </div>
        `}
      </div>
    </section>
  `;
}
