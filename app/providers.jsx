'use client';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '../contexts/CartContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { CookieConsentProvider } from '../contexts/CookieConsentContext';

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <CookieConsentProvider>
        <CurrencyProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CurrencyProvider>
      </CookieConsentProvider>
    </SessionProvider>
  );
}