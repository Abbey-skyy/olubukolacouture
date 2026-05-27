'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';
import {
  Search, ShoppingBag, User, Menu, X, Heart, ChevronDown, LogOut, Settings, Package,
} from 'lucide-react';

const NAV_CATEGORIES = [
  {
    label: 'New In',
    href: '/shop?filter=new',
    mega: [
      { label: 'New Arrivals', href: '/shop?filter=new' },
      { label: 'Best Sellers', href: '/shop?filter=bestseller' },
      { label: 'Trending Now', href: '/shop?filter=trending' },
    ],
  },
  {
    label: 'Clothing',
    href: '/shop',
    mega: [
      { label: 'Dresses',         href: '/shop?category=dresses' },
      { label: 'Tops & Blouses',  href: '/shop?category=tops' },
      { label: 'Trousers & Pants',href: '/shop?category=trousers' },
      { label: 'Skirts',          href: '/shop?category=skirts' },
      { label: '2 Piece',         href: '/shop?category=2-piece' },
      { label: 'Lingerie',        href: '/shop?category=lingerie' },
      { label: 'Auto Gele',       href: '/shop?category=auto-gele' },
    ],
  },
  {
    label: 'Accessories',
    href: '/shop?category=accessories',
    mega: [
      { label: 'Tailoring Accessories', isHeading: true },
      { label: 'Beads',             href: '/shop?category=beads' },
      { label: 'Zips',              href: '/shop?category=zips' },
      { label: 'Rhinestones',       href: '/shop?category=rhinestones' },
      { label: 'Appliqué Sequins',  href: '/shop?category=applique-sequins' },
    ],
  },
  { label: 'Sale', href: '/shop?filter=sale', mega: [] },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems, setIsOpen } = useCart();
  useCurrency();

  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ,    setSearchQ]    = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mega on outside click
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMega(null);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ivory/96 backdrop-blur-md shadow-[0_1px_0_rgba(30,17,10,0.10)]'
          : 'bg-ivory/75 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-8xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {NAV_CATEGORIES.map((cat) => (
              <div key={cat.label} className="relative group">
                <button
                  className="flex items-center gap-1 text-[11px] tracking-[2.5px] uppercase font-medium text-ebony hover:text-gold transition-colors py-2"
                  onMouseEnter={() => cat.mega.length && setActiveMega(cat.label)}
                  onMouseLeave={() => setActiveMega(null)}
                  onClick={() => !cat.mega.length && (window.location.href = cat.href)}
                >
                  {cat.label}
                  {cat.mega.length > 0 && <ChevronDown size={12} className="mt-0.5" />}
                </button>
                {/* Mega dropdown */}
                {cat.mega.length > 0 && (
                  <div
                    onMouseEnter={() => setActiveMega(cat.label)}
                    onMouseLeave={() => setActiveMega(null)}
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 w-56 bg-ivory border border-ivory-dark shadow-lg transition-all duration-200 ${
                      activeMega === cat.label
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="py-4">
                      {cat.mega.map((item) =>
                        item.isHeading ? (
                          <p key={item.label} className="px-6 pt-2 pb-1 text-[9px] tracking-[2.5px] uppercase font-semibold text-gold">
                            {item.label}
                          </p>
                        ) : (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="block px-6 py-2.5 text-[11px] tracking-[1.5px] uppercase text-ebony-light hover:text-ebony hover:bg-ivory-dark transition-colors"
                          >
                            {item.label}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Logo — centred */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-center"
          >
            <span className="font-serif text-xl lg:text-2xl tracking-[6px] text-ebony font-normal">
              OLUBUKOLA
            </span>
            <span className="block text-[8px] tracking-[5px] text-gold font-medium -mt-0.5">
              COUTURE
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-4 lg:gap-5">
            <CurrencySwitcher />

            {/* Search */}
            <button
              className="btn-ghost p-1"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* User */}
            <div className="relative">
              <button
                className="btn-ghost p-1"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="Account"
              >
                <User size={20} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-ivory border border-ivory-dark shadow-lg z-50 py-2">
                  {session?.user ? (
                    <>
                      <div className="px-4 py-3 border-b border-ivory-dark">
                        <p className="text-[11px] tracking-wider text-ebony-light uppercase">Signed in as</p>
                        <p className="text-[13px] text-ebony font-medium truncate mt-0.5">{session.user.name}</p>
                      </div>
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-[11px] tracking-[1.5px] uppercase text-ebony hover:bg-ivory-dark transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <User size={14} /> My Profile
                      </Link>
                      <Link href="/profile?tab=orders" className="flex items-center gap-3 px-4 py-2.5 text-[11px] tracking-[1.5px] uppercase text-ebony hover:bg-ivory-dark transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <Package size={14} /> My Orders
                      </Link>
                      <Link href="/profile?tab=wishlist" className="flex items-center gap-3 px-4 py-2.5 text-[11px] tracking-[1.5px] uppercase text-ebony hover:bg-ivory-dark transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <Heart size={14} /> Wishlist
                      </Link>
                      {session.user.role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-[11px] tracking-[1.5px] uppercase text-gold hover:bg-ivory-dark transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <Settings size={14} /> Admin
                        </Link>
                      )}
                      <hr className="border-ivory-dark my-1" />
                      <button
                        onClick={() => { signOut({ callbackUrl: '/' }); setUserMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-[11px] tracking-[1.5px] uppercase text-ebony-light hover:bg-ivory-dark transition-colors"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-4 py-2.5 text-[11px] tracking-[1.5px] uppercase text-ebony hover:bg-ivory-dark transition-colors" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                      <Link href="/register" className="block px-4 py-2.5 text-[11px] tracking-[1.5px] uppercase text-ebony hover:bg-ivory-dark transition-colors" onClick={() => setUserMenuOpen(false)}>Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              className="btn-ghost p-1 relative"
              onClick={() => setIsOpen(true)}
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-ebony-dark text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-ivory-dark py-4 animate-fade-in">
            <div className="relative max-w-2xl mx-auto">
              <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-ebony-light" />
              <input
                type="search"
                placeholder="SEARCH FOR PRODUCTS..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQ.trim()) {
                    window.location.href = `/shop?q=${encodeURIComponent(searchQ.trim())}`;
                  }
                }}
                className="input-minimal pl-6 text-[12px] tracking-[2px]"
                autoFocus
              />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-ivory border-t border-ivory-dark animate-fade-in">
          <div className="px-6 py-4 space-y-1">
            {NAV_CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <Link
                  href={cat.href}
                  className="block py-3 text-[12px] tracking-[2.5px] uppercase font-medium text-ebony border-b border-ivory-dark"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.label}
                </Link>
                {cat.mega.map((item) =>
                  item.isHeading ? (
                    <p key={item.label} className="pl-4 pt-2 pb-0.5 text-[9px] tracking-[2.5px] uppercase font-semibold text-gold">
                      {item.label}
                    </p>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block py-2 pl-6 text-[11px] tracking-[1.5px] uppercase text-ebony-light"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
