'use client';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, ShoppingBag, Truck, CheckCircle2, RotateCcw, RefreshCw, Search, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending:          { label: 'Pending',          color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  confirmed:        { label: 'Confirmed',         color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
  processing:       { label: 'Processing',        color: 'bg-indigo-100 text-indigo-700',dot: 'bg-indigo-500' },
  shipped:          { label: 'Shipped',           color: 'bg-purple-100 text-purple-700',dot: 'bg-purple-500' },
  delivered:        { label: 'Delivered',         color: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  cancelled:        { label: 'Cancelled',         color: 'bg-gray-100 text-gray-600',    dot: 'bg-gray-400' },
  return_requested: { label: 'Return Requested',  color: 'bg-orange-100 text-orange-700',dot: 'bg-orange-500' },
  returned:         { label: 'Refund Processed',  color: 'bg-red-100 text-red-600',      dot: 'bg-red-400' },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

function fmt(pence) {
  return `£${(pence / 100).toFixed(2)}`;
}

function shortId(id) {
  return id?.slice(-8).toUpperCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminOrdersPage() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');
  const [search,   setSearch]   = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const { order } = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: order.status } : o)));
      toast.success('Order status updated');
    } else {
      toast.error('Failed to update status');
    }
    setUpdating(null);
  };

  // Stats
  const total          = orders.length;
  const inProgress     = orders.filter((o) => ['processing', 'shipped', 'confirmed'].includes(o.status)).length;
  const delivered      = orders.filter((o) => o.status === 'delivered').length;
  const refundReq      = orders.filter((o) => o.status === 'return_requested').length;
  const refundDone     = orders.filter((o) => o.status === 'returned').length;

  // Filter + search
  const visible = orders.filter((o) => {
    if (filter && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const customerName = o.user?.name?.toLowerCase() || '';
      const customerEmail = o.user?.email?.toLowerCase() || '';
      const orderId = o._id?.toLowerCase() || '';
      return customerName.includes(q) || customerEmail.includes(q) || orderId.includes(q);
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-ebony tracking-[2px]">Orders</h1>
        <p className="text-[12px] text-ebony-light mt-1">{total} total orders</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <button
          onClick={() => setFilter('')}
          className={`p-4 border text-left transition-all ${!filter ? 'border-gold bg-gold/5' : 'border-ivory-dark hover:border-gold/40'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">Total Orders</span>
            <ShoppingBag size={15} className="text-gold" />
          </div>
          <p className="text-2xl font-bold text-ebony">{total}</p>
        </button>

        <button
          onClick={() => setFilter(filter === 'processing' ? '' : 'processing')}
          className={`p-4 border text-left transition-all ${filter === 'processing' ? 'border-indigo-400 bg-indigo-50' : 'border-ivory-dark hover:border-indigo-300'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">In Progress</span>
            <RefreshCw size={15} className="text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-600">{inProgress}</p>
          <p className="text-[10px] text-ebony-light mt-0.5">confirmed / processing / shipped</p>
        </button>

        <button
          onClick={() => setFilter(filter === 'delivered' ? '' : 'delivered')}
          className={`p-4 border text-left transition-all ${filter === 'delivered' ? 'border-green-400 bg-green-50' : 'border-ivory-dark hover:border-green-300'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">Delivered</span>
            <CheckCircle2 size={15} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{delivered}</p>
        </button>

        <button
          onClick={() => setFilter(filter === 'return_requested' ? '' : 'return_requested')}
          className={`p-4 border text-left transition-all ${filter === 'return_requested' ? 'border-orange-400 bg-orange-50' : 'border-ivory-dark hover:border-orange-300'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">Refund Requested</span>
            <RotateCcw size={15} className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-600">{refundReq}</p>
        </button>

        <button
          onClick={() => setFilter(filter === 'returned' ? '' : 'returned')}
          className={`p-4 border text-left transition-all ${filter === 'returned' ? 'border-red-300 bg-red-50' : 'border-ivory-dark hover:border-red-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">Refund Processed</span>
            <Truck size={15} className="text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-500">{refundDone}</p>
        </button>
      </div>

      {/* Search + filter row */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ebony-light" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email or order ID…"
            className="input-box pl-9 text-[13px] w-full"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-box text-[13px]"
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="border border-ivory-dark overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="bg-ivory-dark">
            <tr>
              {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Change Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[2px] uppercase text-ebony-light font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-dark">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <Loader2 size={24} className="animate-spin text-gold mx-auto" />
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-[12px] text-ebony-light">
                  No orders found
                </td>
              </tr>
            ) : visible.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const isUpdating = updating === order._id;
              return (
                <tr key={order._id} className="hover:bg-ivory-dark/30 transition-colors">
                  {/* Order ID */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-ebony font-medium">#{shortId(order._id)}</span>
                  </td>
                  {/* Customer */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-ebony leading-tight">{order.user?.name || '—'}</p>
                    <p className="text-[10px] text-ebony-light mt-0.5">{order.user?.email || '—'}</p>
                  </td>
                  {/* Items */}
                  <td className="px-4 py-3">
                    <p className="text-ebony">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                    <p className="text-[10px] text-ebony-light mt-0.5 leading-tight">
                      {order.items?.slice(0, 2).map((i) => i.name).join(', ')}
                      {order.items?.length > 2 ? ` +${order.items.length - 2} more` : ''}
                    </p>
                  </td>
                  {/* Total */}
                  <td className="px-4 py-3 font-medium text-ebony">
                    {fmt(order.totalGBP)}
                  </td>
                  {/* Status badge */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[1px] uppercase font-medium whitespace-nowrap ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </td>
                  {/* Date */}
                  <td className="px-4 py-3 text-ebony-light whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  {/* Change status */}
                  <td className="px-4 py-3">
                    <div className="relative">
                      {isUpdating ? (
                        <Loader2 size={14} className="animate-spin text-gold" />
                      ) : (
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className="appearance-none bg-ivory border border-ivory-dark text-ebony text-[11px] tracking-[1px] pl-3 pr-7 py-1.5 cursor-pointer hover:border-gold transition-colors outline-none focus:border-gold"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                            ))}
                          </select>
                          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-ebony-light pointer-events-none" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
