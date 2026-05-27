import LegalTabs from '@/components/legal/LegalTabs';
import CookiePreferencesPanel from './CookiePreferencesPanel';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Settings',
  description: 'Manage your cookie preferences for the Olubukola Couture website.',
};

const COOKIE_TYPES = [
  {
    key: 'essential',
    label: 'Strictly Necessary Cookies',
    alwaysOn: true,
    legal: 'No consent required — exempt under PECR Regulation 6(4)',
    examples: [
      { name: 'oc_session', purpose: 'Maintains your login session and shopping bag.', duration: 'Session' },
      { name: 'oc_cookie_consent', purpose: 'Stores your cookie consent preferences.', duration: '13 months' },
      { name: '__stripe_sid', purpose: 'Required for Stripe payment processing.', duration: 'Session' },
    ],
    desc: 'These cookies are essential for the website to function and cannot be switched off. They are set in response to your actions such as logging in, adding items to your bag, or completing a purchase. You can set your browser to block these cookies, but parts of the site will then not work.',
  },
  {
    key: 'functional',
    label: 'Functional Cookies',
    alwaysOn: false,
    legal: 'Consent required under UK PECR',
    examples: [
      { name: 'oc_currency', purpose: 'Remembers your selected display currency (GBP/NGN).', duration: '12 months' },
      { name: 'oc_theme', purpose: 'Stores your display preferences.', duration: '12 months' },
    ],
    desc: 'These cookies enable enhanced functionality and personalisation. They may be set by us or by third-party providers whose services we use on our pages. If you do not allow these cookies, some features may not work correctly.',
  },
  {
    key: 'analytics',
    label: 'Analytics Cookies',
    alwaysOn: false,
    legal: 'Consent required under UK PECR',
    examples: [
      { name: '_ga', purpose: 'Google Analytics — distinguishes unique users.', duration: '2 years' },
      { name: '_ga_*', purpose: 'Google Analytics — maintains session state.', duration: '2 years' },
    ],
    desc: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our website. All data is collected anonymously. If you do not allow these cookies, we will not know when you have visited our site and will not be able to monitor its performance.',
  },
];

export default function CookieSettingsPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <div className="border-b border-ivory-dark py-12 px-6 lg:px-12 text-center">
        <div className="max-w-8xl mx-auto">
          <span className="text-[10px] tracking-[3px] uppercase text-gold font-semibold">Legal</span>
          <h1 className="font-serif text-3xl lg:text-4xl mt-2 text-ebony">Cookie Settings</h1>
          <p className="mt-3 text-[13px] text-ebony-light leading-relaxed max-w-xl mx-auto">
            Manage which cookies you allow. Your preferences are saved in your browser and can be
            changed at any time.
          </p>
        </div>
      </div>

      <LegalTabs />

      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-14 space-y-14">
        {/* About cookies */}
        <section>
          <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony mb-4">
            About Cookies
          </h2>
          <p className="text-[13px] text-ebony-light leading-relaxed mb-3">
            Cookies are small text files placed on your device when you visit a website. We use cookies
            and similar technologies in accordance with the UK General Data Protection Regulation
            (UK GDPR) and the Privacy and Electronic Communications Regulations 2003 (PECR).
          </p>
          <p className="text-[13px] text-ebony-light leading-relaxed">
            Under PECR, we must obtain your consent before placing non-essential cookies on your
            device. You can update your preferences at any time on this page. For more information on
            how we use your data, please see our{' '}
            <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-ebony transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        {/* Preference panel */}
        <section>
          <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony mb-6">
            Manage Your Preferences
          </h2>
          <CookiePreferencesPanel />
        </section>

        {/* Cookie table */}
        <section className="space-y-10">
          <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony">
            Cookies We Use
          </h2>
          {COOKIE_TYPES.map((type) => (
            <div key={type.key}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[11px] tracking-[2px] uppercase font-semibold text-ebony">
                  {type.label}
                </h3>
                {type.alwaysOn ? (
                  <span className="text-[9px] tracking-[1.5px] uppercase bg-gold/20 text-gold px-2 py-0.5 font-medium">
                    Always On
                  </span>
                ) : (
                  <span className="text-[9px] tracking-[1.5px] uppercase bg-ivory-dark text-ebony-light px-2 py-0.5 font-medium">
                    Consent Required
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gold mb-3">{type.legal}</p>
              <p className="text-[13px] text-ebony-light leading-relaxed mb-4">{type.desc}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] border-collapse">
                  <thead>
                    <tr className="bg-ebony text-ivory">
                      <th className="py-2.5 px-4 text-left text-[9px] tracking-[2px] uppercase font-semibold">Cookie Name</th>
                      <th className="py-2.5 px-4 text-left text-[9px] tracking-[2px] uppercase font-semibold">Purpose</th>
                      <th className="py-2.5 px-4 text-left text-[9px] tracking-[2px] uppercase font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {type.examples.map((ex, i) => (
                      <tr key={ex.name} className={`border-b border-ivory-dark ${i % 2 === 0 ? 'bg-white' : 'bg-ivory'}`}>
                        <td className="py-3 px-4 font-mono text-[11px] text-ebony">{ex.name}</td>
                        <td className="py-3 px-4 text-ebony-light">{ex.purpose}</td>
                        <td className="py-3 px-4 text-ebony-light whitespace-nowrap">{ex.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* How to control via browser */}
        <section>
          <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony mb-4">
            Browser Controls
          </h2>
          <p className="text-[13px] text-ebony-light leading-relaxed">
            Most browsers allow you to refuse or delete cookies through their settings. Please note
            that blocking cookies may affect the functionality of our website. The links below explain
            how to manage cookies in common browsers:
          </p>
          <ul className="mt-4 space-y-2 text-[13px]">
            {[
              ['Google Chrome', 'https://support.google.com/chrome/answer/95647'],
              ['Mozilla Firefox', 'https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer'],
              ['Safari', 'https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac'],
              ['Microsoft Edge', 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406'],
            ].map(([browser, url]) => (
              <li key={browser} className="flex gap-2">
                <span className="text-gold mt-0.5">–</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ebony-light hover:text-ebony transition-colors underline underline-offset-2"
                >
                  {browser}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
