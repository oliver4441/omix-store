'use client'

import { useState } from 'react'
import {
  ShoppingBag,
  Zap,
  Shield,
  Truck,
  Star,
  ArrowRight,
  Smartphone,
  Shirt,
  Sparkles,
  Home as HomeIcon,
  GraduationCap,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";

/* ── Placeholder data ──────────────────────────────────── */

const categories = [
  {
    name: "Electronics",
    icon: Smartphone,
    description: "Latest gadgets & devices",
    count: 128,
    gradient: "from-blue-500/20 to-purple-500/20",
    border: "border-blue-500/30",
  },
  {
    name: "Fashion",
    icon: Shirt,
    description: "Trending styles & apparel",
    count: 256,
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
  },
  {
    name: "Beauty",
    icon: Sparkles,
    description: "Skincare & cosmetics",
    count: 94,
    gradient: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/30",
  },
  {
    name: "Home",
    icon: HomeIcon,
    description: "Furniture & décor",
    count: 187,
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
  },
  {
    name: "School Supplies",
    icon: GraduationCap,
    description: "Books, stationery & more",
    count: 203,
    gradient: "from-cyan-500/20 to-teal-500/20",
    border: "border-cyan-500/30",
  },
];

const bestSellers = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviews: 342,
    image: "/products/headphones.jpg",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Premium Cotton Oversized Tee",
    price: 29.99,
    originalPrice: 44.99,
    rating: 4.6,
    reviews: 218,
    image: "/products/tshirt.jpg",
    badge: "Top Rated",
  },
  {
    id: 3,
    name: "Vitamin C Brightening Serum",
    price: 24.99,
    originalPrice: 39.99,
    rating: 4.9,
    reviews: 567,
    image: "/products/serum.jpg",
    badge: "Fan Favorite",
  },
  {
    id: 4,
    name: "Smart LED Desk Lamp",
    price: 45.99,
    originalPrice: 69.99,
    rating: 4.7,
    reviews: 189,
    image: "/products/lamp.jpg",
    badge: "Best Seller",
  },
];

const flashDeals = [
  {
    id: 1,
    name: "Bluetooth Portable Speaker",
    price: 34.99,
    originalPrice: 59.99,
    discount: 42,
    endsIn: "02:14:33",
    image: "/products/speaker.jpg",
  },
  {
    id: 2,
    name: "Minimalist Leather Wallet",
    price: 19.99,
    originalPrice: 39.99,
    discount: 50,
    endsIn: "05:47:12",
    image: "/products/wallet.jpg",
  },
  {
    id: 3,
    name: "Aromatherapy Diffuser Set",
    price: 27.99,
    originalPrice: 49.99,
    discount: 44,
    endsIn: "01:33:58",
    image: "/products/diffuser.jpg",
  },
  {
    id: 4,
    name: "Ergonomic Laptop Stand",
    price: 32.99,
    originalPrice: 54.99,
    discount: 40,
    endsIn: "08:22:45",
    image: "/products/stand.jpg",
  },
];

const whyChoose = [
  {
    icon: Truck,
    title: "Free Fast Shipping",
    description:
      "Free delivery on orders over $50. Get your items within 2-5 business days with real-time tracking.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Your transactions are protected with bank-level encryption and fraud prevention technology.",
  },
  {
    icon: Zap,
    title: "Flash Deals Daily",
    description:
      "New deals every day with discounts up to 70% off. Never miss a bargain with our alerts.",
  },
  {
    icon: Star,
    title: "Quality Guaranteed",
    description:
      "Every product is vetted for quality. Not satisfied? 30-day hassle-free returns, no questions asked.",
  },
];

