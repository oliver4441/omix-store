export const products = [
  // ─── SOFTWARE ───
  {
    id: "azani-wifi",
    slug: "azani-wifi",
    name: "Azani WiFi Billing System",
    tagline: "Complete hotspot management & billing platform",
    description: "A powerful WiFi billing and management system designed for Kenyan ISPs and hotspot operators. Features real-time M-Pesa integration, voucher generation, bandwidth management, and comprehensive reporting.",
    category: "software",
    price: 25000,
    features: [
      "M-Pesa STK Push integration",
      "Voucher & subscription management",
      "Bandwidth throttling per user",
      "Real-time usage dashboard",
      "Multi-router support (MikroTik, Linux)",
      "Customer self-service portal",
      "Monthly & annual billing reports",
    ],
    badge: "Popular",
    demoUrl: "https://azani.omixsystems.store",
  },
  {
    id: "school-sms",
    slug: "school-sms",
    name: "School Management System",
    tagline: "Student data, attendance & results platform",
    description: "A comprehensive school management system handling student registration, attendance tracking, exam results, and staff management. Built for Kenyan secondary schools.",
    category: "software",
    price: 35000,
    features: [
      "Student registration & profiles",
      "Class & stream management",
      "Attendance tracking (daily/term)",
      "Exam results & grade analysis",
      "Staff management & payroll",
      "Parent/guardian portal",
      "Report card generation",
    ],
  },
  {
    id: "omix-cms",
    slug: "omix-cms",
    name: "Omix Content Manager",
    tagline: "Lightweight CMS for small businesses",
    description: "A simple, fast content management system built for Kenyan small businesses. Manage your website content, blog posts, and service pages without technical knowledge.",
    category: "software",
    price: 15000,
    originalPrice: 20000,
    features: [
      "Drag-and-drop page builder",
      "Blog & news management",
      "Contact form with email notifications",
      "SEO optimization tools",
      "Mobile responsive output",
      "One-click backup",
    ],
    badge: "Sale",
  },

  // ─── BOOKS ───
  {
    id: "kcse-past-papers",
    slug: "kcse-past-papers",
    name: "KCSE Past Papers Bundle (2015-2025)",
    tagline: "Complete collection with marking schemes",
    description: "Comprehensive digital archive of KCSE past papers covering all subjects from 2015 to 2025. Includes marking schemes, confidentials, and examiner reports.",
    category: "books",
    price: 1500,
    features: [
      "All subjects covered (20+ subjects)",
      "Marking schemes included",
      "Digital PDF format",
      "Instant download after payment",
      "Updated annually",
    ],
    badge: "Bestseller",
  },
  {
    id: "revision-guides",
    slug: "revision-guides",
    name: "Form 1-4 Revision Guides Bundle",
    tagline: "Comprehensive revision notes for all KCSE subjects",
    description: "Well-organized revision notes covering the entire secondary school syllabus. Perfect for students preparing for CATs, end-term exams, and KCSE.",
    category: "books",
    price: 2500,
    originalPrice: 3500,
    features: [
      "Covers Form 1 to 4 syllabus",
      "Topic-by-topic breakdown",
      "Practice questions with answers",
      "Summary charts & diagrams",
      "Digital format (PDF)",
    ],
    badge: "Sale",
  },
  {
    id: "ict-notes",
    slug: "ict-notes",
    name: "ICT/Computer Studies Notes Kit",
    tagline: "Complete computer studies revision & practical guide",
    description: "Detailed ICT notes covering theory, practical programming, and emerging trends. Includes sample programs and database design exercises.",
    category: "books",
    price: 1800,
    features: [
      "Theory notes by topic",
      "Programming examples (Python, HTML)",
      "Database design exercises",
      "Networking & internet concepts",
      "Practical exam preparation",
    ],
  },

  // ─── SERVICES ───
  {
    id: "web-dev",
    slug: "web-dev",
    name: "Custom Website Development",
    tagline: "Professional websites built for your business",
    description: "Get a fully customized website for your school, business, or organization. Built with modern technology, optimized for speed, SEO, and mobile.",
    category: "services",
    price: 15000,
    features: [
      "Custom design & development",
      "Mobile responsive",
      "SEO optimized",
      "Contact forms & inquiries",
      "Social media integration",
      "Hosting setup assistance",
      "1 month support included",
    ],
    badge: "Popular",
  },
  {
    id: "branding",
    slug: "branding",
    name: "Business Branding Package",
    tagline: "Logo, colors & identity for your brand",
    description: "Complete branding package including logo design, color palette, typography selection, and brand guidelines.",
    category: "services",
    price: 8000,
    features: [
      "Logo design (3 concepts)",
      "Color palette selection",
      "Typography guidelines",
      "Brand style guide PDF",
      "Social media kit",
      "Business card design",
      "Unlimited revisions",
    ],
  },

  // ─── PROJECTS ───
  {
    id: "pos-system",
    slug: "pos-system",
    name: "Retail POS System",
    tagline: "Complete point-of-sale for small shops",
    description: "Full-featured point-of-sale system built for Kenyan retail shops. Includes inventory management, sales tracking, and M-Pesa payment integration.",
    category: "projects",
    price: 45000,
    features: [
      "Product & inventory management",
      "Barcode scanning support",
      "M-Pesa till number integration",
      "Daily & monthly sales reports",
      "Supplier management",
      "Multi-user access control",
      "Receipt printing (thermal/Epson)",
    ],
    badge: "New",
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    name: "Custom E-Commerce Platform",
    tagline: "Online store tailored to your products",
    description: "A complete online store solution with product catalog, shopping cart, M-Pesa checkout, and order management.",
    category: "projects",
    price: 35000,
    features: [
      "Product catalog with categories",
      "Shopping cart & checkout",
      "M-Pesa STK Push payment",
      "Order management dashboard",
      "Customer accounts",
      "Mobile optimized",
      "Inventory tracking",
    ],
  },
];

export const categories = [
  { id: "software", name: "Software", icon: "💻", desc: "Custom software & billing systems built for Kenya." },
  { id: "books", name: "Books & Archives", icon: "📚", desc: "KCSE resources, revision notes & educational materials." },
  { id: "services", name: "Services", icon: "🛠️", desc: "Web development, branding & tech consulting." },
  { id: "projects", name: "Projects", icon: "📦", desc: "Complete project solutions ready for deployment." },
];

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem("omix-cart") || "[]");
  } catch { return []; }
}

export function saveCart(cart) {
  localStorage.setItem("omix-cart", JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId) {
  let cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter((i) => i.id !== productId);
  }
  saveCart(cart);
  return cart;
}

export function clearCart() {
  localStorage.removeItem("omix-cart");
}
