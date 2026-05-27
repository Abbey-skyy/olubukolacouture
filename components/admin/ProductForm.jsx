'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  X, Plus, Minus, ImagePlus,
  CheckCircle, Loader2, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_GROUPS = [
  {
    group: 'Clothing',
    options: [
      { value: 'dresses',   label: 'Dresses' },
      { value: 'tops',      label: 'Tops & Blouses' },
      { value: 'trousers',  label: 'Trousers & Pants' },
      { value: 'skirts',    label: 'Skirts' },
      { value: '2-piece',   label: '2 Piece' },
      { value: 'lingerie',  label: 'Lingerie' },
      { value: 'auto-gele', label: 'Auto Gele' },
    ],
  },
  {
    group: 'Accessories — Tailoring',
    options: [
      { value: 'beads',             label: 'Beads' },
      { value: 'zips',              label: 'Zips' },
      { value: 'rhinestones',       label: 'Rhinestones' },
      { value: 'applique-sequins',  label: 'Appliqué Sequins' },
    ],
  },
];
const SIZES      = ['XS','S','M','L','XL','XXL'];

const STOCK_STATUS = (stock) => {
  if (stock === 0)  return { label: 'Out of Stock', color: 'bg-red-100 text-red-700',    dot: 'bg-red-500' };
  if (stock <= 3)   return { label: 'Critical',     color: 'bg-red-50 text-red-600',     dot: 'bg-red-400' };
  if (stock <= 10)  return { label: 'Low Stock',    color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' };
  return              { label: 'In Stock',      color: 'bg-green-100 text-green-700',  dot: 'bg-green-500' };
};

function ImageUploadSlot({ image, index, onUpload, onRemove, isUploading }) {
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024)   { toast.error('Image must be under 10MB'); return; }
    onUpload(index, file);
  };

  return (
    <div className="relative aspect-[3/4] border-2 border-dashed border-ivory-dark hover:border-gold transition-colors bg-ivory-dark/50 overflow-hidden group">
      {image ? (
        <>
          <Image src={image.url} alt={`Product image ${index + 1}`} fill className="object-cover" sizes="200px" />
          <div className="absolute inset-0 bg-ebony-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-ivory text-ebony p-2 hover:bg-gold transition-colors"
              title="Replace image"
            >
              <ImagePlus size={16} />
            </button>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="bg-red-500 text-white p-2 hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <Trash2 size={16} />
            </button>
          </div>
          {index === 0 && (
            <span className="absolute top-2 left-2 bg-gold text-ebony-dark text-[9px] tracking-[1.5px] uppercase px-2 py-0.5 font-semibold">
              Main
            </span>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ebony-light hover:text-ebony transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 size={24} className="animate-spin text-gold" />
          ) : (
            <>
              <ImagePlus size={24} />
              <span className="text-[10px] tracking-[1.5px] uppercase">
                {index === 0 ? 'Main Photo' : `Photo ${index + 1}`}
              </span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}

export default function ProductForm({ initialData, onSave }) {
  const router = useRouter();
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(null); // "colorIdx-imgIdx"

  const [form, setForm] = useState({
    name:         initialData?.name        || '',
    slug:         initialData?.slug        || '',
    description:  initialData?.description || '',
    category:     initialData?.category    || CATEGORY_GROUPS[0].options[0].value,
    subcategory:  initialData?.subcategory || '',
    priceGBP:     initialData ? (initialData.priceGBP / 100).toFixed(2) : '',
    compareAtGBP: initialData?.compareAtGBP ? (initialData.compareAtGBP / 100).toFixed(2) : '',
    isFeatured:   initialData?.isFeatured   || false,
    isNewArrival: initialData?.isNewArrival || false,
    isSale:       initialData?.isSale       || false,
    isArchived:   initialData?.isArchived   || false,
    tags:         initialData?.tags?.join(', ') || '',
  });

  const defaultSizeRows = () => SIZES.map((label) => ({ label, stock: 0, enabled: false }));

  const parseSizeRows = (sizesArr) =>
    SIZES.map((label) => {
      const existing = sizesArr?.find((s) => s.label === label);
      return { label, stock: existing?.stock || 0, enabled: !!existing };
    });

  // Colours — each carries images + per-colour size stock
  const [colors, setColors] = useState(() => {
    if (initialData?.colors?.length) {
      return initialData.colors.map((c) => ({
        name:   c.name || '',
        hex:    c.hex  || '#555D50',
        images: Object.assign(
          Array(6).fill(null),
          (c.images || []).map((img) =>
            typeof img === 'string' ? { url: img, publicId: '', alt: '' } : img
          )
        ),
        // If this colour already has per-colour sizes use them; otherwise migrate top-level sizes
        sizes: c.sizes?.length ? parseSizeRows(c.sizes) : parseSizeRows(initialData?.sizes),
      }));
    }
    // Brand-new product, or legacy product with top-level images/sizes (no colors array)
    const legacyImages = (initialData?.images || []).map((img) =>
      typeof img === 'string' ? { url: img, publicId: '', alt: '' } : img
    );
    return [{
      name:   '',
      hex:    '#555D50',
      images: Object.assign(Array(6).fill(null), legacyImages),
      sizes:  parseSizeRows(initialData?.sizes) || defaultSizeRows(),
    }];
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    // Auto-generate slug from name
    if (name === 'name') {
      setForm((f) => ({
        ...f,
        name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    }
  };

  const uploadColorImage = async (colorIdx, imgIdx, file) => {
    if (!file.type.startsWith('image/'))   { toast.error('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024)     { toast.error('Image must be under 10 MB'); return; }
    setUploading(`${colorIdx}-${imgIdx}`);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setColors((prev) => prev.map((c, ci) => {
        if (ci !== colorIdx) return c;
        const imgs = [...c.images];
        imgs[imgIdx] = { url: data.url, publicId: data.publicId, alt: c.name || form.name };
        return { ...c, images: imgs };
      }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(null);
    }
  };

  const removeColorImage = (colorIdx, imgIdx) => {
    setColors((prev) => prev.map((c, ci) => {
      if (ci !== colorIdx) return c;
      const imgs = [...c.images];
      imgs[imgIdx] = null;
      return { ...c, images: imgs };
    }));
  };

  const addColor = () =>
    setColors((prev) => [...prev, { name: '', hex: '#D4AF37', images: Array(6).fill(null), sizes: defaultSizeRows() }]);
  const removeColor = (colorIdx) => setColors((prev) => prev.filter((_, i) => i !== colorIdx));
  const updateColor = (colorIdx, field, value) =>
    setColors((prev) => prev.map((c, i) => i === colorIdx ? { ...c, [field]: value } : c));

  const toggleSize = (colorIdx, label) =>
    setColors((prev) => prev.map((c, ci) => ci !== colorIdx ? c : {
      ...c,
      sizes: c.sizes.map((s) => s.label === label ? { ...s, enabled: !s.enabled, stock: s.enabled ? 0 : s.stock } : s),
    }));

  const setStock = (colorIdx, label, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    setColors((prev) => prev.map((c, ci) => ci !== colorIdx ? c : {
      ...c,
      sizes: c.sizes.map((s) => s.label === label ? { ...s, stock: num } : s),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalImages = colors.reduce((n, c) => n + c.images.filter(Boolean).length, 0);
    if (totalImages < 1) { toast.error('Please upload at least 1 image for at least one colour'); return; }

    const hasLowImages = colors.some((c) => {
      const count = c.images.filter(Boolean).length;
      return count > 0 && count < 4;
    });
    if (hasLowImages) {
      const ok = window.confirm('Some colours have fewer than 4 images. Products look best with 4+. Continue anyway?');
      if (!ok) return;
    }

    const anyEnabledSize = colors.some((c) => c.sizes.some((s) => s.enabled));
    if (!anyEnabledSize) { toast.error('Please enable at least one size for at least one colour'); return; }
    if (!form.priceGBP)  { toast.error('Please set a price'); return; }

    setSaving(true);
    try {
      const colorPayload = colors
        .filter((c) => c.name || c.images.some(Boolean))
        .map((c) => ({
          name:   c.name,
          hex:    c.hex,
          images: c.images.filter(Boolean).map((img, i) => ({ ...img, order: i })),
          sizes:  c.sizes.filter((s) => s.enabled).map(({ label, stock }) => ({ label, stock })),
        }));

      // Aggregate top-level sizes: union across all colours (summed stock)
      const allLabels = [...new Set(colorPayload.flatMap((c) => c.sizes.map((s) => s.label)))];
      const aggregateSizes = allLabels.map((label) => ({
        label,
        stock: colorPayload.reduce((sum, c) => sum + (c.sizes.find((s) => s.label === label)?.stock || 0), 0),
      }));

      const payload = {
        name:         form.name,
        slug:         form.slug,
        description:  form.description,
        category:     form.category,
        subcategory:  form.subcategory,
        priceGBP:     Math.round(parseFloat(form.priceGBP) * 100),
        compareAtGBP: form.compareAtGBP ? Math.round(parseFloat(form.compareAtGBP) * 100) : null,
        sizes:        aggregateSizes,
        colors:       colorPayload,
        // top-level images = first colour's images (used by ProductCard thumbnail)
        images:       colorPayload[0]?.images || [],
        tags:         form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isFeatured:   form.isFeatured,
        isNewArrival: form.isNewArrival,
        isSale:       form.isSale,
        isArchived:   form.isArchived,
      };

      await onSave(payload);
      toast.success(initialData ? 'Product updated!' : 'Product created!');
      router.push('/admin/products');
    } catch (err) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const ngnPrice = form.priceGBP
    ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })
        .format(parseFloat(form.priceGBP) * 1800)
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      {/* ── Colours & Images ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-ivory-dark">
          <div>
            <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony">Colours & Images</h2>
            <p className="text-[11px] text-ebony-light mt-0.5">
              Each colour has its own gallery of up to 6 images. Customers will see the matching gallery when they select a colour.
            </p>
          </div>
          <button
            type="button"
            onClick={addColor}
            className="flex items-center gap-1 text-[10px] tracking-[1.5px] uppercase text-gold hover:text-ebony transition-colors font-semibold"
          >
            <Plus size={13} /> Add Colour
          </button>
        </div>

        <div className="space-y-6">
          {colors.map((color, colorIdx) => {
            const uploadedCount = color.images.filter(Boolean).length;
            return (
              <div key={colorIdx} className="border border-ivory-dark p-5">
                {/* Colour header */}
                <div className="flex items-center gap-3 mb-5">
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(colorIdx, 'hex', e.target.value)}
                    className="w-10 h-10 border border-ivory-dark cursor-pointer rounded flex-shrink-0"
                    title="Pick colour"
                  />
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => updateColor(colorIdx, 'name', e.target.value)}
                    placeholder="Colour name (e.g. Red, Ivory, Black)"
                    className="input-box flex-1"
                  />
                  <span className={`text-[10px] tracking-[1.5px] uppercase px-2 py-1 font-medium flex-shrink-0 ${
                    uploadedCount >= 4 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {uploadedCount} / 6
                  </span>
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(colorIdx)}
                      className="p-1.5 text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                      title="Remove this colour"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Image grid */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {color.images.map((img, imgIdx) => (
                    <ImageUploadSlot
                      key={imgIdx}
                      index={imgIdx}
                      image={img}
                      onUpload={(idx, file) => uploadColorImage(colorIdx, idx, file)}
                      onRemove={(idx) => removeColorImage(colorIdx, idx)}
                      isUploading={uploading === `${colorIdx}-${imgIdx}`}
                    />
                  ))}
                </div>

                {/* Per-colour size & stock */}
                <div className="mt-5 border-t border-ivory-dark pt-4">
                  <p className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-3">
                    Size &amp; Stock for this colour
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {color.sizes.map((s) => {
                      const status = STOCK_STATUS(s.enabled ? s.stock : 0);
                      return (
                        <div
                          key={s.label}
                          className={`flex items-center gap-2 p-3 border transition-all ${
                            s.enabled ? 'border-ebony/20 bg-ivory' : 'border-ivory-dark bg-ivory-dark/30 opacity-60'
                          }`}
                        >
                          <label className="flex items-center gap-1.5 cursor-pointer w-14 flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={s.enabled || false}
                              onChange={() => toggleSize(colorIdx, s.label)}
                              className="accent-gold w-4 h-4"
                            />
                            <span className="text-[13px] font-semibold text-ebony">{s.label}</span>
                          </label>
                          <div className="flex items-center gap-1 flex-1">
                            <button
                              type="button"
                              onClick={() => setStock(colorIdx, s.label, (s.stock || 0) - 1)}
                              disabled={!s.enabled}
                              className="w-7 h-7 border border-ivory-dark flex items-center justify-center hover:border-ebony disabled:opacity-30 transition-colors flex-shrink-0"
                            >
                              <Minus size={11} />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={s.stock || 0}
                              onChange={(e) => setStock(colorIdx, s.label, e.target.value)}
                              disabled={!s.enabled}
                              className="w-14 input-box text-center text-[13px] font-medium py-1 disabled:opacity-40"
                            />
                            <button
                              type="button"
                              onClick={() => setStock(colorIdx, s.label, (s.stock || 0) + 1)}
                              disabled={!s.enabled}
                              className="w-7 h-7 border border-ivory-dark flex items-center justify-center hover:border-ebony disabled:opacity-30 transition-colors flex-shrink-0"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          {s.enabled && (
                            <span className={`text-[9px] tracking-[1px] uppercase px-1.5 py-0.5 font-medium flex-shrink-0 ${status.color}`}>
                              {status.label}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Basic Info ───────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony mb-4 pb-2 border-b border-ivory-dark">
            Product Information
          </h2>
        </div>

        <div>
          <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Product Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required className="input-box w-full" placeholder="e.g. Ivory Draped Midi Dress" />
        </div>
        <div>
          <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">URL Slug (auto-generated)</label>
          <input name="slug" value={form.slug} onChange={handleChange} className="input-box w-full bg-ivory-dark/50 text-ebony-light" readOnly />
        </div>
        <div className="md:col-span-2">
          <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input-box w-full resize-none" placeholder="Describe the product — fabric, fit, occasion..." />
        </div>
        <div>
          <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-box w-full">
            {CATEGORY_GROUPS.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} className="input-box w-full" placeholder="dress, midi, wrap, summer" />
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony mb-4 pb-2 border-b border-ivory-dark">
          Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Price (£ GBP) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ebony-light font-medium">£</span>
              <input
                name="priceGBP"
                type="number"
                step="0.01"
                min="0"
                value={form.priceGBP}
                onChange={handleChange}
                required
                className="input-box w-full pl-8"
                placeholder="0.00"
              />
            </div>
            {ngnPrice && (
              <p className="text-[11px] text-ebony-light mt-1.5">
                ≈ {ngnPrice} NGN <span className="text-[10px]">(at 1800 rate)</span>
              </p>
            )}
          </div>
          <div>
            <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">
              Compare-at Price (£) <span className="text-gold">— shows as strikethrough</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ebony-light font-medium">£</span>
              <input
                name="compareAtGBP"
                type="number"
                step="0.01"
                min="0"
                value={form.compareAtGBP}
                onChange={handleChange}
                className="input-box w-full pl-8"
                placeholder="0.00"
              />
            </div>
            <p className="text-[10px] text-ebony-light mt-1.5">Leave empty if not on sale</p>
          </div>
          {form.priceGBP && form.compareAtGBP && parseFloat(form.compareAtGBP) > parseFloat(form.priceGBP) && (
            <div className="flex items-center">
              <div className="bg-gold/15 border border-gold/30 p-4 w-full">
                <p className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-1">Sale Discount</p>
                <p className="text-2xl font-bold text-gold">
                  {Math.round((1 - parseFloat(form.priceGBP) / parseFloat(form.compareAtGBP)) * 100)}% OFF
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Product Flags ────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony mb-4 pb-2 border-b border-ivory-dark">
          Product Flags
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'isFeatured',   label: 'Featured',     desc: 'Shows on homepage' },
            { name: 'isNewArrival', label: 'New Arrival',  desc: 'Shows "New" badge' },
            { name: 'isSale',       label: 'On Sale',      desc: 'Shows "Sale" badge' },
            { name: 'isArchived',   label: 'Archived',     desc: 'Hidden from shop', danger: true },
          ].map((flag) => (
            <label
              key={flag.name}
              className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                form[flag.name]
                  ? flag.danger ? 'border-red-300 bg-red-50' : 'border-gold bg-gold/10'
                  : 'border-ivory-dark hover:border-ebony/30'
              }`}
            >
              <input
                type="checkbox"
                name={flag.name}
                checked={form[flag.name]}
                onChange={handleChange}
                className="accent-gold mt-0.5"
              />
              <div>
                <p className={`text-[11px] tracking-[1.5px] uppercase font-semibold ${flag.danger ? 'text-red-600' : 'text-ebony'}`}>
                  {flag.label}
                </p>
                <p className="text-[10px] text-ebony-light mt-0.5">{flag.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* ── Submit ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pt-6 border-t border-ivory-dark">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary text-[10px] disabled:opacity-60 flex items-center gap-2 px-10"
        >
          {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><CheckCircle size={14} /> {initialData ? 'Update Product' : 'Create Product'}</>}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="btn-secondary text-[10px]"
        >
          Cancel
        </button>
        {initialData && (
          <p className="text-[11px] text-ebony-light ml-auto">
            Last updated: {new Date(initialData.updatedAt).toLocaleDateString('en-GB')}
          </p>
        )}
      </div>
    </form>
  );
}
