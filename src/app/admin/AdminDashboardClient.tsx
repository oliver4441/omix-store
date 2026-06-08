'use client'

import Link from 'next/link'
import {
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

interface Order {
  id: string
  order_number: string
  email: string
  status: string
  total: number
  created_at: string
  customer_name: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image_url: string | null
  category_id: string | null
  featured: boolean
  created_at: string
}

interface Stats {
  totalOrders: number
  revenue: number
  totalProducts: number
  lowStock: number
  recentOrders: Order[]
  topProducts: Product[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-400/10 text-gray-400',
  paid: 'bg-blue-400/10 text-blue-400',
  processing: 'bg-orange-400/10 text-orange-400',
  delivered: 'bg-green-400/10 text-green-400',
  cancelled: 'bg-red-400/10 text-red-400',
}

export default function AdminDashboardClient({ stats }: { stats: Stats }) {
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const statCards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'text-[#ff385c]',
      bg: 'bg-[#ff385c]/10',
    },
    {
      label: 'Revenue',
      value: formatPrice(stats.revenue),
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      label: 'Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Low Stock',
      value: stats.lowStock.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-[#12122a] border border-white/10 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{card.label}</span>
              <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon size={18} className={card.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-[#12122a] border border-white/10 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-[#ff385c] text-sm hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {order.order_number}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {order.customer_name || order.email} &middot;{' '}
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">
                      {formatPrice(order.total)}
                    </p>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        statusColors[order.status] ?? 'bg-gray-400/10 text-gray-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#12122a] border border-white/10 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Latest Products</h2>
            <Link
              href="/admin/products"
              className="text-[#ff385c] text-sm hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {stats.topProducts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No products yet</p>
            ) : (
              stats.topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Package size={16} className="text-gray-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-white text-sm font-medium">
                        {product.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Stock: {product.stock}
                        {product.featured && (
                          <span className="ml-2 text-[#ff385c]">Featured</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-white text-sm font-medium">
                    {formatPrice(product.price)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
