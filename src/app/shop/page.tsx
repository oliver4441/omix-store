import { supabase } from '@/utils/supabase'
import ShopClient from './ShopClient'

export const revalidate = 60

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  // Fetch categories
  const { data: categories } = await supabase
    .from('omix_categories')
    .select('*')
    .order('name')

  // Build products query
  let query = supabase.from('omix_products').select('*').order('created_at', { ascending: false })

  if (searchParams.category) {
    const { data: category } = await supabase
      .from('omix_categories')
      .select('id')
      .eq('slug', searchParams.category)
      .single()
    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`)
  }

  const { data: products } = await query

  return (
    <ShopClient
      products={products || []}
      categories={categories || []}
      activeCategory={searchParams.category || ''}
      searchQuery={searchParams.search || ''}
    />
  )
}
