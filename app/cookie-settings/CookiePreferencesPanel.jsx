'use client';
import { useState } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { Shield, CheckCircle } from 'lucide-react';

const CATEGORIES = [
  {
    key: 'essential',
    label: 'Strictly Necessary',
    desc: 'Required for login sessions, the shopping bag, payment processing, and core site functionality. Cannot be disabled.',
    alwaysOn: true,
  },
  {
    key: 'functional',
    label: 'Functional',
    desc: 'Enables your currency display preference (GBP/NGN) and other personalisation settings to persist across visits.',
    alwaysOn: false,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    desc: 'Allows Google Analytics to collect anonymised data so we can understand how visitors use the website and make improvements.',
    alwaysOn: false,
  },
];

function Toggle({ on, onToggle, disabled }) {
  return (
    <button
      onClick={!disabled ? onToggle : undefined}
      disabled={disabled}
      className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
        on ? 'bg-gold' : 'bg-ebony-light/40'
      } ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
      aria-checked={on}
      role="switch"
      aria-label={disabled ? 'Always enabled' : on ? 'Enabled' : 'Disabled'}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-ivory shadow transition-transform duration-200 ${
          on ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function CookiePreferencesPanel() {
  const { consent, savePreferences, acceptAll, rejectAll } = useCookieConsent();
  const [prefs, setPrefs] = useState({
    essential:  true,
    functional: consent.functional,
    analytics:  consent.analytics,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    savePreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAcceptAll = () => {
    acceptAll();
    setPrefs({ essential: true, functional: true, analytics: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRejectAll = () => {
    rejectAll();
    setPrefs({ essential: true, functional: false, analytics: false });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="border border-ivory-dark bg-white">
      <div className="p-6 border-b border-ivory-dark flex items-start gap-3">
        <Shield size={16} className="text-gold flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-ebony-light leading-relaxed">
          Adjust your preferences below. Strictly necessary cookies cannot be disabled as they are
          required for the website to function. Your choices apply to this browser and device only.
        </p>
      </div>

      <div className="divide-y divide-ivory-dark">
        {CATEGORIES.map((cat) => (
          <div key={cat.key} className="p-6 flex gap-4 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] tracking-[1.5px] uppercase font-semibold text-ebony">
                  {cat.label}
                </span>
                {cat.alwaysOn && (
                  <span className="text-[9px] tracking-[1.5px] uppercase bg-gold/20 text-gold px-2 py-0.5 font-medium">
                    Always On
                  </span>
                )}
              </div>
              <p className="text-[12px] text-ebony-light leading-relaxed">{cat.desc}</p>
            </div>
            <Toggle
              on={prefs[cat.key]}
              disabled={cat.alwaysOn}
              onToggle={() => setPrefs((p) => ({ ...p, [cat.key]: !p[cat.key] }))}
            />
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-ivory-dark flex flex-col sm:flex-row gap-3 items-center">
        <button
          onClick={handleSave}
          className="w-full sm:w-auto bg-ebony text-ivory text-[10px] tracking-[3px] uppercase font-semibold px-8 py-3 hover:bg-ebony-dark transition-colors"
        >
          Save Preferences
        </button>
        <button
          onClick={handleAcceptAll}
          className="w-full sm:w-auto border border-gold text-ebony text-[10px] tracking-[3px] uppercase font-semibold px-8 py-3 hover:bg-gold hover:text-ebony-dark transition-colors"
        >
          Accept All
        </button>
        <button
          onClick={handleRejectAll}
          className="w-full sm:w-auto text-[10px] tracking-[3px] uppercase font-semibold px-8 py-3 text-ebony-light hover:text-ebony transition-colors"
        >
          Reject Non-Essential
        </button>

        {saved && (
          <span className="flex items-center gap-1.5 text-[11px] text-gold font-medium sm:ml-auto">
            <CheckCircle size={13} />
            Preferences saved
          </span>
        )}
      </div>
    </div>
  );
}
