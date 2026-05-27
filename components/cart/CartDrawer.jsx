'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, subtotalGBP, totalItems } = useCart();
  const { format } = useCurrency();

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ebony-dark/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-ivory z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-ivory-dark">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-ebony" />
            <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony">
              Your Bag ({totalItems})
            </h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="btn-ghost p-1">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-ebony-light/40" />
              <p className="text-[12px] tracking-[1.5px] uppercase text-ebony-light">Your bag is empty</p>
              <Link href="/shop" onClick={() => setIsOpen(false)} className="btn-secondary text-[10px] py-2.5 px-6">
                Browse Collection
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-4">
                {/* Image */}
                <Link
                  href={`/product/${item.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="relative w-20 h-24 flex-shrink-0 bg-ivory-dark overflow-hidden"
                >
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover object-top" sizes="80px" />
                  )}
                </Link>
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`} onClick={() => setIsOpen(false)}>
                    <h4 className="text-[11px] tracking-[1.5px] uppercase font-medium text-ebony hover:text-gold transition-colors leading-tight">
                      {item.name}
                    </h4>
                  </Link>
                  <p className="text-[11px] text-ebony-light mt-1">Size: {item.size}</p>
                  <p className="text-[13px] font-medium text-ebony mt-1">{format(item.priceGBP)}</p>
                  {/* Qty control */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                      className="w-7 h-7 border border-ivory-dark flex items-center justify-center hover:border-ebony transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-[13px] font-medium w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                      className="w-7 h-7 border border-ivory-dark flex items-center justify-center hover:border-ebony transition-colors"
                      aria-label="Increase"
                    >
                      <Plus size={10} />
                    </button>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="ml-auto text-[10px] tracking-[1px] text-ebony-light hover:text-ebony uppercase transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-ivory-dark space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] tracking-[2px] uppercase text-ebony-light">Subtotal</span>
              <span className="text-[15px] font-medium text-ebony">{format(subtotalGBP)}</span>
            </div>
            <p className="text-[10px] tracking-[0.5px] text-ebony-light">
              Shipping calculated at checkout. Free on orders over £150.
            </p>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full justify-center text-[10px]"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="btn-secondary w-full justify-center text-[10px]"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
