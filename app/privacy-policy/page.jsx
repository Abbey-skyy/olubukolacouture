import LegalTabs from '@/components/legal/LegalTabs';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Olubukola Couture collects, uses, and protects your personal data under UK GDPR.',
};

const SECTIONS = [
  {
    id: 'who-we-are',
    title: '1. Who We Are',
    content: (
      <>
        <p>
          Olubukola Couture Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is the data controller responsible for
          your personal data. We are registered in England and Wales.
        </p>
        <address className="not-italic mt-4 space-y-1">
          <p className="font-medium text-ebony">Olubukola Couture Ltd</p>
          <p>65 Periwinkle Close</p>
          <p>Sittingbourne, Kent, ME10 2JU</p>
          <p>United Kingdom</p>
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
    id: 'what-we-collect',
    title: '2. What Personal Data We Collect',
    content: (
      <>
        <p>Depending on how you interact with our website, we may collect:</p>
        <ul className="mt-3 space-y-2 list-none">
          {[
            ['Identity data', 'first name, last name, username or similar identifier.'],
            ['Contact data', 'billing address, delivery address, email address, and telephone number.'],
            ['Financial data', 'payment card details (processed securely via Stripe or Paystack — we do not store card numbers).'],
            ['Transaction data', 'details of products you have purchased from us and payments made.'],
            ['Technical data', 'IP address, browser type and version, time zone setting, browser plug-in types, operating system and platform.'],
            ['Profile data', 'your username and password, purchases and order history, wishlist items, your interests, preferences, and feedback.'],
            ['Usage data', 'information about how you use our website and services.'],
            ['Marketing data', 'your preferences in receiving marketing from us and your communication preferences.'],
          ].map(([label, desc]) => (
            <li key={label} className="flex gap-2">
              <span className="text-gold mt-0.5">–</span>
              <span><strong className="text-ebony font-semibold">{label}:</strong> {desc}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          We do not collect any Special Category data (such as data about your race, religion, health, or sexual orientation).
        </p>
      </>
    ),
  },
  {
    id: 'how-we-collect',
    title: '3. How We Collect Your Data',
    content: (
      <ul className="space-y-2">
        {[
          'Directly from you when you create an account, place an order, subscribe to our newsletter, or contact us.',
          'Automatically via cookies, server logs, and similar technologies when you browse our website.',
          'From third parties such as our payment processors (Stripe, Paystack) and analytics providers.',
        ].map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-gold mt-0.5">–</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'lawful-basis',
    title: '4. Lawful Basis for Processing',
    content: (
      <>
        <p>Under UK GDPR we must have a lawful basis for processing your personal data. We rely on the following:</p>
        <div className="mt-4 space-y-4">
          {[
            ['Contract', 'Processing your order, managing your account, and delivering your purchases.'],
            ['Legal Obligation', 'Complying with accounting, tax, and fraud-prevention obligations.'],
            ['Legitimate Interests', 'Improving our website, preventing fraud, and sending service-related communications. We have assessed that these interests are not overridden by your rights.'],
            ['Consent', 'Sending you marketing emails and setting non-essential cookies. You may withdraw consent at any time.'],
          ].map(([basis, desc]) => (
            <div key={basis} className="border-l-2 border-ivory-dark pl-4">
              <p className="text-[11px] tracking-[1.5px] uppercase font-semibold text-gold mb-1">{basis}</p>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: '5. How We Use Your Data',
    content: (
      <ul className="space-y-2">
        {[
          'To process and fulfil your orders, including delivery and returns.',
          'To manage your account and provide customer support.',
          'To send order confirmations, dispatch notifications, and service communications.',
          'To send you marketing communications (only where you have opted in).',
          'To personalise your experience on our website.',
          'To improve our website, products, and services via analytics.',
          'To detect, prevent, and investigate fraud or other illegal activities.',
          'To comply with our legal and regulatory obligations.',
        ].map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-gold mt-0.5">–</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'data-sharing',
    title: '6. Who We Share Your Data With',
    content: (
      <>
        <p>We share your personal data only with trusted third parties where necessary:</p>
        <ul className="mt-3 space-y-2">
          {[
            ['Payment processors', 'Stripe (UK/EU) and Paystack — to process payments securely.'],
            ['Delivery partners', 'Royal Mail and DPD — to fulfil and track your orders.'],
            ['Email service providers', 'To send transactional and marketing emails.'],
            ['Analytics providers', 'Google Analytics (with anonymisation enabled) — to understand website usage.'],
            ['IT and hosting providers', 'Cloud infrastructure and website hosting services.'],
            ['Professional advisers', 'Lawyers, accountants, and auditors where required.'],
          ].map(([who, desc]) => (
            <li key={who} className="flex gap-2">
              <span className="text-gold mt-0.5">–</span>
              <span><strong className="text-ebony font-semibold">{who}:</strong> {desc}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          We do not sell your personal data to any third parties.
        </p>
      </>
    ),
  },
  {
    id: 'international-transfers',
    title: '7. International Transfers',
    content: (
      <p>
        Some of our third-party service providers operate outside the UK. Where we transfer your data
        outside the UK, we ensure appropriate safeguards are in place — including Standard Contractual
        Clauses (SCCs) approved by the UK ICO — to ensure your data receives an equivalent level of
        protection as required by UK GDPR.
      </p>
    ),
  },
  {
    id: 'retention',
    title: '8. How Long We Keep Your Data',
    content: (
      <>
        <p>We retain your personal data only for as long as necessary for the purposes set out in this policy:</p>
        <ul className="mt-3 space-y-2">
          {[
            'Account and transaction data: 7 years from the date of the last transaction, to comply with HMRC requirements.',
            'Marketing preferences: until you unsubscribe or withdraw consent.',
            'Website usage data: up to 26 months (in line with Google Analytics defaults).',
            'Cookie consent records: 13 months.',
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-gold mt-0.5">–</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: '9. Your Rights Under UK GDPR',
    content: (
      <>
        <p>You have the following rights regarding your personal data:</p>
        <div className="mt-4 space-y-3">
          {[
            ['Right to Access', 'Request a copy of the personal data we hold about you (Subject Access Request).'],
            ['Right to Rectification', 'Ask us to correct inaccurate or incomplete data.'],
            ['Right to Erasure', 'Ask us to delete your data in certain circumstances ("right to be forgotten").'],
            ['Right to Restrict Processing', 'Ask us to pause processing of your data in certain circumstances.'],
            ['Right to Data Portability', 'Receive your data in a structured, machine-readable format and transfer it to another controller.'],
            ['Right to Object', 'Object to processing based on legitimate interests or for direct marketing.'],
            ['Right to Withdraw Consent', 'Withdraw consent at any time where processing is based on consent (this does not affect processing carried out before withdrawal).'],
          ].map(([right, desc]) => (
            <div key={right} className="border-l-2 border-ivory-dark pl-4">
              <p className="text-[11px] tracking-[1.5px] uppercase font-semibold text-gold mb-1">{right}</p>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4">
          To exercise any of these rights, please contact us at{' '}
          <a href="mailto:olubukolacoutore@writeme.com" className="underline underline-offset-2 hover:text-ebony transition-colors">
            olubukolacoutore@writeme.com
          </a>
          . We will respond within one calendar month.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '10. Cookies',
    content: (
      <p>
        We use cookies and similar tracking technologies. For full details of the cookies we use and
        how to manage your preferences, please see our{' '}
        <Link href="/cookie-settings" className="underline underline-offset-2 hover:text-ebony transition-colors">
          Cookie Settings
        </Link>{' '}
        page.
      </p>
    ),
  },
  {
    id: 'complaints',
    title: '11. How to Complain',
    content: (
      <>
        <p>
          If you are unhappy with how we handle your personal data, please contact us first and we will
          do our best to resolve the matter. You also have the right to lodge a complaint with the
          Information Commissioner&rsquo;s Office (ICO), the UK&rsquo;s data protection supervisory authority:
        </p>
        <address className="not-italic mt-4 space-y-1">
          <p className="font-medium text-ebony">Information Commissioner&rsquo;s Office</p>
          <p>Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</p>
          <p>Tel: 0303 123 1113</p>
          <p>
            Website:{' '}
            <a
              href="https://ico.org.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-ebony transition-colors"
            >
              ico.org.uk
            </a>
          </p>
        </address>
      </>
    ),
  },
  {
    id: 'changes',
    title: '12. Changes to This Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. When we make significant changes, we will
        notify you by email or by placing a prominent notice on our website. The date at the top of
        this page shows when the policy was last updated.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <div className="border-b border-ivory-dark py-12 px-6 lg:px-12 text-center">
        <div className="max-w-8xl mx-auto">
          <span className="text-[10px] tracking-[3px] uppercase text-gold font-semibold">Legal</span>
          <h1 className="font-serif text-3xl lg:text-4xl mt-2 text-ebony">Privacy Policy</h1>
          <p className="mt-3 text-[13px] text-ebony-light">
            Last updated: 18 April 2026 &nbsp;·&nbsp; Effective date: 18 April 2026
          </p>
        </div>
      </div>

      <LegalTabs />

      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-14">
        <p className="text-[13px] text-ebony-light leading-relaxed mb-10 border-l-2 border-gold pl-4">
          This Privacy Policy explains how Olubukola Couture Ltd collects, uses, and protects your
          personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and
          the Data Protection Act 2018.
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
