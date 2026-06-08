import { supabase } from '@/utils/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ShoppingCart, Package, CheckCircle, XCircle } from 'lucide-react'
import AddToCartSection from './AddToCartSection'

export const revalidate = 60

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

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!product) notFound()

  // Fetch related products from same category
  let relatedProducts: Product[] = []
  if (product.category_id) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', product.category_id)
      .neq('id', product.id)
      .limit(4)
    relatedProducts = data || []
  }

  const inStock = product.stock === null || product.stock > 0

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

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image */}
        <div className="relative aspect-square bg-[#1a1a2e] rounded-2xl overflow-hidden border border-gray-800">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="w-20 h-20 text-gray-700" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            {inStock ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                In Stock
                {product.stock !== null && ` (${product.stock} available)`}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-red-400 text-sm font-medium">
                <XCircle className="w-4 h-4" />
                Out of Stock
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            {product.name}
          </h1>

          <p className="text-[#ff385c] text-3xl sm:text-4xl font-bold mb-6">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Add to Cart Section (Client Component) */}
          <AddToCartSection product={product} />

          {/* Delivery Info */}
          <div className="mt-8 p-4 bg-[#1a1a2e] rounded-xl border border-gray-800">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-[#ff385c] mt-0.5 shrink-0" />
              <div>
                <h3 className="text-white font-medium mb-1">Delivery Information</h3>
                <p className="text-gray-400 text-sm">
                  Free delivery within Kericho County. Delivery within 1-2 business days.
                  Cash on delivery available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rp) => (
              <div
                key={rp.id}
                className="group bg-[#1a1a2e] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#ff385c]/50 transition-all duration-300"
              >
                <Link href={`/product/${rp.slug}`}>
                  <div className="relative aspect-square bg-[#0f0f23] overflow-hidden">
                    {rp.image ? (
                      <Image
                        src={rp.image}
                        alt={rp.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-10 h-10 text-gray-700" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/product/${rp.slug}`}>
                    <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 hover:text-[#ff385c] transition-colors">
                      {rp.name}
                    </h3>
                  </Link>
                  <p className="text-[#ff385c] font-bold">{formatPrice(rp.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
