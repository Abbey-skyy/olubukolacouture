'use client';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function CurrencySwitcher({ className = '' }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={`flex items-center gap-0 text-[10px] tracking-[1.5px] font-medium border border-ebony/20 ${className}`}>
      <button
        onClick={() => setCurrency('gbp')}
        className={`px-2.5 py-1.5 transition-colors ${
          currency === 'gbp'
            ? 'bg-gold text-ebony-dark'
            : 'text-ebony-light hover:text-ebony'
        }`}
        aria-label="Switch to British Pounds"
      >
        £ GBP
      </button>
      <button
        onClick={() => setCurrency('ngn')}
        className={`px-2.5 py-1.5 transition-colors ${
          currency === 'ngn'
            ? 'bg-gold text-ebony-dark'
            : 'text-ebony-light hover:text-ebony'
        }`}
        aria-label="Switch to Nigerian Naira"
      >
        ₦ NGN
      </button>
    </div>
  );
}
