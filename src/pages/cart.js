import { getCart, removeFromCart, clearCart } from "../data/products.js";

export function renderCart() {
  const cart = getCart();
  const icons = { software: "💻", books: "📚", services: "🛠️", projects: "📦" };

  if (cart.length === 0) {
    return `
      <div class="empty-state" style="padding-top:80px;">
        <div class="icon">🛒</div>
        <h2>Your Cart is Empty</h2>
        <p>Add some products first, then come back to checkout.</p>
        <a href="#products" class="btn-primary" data-nav>Browse Products →</a>
      </div>
    `;
  }

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return `
    <div class="breadcrumb container">
      <a href="#home" data-nav>Home</a> <span>/</span>
      <span>Cart</span>
    </div>

    <div class="cart-page" id="cartPage">
      <div class="container fade-in">
        <h1>Your Cart (${totalItems} item${totalItems !== 1 ? "s" : ""})</h1>

        <div class="cart-grid">
          <!-- Items -->
          <div>
            ${cart.map(item => `
              <div class="cart-item">
                <div class="cart-item-icon">${icons[item.category] || "📦"}</div>
                <div class="cart-item-info">
                  <a href="#product-detail?slug=${item.slug}" class="name" data-nav style="color:inherit;">${item.name}</a>
                  <div class="qty">Qty: ${item.quantity}</div>
                </div>
                <div class="cart-item-right">
                  <div class="price">KES ${(item.price * item.quantity).toLocaleString()}</div>
                  <button class="cart-item-remove" onclick="removeFromCartAndRefresh('${item.id}')">Remove</button>
                </div>
              </div>
            `).join("")}
            <button onclick="clearCartAndRefresh()" style="background:none;border:none;color:var(--text-dim);font-size:13px;cursor:pointer;margin-top:8px;">🗑️ Clear all items</button>
          </div>

          <!-- Summary -->
          <div class="cart-summary">
            <h2>Order Summary</h2>
            <div class="row muted">
              <span>Subtotal (${totalItems} items)</span>
              <span>KES ${totalPrice.toLocaleString()}</span>
            </div>
            <div class="row muted">
              <span>Delivery</span>
              <span style="color:var(--green);">Digital / Free</span>
            </div>
            <div class="row total">
              <span>Total</span>
              <span>KES ${totalPrice.toLocaleString()}</span>
            </div>

            <div class="mpesa-input">
              <label for="mpesaPhone">📱 M-Pesa Phone Number</label>
              <input type="tel" id="mpesaPhone" placeholder="0712 345 678" />
            </div>

            <button class="btn-primary" onclick="checkout()" id="checkoutBtn" style="width:100%;margin-top:16px;justify-content:center;">
              💳 Pay with M-Pesa
            </button>
            <div id="checkoutStatus"></div>

            <p style="font-size:12px;color:var(--text-dim);margin-top:12px;text-align:center;line-height:1.5;">
              You'll receive an M-Pesa prompt on your phone. Enter your PIN to complete payment. Digital products delivered instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Cart action functions exposed globally
window.removeFromCartAndRefresh = function(id) {
  removeFromCart(id);
  window.dispatchEvent(new CustomEvent("cart-updated"));
  window.location.hash = "cart";
};

window.clearCartAndRefresh = function() {
  clearCart();
  window.dispatchEvent(new CustomEvent("cart-updated"));
  window.location.hash = "cart";
};

window.checkout = async function() {
  const phone = document.getElementById("mpesaPhone")?.value?.trim();
  if (!phone || phone.length < 9) {
    document.getElementById("checkoutStatus").innerHTML =
      '<div class="status-msg error">Please enter your M-Pesa phone number</div>';
    return;
  }

  const btn = document.getElementById("checkoutBtn");
  const status = document.getElementById("checkoutStatus");
  btn.disabled = true;
  btn.textContent = "⏳ Sending STK Push...";

  const cart = getCart();
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  try {
    const formattedPhone = phone.replace(/^0/, "254").replace(/^\+/, "");
    const res = await fetch("/api/mpesa/stkpush", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: formattedPhone,
        amount: totalPrice,
        items: cart.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
      }),
    });

    const data = await res.json();

    if (data.ResponseCode === "0") {
      status.innerHTML = '<div class="status-msg success">✅ M-Pesa STK Push sent! Check your phone and enter your PIN.</div>';
      setTimeout(() => {
        clearCart();
        window.dispatchEvent(new CustomEvent("cart-updated"));
        location.hash = "cart";
      }, 4000);
    } else {
      status.innerHTML = `<div class="status-msg error">${data.errorMessage || "Payment failed. Please try again."}</div>`;
      btn.disabled = false;
      btn.textContent = "💳 Pay with M-Pesa";
    }
  } catch (err) {
    status.innerHTML = '<div class="status-msg error">Network error. Please try again or contact us on WhatsApp.</div>';
    btn.disabled = false;
    btn.textContent = "💳 Pay with M-Pesa";
  }
};
