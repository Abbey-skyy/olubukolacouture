import HelpTabs from '@/components/help/HelpTabs';
import { Truck, RotateCcw, Clock, PackageCheck } from 'lucide-react';

export const metadata = {
  title: 'Delivery & Returns',
  description: 'Delivery options and returns policy for Olubukola Couture UK orders.',
};

const DELIVERY_OPTIONS = [
  {
    icon: Truck,
    title: 'Standard UK Delivery',
    time: '3–5 Business Days',
    price: '£4.99',
    note: 'Free on orders over £150',
  },
  {
    icon: Clock,
    title: 'Express UK Delivery',
    time: 'Next Business Day',
    price: '£9.99',
    note: 'Order before 1pm Mon–Fri',
  },
  {
    icon: PackageCheck,
    title: 'International Delivery',
    time: '7–14 Business Days',
    price: 'From £14.99',
    note: 'EU, US, and worldwide',
  },
];

const RETURN_STEPS = [
  'Log in to your account and navigate to Orders.',
  'Select the item(s) you wish to return and choose a reason.',
  'Print the prepaid Royal Mail returns label from your confirmation email.',
  'Drop your parcel at any Royal Mail Post Office or collection point.',
  'Once we receive and inspect the item, your refund will be processed within 5–10 business days.',
];

export default function DeliveryReturnsPage() {
  return (
    <div className="bg-ivory min-h-screen">
      {/* Page header */}
      <div className="border-b border-ivory-dark py-12 px-6 lg:px-12 text-center">
        <div className="max-w-8xl mx-auto">
          <span className="text-[10px] tracking-[3px] uppercase text-gold font-semibold">Help</span>
          <h1 className="font-serif text-3xl lg:text-4xl mt-2 text-ebony">Delivery & Returns</h1>
          <p className="mt-3 text-[13px] text-ebony-light leading-relaxed max-w-xl mx-auto">
            We want you to love everything you order. Here's everything you need to know
            about how we deliver and our hassle-free returns policy.
          </p>
        </div>
      </div>

      <HelpTabs />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-14 space-y-16">
        {/* Delivery */}
        <section>
          <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony mb-8">
            Delivery Options
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {DELIVERY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <div key={opt.title} className="border border-ivory-dark p-6 flex flex-col gap-4">
                  <Icon size={20} className="text-gold" />
                  <div>
                    <p className="text-[11px] tracking-[1.5px] uppercase font-semibold text-ebony mb-1">
                      {opt.title}
                    </p>
                    <p className="text-[13px] text-ebony font-medium">{opt.price}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-ebony-light">{opt.time}</p>
                    <p className="text-[11px] text-gold mt-1">{opt.note}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 border border-ivory-dark p-6 bg-white">
            <h3 className="text-[10px] tracking-[2px] uppercase font-semibold text-ebony mb-3">
              Important Delivery Information
            </h3>
            <ul className="space-y-2 text-[13px] text-ebony-light leading-relaxed">
              <li>Orders placed before 1pm on business days are dispatched the same day.</li>
              <li>Business days are Monday to Friday, excluding UK public holidays.</li>
              <li>A signature may be required upon delivery. If you're not in, the carrier will leave a card.</li>
              <li>We ship from Sittingbourne, Kent. Delivery times are estimates only.</li>
              <li>For international orders, customs duties and import taxes may apply and are the customer's responsibility.</li>
            </ul>
          </div>
        </section>

        {/* Returns */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <RotateCcw size={16} className="text-gold" />
            <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony">
              Returns Policy
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 mb-10">
            <div className="border border-ivory-dark p-6">
              <p className="text-[10px] tracking-[2px] uppercase font-semibold text-gold mb-3">
                Return Window
              </p>
              <p className="font-serif text-3xl text-ebony mb-2">28 Days</p>
              <p className="text-[13px] text-ebony-light leading-relaxed">
                You have 28 days from the date of delivery to return an item for a full refund or exchange.
              </p>
            </div>
            <div className="border border-ivory-dark p-6">
              <p className="text-[10px] tracking-[2px] uppercase font-semibold text-gold mb-3">
                UK Returns
              </p>
              <p className="font-serif text-3xl text-ebony mb-2">Free</p>
              <p className="text-[13px] text-ebony-light leading-relaxed">
                All UK returns are free of charge via our prepaid Royal Mail returns label.
              </p>
            </div>
          </div>

          <h3 className="text-[10px] tracking-[2px] uppercase font-semibold text-ebony mb-4">
            How to Return
          </h3>
          <ol className="space-y-4">
            {RETURN_STEPS.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full border border-ebony flex items-center justify-center text-[11px] font-semibold text-ebony">
                  {i + 1}
                </span>
                <p className="text-[13px] text-ebony-light leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 border border-ivory-dark p-6 bg-white">
            <h3 className="text-[10px] tracking-[2px] uppercase font-semibold text-ebony mb-3">
              Return Conditions
            </h3>
            <ul className="space-y-2 text-[13px] text-ebony-light leading-relaxed">
              <li>Items must be unworn, unwashed, and in their original condition.</li>
              <li>All original tags must be attached and intact.</li>
              <li>Items must be returned in their original packaging where possible.</li>
              <li>Sale items marked as <strong className="text-ebony">Final Sale</strong> are not eligible for return or exchange.</li>
              <li>Earrings and pierced jewellery cannot be returned for hygiene reasons.</li>
              <li>Refunds are issued to the original payment method. Please allow 5–10 business days for funds to clear.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
