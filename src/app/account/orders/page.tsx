'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/utils/supabase'
import {
  Package,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react'

interface OrderItem {
  id: string
  product_name: string
  product_image: string | null
  quantity: number
  price: number
}

interface Order {
  id: string
  order_number: string
  email: string
  status: string
  total: number
  items: OrderItem[]
  created_at: string
  customer_name: string | null
  phone: string | null
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  pending: { color: 'text-gray-400', bg: 'bg-gray-400/10' },
  paid: { color: 'text-blue-400', bg: 'bg-blue-400/10' },
  processing: { color: 'text-orange-400', bg: 'bg-orange-400/10' },
  delivered: { color: 'text-green-400', bg: 'bg-green-400/10' },
  cancelled: { color: 'text-red-400', bg: 'bg-red-400/10' },
}

export default function OrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.replace('/login')
        return
      }

      setUser(authUser)

      const { data, error: fetchError } = await supabase
        .from('omix_orders')
        .select('*')
        .eq('email', authUser.email!)
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setOrders(data ?? [])
      }

      setLoading(false)
    }

    fetchOrders()
  }, [router])

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#ff385c]" size={32} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Package className="text-[#ff385c]" size={28} />
          My Orders
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          View and track your order history
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-[#12122a] border border-white/10 rounded-2xl">
          <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-lg font-medium text-white mb-2">No orders yet</h2>
          <p className="text-gray-500 text-sm mb-6">
            Start shopping to see your orders here.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#ff385c] hover:bg-[#e62e4f] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] ?? statusConfig.pending
            const isExpanded = expandedOrder === order.id

            return (
              <div
                key={order.id}
                className="bg-[#12122a] border border-white/10 rounded-xl overflow-hidden"
              >
                {/* Order Header */}
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div>
                      <p className="text-white font-medium text-sm">
                        {order.order_number}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color} ${status.bg}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-semibold text-sm">
                      {formatPrice(order.total)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-500" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-white/5 p-4 space-y-4">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Customer</p>
                        <p className="text-gray-300">
                          {order.customer_name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Phone</p>
                        <p className="text-gray-300">{order.phone || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-gray-500 text-xs mb-2">Items</p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between bg-[#0a0a1a] rounded-lg px-3 py-2"
                          >
                            <div className="flex items-center gap-3">
                              {item.product_image && (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <p className="text-white text-sm">
                                  {item.product_name}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-end pt-2 border-t border-white/5">
                      <div className="text-right">
                        <p className="text-gray-500 text-xs">Total</p>
                        <p className="text-white font-bold text-lg">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
