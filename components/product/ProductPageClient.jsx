'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Ruler } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useSession } from 'next-auth/react';
import ProductCard from '@/components/shop/ProductCard';
import toast from 'react-hot-toast';

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ivory-dark">
      <button
        className="flex items-center justify-between w-full py-5 text-[11px] tracking-[2px] uppercase font-semibold text-ebony"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="pb-5 text-[13px] text-ebony-light leading-relaxed">{children}</div>}
    </div>
  );
}

export default function ProductPageClient({ product, related }) {
  const { addItem } = useCart();
  const { format }  = useCurrency();
  const { data: session } = useSession();

  const [selectedSize,  setSelectedSize]  = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted,    setWishlisted]    = useState(false);
  const [adding,        setAdding]        = useState(false);

  // Resolve which image array to show — prefer the selected colour's images
  const activeImages = (() => {
    const colorImgs = product.colors?.[selectedColor]?.images;
    if (colorImgs?.length) return colorImgs;
    return product.images || [];
  })();

  const handleColorSelect = (idx) => {
    setSelectedColor(idx);
    setSelectedImage(0);
    setSelectedSize(null);
  };

  // Prefer per-colour sizes; fall back to top-level sizes for legacy products
  const activeSizes = (() => {
    const colorSizes = product.colors?.[selectedColor]?.sizes;
    if (colorSizes?.length) return colorSizes;
    return product.sizes || [];
  })();

  const inStock = activeSizes.some((s) => s.stock > 0);
  const selectedSizeStock = activeSizes.find((s) => s.label === selectedSize)?.stock ?? 0;

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('Please select a size'); return; }
    if (selectedSizeStock === 0) { toast.error('This size is out of stock'); return; }
    setAdding(true);
    addItem(product, selectedSize);
    setTimeout(() => setAdding(false), 800);
  };

  const handleWishlist = async () => {
    if (!session) { toast.error('Sign in to save items'); return; }
    setWishlisted(!wishlisted);
    await fetch('/api/user/wishlist', {
      method: wishlisted ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product._id }),
    });
  };

  return (
    <div className="max-w-8xl mx-auto px-6 lg:px-12 py-12">
      {/* Breadcrumb */}
      <nav className="text-[10px] tracking-[1.5px] uppercase text-ebony-light mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-ebony transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ebony transition-colors">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-ebony transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ebony">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div className="flex gap-4">
          {/* Thumbnail strip */}
          {activeImages.length > 1 && (
            <div className="flex flex-col gap-2 w-16 flex-shrink-0">
              {activeImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-[3/4] overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-ebony' : 'border-transparent'
                  }`}
                >
                  <Image src={img.url} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
          {/* Main image with slider arrows */}
          <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-ivory-dark group">
            {activeImages[selectedImage] && (
              <Image
                src={activeImages[selectedImage].url}
                alt={product.name}
                fill
                priority
                className="object-cover object-top transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.isNewArrival && <span className="bg-ebony text-ivory text-[9px] tracking-[2px] px-3 py-1.5 uppercase font-medium">New</span>}
              {product.isSale && <span className="bg-gold text-ebony-dark text-[9px] tracking-[2px] px-3 py-1.5 uppercase font-medium">Sale</span>}
            </div>
            {/* Directional arrows */}
            {activeImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((i) => (i - 1 + activeImages.length) % activeImages.length)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-ivory/80 backdrop-blur-sm text-ebony opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ivory"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setSelectedImage((i) => (i + 1) % activeImages.length)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-ivory/80 backdrop-blur-sm text-ebony opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ivory"
                >
                  <ChevronRight size={18} />
                </button>
                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                  {activeImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        selectedImage === i ? 'bg-ivory w-4' : 'bg-ivory/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:pt-4">
          {/* Category */}
          <Link href={`/shop?category=${product.category}`} className="text-[10px] tracking-[3px] uppercase text-gold hover:text-gold-dark transition-colors">
            {product.category}
          </Link>

          <h1 className="font-serif text-3xl lg:text-4xl text-ebony tracking-[2px] mt-2 mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xl font-medium text-ebony">{format(product.priceGBP)}</span>
            {product.compareAtGBP && (
              <span className="text-[15px] text-ebony-light line-through">{format(product.compareAtGBP)}</span>
            )}
            {product.compareAtGBP && (
              <span className="text-[10px] tracking-[1.5px] bg-gold/15 text-gold px-2 py-1 uppercase font-medium">
                Save {Math.round((1 - product.priceGBP / product.compareAtGBP) * 100)}%
              </span>
            )}
          </div>

          {/* Colour options */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-3">
                Colour{product.colors[selectedColor]?.name && (
                  <span className="text-ebony font-medium"> — {product.colors[selectedColor].name}</span>
                )}
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleColorSelect(i)}
                    title={c.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all ring-1 ring-ebony/20 ${
                      selectedColor === i
                        ? 'border-ebony scale-110'
                        : 'border-transparent hover:border-ebony/50'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] tracking-[2px] uppercase text-ebony-light">
                Size {selectedSize && <span className="text-ebony font-medium">— {selectedSize}</span>}
              </p>
              <Link href="/sizing" className="flex items-center gap-1 text-[10px] tracking-[1.5px] uppercase text-ebony-light hover:text-gold transition-colors">
                <Ruler size={12} /> Size Guide
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeSizes.map((s) => (
                <button
                  key={s.label}
                  onClick={() => s.stock > 0 && setSelectedSize(s.label)}
                  disabled={s.stock === 0}
                  className={`w-12 h-12 text-[12px] tracking-[1px] border transition-all relative ${
                    selectedSize === s.label
                      ? 'bg-ebony text-ivory border-ebony'
                      : s.stock === 0
                      ? 'border-ivory-dark text-ebony-light/40 cursor-not-allowed line-through'
                      : 'border-ivory-dark text-ebony hover:border-ebony'
                  }`}
                >
                  {s.label}
                  {s.stock > 0 && s.stock <= 3 && selectedSize !== s.label && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full" title="Low stock" />
                  )}
                </button>
              ))}
            </div>
            {selectedSize && selectedSizeStock <= 3 && selectedSizeStock > 0 && (
              <p className="text-[11px] text-gold mt-2">Only {selectedSizeStock} left in this size</p>
            )}
          </div>

          {/* Add to cart */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className="btn-primary flex-1 text-[10px] disabled:opacity-60"
            >
              {adding ? 'ADDED ✓' : !inStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
            </button>
            <button
              onClick={handleWishlist}
              className={`w-14 h-14 border flex items-center justify-center transition-all ${
                wishlisted ? 'bg-gold/10 border-gold text-gold' : 'border-ivory-dark text-ebony hover:border-ebony'
              }`}
              aria-label="Wishlist"
            >
              <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Delivery note */}
          <p className="text-[11px] text-ebony-light tracking-[0.5px] mb-8">
            Free delivery on orders over £150 · Express next-day available
          </p>

          {/* Accordions */}
          <div>
            <AccordionItem title="Product Details">
              <p>{product.description}</p>
            </AccordionItem>
            <AccordionItem title="Composition & Care">
              <p>Please refer to the care label. We recommend dry cleaning or gentle hand wash for delicate fabrics.</p>
            </AccordionItem>
            <AccordionItem title="Delivery & Returns">
              <p>Standard delivery 2–4 working days. Express next-day available. Free returns within 30 days.</p>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-3xl text-ebony tracking-[2px] mb-10">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
