'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function NewsletterModal() {
  const [visible, setVisible] = useState(false);
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState('idle'); // idle | loading | success | error | already
  const [message, setMessage] = useState('');

  useEffect(() => {
    const dismissed = sessionStorage.getItem('oc_newsletter_dismissed');
    if (dismissed) return;

    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem('oc_newsletter_dismissed', '1');
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    try {
      const res  = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'popup' }),
      });
      const data = await res.json();

      if (data.alreadySubscribed) {
        setStatus('already');
        setMessage('You are already subscribed!');
      } else if (res.ok) {
        setStatus('success');
        setMessage('Welcome to the club.');
        setTimeout(dismiss, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ebony-dark/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-ivory shadow-2xl z-10 animate-fade-up overflow-hidden"
        style={{ animationFillMode: 'both' }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 btn-ghost p-1 z-10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Gold top bar */}
        <div className="h-1 bg-gold w-full" />

        <div className="px-12 py-14 text-center">
          {/* Eyebrow */}
          <p className="text-[9px] tracking-[4px] uppercase text-gold font-semibold mb-3">
            Exclusive Access
          </p>

          {/* Heading */}
          <h2 className="font-serif text-4xl text-ebony tracking-[2px] mb-4 leading-tight">
            JOIN THE CLUB
          </h2>

          {/* Subtext */}
          <p className="text-[12px] tracking-[0.5px] text-ebony-light leading-relaxed mb-10 max-w-xs mx-auto">
            Subscribe to receive new arrivals, exclusive member offers, and style inspiration curated just for you.
          </p>

          {status === 'success' || status === 'already' ? (
            <div className="py-4">
              <p className={`text-[13px] tracking-[1px] ${status === 'success' ? 'text-ebony' : 'text-gold'}`}>
                {status === 'success' ? '✓ ' : ''}
                {message}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-6">
              {/* Minimalist input */}
              <div>
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-minimal text-center text-[13px] tracking-[1px]"
                />
              </div>

              {status === 'error' && (
                <p className="text-[11px] text-red-500">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full text-[10px] py-4 disabled:opacity-60"
              >
                {status === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
              </button>
            </form>
          )}

          <p className="text-[10px] text-ebony-light mt-6">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
