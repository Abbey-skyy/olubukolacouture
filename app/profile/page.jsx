'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Heart, RefreshCw, User, LogOut, Loader2, X, ShoppingBag, Trash2, AlertTriangle } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';
import { format as formatDate } from 'date-fns';

const STATUS_COLORS = {
  pending:          'bg-yellow-100 text-yellow-800',
  confirmed:        'bg-blue-100 text-blue-800',
  processing:       'bg-blue-100 text-blue-800',
  shipped:          'bg-indigo-100 text-indigo-800',
  delivered:        'bg-green-100 text-green-800',
  cancelled:        'bg-red-100 text-red-800',
  return_requested: 'bg-orange-100 text-orange-800',
  returned:         'bg-gray-100 text-gray-600',
};

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { format } = useCurrency();

  useEffect(() => {
    fetch('/api/user/orders').then((r) => r.json()).then((d) => {
      setOrders(d.orders || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-gold" /></div>;

  return (
    <div>
      <h2 className="font-serif text-2xl text-ebony tracking-[2px] mb-8">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={40} className="mx-auto mb-4 text-ebony-light/40" />
          <p className="text-[12px] tracking-[1.5px] uppercase text-ebony-light mb-4">No orders yet</p>
          <Link href="/shop" className="btn-primary text-[10px]">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-ivory-dark p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-[12px] text-ebony-light">{formatDate(new Date(order.createdAt), 'dd MMM yyyy')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] tracking-[1.5px] uppercase px-3 py-1 font-medium rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[13px] font-medium text-ebony">{format(order.totalGBP)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {order.items?.slice(0, 4).map((item, i) => (
                  <div key={i} className="relative w-14 h-14 bg-ivory-dark overflow-hidden">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />}
                  </div>
                ))}
                {order.items?.length > 4 && (
                  <div className="w-14 h-14 bg-ivory-dark flex items-center justify-center text-[11px] text-ebony-light">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>
              {order.trackingNumber && (
                <p className="text-[11px] text-ebony-light mt-3">Tracking: <span className="text-ebony font-medium">{order.trackingNumber}</span></p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WishlistTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const { format } = useCurrency();
  const { addItem } = useCart();

  useEffect(() => {
    fetch('/api/user/wishlist').then((r) => r.json()).then((d) => {
      setProducts(d.wishlist || []);
      setLoading(false);
    });
  }, []);

  const removeFromWishlist = async (productId) => {
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    await fetch('/api/user/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    toast.success('Removed from wishlist');
  };

  const addToCartAndRemove = async (product) => {
    const defaultSize = product.sizes?.find((s) => s.stock > 0)?.label;
    if (!defaultSize) { toast.error('Out of stock'); return; }
    addItem(product, defaultSize);
    toast.success('Added to bag');
    await removeFromWishlist(product._id);
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-gold" /></div>;

  return (
    <div>
      <h2 className="font-serif text-2xl text-ebony tracking-[2px] mb-8">
        My Wishlist {products.length > 0 && <span className="text-ebony-light text-lg">({products.length})</span>}
      </h2>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={40} className="mx-auto mb-4 text-ebony-light/40" />
          <p className="text-[12px] tracking-[1.5px] uppercase text-ebony-light mb-4">Your wishlist is empty</p>
          <Link href="/shop" className="btn-primary text-[10px]">Browse Collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const inStock = p.sizes?.some((s) => s.stock > 0);
            return (
              <div key={p._id} className="group border border-ivory-dark flex flex-col">
                {/* Image */}
                <Link href={`/product/${p.slug}`} className="relative aspect-[3/4] overflow-hidden bg-ivory-dark block">
                  {p.images?.[0]?.url && (
                    <Image
                      src={p.images[0].url}
                      alt={p.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  {/* Remove button */}
                  <button
                    onClick={(e) => { e.preventDefault(); removeFromWishlist(p._id); }}
                    aria-label="Remove from wishlist"
                    className="absolute top-3 right-3 w-8 h-8 bg-ivory/90 backdrop-blur-sm flex items-center justify-center text-ebony hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  {!inStock && (
                    <div className="absolute inset-0 bg-ivory/60 flex items-center justify-center">
                      <span className="text-[10px] tracking-[2px] uppercase font-semibold text-ebony">Out of Stock</span>
                    </div>
                  )}
                </Link>
                {/* Info + actions */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <Link href={`/product/${p.slug}`}>
                      <h3 className="text-[12px] tracking-[1.5px] uppercase font-medium text-ebony hover:text-gold transition-colors leading-snug">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[13px] text-ebony font-medium">{format(p.priceGBP)}</span>
                      {p.compareAtGBP && (
                        <span className="text-[12px] text-ebony-light line-through">{format(p.compareAtGBP)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => addToCartAndRemove(p)}
                      disabled={!inStock}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-ebony text-ivory text-[10px] tracking-[2px] uppercase font-medium py-2.5 hover:bg-ebony-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag size={12} />
                      Add to Bag
                    </button>
                    <button
                      onClick={() => removeFromWishlist(p._id)}
                      aria-label="Remove from wishlist"
                      className="w-10 flex items-center justify-center border border-ivory-dark text-ebony-light hover:border-red-300 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReturnsTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/orders?status=delivered').then((r) => r.json()).then((d) => {
      setOrders(d.orders || []);
      setLoading(false);
    });
  }, []);

  const requestReturn = async (orderId) => {
    const reason = prompt('Please briefly describe the reason for your return:');
    if (!reason) return;
    await fetch(`/api/user/orders/${orderId}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: 'return_requested' } : o));
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-gold" /></div>;

  return (
    <div>
      <h2 className="font-serif text-2xl text-ebony tracking-[2px] mb-4">Returns & Refunds</h2>
      <p className="text-[12px] text-ebony-light mb-8">Free returns within 30 days of delivery. Eligible delivered orders are shown below.</p>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <RefreshCw size={40} className="mx-auto mb-4 text-ebony-light/40" />
          <p className="text-[12px] tracking-[1.5px] uppercase text-ebony-light">No eligible orders for return</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-ivory-dark p-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[2px] uppercase text-ebony">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-[12px] text-ebony-light mt-1">{order.items?.length} item(s)</p>
              </div>
              {order.status === 'return_requested' || order.status === 'returned' ? (
                <span className={`text-[10px] tracking-[1.5px] uppercase px-3 py-1 font-medium rounded-full ${STATUS_COLORS[order.status]}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              ) : (
                <button onClick={() => requestReturn(order._id)} className="btn-secondary text-[10px] py-2">
                  Request Return
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeleteAccountModal({ onClose, userEmail }) {
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting]       = useState(false);

  const confirmed = confirmText === 'DELETE';

  const handleDelete = async () => {
    if (!confirmed) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/user/delete-account', { method: 'DELETE' });
      if (!res.ok) throw new Error();
      await signOut({ callbackUrl: '/' });
    } catch {
      toast.error('Something went wrong. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ebony-dark/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-ivory shadow-2xl z-10">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
              <h2 className="text-[13px] tracking-[3px] uppercase font-semibold text-ebony">
                Delete Account
              </h2>
            </div>
            <button onClick={onClose} className="text-ebony-light hover:text-ebony transition-colors p-1">
              <X size={18} />
            </button>
          </div>

          <p className="text-[13px] text-ebony-light leading-relaxed mb-3">
            This action is <strong className="text-ebony">permanent and cannot be undone</strong>.
            Deleting your account will remove your profile, wishlist, and order history.
          </p>
          <p className="text-[13px] text-ebony-light leading-relaxed mb-6">
            A confirmation email will be sent to <strong className="text-ebony">{userEmail}</strong>.
          </p>

          <div className="mb-6">
            <label className="block text-[10px] tracking-[2px] uppercase text-ebony-light mb-2">
              Type <span className="text-red-500 font-semibold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full border border-ivory-dark bg-white px-4 py-3 text-[13px] text-ebony focus:outline-none focus:border-red-400 transition-colors"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={!confirmed || deleting}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-ivory text-[10px] tracking-[2px] uppercase font-semibold py-3 hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              {deleting ? 'Deleting...' : 'Delete My Account'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-ivory-dark text-ebony text-[10px] tracking-[2px] uppercase font-semibold py-3 hover:bg-ivory-dark transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const COUNTRIES = [
  { code: 'GB', label: 'United Kingdom' },
  { code: 'NG', label: 'Nigeria' },
  { code: 'US', label: 'United States' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
  { code: 'GH', label: 'Ghana' },
  { code: 'KE', label: 'Kenya' },
  { code: 'ZA', label: 'South Africa' },
  { code: 'FR', label: 'France' },
  { code: 'DE', label: 'Germany' },
  { code: 'NL', label: 'Netherlands' },
  { code: 'AE', label: 'UAE' },
];

const EMPTY_ADDRESS = { fullName: '', line1: '', line2: '', city: '', postcode: '', country: 'GB', phone: '' };

function AccountTab({ onNameChange }) {
  const { update } = useSession();
  const [fetching,    setFetching]    = useState(true);
  const [loading,     setLoading]     = useState(false);
  const [showDelete,  setShowDelete]  = useState(false);
  const [userEmail,   setUserEmail]   = useState('');
  const [form, setForm] = useState({ name: '', email: '', address: EMPTY_ADDRESS });

  const setAddr = (field, val) =>
    setForm((f) => ({ ...f, address: { ...f.address, [field]: val } }));

  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then(({ user: u }) => {
        if (!u) return;
        const addr = u.addresses?.find((a) => a.isDefault) ?? u.addresses?.[0] ?? {};
        setForm({
          name:  u.name  || '',
          email: u.email || '',
          address: {
            fullName: addr.fullName || '',
            line1:    addr.line1    || '',
            line2:    addr.line2    || '',
            city:     addr.city     || '',
            postcode: addr.postcode || '',
            country:  addr.country  || 'GB',
            phone:    addr.phone    || '',
          },
        });
        setUserEmail(u.email || '');
      })
      .finally(() => setFetching(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/user/profile', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: form.name, email: form.email, address: form.address }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      toast.success('Changes saved');
      setUserEmail(data.user.email);
      onNameChange(data.user.name);
      await update({ name: data.user.name });
    } else {
      toast.error(data.error || 'Failed to save changes');
    }
  };

  if (fetching) return <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-gold" /></div>;

  return (
    <div>
      <h2 className="font-serif text-2xl text-ebony tracking-[2px] mb-8">My Account</h2>

      <form onSubmit={handleSave} className="max-w-xl space-y-10">
        {/* ── Personal Information ─────────────────────────── */}
        <section>
          <h3 className="text-[10px] tracking-[3px] uppercase font-semibold text-ebony-light mb-5 pb-3 border-b border-ivory-dark">
            Personal Information
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Full Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input-minimal"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Email Address</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input-minimal"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </section>

        {/* ── Delivery Address ─────────────────────────────── */}
        <section>
          <h3 className="text-[10px] tracking-[3px] uppercase font-semibold text-ebony-light mb-5 pb-3 border-b border-ivory-dark">
            Delivery Address
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Full Name on Address</label>
              <input
                value={form.address.fullName}
                onChange={(e) => setAddr('fullName', e.target.value)}
                className="input-minimal"
                placeholder="Name for delivery label"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Address Line 1</label>
              <input
                value={form.address.line1}
                onChange={(e) => setAddr('line1', e.target.value)}
                className="input-minimal"
                placeholder="Street address"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">
                Address Line 2 <span className="normal-case text-ebony-light/50">(optional)</span>
              </label>
              <input
                value={form.address.line2}
                onChange={(e) => setAddr('line2', e.target.value)}
                className="input-minimal"
                placeholder="Apartment, suite, floor, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">City</label>
                <input
                  value={form.address.city}
                  onChange={(e) => setAddr('city', e.target.value)}
                  className="input-minimal"
                  placeholder="London"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Postcode</label>
                <input
                  value={form.address.postcode}
                  onChange={(e) => setAddr('postcode', e.target.value)}
                  className="input-minimal"
                  placeholder="SW1A 1AA"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Country</label>
                <select
                  value={form.address.country}
                  onChange={(e) => setAddr('country', e.target.value)}
                  className="input-minimal bg-transparent"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Phone Number</label>
                <input
                  type="tel"
                  value={form.address.phone}
                  onChange={(e) => setAddr('phone', e.target.value)}
                  className="input-minimal"
                  placeholder="+44 7700 000000"
                />
              </div>
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary text-[10px] disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <Loader2 size={13} className="animate-spin" />}
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      {/* ── Danger Zone ──────────────────────────────────────── */}
      <div className="mt-12 pt-8 border-t border-ivory-dark">
        <h3 className="text-[11px] tracking-[2px] uppercase font-semibold text-ebony mb-2">Danger Zone</h3>
        <p className="text-[12px] text-ebony-light mb-5">These actions are irreversible. Please proceed with caution.</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 btn-secondary text-[10px] py-2.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={14} /> Sign Out
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 text-[10px] tracking-[1.5px] uppercase font-semibold py-2.5 px-4 border border-red-300 text-red-600 hover:bg-red-600 hover:text-ivory hover:border-red-600 transition-colors"
          >
            <Trash2 size={14} /> Delete Account
          </button>
        </div>
      </div>

      {showDelete && (
        <DeleteAccountModal
          onClose={() => setShowDelete(false)}
          userEmail={userEmail}
        />
      )}
    </div>
  );
}

const TABS = [
  { id: 'orders',   label: 'My Orders',  icon: Package },
  { id: 'wishlist', label: 'Wishlist',   icon: Heart },
  { id: 'returns',  label: 'Returns',    icon: RefreshCw },
  { id: 'account',  label: 'My Account', icon: User },
];

function ProfileContent() {
  const { data: session } = useSession();
  const searchParams      = useSearchParams();
  const [activeTab,    setActiveTab]    = useState(searchParams.get('tab') || 'orders');
  const [displayName,  setDisplayName]  = useState('');

  useEffect(() => {
    if (session?.user?.name) setDisplayName(session.user.name);
  }, [session?.user?.name]);

  return (
    <div className="max-w-8xl mx-auto px-6 lg:px-12 py-12">
      <div className="mb-10">
        <p className="text-[10px] tracking-[3px] uppercase text-gold mb-2">Welcome back</p>
        <h1 className="font-serif text-4xl text-ebony tracking-[2px]">{displayName || session?.user?.name}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-[11px] tracking-[1.5px] uppercase transition-colors text-left border-l-2 ${
                  activeTab === id
                    ? 'border-gold bg-gold/5 text-ebony font-semibold'
                    : 'border-transparent text-ebony-light hover:text-ebony hover:bg-ivory-dark'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {activeTab === 'orders'   && <OrdersTab />}
          {activeTab === 'wishlist' && <WishlistTab />}
          {activeTab === 'returns'  && <ReturnsTab />}
          {activeTab === 'account'  && <AccountTab onNameChange={setDisplayName} />}
        </main>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><Loader2 size={24} className="animate-spin text-gold" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
