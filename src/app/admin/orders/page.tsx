'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import {
  Search,
  Filter,
  X,
  Loader2,
  ChevronDown,
  Package,
  Phone,
  Mail,
  User,
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
  customer_name: string | null
  phone: string | null
  status: string
  total: number
  items: OrderItem[]
  created_at: string
}

const statuses = ['all', 'pending', 'paid', 'processing', 'delivered', 'cancelled']

const statusColors: Record<string, string> = {
  pending: 'bg-gray-400/10 text-gray-400',
  paid: 'bg-blue-400/10 text-blue-400',
  processing: 'bg-orange-400/10 text-orange-400',
  delivered: 'bg-green-400/10 text-green-400',
  cancelled: 'bg-red-400/10 text-red-400',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data } = await supabase
      .from('omix_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setOrders(data)
    setLoading(false)
  }

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdating(true)
    const { error } = await supabase
      .from('omix_orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      alert('Error updating status: ' + error.message)
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    }
    setUpdating(false)
  }

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const filtered = orders.filter((order) => {
    const matchesSearch =
      !search ||
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      (order.customer_name ?? '').toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#ff385c]" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Orders</h1>
        <p className="text-gray-500 text-sm">{orders.length} total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, email, or name..."
            className="w-full bg-[#0a0a1a] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]/50"
          />
        </div>
        <div className="relative">
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0a0a1a] border border-white/10 rounded-lg pl-10 pr-8 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]/50 cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-[#12122a] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 text-xs uppercase">
                <th className="text-left px-5 py-3 font-medium">Order</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">
                  Customer
                </th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Total</th>
                <th className="text-right px-5 py-3 font-medium hidden sm:table-cell">
                  Date
                </th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-10">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <p className="text-white font-medium text-sm">
                        {order.order_number}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {order.items.length} item(s)
                      </p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <p className="text-white text-sm">
                        {order.customer_name || '—'}
                      </p>
                      <p className="text-gray-500 text-xs">{order.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer appearance-none ${
                          statusColors[order.status] ?? 'bg-gray-400/10 text-gray-400'
                        }`}
                      >
                        {statuses
                          .filter((s) => s !== 'all')
                          .map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right text-white font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400 hidden sm:table-cell">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#ff385c] text-xs font-medium hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-[#12122a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {selectedOrder.order_number}
                </h2>
                <p className="text-gray-500 text-xs">
                  {formatDate(selectedOrder.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Status */}
            <div className="px-6 py-3 border-b border-white/5 flex items-center gap-3">
              <span className="text-sm text-gray-400">Status:</span>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  updateStatus(selectedOrder.id, e.target.value)
                }
                disabled={updating}
                className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer appearance-none ${
                  statusColors[selectedOrder.status] ??
                  'bg-gray-400/10 text-gray-400'
                }`}
              >
                {statuses
                  .filter((s) => s !== 'all')
                  .map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
              </select>
            </div>

            {/* Customer Info */}
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <User size={14} />
                Customer
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Name</p>
                  <p className="text-white">
                    {selectedOrder.customer_name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="text-white flex items-center gap-1">
                    <Mail size={12} className="text-gray-500" />
                    {selectedOrder.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Phone</p>
                  <p className="text-white flex items-center gap-1">
                    <Phone size={12} className="text-gray-500" />
                    {selectedOrder.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="px-6 py-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <Package size={14} />
                Items ({selectedOrder.items.length})
              </h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
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
                          Qty: {item.quantity} &times; {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                    <p className="text-white text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-end pt-3 mt-3 border-t border-white/5">
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Total</p>
                  <p className="text-white font-bold text-xl">
                    {formatPrice(selectedOrder.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
