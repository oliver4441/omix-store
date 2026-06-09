'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/utils/supabase'
import { ShoppingCart, ArrowRight, Loader2, Package, CreditCard } from 'lucide-react'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price)
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
  })

  const total = getTotal()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.fullName.trim()) {
      setError('Full name is required')
      return
    }
    if (!form.phone.trim()) {
      setError('Phone number is required')
      return
    }
    if (!form.address.trim()) {
      setError('Delivery address is required')
      return
    }

    setLoading(true)

    try {
      const { data: order, error: orderError } = await supabase
        .from('omix_orders')
        .insert({
          customer_name: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          address: form.address.trim(),
          total_amount: total,
          status: 'pending',
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Insert order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase.from('omix_order_items').insert(orderItems)
      if (itemsError) throw itemsError

      // Send notification
      try {
        await fetch('https://hooks.hermes.xenon.bot/forms?form=notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'New Omix Order #' + order.id + ' - KES ' + total,
          }),
        })
      } catch {
        // Non-blocking: don't fail the order if notification fails
      }

      clearCart()
      setOrderId(order.id)
      setOrderComplete(true)
    } catch (err) {
      console.error('Order error:', err)
      setError('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1a1a2e] flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Your cart is empty</h1>
          <p className="text-gray-400 mb-8">Add some items before checking out.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#ff385c] hover:bg-[#e62e4f] text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Order Placed Successfully!</h1>
          <p className="text-gray-400 mb-2">Order ID: <span className="text-white font-mono">{orderId.slice(0, 8)}</span></p>
          <p className="text-gray-400 mb-8">Thank you for shopping with Omix. We&apos;ll contact you soon to confirm your order.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push(`/track-order?id=${orderId}`)}
              className="inline-flex items-center justify-center gap-2 bg-[#ff385c] hover:bg-[#e62e4f] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Track Order
            </button>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-[#1a1a2e] hover:bg-[#252545] text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-gray-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Details */}
          <div>
            <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-5 h-5 text-[#ff385c]" />
                <h2 className="text-xl font-bold text-white">Delivery Details</h2>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Full Name <span className="text-[#ff385c]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-[#0a0a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Phone Number <span className="text-[#ff385c]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="0712345678"
                    className="w-full px-4 py-3 bg-[#0a0a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Email <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-[#0a0a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    Delivery Address <span className="text-[#ff385c]">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Enter your full delivery address in Kericho..."
                    className="w-full px-4 py-3 bg-[#0a0a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6 bg-[#1a1a2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-[#ff385c]" />
                <h2 className="text-xl font-bold text-white">Payment Method</h2>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#0a0a1a] rounded-xl border border-gray-700">
                <div className="w-3 h-3 rounded-full bg-[#ff385c]" />
                <div>
                  <p className="text-white font-medium">Cash on Delivery</p>
                  <p className="text-gray-500 text-sm">Pay when you receive your order</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-gray-800 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-[#0f0f23] rounded-lg overflow-hidden shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-gray-700" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                      <p className="text-[#ff385c] font-semibold text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700">
                  <span className="text-white font-semibold text-lg">Total</span>
                  <span className="text-[#ff385c] font-bold text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-[#ff385c] hover:bg-[#e62e4f] disabled:bg-gray-700 text-white font-semibold py-4 rounded-xl transition-colors shadow-lg shadow-[#ff385c]/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-gray-500 text-xs text-center mt-4">
                By placing this order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
