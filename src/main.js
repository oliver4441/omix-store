import "./style.css";

const app = document.getElementById("app");

function navigate(hash) {
  window.location.hash = hash;
  render();
}

function render() {
  const hash = window.location.hash.slice(1) || "home";
  app.innerHTML = "";

  // Navbar
  app.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="#home" class="logo" data-nav>
          <div class="logo-icon">O</div>
          <span class="logo-text">Omix <span class="logo-sub">Store</span></span>
        </a>
        <div class="nav-links" id="navLinks">
          <a href="#home" data-nav>Home</a>
          <a href="#products" data-nav>Products</a>
          <a href="#products?cat=software" data-nav>Software</a>
          <a href="#products?cat=books" data-nav>Books</a>
          <a href="#products?cat=services" data-nav>Services</a>
        </div>
        <div class="nav-right">
          <a href="#cart" class="cart-btn" data-nav id="cartBtn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
            <span class="cart-badge" id="cartBadge" style="display:none">0</span>
          </a>
          <button class="menu-toggle" id="menuToggle">☰</button>
        </div>
      </div>
      <div class="mobile-menu" id="mobileMenu">
        <a href="#home" data-nav>Home</a>
        <a href="#products" data-nav>All Products</a>
        <a href="#products?cat=software" data-nav>💻 Software</a>
        <a href="#products?cat=books" data-nav>📚 Books</a>
        <a href="#products?cat=services" data-nav>🛠️ Services</a>
        <a href="#products?cat=projects" data-nav>📦 Projects</a>
      </div>
    </nav>
    <main class="main-content" id="mainContent"></main>
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>Omix Systems</h3>
            <p>Building modern digital solutions for Kenyan businesses and schools.</p>
          </div>
          <div>
            <h4>Products</h4>
            <a href="#products?cat=software" data-nav>Software</a>
            <a href="#products?cat=books" data-nav>Books</a>
            <a href="#products?cat=services" data-nav>Services</a>
            <a href="#products?cat=projects" data-nav>Projects</a>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="tel:+254725220515">0725 220 515</a>
            <a href="mailto:kipkiruigideon890@gmail.com">Email Us</a>
            <a href="https://wa.me/254725220515" target="_blank">WhatsApp</a>
          </div>
        </div>
        <div class="footer-bottom">
          © ${new Date().getFullYear()} Omix Systems. All rights reserved.
        </div>
      </div>
    </footer>
    <a href="https://wa.me/254725220515" target="_blank" class="whatsapp-float">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  `;

  // Load page content
  const content = document.getElementById("mainContent");
  populatePage(hash, content);

  // Setup mobile menu
  document.getElementById("menuToggle")?.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.toggle("open");
  });

  // Close mobile menu on nav
  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => {
      document.getElementById("mobileMenu")?.classList.remove("open");
    });
  });

  updateCartBadge();
}

async function populatePage(hash, container) {
  const [base, queryString] = hash.split("?");
  const params = new URLSearchParams(queryString || "");

  try {
    let html = "";
    switch (base) {
      case "home": {
        const mod = await import("./pages/homepage.js");
        html = mod.renderHome();
        break;
      }
      case "products": {
        const mod = await import("./pages/products.js");
        html = mod.renderProducts(params.get("cat"));
        break;
      }
      case "product-detail": {
        const mod = await import("./pages/product-detail.js");
        html = mod.renderProductDetail(params.get("slug"));
        break;
      }
      case "cart": {
        const mod = await import("./pages/cart.js");
        html = mod.renderCart();
        break;
      }
      default: {
        const mod = await import("./pages/homepage.js");
        html = mod.renderHome();
        break;
      }
    }
    container.innerHTML = html;

    // Scroll to top
    window.scrollTo(0, 0);
  } catch (err) {
    console.error("Page load error:", err);
    container.innerHTML = `<div class="error-state"><h2>Something went wrong</h2><p>${err.message}</p><a href="#home" data-nav>Go Home</a></div>`;
  }
}

function updateCartBadge() {
  try {
    const cart = JSON.parse(localStorage.getItem("omix-cart") || "[]");
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    const badge = document.getElementById("cartBadge");
    if (badge) {
      if (count > 0) {
        badge.style.display = "flex";
        badge.textContent = count;
      } else {
        badge.style.display = "none";
      }
    }
  } catch {}
}

// Handle hash changes
window.addEventListener("hashchange", render);

// Handle cart updates from other pages
window.addEventListener("cart-updated", () => {
  updateCartBadge();
});

// Initial render
render();
