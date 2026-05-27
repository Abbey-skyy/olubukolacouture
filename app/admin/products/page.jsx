'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit2, Archive, ArchiveRestore, Loader2, AlertTriangle, XCircle, CheckCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const STOCK_STATUS = (total) => {
  if (total === 0)  return { label: 'Out of Stock', color: 'bg-red-100 text-red-700',      dot: 'bg-red-500',    icon: XCircle };
  if (total <= 5)   return { label: 'Critical',     color: 'bg-red-50 text-red-600',       dot: 'bg-red-400',    icon: AlertTriangle };
  if (total <= 15)  return { label: 'Low Stock',    color: 'bg-yellow-100 text-yellow-700',dot: 'bg-yellow-500', icon: AlertTriangle };
  return              { label: 'In Stock',      color: 'bg-green-100 text-green-700',   dot: 'bg-green-500',  icon: CheckCircle };
};

export default function AdminProductsPage() {
  const [products,     setProducts]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [category,     setCategory]     = useState('');
  const [stockFilter,  setStockFilter]  = useState(''); // 'out' | 'low' | 'in'
  const [showArchived, setShowArchived] = useState(false);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)       params.set('q', search);
    if (category)     params.set('category', category);
    if (showArchived) params.set('includeArchived', '1');
    params.set('limit', '100');

    fetch(`/api/admin/products?${params}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); })
      .finally(() => setLoading(false));
  }, [search, category, showArchived]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleArchive = async (product) => {
    const action = product.isArchived ? 'Restore' : 'Archive';
    if (!window.confirm(`${action} "${product.name}"?`)) return;
    const res = await fetch(`/api/admin/products/${product._id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ isArchived: !product.isArchived }),
    });
    if (res.ok) { toast.success(`Product ${action.toLowerCase()}d`); fetchProducts(); }
    else toast.error('Action failed');
  };

  // Compute stock totals and apply stock filter
  const enriched = products.map((p) => {
    const total  = p.sizes?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0;
    const status = STOCK_STATUS(total);
    return { ...p, totalStock: total, stockStatus: status };
  });

  const filtered = enriched.filter((p) => {
    if (!stockFilter) return true;
    if (stockFilter === 'out') return p.totalStock === 0;
    if (stockFilter === 'low') return p.totalStock > 0 && p.totalStock <= 15;
    if (stockFilter === 'in')  return p.totalStock > 15;
    return true;
  });

  // Summary counts
  const outCount  = enriched.filter((p) => p.totalStock === 0).length;
  const lowCount  = enriched.filter((p) => p.totalStock > 0 && p.totalStock <= 15).length;
  const inCount   = enriched.filter((p) => p.totalStock > 15).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-ebony tracking-[2px]">Products</h1>
          <p className="text-[12px] text-ebony-light mt-1">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-[10px] flex items-center gap-2">
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button onClick={() => setStockFilter(stockFilter === 'out' ? '' : 'out')}
          className={`p-4 border text-left transition-all ${stockFilter === 'out' ? 'border-red-400 bg-red-50' : 'border-ivory-dark hover:border-red-300'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">Out of Stock</span>
            <XCircle size={16} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{outCount}</p>
          <p className="text-[10px] text-ebony-light mt-0.5">products need restocking</p>
        </button>
        <button onClick={() => setStockFilter(stockFilter === 'low' ? '' : 'low')}
          className={`p-4 border text-left transition-all ${stockFilter === 'low' ? 'border-yellow-400 bg-yellow-50' : 'border-ivory-dark hover:border-yellow-300'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">Low Stock</span>
            <AlertTriangle size={16} className="text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{lowCount}</p>
          <p className="text-[10px] text-ebony-light mt-0.5">15 or fewer units left</p>
        </button>
        <button onClick={() => setStockFilter(stockFilter === 'in' ? '' : 'in')}
          className={`p-4 border text-left transition-all ${stockFilter === 'in' ? 'border-green-400 bg-green-50' : 'border-ivory-dark hover:border-green-300'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">In Stock</span>
            <CheckCircle size={16} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{inCount}</p>
          <p className="text-[10px] text-ebony-light mt-0.5">well stocked products</p>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ebony-light" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..." className="input-box pl-9 text-[13px] w-full" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-box text-[13px]">
          <option value="">All Categories</option>
          {['dresses','tops','trousers','skirts','jackets','knitwear','accessories'].map((c) => (
            <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-[12px] text-ebony-light cursor-pointer px-3 border border-ivory-dark">
          <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="accent-gold" />
          Show archived
        </label>
        {stockFilter && (
          <button onClick={() => setStockFilter('')} className="flex items-center gap-1.5 text-[11px] text-gold border border-gold/40 px-3 py-2">
            <Filter size={12} /> Clear filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-ivory-dark overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="bg-ivory-dark">
            <tr>
              {['Image','Product','Category','Price (£)','Total Stock','Stock Status','Flags','Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[2px] uppercase text-ebony-light font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-dark">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-16"><Loader2 size={24} className="animate-spin text-gold mx-auto" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-16 text-[12px] text-ebony-light">No products found</td></tr>
            ) : filtered.map((p) => {
              const StatusIcon = p.stockStatus.icon;
              return (
                <tr key={p._id} className={`hover:bg-ivory-dark/30 transition-colors ${p.isArchived ? 'opacity-50' : ''}`}>
                  {/* Image */}
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-16 bg-ivory-dark overflow-hidden flex-shrink-0">
                      {p.images?.[0]?.url
                        ? <Image src={p.images[0].url} alt={p.name} fill className="object-cover" sizes="48px" />
                        : <div className="w-full h-full flex items-center justify-center text-ebony-light/40 text-[9px]">No img</div>
                      }
                      {p.images?.length > 1 && (
                        <span className="absolute bottom-0 right-0 bg-ebony/70 text-ivory text-[8px] px-1">
                          +{p.images.length - 1}
                        </span>
                      )}
                    </div>
                  </td>
                  {/* Name */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-ebony leading-tight">{p.name}</p>
                    <p className="text-[10px] text-ebony-light mt-0.5 font-mono">{p.slug}</p>
                  </td>
                  {/* Category */}
                  <td className="px-4 py-3 text-ebony-light capitalize">{p.category}</td>
                  {/* Price */}
                  <td className="px-4 py-3">
                    <p className="font-medium">£{(p.priceGBP / 100).toFixed(2)}</p>
                    {p.compareAtGBP && (
                      <p className="text-[10px] text-ebony-light line-through">£{(p.compareAtGBP / 100).toFixed(2)}</p>
                    )}
                  </td>
                  {/* Total stock */}
                  <td className="px-4 py-3">
                    <div>
                      <span className={`text-base font-bold ${p.totalStock === 0 ? 'text-red-600' : p.totalStock <= 15 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {p.totalStock}
                      </span>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {p.sizes?.filter((s) => s.stock >= 0).map((s) => (
                          <span key={s.label} className={`text-[9px] px-1 py-0.5 rounded ${
                            s.stock === 0 ? 'bg-red-100 text-red-600' :
                            s.stock <= 5  ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {s.label}:{s.stock}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  {/* Status badge */}
                  <td className="px-4 py-3">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] tracking-[1px] uppercase font-medium whitespace-nowrap ${p.stockStatus.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.stockStatus.dot}`} />
                      {p.stockStatus.label}
                    </div>
                  </td>
                  {/* Flags */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {p.isNewArrival && <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded w-fit whitespace-nowrap">✦ New</span>}
                      {p.isFeatured   && <span className="text-[9px] bg-gold/20 text-gold px-1.5 py-0.5 rounded w-fit whitespace-nowrap">★ Featured</span>}
                      {p.isSale       && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded w-fit whitespace-nowrap">% Sale</span>}
                      {p.isArchived   && <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded w-fit whitespace-nowrap">Archived</span>}
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/products/${p._id}`}
                        className="flex items-center gap-1 text-[10px] tracking-[1px] uppercase border border-ivory-dark px-2 py-1.5 hover:border-ebony hover:text-ebony text-ebony-light transition-colors whitespace-nowrap">
                        <Edit2 size={11} /> Edit
                      </Link>
                      <button onClick={() => toggleArchive(p)}
                        className={`flex items-center gap-1 text-[10px] tracking-[1px] uppercase border px-2 py-1.5 transition-colors whitespace-nowrap ${
                          p.isArchived
                            ? 'border-green-200 text-green-600 hover:bg-green-50'
                            : 'border-ivory-dark text-ebony-light hover:border-red-300 hover:text-red-500'
                        }`}>
                        {p.isArchived ? <><ArchiveRestore size={11} /> Restore</> : <><Archive size={11} /> Archive</>}
                      </button>
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
