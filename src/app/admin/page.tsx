import { supabase } from '@/utils/supabase'
import AdminDashboardClient from './AdminDashboardClient'

async function getStats() {
  // Total orders
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  // Revenue (sum of paid + processing + delivered orders)
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total')
    .in('status', ['paid', 'processing', 'delivered'])

  const revenue = revenueData?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0

  // Total products
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // Low stock products (stock < 10)
  const { count: lowStock } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .lt('stock', 10)

  // Recent orders (last 10)
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  // Top products (by stock as a proxy, or we could use order_items)
  const { data: topProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    totalOrders: totalOrders ?? 0,
    revenue,
    totalProducts: totalProducts ?? 0,
    lowStock: lowStock ?? 0,
    recentOrders: recentOrders ?? [],
    topProducts: topProducts ?? [],
  }
}

export default async function AdminPage() {
  const stats = await getStats()
  return <AdminDashboardClient stats={stats} />
}
