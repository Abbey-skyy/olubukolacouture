'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Shield, X } from 'lucide-react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const CATEGORIES = [
  {
    key: 'essential',
    label: 'Essential',
    desc: 'Required for login sessions, cart, and core site functionality. Cannot be disabled.',
    alwaysOn: true,
  },
  {
    key: 'functional',
    label: 'Functional',
    desc: 'Enables currency switching (GBP/NGN) and your preferences to persist across visits.',
    alwaysOn: false,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    desc: 'Collects anonymised data to help us understand how visitors use the site.',
    alwaysOn: false,
  },
];

function Toggle({ on, onToggle, disabled }) {
  return (
    <button
      type="button"
      onClick={!disabled ? onToggle : undefined}
      disabled={disabled}
      aria-checked={on}
      role="switch"
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold flex-shrink-0 ${
        on ? 'bg-gold' : 'bg-ebony-light/30'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-ivory shadow transition-transform duration-200 ${
          on ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function PreferencesPanel({ onBack }) {
  const { consent, savePreferences } = useCookieConsent();
  const [prefs, setPrefs] = useState({
    essential:  true,
    functional: consent.functional,
    analytics:  consent.analytics,
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="text-[10px] tracking-[2px] uppercase text-ebony-light hover:text-ebony transition-colors"
        >
          ← Back
        </button>
        <h3 className="text-[12px] tracking-[3px] uppercase font-semibold text-ebony">
          Manage Preferences
        </h3>
      </div>

      <div className="space-y-4 mb-8">
        {CATEGORIES.map((cat) => (
          <div key={cat.key} className="flex items-start gap-4 p-4 border border-ivory-dark">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] tracking-[1.5px] uppercase font-semibold text-ebony">
                  {cat.label}
                </span>
                {cat.alwaysOn && (
                  <span className="text-[9px] tracking-[1px] uppercase bg-gold/20 text-gold px-2 py-0.5">
                    Always On
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ebony-light leading-relaxed">{cat.desc}</p>
            </div>
            <Toggle
              on={prefs[cat.key]}
              disabled={cat.alwaysOn}
              onToggle={() => setPrefs((p) => ({ ...p, [cat.key]: !p[cat.key] }))}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => savePreferences(prefs)}
        className="btn-primary w-full text-[10px]"
      >
        Save Preferences
      </button>
    </div>
  );
}

export default function CookieConsent() {
  const { hasDecided, acceptAll, rejectAll } = useCookieConsent();
  const [showPrefs, setShowPrefs] = useState(false);

  // null = still reading localStorage (avoid flash); true = already decided
  if (hasDecided !== false) return null;

  return (
    /* Full-screen blocking overlay — sits above everything */
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      {/* Frosted backdrop — blocks all clicks on the page behind */}
      <div className="absolute inset-0 bg-ebony-dark/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full sm:max-w-lg bg-ivory shadow-2xl z-10 max-h-[90dvh] overflow-y-auto sm:mx-4 sm:mb-0 mb-0">
        {/* Top gold bar */}
        <div className="h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />

        <div className="p-8">
          {/* Brand */}
          <div className="mb-6 text-center">
            <span className="font-serif text-xl tracking-[6px] text-ebony">OLUBUKOLA</span>
            <span className="block text-[9px] tracking-[5px] text-gold mt-0.5">COUTURE</span>
          </div>

          {!showPrefs ? (
            <>
              {/* Icon + heading */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield size={16} className="text-gold" />
                <h2 className="text-[13px] tracking-[3px] uppercase font-semibold text-ebony">
                  We Value Your Privacy
                </h2>
              </div>

              {/* Body text */}
              <p className="text-[12px] text-ebony-light leading-relaxed text-center mb-2">
                We use cookies to enhance your shopping experience, remember your preferences, and
                analyse site traffic. Essential cookies are always active as they are necessary for
                the site to function.
              </p>
              <p className="text-[11px] text-ebony-light/80 text-center mb-8">
                Read our{' '}
                <Link href="/cookie-settings" className="underline hover:text-gold transition-colors">
                  Cookie Policy
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="underline hover:text-gold transition-colors">
                  Privacy Policy
                </Link>.
              </p>

              {/* Primary actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="btn-primary flex-1 text-[10px] py-3"
                >
                  Accept All Cookies
                </button>
                <button
                  type="button"
                  onClick={rejectAll}
                  className="btn-secondary flex-1 text-[10px] py-3"
                >
                  Reject Non-Essential
                </button>
              </div>

              {/* Manage link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowPrefs(true)}
                  className="text-[10px] tracking-[1.5px] uppercase text-ebony-light hover:text-gold underline transition-colors"
                >
                  Manage Preferences
                </button>
              </div>
            </>
          ) : (
            <PreferencesPanel onBack={() => setShowPrefs(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
