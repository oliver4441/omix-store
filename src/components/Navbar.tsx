'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/utils/supabase'
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  Shield,
  ChevronDown,
} from 'lucide-react'

interface Profile {
  id: string
  email: string
  role: string
  full_name: string | null
}

export default function Navbar() {
  const router = useRouter()
  const { getItemCount } = useCart()
  const totalItems = getItemCount()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      setUser(authUser ?? null)

      if (authUser?.email) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', authUser.email)
          .single()
        setProfile(data)
      }
      setLoading(false)
    }

    fetchUser()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setUserMenuOpen(false)
    setMobileOpen(false)
    router.push('/')
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a1a]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#ff385c] rounded-lg flex items-center justify-center font-bold text-white text-sm">
              O
            </div>
            <span className="text-xl font-bold text-white group-hover:text-[#ff385c] transition-colors">
              Omix
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-[#ff385c] transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-300 hover:text-[#ff385c] transition-colors text-sm font-medium"
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="relative text-gray-300 hover:text-[#ff385c] transition-colors"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff385c] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#ff385c]/20 flex items-center justify-center">
                    <User size={16} className="text-[#ff385c]" />
                  </div>
                  <span className="text-sm max-w-[120px] truncate">
                    {profile?.full_name || user.email}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#12122a] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-sm text-white font-medium truncate">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/account/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <User size={16} />
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Shield size={16} />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-[#ff385c] hover:bg-[#e62e4f] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a1a] border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block text-gray-300 hover:text-[#ff385c] py-2 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileOpen(false)}
              className="block text-gray-300 hover:text-[#ff385c] py-2 text-sm font-medium"
            >
              Shop
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-gray-300 hover:text-[#ff385c] py-2 text-sm font-medium"
            >
              <ShoppingCart size={18} />
              Cart
              {totalItems > 0 && (
                <span className="bg-[#ff385c] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="border-t border-white/10 pt-3">
              {user ? (
                <>
                  <p className="text-xs text-gray-500 px-1 mb-2">
                    {user.email}
                  </p>
                  <Link
                    href="/account/orders"
                    onClick={() => setMobileOpen(false)}
                    className="block text-gray-300 hover:text-[#ff385c] py-2 text-sm font-medium"
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block text-gray-300 hover:text-[#ff385c] py-2 text-sm font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block text-red-400 hover:text-red-300 py-2 text-sm font-medium w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block bg-[#ff385c] hover:bg-[#e62e4f] text-white text-sm font-medium px-5 py-2.5 rounded-lg text-center transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
