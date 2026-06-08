'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Plus, Minus, ShoppingCart } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image: string | null
  slug: string
  description: string | null
  stock: number | null
  category_id: string | null
}

export default function AddToCartSection({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const inStock = product.stock === null || product.stock > 0
  const maxQty = product.stock ?? 99

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div>
      {/* Quantity Selector */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-gray-300 font-medium">Quantity</span>
        <div className="flex items-center bg-[#1a1a2e] rounded-xl border border-gray-700">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="p-3 text-gray-400 hover:text-white disabled:text-gray-600 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center text-white font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
            disabled={quantity >= maxQty}
            className="p-3 text-gray-400 hover:text-white disabled:text-gray-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAdd}
        disabled={!inStock}
        className={`w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-xl transition-all text-base ${
          added
            ? 'bg-emerald-500 text-white'
            : inStock
            ? 'bg-[#ff385c] hover:bg-[#e62e4f] text-white shadow-lg shadow-[#ff385c]/25 hover:shadow-[#ff385c]/40'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        {added ? 'Added to Cart!' : inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  )
}
