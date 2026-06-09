'use client'

import { useState, useEffect, use } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import {
  Search,
  Package,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  AlertTriangle,
  XCircle,
} from 'lucide-react'

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const orderIdParam = searchParams.get('orderId')

  const [orderId, setOrderId] = useState(orderIdParam || '')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (orderIdParam) {
      handleSearch()
    }
  }, [orderIdParam])

  const handleSearch = async () => {
    if (!orderId.trim()) return
    setLoading(true)
    setError('')
    setSearched(true)

    const { data, error: err } = await supabase
      .from('omix_orders')
      .select('*, omix_order_items(*, omix_products(*))')
      .eq('id', orderId.trim())
      .single()

    if (err || !data) {
      setError('Order not found. Please check the order ID and try again.')
      setOrder(null)
    } else {
      setOrder(data)
    }
    setLoading(false)
  }

  const statusSteps = ['pending', 'paid', 'processing', 'delivered']
  const currentStep = order ? statusSteps.indexOf(order.status) : -1

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Track Your Order</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Enter your order ID to check the status</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-6">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch() }} className="flex gap-3">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            type="text"
            placeholder="Enter Order ID (e.g. 123)"
            className="flex-1 px-4 py-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-[#ff385c] focus:outline-none text-zinc-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading || !orderId.trim()}
            className="bg-[#ff385c] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#e03150] transition-all disabled:opacity-40 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-100 dark:border-red-900/50 flex items-center gap-3 mb-6">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {order && (
        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-4">Order Status</h3>
            <div className="flex items-center justify-between mb-4">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    i <= currentStep
                      ? 'bg-[#ff385c] text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}>
                    {i < currentStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-2 capitalize ${
                    i <= currentStep ? 'text-[#ff385c] font-bold' : 'text-zinc-400'
                  }`}>{step}</span>
                </div>
              ))}
            </div>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ff385c] rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-4">Order Details</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-zinc-400" />
                <div>
                  <p className="text-xs text-zinc-400">Customer</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{order.customer_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-zinc-400" />
                <div>
                  <p className="text-xs text-zinc-400">Phone</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{order.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-zinc-400" />
                <div>
                  <p className="text-xs text-zinc-400">Email</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{order.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-zinc-400" />
                <div>
                  <p className="text-xs text-zinc-400">Address</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{order.address}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-3">Items</h4>
              <div className="space-y-3">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                      {item.products?.image_url ? (
                        <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-zinc-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 dark:text-white text-sm truncate">{item.products?.name || 'Product'}</p>
                      <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[#ff385c]">KES {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="font-bold text-zinc-900 dark:text-white">Total</span>
                <span className="font-black text-xl text-[#ff385c]">KES {order.total_amount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {searched && !order && !loading && !error && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500">Enter an order ID to track your order</p>
        </div>
      )}
    </div>
  )
}

export default function TrackOrderClient() {
  return <TrackOrderContent />
}
