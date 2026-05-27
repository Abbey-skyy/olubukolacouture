'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'oc_cookie_consent_v2';

const defaultConsent = {
  essential:  true,
  functional: false,
  analytics:  false,
};

const CookieConsentContext = createContext(null);

export function CookieConsentProvider({ children }) {
  const [consent,    setConsent]    = useState(defaultConsent);
  // Start as null so we can distinguish "not yet checked" from "decided"
  const [hasDecided, setHasDecided] = useState(null);
  const [showModal,  setShowModal]  = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setConsent(JSON.parse(stored));
        setHasDecided(true);
      } catch {
        setHasDecided(false);
      }
    } else {
      setHasDecided(false);
    }
  }, []);

  const persist = (prefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setConsent(prefs);
    setHasDecided(true);
    setShowModal(false);
  };

  const acceptAll = () =>
    persist({ essential: true, functional: true, analytics: true });

  const rejectAll = () =>
    persist({ essential: true, functional: false, analytics: false });

  const savePreferences = (prefs) =>
    persist({ ...prefs, essential: true });

  const reopen = () => setHasDecided(false);

  return (
    <CookieConsentContext.Provider
      value={{ consent, hasDecided, showModal, setShowModal, acceptAll, rejectAll, savePreferences, reopen }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be within CookieConsentProvider');
  return ctx;
}
