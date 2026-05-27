'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { format } = useCurrency();
  const { addItem } = useCart();
  const { data: session } = useSession();
  const [wishlisted, setWishlisted] = useState(false);
  const [imgIdx, setImgIdx]         = useState(0);

  const images      = product.images?.length ? product.images : [{ url: '/placeholder.jpg' }];
  const totalImages = images.length;
  const defaultSize = product.sizes?.find((s) => s.stock > 0)?.label;

  const prevImage = (e) => {
    e.preventDefault();
    setImgIdx((i) => (i - 1 + totalImages) % totalImages);
  };
  const nextImage = (e) => {
    e.preventDefault();
    setImgIdx((i) => (i + 1) % totalImages);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!session) { toast.error('Sign in to save items'); return; }
    setWishlisted(!wishlisted);
    try {
      await fetch('/api/user/wishlist', {
        method: wishlisted ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });
    } catch { setWishlisted(wishlisted); }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!defaultSize) { toast.error('Out of stock'); return; }
    addItem(product, defaultSize);
  };

  return (
    <article
      className="product-card group relative flex flex-col bg-white"
    >
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden bg-white aspect-[3/4]">
        <Image
          src={images[imgIdx].url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="product-image object-cover object-top transition-opacity duration-300"
          priority={false}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="bg-ebony text-ivory text-[9px] tracking-[2px] px-2.5 py-1 uppercase font-medium">New</span>
          )}
          {product.isSale && (
            <span className="bg-gold text-ebony-dark text-[9px] tracking-[2px] px-2.5 py-1 uppercase font-medium">Sale</span>
          )}
        </div>
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-ivory/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Wishlist"
        >
          <Heart
            size={15}
            className={wishlisted ? 'fill-gold text-gold' : 'text-ebony'}
          />
        </button>
        {/* Directional arrows */}
        {totalImages > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-ivory/80 backdrop-blur-sm text-ebony opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ivory"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-ivory/80 backdrop-blur-sm text-ebony opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ivory"
            >
              <ChevronRight size={14} />
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setImgIdx(i); }}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-200 ${
                    imgIdx === i ? 'bg-ivory w-3' : 'bg-ivory/50 w-1'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        {/* Quick Add */}
        <div className="quick-add absolute bottom-0 left-0 right-0 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-ebony text-ivory py-3 text-[10px] tracking-[2.5px] uppercase font-medium hover:bg-ebony-dark transition-colors"
          >
            {defaultSize ? 'Quick Add' : 'Out of Stock'}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="pt-4 flex-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-[12px] tracking-[1.5px] uppercase font-medium text-ebony hover:text-gold transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[13px] text-ebony font-medium">{format(product.priceGBP)}</span>
          {product.compareAtGBP && (
            <span className="text-[12px] text-ebony-light line-through">{format(product.compareAtGBP)}</span>
          )}
        </div>
        {/* Colour dots */}
        {product.colors?.length > 1 && (
          <div className="flex gap-1.5 mt-2">
            {product.colors.slice(0, 5).map((c, i) => (
              <button
                key={i}
                title={c.name}
                className="w-3.5 h-3.5 rounded-full border border-ebony/20 hover:scale-125 transition-transform"
                style={{ backgroundColor: c.hex || '#ccc' }}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
