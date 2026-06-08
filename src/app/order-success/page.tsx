import Link from 'next/link'
import { CheckCircle, Package, Phone, Truck, ShoppingBag } from 'lucide-react'

export default function OrderSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        {/* Check Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <CheckCircle className="w-14 h-14 text-emerald-400" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Your order has been placed successfully. We&apos;re excited to get your products to you!
        </p>
      </div>

      {/* What's Next */}
      <div className="bg-[#1a1a2e] rounded-2xl p-6 sm:p-8 border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">What&apos;s Next?</h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ff385c]/20 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-[#ff385c]" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Order Confirmation</h3>
              <p className="text-gray-400 text-sm">
                Our team will call you within 24 hours to confirm your order and delivery details.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ff385c]/20 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-[#ff385c]" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Order Processing</h3>
              <p className="text-gray-400 text-sm">
                We&apos;ll carefully prepare and package your items for delivery.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ff385c]/20 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#ff385c]" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Delivery</h3>
              <p className="text-gray-400 text-sm">
                Your order will be delivered to your address within 1-2 business days. Free delivery within Kericho County!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/track-order"
          className="inline-flex items-center justify-center gap-2 bg-[#ff385c] hover:bg-[#e62e4f] text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-[#ff385c]/25"
        >
          <Package className="w-5 h-5" />
          Track Your Order
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 bg-[#1a1a2e] hover:bg-[#252545] text-white font-semibold px-8 py-4 rounded-xl transition-colors border border-gray-700"
        >
          <ShoppingBag className="w-5 h-5" />
          Continue Shopping
        </Link>
      </div>

      {/* Contact */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          Have questions? Contact us at{' '}
          <a href="tel:+254700000000" className="text-[#ff385c] hover:underline">
            0700 000 000
          </a>
        </p>
      </div>
    </div>
  )
}
