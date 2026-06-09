-- ═══════════════════════════════════════════════════════════
--  Omix Store — Supabase Database Schema (v2, conflict-free)
--  Uses omix_ prefix to avoid conflicts with stor1 tables
-- ═══════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════
--  CATEGORIES
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.omix_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  icon        TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
--  PRODUCTS
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.omix_products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id   UUID REFERENCES public.omix_categories(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  price         NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_price NUMERIC(10, 2) CHECK (compare_price IS NULL OR compare_price >= 0),
  sku           TEXT UNIQUE,
  stock         INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url     TEXT,
  images        JSONB DEFAULT '[]'::jsonb,
  tags          TEXT[] DEFAULT '{}',
  rating        NUMERIC(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count  INTEGER DEFAULT 0 CHECK (review_count >= 0),
  is_featured   BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  metadata      JSONB DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
--  ORDERS
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.omix_orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number    TEXT UNIQUE,
  status          TEXT NOT NULL DEFAULT 'pending',
  total_amount    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total           NUMERIC(10, 2) GENERATED ALWAYS AS (total_amount) STORED,
  customer_name   TEXT,
  email           TEXT,
  phone           TEXT,
  address         TEXT,
  city            TEXT DEFAULT 'Kericho',
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
--  ORDER ITEMS
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.omix_order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES public.omix_orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES public.omix_products(id) ON DELETE SET NULL,
  product_name  TEXT NOT NULL,
  product_sku   TEXT,
  product_image TEXT,
  price         NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  subtotal      NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
--  INDEXES
-- ═══════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_omix_products_category_id ON public.omix_products(category_id);
CREATE INDEX IF NOT EXISTS idx_omix_products_slug ON public.omix_products(slug);
CREATE INDEX IF NOT EXISTS idx_omix_products_is_featured ON public.omix_products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_omix_products_is_active ON public.omix_products(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_omix_products_price ON public.omix_products(price);

CREATE INDEX IF NOT EXISTS idx_omix_orders_user_id ON public.omix_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_omix_orders_status ON public.omix_orders(status);
CREATE INDEX IF NOT EXISTS idx_omix_orders_created_at ON public.omix_orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_omix_order_items_order_id ON public.omix_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_omix_order_items_product_id ON public.omix_order_items(product_id);

-- ═══════════════════════════════════════════════════════════
--  updated_at TRIGGER FUNCTION
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_omix_updated_at ON public.omix_categories;
CREATE TRIGGER set_omix_updated_at
  BEFORE UPDATE ON public.omix_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_omix_updated_at ON public.omix_products;
CREATE TRIGGER set_omix_updated_at
  BEFORE UPDATE ON public.omix_products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_omix_updated_at ON public.omix_orders;
CREATE TRIGGER set_omix_updated_at
  BEFORE UPDATE ON public.omix_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ═══════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.omix_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omix_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omix_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omix_order_items ENABLE ROW LEVEL SECURITY;

-- ── Categories policies ──
CREATE POLICY "Omix categories viewable by everyone"
  ON public.omix_categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can insert omix_categories"
  ON public.omix_categories FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admins can update omix_categories"
  ON public.omix_categories FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Admins can delete omix_categories"
  ON public.omix_categories FOR DELETE USING (auth.role() = 'service_role');

-- ── Products policies ──
CREATE POLICY "Omix products viewable by everyone"
  ON public.omix_products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can insert omix_products"
  ON public.omix_products FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admins can update omix_products"
  ON public.omix_products FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Admins can delete omix_products"
  ON public.omix_products FOR DELETE USING (auth.role() = 'service_role');

-- ── Orders policies ──
CREATE POLICY "Users can view their own omix_orders"
  ON public.omix_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own omix_orders"
  ON public.omix_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pending omix_orders"
  ON public.omix_orders FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Admins can manage all omix_orders"
  ON public.omix_orders FOR ALL USING (auth.role() = 'service_role');

-- ── Order items policies ──
CREATE POLICY "Users can view their own omix_order_items"
  ON public.omix_order_items FOR SELECT USING (
    order_id IN (SELECT id FROM public.omix_orders WHERE auth.uid() = user_id)
  );
CREATE POLICY "Users can create their own omix_order_items"
  ON public.omix_order_items FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM public.omix_orders WHERE auth.uid() = user_id)
  );
CREATE POLICY "Admins can manage all omix_order_items"
  ON public.omix_order_items FOR ALL USING (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════
--  SEED DATA
-- ═══════════════════════════════════════════════════════════
INSERT INTO public.omix_categories (name, slug, description, icon, sort_order) VALUES
  ('Electronics',     'electronics',     'Latest gadgets, devices & tech accessories',      'smartphone',     1),
  ('Fashion',         'fashion',         'Trending styles, apparel & accessories',          'shirt',          2),
  ('Beauty',          'beauty',          'Skincare, cosmetics & personal care',              'sparkles',       3),
  ('Home',            'home',            'Furniture, décor & home essentials',               'home',           4),
  ('School Supplies', 'school-supplies', 'Books, stationery & study tools',                  'graduation-cap', 5)
ON CONFLICT (slug) DO NOTHING;
