'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface Product {
  id: string
  name: string
  price: number
  image: string | null
  slug: string
  stock: number | null
}

interface Category {
  id: string
  name: string
  slug: string
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price)
}

export default function ShopClient({
  products,
  categories,
  activeCategory,
  searchQuery,
}: {
  products: Product[]
  categories: Category[]
  activeCategory: string
  searchQuery: string
}) {
  const { addItem } = useCart()
  const [search, setSearch] = useState(searchQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (activeCategory) params.set('category', activeCategory)
    window.location.href = `/shop${params.toString() ? '?' + params.toString() : ''}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Shop</h1>
        <p className="text-gray-400">Discover amazing products at unbeatable prices</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c] transition-colors"
          />
        </div>
      </form>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/shop"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !activeCategory
              ? 'bg-[#ff385c] text-white shadow-lg shadow-[#ff385c]/25'
              : 'bg-[#1a1a2e] text-gray-300 hover:bg-[#252545] hover:text-white'
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.slug
                ? 'bg-[#ff385c] text-white shadow-lg shadow-[#ff385c]/25'
                : 'bg-[#1a1a2e] text-gray-300 hover:bg-[#252545] hover:text-white'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1a1a2e] flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-[#1a1a2e] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#ff385c]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#ff385c]/10"
            >
              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-square bg-[#0f0f23] overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="w-12 h-12 text-gray-700" />
                    </div>
                  )}
                  {product.stock !== null && product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="text-white font-medium text-sm sm:text-base mb-1 line-clamp-2 hover:text-[#ff385c] transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-[#ff385c] font-bold text-lg mb-3">{formatPrice(product.price)}</p>
                <button
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image || '',
                    })
                  }
                  disabled={product.stock !== null && product.stock <= 0}
                  className="w-full flex items-center justify-center gap-2 bg-[#ff385c] hover:bg-[#e62e4f] disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