/* ── Components ────────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-600 text-gray-600"
          }
        />
      ))}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#ff385c]/10 blur-[120px]" />
          <div className="absolute -bottom-40 right-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ff385c]/30 bg-[#ff385c]/10 px-4 py-1.5 text-sm font-medium text-[#ff385c]">
              <Zap size={14} />
              New arrivals just dropped
            </div>

            {/* Heading */}
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Shop Smarter.{" "}
              <span className="text-gradient">Live Better.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
              Discover curated products across electronics, fashion, beauty,
              home & school supplies — all at unbeatable prices with fast
              delivery.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#categories"
                className="inline-flex items-center gap-2 rounded-xl bg-[#ff385c] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#ff385c]/25 transition-all hover:bg-[#e6324f] hover:shadow-xl hover:shadow-[#ff385c]/30 pulse-glow"
              >
                <ShoppingBag size={18} />
                Shop Now
              </Link>
              <Link
                href="#flash-deals"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:border-white/20 hover:bg-white/10"
              >
                <Zap size={18} />
                Flash Deals
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                { value: "10K+", label: "Products" },
                { value: "50K+", label: "Happy Customers" },
                { value: "99%", label: "Satisfaction" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section id="omix_categories" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Shop by <span className="text-gradient">Category</span>
            </h2>
            <p className="mt-3 text-gray-400">
              Browse our curated collections and find exactly what you need.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`group relative overflow-hidden rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.gradient} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20`}
                >
                  <div className="mb-4 inline-flex rounded-xl bg-white/10 p-3">
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">{cat.description}</p>
                  <span className="mt-3 inline-block text-xs font-medium text-gray-500">
                    {cat.count} products
                  </span>
                  <ArrowRight
                    size={18}
                    className="absolute bottom-6 right-6 text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-[#ff385c]"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ BEST SELLERS ═══════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Best <span className="text-gradient">Sellers</span>
              </h2>
              <p className="mt-3 text-gray-400">
                Our most loved products by customers like you.
              </p>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-medium text-[#ff385c] transition-colors hover:text-[#ff6b8a] sm:flex"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
              >
                {/* Image placeholder */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02]">
                  <div className="flex h-full items-center justify-center text-gray-700">
                    <ShoppingBag size={48} strokeWidth={1} />
                  </div>
                  {/* Badge */}
                  <span className="absolute left-3 top-3 rounded-full bg-[#ff385c] px-3 py-1 text-xs font-semibold text-white">
                    {product.badge}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm font-medium text-white">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-gray-500">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                  <button className="mt-4 w-full rounded-xl bg-white/10 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#ff385c] hover:shadow-lg hover:shadow-[#ff385c]/20">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FLASH DEALS ═══════════════ */}
      <section id="flash-deals" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff385c]/10">
                <Zap className="text-[#ff385c]" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Flash <span className="text-gradient">Deals</span>
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Limited time offers — grab them before they&apos;re gone!
                </p>
              </div>
            </div>
            <Link
              href="/flash-deals"
              className="hidden items-center gap-1 text-sm font-medium text-[#ff385c] transition-colors hover:text-[#ff6b8a] sm:flex"
            >
              See All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {flashDeals.map((deal) => (
              <div
                key={deal.id}
                className="group overflow-hidden rounded-2xl border border-[#ff385c]/20 bg-gradient-to-b from-[#ff385c]/5 to-transparent transition-all duration-300 hover:border-[#ff385c]/40"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02]">
                  <div className="flex h-full items-center justify-center text-gray-700">
                    <ShoppingBag size={48} strokeWidth={1} />
                  </div>
                  {/* Discount badge */}
                  <span className="absolute left-3 top-3 rounded-full bg-[#ff385c] px-3 py-1 text-xs font-bold text-white">
                    -{deal.discount}%
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm font-medium text-white">
                    {deal.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-[#ff385c]">
                      ${deal.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${deal.originalPrice}
                    </span>
                  </div>
                  {/* Timer */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>Ends in {deal.endsIn}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ff385c] to-[#ff6b8a]"
                      style={{ width: `${Math.floor(Math.random() * 40 + 30)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {Math.floor(Math.random() * 60 + 20)} sold
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY CHOOSE OMIX ═══════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Why Choose <span className="text-gradient">Omix</span>?
            </h2>
            <p className="mt-3 text-gray-400">
              We go above and beyond to make your shopping experience
              exceptional.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center transition-all duration-300 hover:border-[#ff385c]/30 hover:bg-[#ff385c]/5"
                >
                  <div className="mx-auto mb-4 inline-flex rounded-xl bg-[#ff385c]/10 p-4 transition-colors group-hover:bg-[#ff385c]/20">
                    <Icon size={28} className="text-[#ff385c]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ NEWSLETTER / CTA ═══════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-[#ff385c]/20 bg-gradient-to-br from-[#ff385c]/10 via-transparent to-purple-600/10 px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[#ff385c]/10 blur-[80px]" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-purple-600/10 blur-[80px]" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Get <span className="text-gradient">10% Off</span> Your First
                Order
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-gray-400">
                Subscribe to our newsletter for exclusive deals, new arrivals, and
                a special welcome discount.
              </p>
              <form
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#ff385c]/50 focus:ring-1 focus:ring-[#ff385c]/30"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#ff385c] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ff385c]/25 transition-all hover:bg-[#e6324f]"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═══════════════ */}
      <section id="contact" className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Left */}
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Get in <span className="text-gradient">Touch</span>
              </h2>
              <p className="mt-3 text-gray-400">
                Have a question or need help? We&apos;d love to hear from you.
                Reach out and we&apos;ll respond as soon as possible.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                    <Mail size={18} className="text-[#ff385c]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-white">support@omixstore.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                    <Phone size={18} className="text-[#ff385c]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-white">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                    <MapPin size={18} className="text-[#ff385c]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-white">
                      123 Commerce St, Suite 100, New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <form
              className="space-y-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#ff385c]/50 focus:ring-1 focus:ring-[#ff385c]/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#ff385c]/50 focus:ring-1 focus:ring-[#ff385c]/30"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#ff385c]/50 focus:ring-1 focus:ring-[#ff385c]/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#ff385c]/50 focus:ring-1 focus:ring-[#ff385c]/30"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#ff385c] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#ff385c]/25 transition-all hover:bg-[#e6324f]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff385c]">
                <ShoppingBag size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">Omix Store</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Omix Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
