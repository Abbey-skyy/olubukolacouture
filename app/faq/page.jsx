'use client';
import { useState } from 'react';
import HelpTabs from '@/components/help/HelpTabs';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    category: 'Sizing & Fit',
    items: [
      {
        q: 'What sizes do you stock?',
        a: 'We stock UK sizes 6 to 24. Our pieces are designed with an inclusive range in mind. Use our Sizing Guide for detailed measurements and conversion charts.',
      },
      {
        q: 'How do I know which size to order?',
        a: 'We recommend taking your bust, waist, and hip measurements and comparing them against our UK size chart on the Sizing Guide page. If you fall between two sizes, size up for a more relaxed fit or size down for a fitted look.',
      },
      {
        q: 'Do your clothes come up true to size?',
        a: "Our garments are cut to standard UK sizing. Individual product pages may include fit notes (e.g. \"slim fit – size up\"). If you're unsure, our team is happy to advise.",
      },
    ],
  },
  {
    category: 'Orders & Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Visa, Mastercard, and American Express. We also accept payment via Paystack for customers in Nigeria and other African markets.',
      },
      {
        q: 'Can I amend or cancel my order after placing it?',
        a: 'We process orders quickly, but if you contact us within one hour of placing your order we will do our best to make changes. After dispatch, orders cannot be amended – please use our returns process instead.',
      },
      {
        q: 'Will I receive a confirmation email?',
        a: 'Yes. A confirmation email is sent immediately after your order is placed, followed by a dispatch notification with your tracking details once your parcel is on its way.',
      },
      {
        q: 'Is my payment secure?',
        a: 'Absolutely. All transactions are processed through encrypted, PCI-DSS-compliant payment gateways. We never store your card details.',
      },
    ],
  },
  {
    category: 'Delivery',
    items: [
      {
        q: 'How long will my order take to arrive?',
        a: 'Standard UK delivery takes 3–5 business days. Express next-day delivery is available for orders placed before 1pm Monday to Friday. International orders typically take 7–14 business days.',
      },
      {
        q: 'Is delivery free?',
        a: 'Standard UK delivery is free on all orders over £150. For orders below £150, a flat rate of £4.99 applies. Express delivery is £9.99.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes. Once your order is dispatched you will receive an email with a tracking link. You can also view your order status at any time in the Orders section of your account.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship worldwide. International delivery starts from £14.99 and typically takes 7–14 business days. Please note that import duties and customs taxes may apply and are the customer\'s responsibility.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your returns policy?',
        a: 'You may return any full-price item within 28 days of delivery for a full refund or exchange, provided it is unworn, unwashed, and all original tags are attached.',
      },
      {
        q: 'Are returns free?',
        a: 'Yes – UK returns are free of charge using our prepaid Royal Mail returns label. International returns are the customer\'s responsibility.',
      },
      {
        q: 'Can I return sale items?',
        a: 'Items discounted in our seasonal sale can be returned for a credit note only. Items marked Final Sale are non-returnable.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Once we receive and inspect your returned item, refunds are processed within 5–10 business days and returned to your original payment method.',
      },
    ],
  },
  {
    category: 'Products & Care',
    items: [
      {
        q: 'How do I care for my garments?',
        a: 'Care instructions are printed on the label inside each garment and are also listed on each product page. We recommend following these carefully to preserve the quality and longevity of your pieces.',
      },
      {
        q: 'Are your pieces ethically made?',
        a: 'Yes. We work only with suppliers who share our commitment to fair working conditions and sustainable practices. Ethical production is at the heart of everything we do.',
      },
      {
        q: 'Do you offer gift wrapping?',
        a: 'Yes. You can add complimentary gift wrapping at checkout, along with a personalised message card.',
      },
    ],
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ivory-dark">
      <button
        className="flex items-center justify-between w-full py-5 text-left text-[13px] text-ebony font-medium gap-4"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        {open ? <ChevronUp size={14} className="flex-shrink-0 text-gold" /> : <ChevronDown size={14} className="flex-shrink-0 text-ebony-light" />}
      </button>
      {open && (
        <p className="pb-5 text-[13px] text-ebony-light leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="bg-ivory min-h-screen">
      {/* Page header */}
      <div className="border-b border-ivory-dark py-12 px-6 lg:px-12 text-center">
        <div className="max-w-8xl mx-auto">
          <span className="text-[10px] tracking-[3px] uppercase text-gold font-semibold">Help</span>
          <h1 className="font-serif text-3xl lg:text-4xl mt-2 text-ebony">Frequently Asked Questions</h1>
          <p className="mt-3 text-[13px] text-ebony-light leading-relaxed max-w-xl mx-auto">
            Can't find what you're looking for? Our team is always happy to help —{' '}
            <Link href="/contact" className="underline underline-offset-2 hover:text-ebony transition-colors">
              get in touch
            </Link>
            .
          </p>
        </div>
      </div>

      <HelpTabs />

      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-14 space-y-12">
        {FAQS.map((section) => (
          <section key={section.category}>
            <h2 className="text-[10px] tracking-[3px] uppercase font-semibold text-gold mb-4">
              {section.category}
            </h2>
            <div>
              {section.items.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
