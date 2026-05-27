'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Image from 'next/image';
import { Loader2, Lock, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function StripeCheckoutForm({ clientSecret, onSuccess, onError }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout/success` },
    });

    if (error) {
      onError(error.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: 'tabs' }} />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-primary w-full text-[10px] disabled:opacity-60"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Lock size={13} /> Pay Now
          </span>
        )}
      </button>
    </form>
  );
}

function PaystackButton({ amount, email, currency, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  const handlePaystack = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, email, currency }),
      });
      const data = await res.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        onError('Failed to initialise Paystack. Please try again.');
      }
    } catch {
      onError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePaystack}
      disabled={loading}
      className="btn-primary w-full text-[10px] disabled:opacity-60"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 size={14} className="animate-spin" /> Processing...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <Lock size={13} /> Pay with Paystack ₦
        </span>
      )}
    </button>
  );
}

export default function CheckoutPage() {
  const { items, subtotalGBP, clearCart } = useCart();
  const { currency, format, rate }        = useCurrency();
  const { data: session }                 = useSession();

  const [clientSecret, setClientSecret] = useState('');
  const [error,        setError]        = useState('');
  const [step,         setStep]         = useState(1); // 1=shipping, 2=payment
  const [shipping, setShipping] = useState({
    fullName: session?.user?.name || '',
    line1: '', line2: '', city: '', postcode: '', country: 'GB', phone: '',
  });

  const shippingGBP = subtotalGBP >= 15000 ? 0 : 499; // free over £150
  const totalGBP    = subtotalGBP + shippingGBP;

  useEffect(() => {
    if (step !== 2 || !session || currency !== 'gbp') return;
    fetch('/api/payment/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount:   totalGBP,
        currency: 'gbp',
        email:    session.user.email,
      }),
    })
      .then((r) => r.json())
      .then((d) => setClientSecret(d.clientSecret));
  }, [step, session, currency, totalGBP]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <p className="text-[13px] tracking-[2px] uppercase text-ebony-light mb-4">Your bag is empty</p>
          <a href="/shop" className="btn-primary text-[10px]">Shop Now</a>
        </div>
      </div>
    );
  }

  const stripeAppearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#D4AF37',
      colorBackground: '#FFFFF0',
      colorText: '#555D50',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '5px',
      borderRadius: '0px',
    },
  };

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-serif text-3xl tracking-[5px] text-ebony">OLUBUKOLA</span>
          <span className="block text-[9px] tracking-[5px] text-gold mt-0.5">COUTURE</span>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-8 mb-12">
          {['Shipping', 'Payment'].map((s, i) => (
            <button
              key={s}
              onClick={() => i + 1 < step && setStep(i + 1)}
              className={`flex items-center gap-2 text-[11px] tracking-[2px] uppercase ${
                step === i + 1 ? 'text-ebony font-semibold' : step > i + 1 ? 'text-gold' : 'text-ebony-light'
              }`}
            >
              <span className={`w-6 h-6 rounded-full border text-[10px] flex items-center justify-center ${
                step > i + 1 ? 'bg-gold border-gold text-ebony-dark' : step === i + 1 ? 'border-ebony' : 'border-ebony-light/40'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </span>
              {s}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-12">
          {/* Left */}
          <div>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-ebony tracking-[2px]">Shipping Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Full Name</label>
                    <input value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} className="input-box" required />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Address Line 1</label>
                    <input value={shipping.line1} onChange={(e) => setShipping({ ...shipping, line1: e.target.value })} className="input-box" required />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Address Line 2</label>
                    <input value={shipping.line2} onChange={(e) => setShipping({ ...shipping, line2: e.target.value })} className="input-box" />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">City</label>
                    <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="input-box" required />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Postcode</label>
                    <input value={shipping.postcode} onChange={(e) => setShipping({ ...shipping, postcode: e.target.value })} className="input-box" required />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Country</label>
                    <select value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} className="input-box">
                      <option value="GB">United Kingdom</option>
                      <option value="NG">Nigeria</option>
                      <option value="US">United States</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Phone</label>
                    <input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="input-box" />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!shipping.fullName || !shipping.line1 || !shipping.city || !shipping.postcode}
                  className="btn-primary text-[10px] disabled:opacity-60"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-serif text-2xl text-ebony tracking-[2px] mb-6">Payment</h2>

                {/* Currency notice */}
                <div className="bg-gold/10 border border-gold/30 p-4 mb-6">
                  <p className="text-[12px] text-ebony tracking-[0.5px]">
                    Paying in <strong>{currency === 'gbp' ? '£ GBP' : '₦ NGN'}</strong> —{' '}
                    <span className="text-ebony-light">switch currency in the header to change.</span>
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-3 mb-6">{error}</div>
                )}

                {currency === 'gbp' ? (
                  clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
                      <StripeCheckoutForm
                        clientSecret={clientSecret}
                        onSuccess={() => { clearCart(); window.location.href = '/checkout/success'; }}
                        onError={setError}
                      />
                    </Elements>
                  ) : (
                    <div className="flex justify-center py-12">
                      <Loader2 size={24} className="animate-spin text-gold" />
                    </div>
                  )
                ) : (
                  <PaystackButton
                    amount={totalGBP}
                    email={session?.user?.email}
                    currency="ngn"
                    rate={rate}
                    onSuccess={() => { clearCart(); window.location.href = '/checkout/success'; }}
                    onError={setError}
                  />
                )}

                <p className="flex items-center justify-center gap-2 text-[10px] text-ebony-light tracking-[1px] mt-6">
                  <Lock size={12} /> Secured by {currency === 'gbp' ? 'Stripe' : 'Paystack'}
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-ivory-dark p-8 h-fit">
            <h3 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                  <div className="relative w-14 h-18 flex-shrink-0 bg-ivory overflow-hidden">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />}
                    <span className="absolute -top-1 -right-1 bg-ebony text-ivory text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{item.qty}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] tracking-[1px] text-ebony font-medium leading-tight">{item.name}</p>
                    <p className="text-[10px] text-ebony-light mt-0.5">Size: {item.size}</p>
                  </div>
                  <span className="text-[12px] text-ebony font-medium flex-shrink-0">{format(item.priceGBP * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-ivory pt-4 space-y-2">
              <div className="flex justify-between text-[12px] text-ebony-light">
                <span>Subtotal</span><span>{format(subtotalGBP)}</span>
              </div>
              <div className="flex justify-between text-[12px] text-ebony-light">
                <span>Shipping</span>
                <span>{shippingGBP === 0 ? 'FREE' : format(shippingGBP)}</span>
              </div>
              <div className="flex justify-between text-[14px] font-semibold text-ebony border-t border-ivory pt-2 mt-2">
                <span>Total</span><span>{format(totalGBP)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
