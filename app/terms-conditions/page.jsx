import LegalTabs from '@/components/legal/LegalTabs';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions governing use of the Olubukola Couture website and purchase of our products.',
};

const SECTIONS = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content: (
      <p>
        These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of the Olubukola Couture website
        at <strong className="text-ebony">olubukola-couture.com</strong> and your purchase of products from us.
        Please read them carefully before using our website or placing an order. By accessing our website
        or purchasing our products, you agree to be bound by these Terms. If you do not agree, please
        do not use our website.
      </p>
    ),
  },
  {
    id: 'about-us',
    title: '2. About Us',
    content: (
      <>
        <p>
          Olubukola Couture Ltd is a company registered in England and Wales. Our registered address is:
        </p>
        <address className="not-italic mt-4 space-y-1">
          <p className="font-medium text-ebony">Olubukola Couture Ltd</p>
          <p>65 Periwinkle Close, Sittingbourne, Kent, ME10 2JU, United Kingdom</p>
          <p className="mt-2">
            Email:{' '}
            <a href="mailto:olubukolacoutore@writeme.com" className="underline underline-offset-2 hover:text-ebony transition-colors">
              olubukolacoutore@writeme.com
            </a>
          </p>
          <p>Tel: <a href="tel:+44789364377" className="underline underline-offset-2 hover:text-ebony transition-colors">+44 789 364 377</a></p>
        </address>
      </>
    ),
  },
  {
    id: 'use-of-site',
    title: '3. Use of Our Website',
    content: (
      <>
        <p>You agree that you will not:</p>
        <ul className="mt-3 space-y-2">
          {[
            'Use the website in any way that is unlawful, fraudulent, or harmful.',
            'Use the website to copy, store, or transmit unsolicited commercial communications (spam).',
            'Conduct any systematic or automated data collection from the website without our written consent.',
            'Attempt to gain unauthorised access to any part of our website, systems, or networks.',
            'Transmit any malicious or technologically harmful material such as viruses or Trojan horses.',
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-gold mt-0.5">–</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          We reserve the right to suspend or terminate your access to our website at any time if you
          breach these Terms.
        </p>
      </>
    ),
  },
  {
    id: 'your-account',
    title: '4. Your Account',
    content: (
      <>
        <p>
          When you create an account, you are responsible for maintaining the confidentiality of your
          login credentials and for all activities that occur under your account. You must notify us
          immediately at{' '}
          <a href="mailto:olubukolacoutore@writeme.com" className="underline underline-offset-2 hover:text-ebony transition-colors">
            olubukolacoutore@writeme.com
          </a>{' '}
          if you suspect any unauthorised use of your account.
        </p>
        <p className="mt-3">
          You must provide accurate and complete information when creating your account and keep it
          up to date. We may suspend or close accounts that contain inaccurate information.
        </p>
      </>
    ),
  },
  {
    id: 'products-pricing',
    title: '5. Products and Pricing',
    content: (
      <>
        <p>
          All product descriptions and prices are displayed in pounds sterling (GBP) unless you have
          selected an alternative display currency. Prices include VAT where applicable.
        </p>
        <p className="mt-3">
          We take care to display product images accurately, but colours may vary slightly depending
          on your device&rsquo;s screen settings. We reserve the right to withdraw any product from
          sale at any time without notice.
        </p>
        <p className="mt-3">
          In the event of a pricing error, we are not obliged to supply goods at the incorrect price.
          We will notify you of the error and give you the option to proceed at the correct price or
          cancel your order.
        </p>
      </>
    ),
  },
  {
    id: 'orders-contract',
    title: '6. Orders and Formation of Contract',
    content: (
      <>
        <p>
          Placing an order constitutes an offer to purchase products subject to these Terms.
          Your order is confirmed when you receive a dispatch notification email from us — this is
          when a legally binding contract is formed between you and Olubukola Couture Ltd.
        </p>
        <p className="mt-3">
          An order confirmation email is sent immediately after checkout, but this does not constitute
          acceptance of your order. We reserve the right to refuse or cancel any order at our discretion,
          for example due to stock unavailability, payment failure, or suspected fraud.
        </p>
        <p className="mt-3">
          You have the right to cancel your order within 14 days of receiving your goods under the
          Consumer Contracts Regulations 2013, without giving a reason.
        </p>
      </>
    ),
  },
  {
    id: 'payment',
    title: '7. Payment',
    content: (
      <>
        <p>
          We accept Visa, Mastercard, American Express, and Paystack. Payment is taken at the time
          of order. All transactions are processed through PCI-DSS-compliant payment gateways.
          We do not store your card details.
        </p>
        <p className="mt-3">
          If payment is declined, your order will not be processed. For assistance, please contact
          your bank or our customer service team.
        </p>
      </>
    ),
  },
  {
    id: 'delivery',
    title: '8. Delivery',
    content: (
      <p>
        Delivery times and charges are set out on our{' '}
        <Link href="/delivery" className="underline underline-offset-2 hover:text-ebony transition-colors">
          Delivery & Returns
        </Link>{' '}
        page. While we make every effort to deliver within the estimated timeframe, we cannot
        guarantee delivery dates. We are not liable for delays caused by circumstances beyond our
        reasonable control, including postal strikes or severe weather.
      </p>
    ),
  },
  {
    id: 'returns-refunds',
    title: '9. Returns and Refunds',
    content: (
      <p>
        Our returns and refund policy is set out in full on our{' '}
        <Link href="/delivery" className="underline underline-offset-2 hover:text-ebony transition-colors">
          Delivery & Returns
        </Link>{' '}
        page. Your statutory rights as a UK consumer are not affected by our returns policy,
        including your rights under the Consumer Rights Act 2015 (goods must be of satisfactory
        quality, fit for purpose, and as described) and the Consumer Contracts Regulations 2013
        (14-day cancellation right for distance sales).
      </p>
    ),
  },
  {
    id: 'intellectual-property',
    title: '10. Intellectual Property',
    content: (
      <p>
        All content on this website — including text, images, graphics, logos, and software — is
        owned by or licensed to Olubukola Couture Ltd and is protected by UK and international
        intellectual property laws. You may not copy, reproduce, distribute, or create derivative
        works from any content on this website without our prior written consent.
      </p>
    ),
  },
  {
    id: 'liability',
    title: '11. Limitation of Liability',
    content: (
      <>
        <p>
          To the fullest extent permitted by applicable law, Olubukola Couture Ltd shall not be
          liable for any indirect, incidental, special, consequential, or punitive losses arising
          from your use of our website or products.
        </p>
        <p className="mt-3">
          Our total liability to you in respect of any claim arising from a purchase shall not
          exceed the price paid for the relevant product.
        </p>
        <p className="mt-3">
          Nothing in these Terms excludes or limits our liability for death or personal injury
          caused by our negligence, fraud or fraudulent misrepresentation, or any other liability
          that cannot be excluded or limited under English law.
        </p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: '12. Privacy',
    content: (
      <p>
        Your use of our website is also governed by our{' '}
        <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-ebony transition-colors">
          Privacy Policy
        </Link>
        , which is incorporated into these Terms by reference.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: '13. Governing Law and Disputes',
    content: (
      <>
        <p>
          These Terms and any disputes arising from them shall be governed by and construed in
          accordance with the laws of England and Wales. The courts of England and Wales shall
          have exclusive jurisdiction to settle any dispute or claim arising out of or in connection
          with these Terms.
        </p>
        <p className="mt-3">
          If you are a UK consumer, you also have the right to use the Online Dispute Resolution
          (ODR) platform provided by the European Commission (where applicable) or the UK&rsquo;s
          Alternative Dispute Resolution (ADR) schemes.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: '14. Changes to These Terms',
    content: (
      <p>
        We may update these Terms from time to time. The updated version will be posted on this page
        with a revised date. Continued use of our website after changes are posted constitutes your
        acceptance of the updated Terms.
      </p>
    ),
  },
];

export default function TermsConditionsPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <div className="border-b border-ivory-dark py-12 px-6 lg:px-12 text-center">
        <div className="max-w-8xl mx-auto">
          <span className="text-[10px] tracking-[3px] uppercase text-gold font-semibold">Legal</span>
          <h1 className="font-serif text-3xl lg:text-4xl mt-2 text-ebony">Terms & Conditions</h1>
          <p className="mt-3 text-[13px] text-ebony-light">
            Last updated: 18 April 2026 &nbsp;·&nbsp; Governed by the laws of England and Wales
          </p>
        </div>
      </div>

      <LegalTabs />

      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-14">
        <p className="text-[13px] text-ebony-light leading-relaxed mb-10 border-l-2 border-gold pl-4">
          Please read these Terms carefully. By using our website or placing an order, you confirm
          that you have read, understood, and agree to be bound by these Terms and Conditions.
        </p>

        {/* In-page navigation */}
        <nav className="mb-12 border border-ivory-dark p-6 bg-white">
          <p className="text-[10px] tracking-[2px] uppercase font-semibold text-ebony mb-4">Contents</p>
          <ol className="space-y-1.5">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-[12px] text-ebony-light hover:text-ebony transition-colors underline-offset-2 hover:underline"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12 text-[13px] text-ebony-light leading-relaxed">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id}>
              <h2 className="text-[11px] tracking-[2px] uppercase font-semibold text-ebony mb-4">
                {s.title}
              </h2>
              {s.content}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
