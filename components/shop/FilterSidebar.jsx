'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['dresses', 'tops', 'trousers', 'skirts', 'jackets', 'knitwear', 'accessories'];
const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTS  = [
  { label: 'Newest First',    value: 'newest' },
  { label: 'Price: Low–High', value: 'price_asc' },
  { label: 'Price: High–Low', value: 'price_desc' },
  { label: 'Best Sellers',    value: 'bestseller' },
];

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ivory-dark pb-5 mb-5">
      <button
        className="flex items-center justify-between w-full text-[11px] tracking-[2px] uppercase font-semibold text-ebony mb-4"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange }) {
  const { category, sizes = [], minPrice, maxPrice, sort, showSale } = filters;

  const toggleSize = (s) => {
    const next = sizes.includes(s) ? sizes.filter((x) => x !== s) : [...sizes, s];
    onChange({ ...filters, sizes: next });
  };

  return (
    <aside className="sticky-sidebar pr-8 pt-8">
      <div className="flex items-center gap-2 mb-8">
        <SlidersHorizontal size={16} className="text-gold" />
        <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony">Filter & Sort</h2>
      </div>

      {/* Sort */}
      <Section title="Sort By">
        <div className="space-y-2">
          {SORT_OPTS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={sort === opt.value}
                onChange={() => onChange({ ...filters, sort: opt.value })}
                className="accent-gold"
              />
              <span className="text-[12px] tracking-[0.5px] text-ebony-light group-hover:text-ebony transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Category */}
      <Section title="Category">
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="category"
              value=""
              checked={!category}
              onChange={() => onChange({ ...filters, category: '' })}
              className="accent-gold"
            />
            <span className="text-[12px] tracking-[0.5px] text-ebony-light group-hover:text-ebony transition-colors capitalize">All</span>
          </label>
          {CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={c}
                checked={category === c}
                onChange={() => onChange({ ...filters, category: c })}
                className="accent-gold"
              />
              <span className="text-[12px] tracking-[0.5px] text-ebony-light group-hover:text-ebony transition-colors capitalize">{c}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Size */}
      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={`w-10 h-10 text-[11px] tracking-[1px] border transition-all ${
                sizes.includes(s)
                  ? 'bg-ebony text-ivory border-ebony'
                  : 'bg-transparent text-ebony-light border-ivory-dark hover:border-ebony'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>

      {/* Price */}
      <Section title="Price Range">
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[10px] tracking-[1px] text-ebony-light uppercase mb-1 block">Min (£)</label>
              <input
                type="number"
                min={0}
                value={minPrice || ''}
                onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
                placeholder="0"
                className="input-box text-[13px] py-2 px-3"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] tracking-[1px] text-ebony-light uppercase mb-1 block">Max (£)</label>
              <input
                type="number"
                min={0}
                value={maxPrice || ''}
                onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
                placeholder="500"
                className="input-box text-[13px] py-2 px-3"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Sale toggle */}
      <Section title="Offers" defaultOpen={false}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!showSale}
            onChange={(e) => onChange({ ...filters, showSale: e.target.checked })}
            className="accent-gold w-4 h-4"
          />
          <span className="text-[12px] tracking-[0.5px] text-ebony-light">Sale items only</span>
        </label>
      </Section>

      {/* Clear */}
      <button
        onClick={() => onChange({ sort: 'newest', category: '', sizes: [], showSale: false })}
        className="text-[10px] tracking-[2px] uppercase text-gold hover:text-gold-dark transition-colors mt-2"
      >
        Clear All Filters
      </button>
    </aside>
  );
}
