import Link from 'next/link'
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#060612] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand / About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#ff385c] rounded-lg flex items-center justify-center font-bold text-white text-sm">
                O
              </div>
              <span className="text-xl font-bold text-white">Omix</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your one-stop online shop in Kericho. Discover electronics, fashion,
              beauty products, home essentials, and school supplies at unbeatable
              prices. Free delivery in Kericho County.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin size={14} />
              <span>Kericho, Kenya</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-[#ff385c] text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-400 hover:text-[#ff385c] text-sm transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-gray-400 hover:text-[#ff385c] text-sm transition-colors"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-[#ff385c] text-sm transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="text-gray-400 hover:text-[#ff385c] text-sm transition-colors"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:omixsystems@gmail.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#ff385c] text-sm transition-colors"
                >
                  <Mail size={16} />
                  omixsystems@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+254768213649"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#ff385c] text-sm transition-colors"
                >
                  <Phone size={16} />
                  +254 768 213 649
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/254768213649"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#ff385c] text-sm transition-colors"
                >
                  <MessageCircle size={16} />
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Omix Store. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Proudly serving Kericho County, Kenya
          </p>
        </div>
      </div>
    </footer>
  )
}
