import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={40} className="text-gold" />
        </div>
        <h1 className="font-serif text-4xl text-ebony tracking-[3px] mb-4">Order Confirmed</h1>
        <p className="text-[13px] text-ebony-light leading-relaxed mb-10">
          Thank you for your purchase. We've received your order and will send you a
          confirmation email with tracking details once your parcel is dispatched.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/profile?tab=orders" className="btn-primary text-[10px]">View My Orders</Link>
          <Link href="/shop" className="btn-secondary text-[10px]">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
