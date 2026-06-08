'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price)
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCart()

  const total = getTotal()
  const itemCount = getItemCount()

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1a1a2e] flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Your cart is empty</h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any items to your cart yet. Start shopping to find something you love!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#ff385c] hover:bg-[#e62e4f] text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-[#ff385c]/25"
          >
            <ShoppingCart className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Shopping Cart</h1>
      <p className="text-gray-400 mb-8">
        {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-[#1a1a2e] rounded-2xl p-4 border border-gray-800"
            >
              {/* Image */}
              <Link href={`/product/${item.id}`} className="shrink-0">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#0f0f23] rounded-xl overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-gray-700" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link
                    href={`/product/${item.id}`}
                    className="text-white font-medium hover:text-[#ff385c] transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 p-2 text-gray-500 hover:text-red-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[#ff385c] font-bold mt-1">{formatPrice(item.price)}</p>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-[#0a0a1a] rounded-lg border border-gray-700">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-white text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="text-white font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-gray-800 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({itemCount} items)</span>
                <span className="text-white">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span className="text-emerald-400 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-white font-semibold text-lg">Total</span>
                  <span className="text-[#ff385c] font-bold text-xl">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-[#ff385c] hover:bg-[#e62e4f] text-white font-semibold py-4 rounded-xl transition-colors shadow-lg shadow-[#ff385c]/25"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/shop"
              className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white font-medium py-3 mt-3 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
