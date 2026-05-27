'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { formatPrice } from '@/lib/currency';

const STORAGE_KEY  = 'oc_currency';
const DEFAULT_RATE = 1800;

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children, initialRate = DEFAULT_RATE }) {
  const [currency, setCurrencyState] = useState('gbp');
  const [rate, setRate] = useState(initialRate);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'gbp' || saved === 'ngn') setCurrencyState(saved);
  }, []);

  const setCurrency = useCallback((next) => {
    if (next !== 'gbp' && next !== 'ngn') return;
    setCurrencyState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(() => {
    setCurrency(currency === 'gbp' ? 'ngn' : 'gbp');
  }, [currency, setCurrency]);

  /** Format a pence value to display string */
  const format = useCallback(
    (pence) => formatPrice(pence, currency, rate),
    [currency, rate]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggle, rate, setRate, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
