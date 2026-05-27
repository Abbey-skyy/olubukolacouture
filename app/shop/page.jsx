'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import FilterSidebar from '@/components/shop/FilterSidebar';
import { LayoutGrid, Rows3, Loader2 } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [cols,     setCols]     = useState(3);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sizes:    [],
    sort:     'newest',
    showSale: searchParams.get('filter') === 'sale',
    q:        searchParams.get('q') || '',
  });

  const PER_PAGE = 12;

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.sizes.length) params.set('sizes', filters.sizes.join(','));
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.showSale) params.set('sale', '1');
    if (filters.q) params.set('q', filters.q);
    if (filters.minPrice) params.set('minPrice', filters.minPrice * 100);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice * 100);
    params.set('page', page);
    params.set('limit', PER_PAGE);

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [filters, page]);

  const totalPages = Math.ceil(total / PER_PAGE);

  const pageTitle = filters.category
    ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
    : filters.q
    ? `Search: "${filters.q}"`
    : 'All Products';

  return (
    <div className="max-w-8xl mx-auto px-6 lg:px-12 py-12">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl text-ebony tracking-[3px]">{pageTitle}</h1>
        <p className="text-[12px] text-ebony-light mt-2 tracking-[1px]">
          {loading ? '...' : `${total} piece${total !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="flex gap-12">
        {/* Sticky Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar filters={filters} onChange={setFilters} />
        </div>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-ivory-dark">
            <p className="text-[11px] tracking-[1.5px] text-ebony-light uppercase hidden md:block">
              {total} Results
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setCols(3)}
                className={`p-2 transition-colors ${cols === 3 ? 'text-ebony' : 'text-ebony-light hover:text-ebony'}`}
                aria-label="3 columns"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setCols(2)}
                className={`p-2 transition-colors ${cols === 2 ? 'text-ebony' : 'text-ebony-light hover:text-ebony'}`}
                aria-label="2 columns"
              >
                <Rows3 size={16} />
              </button>
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 size={28} className="animate-spin text-gold" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-[13px] tracking-[2px] uppercase text-ebony-light mb-4">No products found</p>
              <button
                onClick={() => setFilters({ category: '', sizes: [], sort: 'newest', showSale: false, q: '' })}
                className="btn-secondary text-[10px]"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 lg:gap-8 ${
                cols === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'
              }`}
            >
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-16">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-10 h-10 text-[12px] tracking-[1px] border transition-colors ${
                    n === page
                      ? 'bg-ebony text-ivory border-ebony'
                      : 'border-ivory-dark text-ebony-light hover:border-ebony hover:text-ebony'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-32">
        <Loader2 size={28} className="animate-spin text-gold" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
