import { supabase } from '@/utils/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Plus, ArrowLeft } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export const revalidate = 60

interface Product {
  id: string
  name: string
  price: number
  image: string | null
  slug: string
  stock: number | null
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price)
}

function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
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
  )
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const { data: category } = await supabase
    .from('omix_categories')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!category) notFound()

  const { data: products } = await supabase
    .from('omix_products')
    .select('*')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ff385c] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </Link>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{category.name}</h1>
        <p className="text-gray-400">
          {products?.length || 0} product{products?.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Category Description */}
      {category.description && (
        <div className="mb-8 p-4 bg-[#1a1a2e] rounded-xl border border-gray-800">
          <p className="text-gray-300">{category.description}</p>
        </div>
      )}

      {/* Products Grid */}
      {products && products.length > 0 ? (
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
                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1a1a2e] flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No products yet</h3>
          <p className="text-gray-500 mb-6">This category doesn&apos;t have any products yet.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#ff385c] hover:bg-[#e62e4f] text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  )
}
