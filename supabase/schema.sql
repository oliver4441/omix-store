-- ═══════════════════════════════════════════════════════════
--  Omix Store — Supabase Database Schema
--  Project ref: xmdyovfcjogkarwxiyhb
-- ═══════════════════════════════════════════════════════════

-- ── Enable required extensions ──────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Custom types ────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ═══════════════════════════════════════════════════════════
--  CATEGORIES
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.categories (
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
CREATE TABLE IF NOT EXISTS public.products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id   UUID REFERENCES public.categories(id) ON DELETE SET NULL,
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
CREATE TABLE IF NOT EXISTS public.orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status          order_status NOT NULL DEFAULT 'pending',
  subtotal        NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost   NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  tax             NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total           NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  currency        TEXT NOT NULL DEFAULT 'USD',
  -- Shipping address
  shipping_name       TEXT,
  shipping_email      TEXT,
  shipping_phone      TEXT,
  shipping_address    TEXT,
  shipping_city       TEXT,
  shipping_state      TEXT,
  shipping_zip        TEXT,
  shipping_country    TEXT DEFAULT 'US',
  -- Payment
  payment_method      TEXT,
  payment_status      TEXT DEFAULT 'pending',
  payment_id          TEXT,
  -- Notes
  customer_note       TEXT,
  internal_note       TEXT,
  -- Timestamps
  confirmed_at    TIMESTAMPTZ,
  shipped_at      TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  cancelled_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
--  ORDER ITEMS
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name  TEXT NOT NULL,
  product_sku   TEXT,
  image_url   TEXT,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  subtotal    NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
--  INDEXES
-- ═══════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

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

-- Attach trigger to all tables with updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.categories;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.products;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.orders;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ═══════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ── Categories policies ─────────────────────────────────
-- Anyone can read active categories
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (is_active = TRUE);

-- Only admins can manage categories
CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (auth.role() = 'service_role');

-- ── Products policies ───────────────────────────────────
-- Anyone can read active products
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

-- Only admins can manage products
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (auth.role() = 'service_role');

-- ── Orders policies ─────────────────────────────────────
-- Users can read their own orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending orders
CREATE POLICY "Users can update their own pending orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Admins can manage all orders
CREATE POLICY "Admins can manage all orders"
  ON public.orders FOR ALL
  USING (auth.role() = 'service_role');

-- ── Order items policies ────────────────────────────────
-- Users can read items for their own orders
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.orders WHERE auth.uid() = user_id
    )
  );

-- Users can create order items for their own orders
CREATE POLICY "Users can create their own order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM public.orders WHERE auth.uid() = user_id
    )
  );

-- Admins can manage all order items
CREATE POLICY "Admins can manage all order items"
  ON public.order_items FOR ALL
  USING (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════
--  SEED DATA
-- ═══════════════════════════════════════════════════════════
INSERT INTO public.categories (name, slug, description, icon, sort_order) VALUES
  ('Electronics',     'electronics',     'Latest gadgets, devices & tech accessories',  'smartphone', 1),
  ('Fashion',         'fashion',         'Trending styles, apparel & accessories',      'shirt',      2),
  ('Beauty',          'beauty',          'Skincare, cosmetics & personal care',          'sparkles',   3),
  ('Home',            'home',            'Furniture, décor & home essentials',           'home',       4),
  ('School Supplies', 'school-supplies', 'Books, stationery & study tools',              'graduation-cap', 5)
ON CONFLICT (slug) DO NOTHING;
