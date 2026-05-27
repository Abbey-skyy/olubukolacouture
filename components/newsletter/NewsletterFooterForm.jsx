'use client';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function NewsletterFooterForm() {
  const [email,  setEmail]  = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const res  = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });
      const data = await res.json();
      setStatus(data.alreadySubscribed ? 'already' : res.ok ? 'success' : 'error');
    } catch { setStatus('error'); }
  };

  if (status === 'success')
    return <p className="text-[12px] tracking-[2px] text-gold uppercase">Thank you for subscribing ✓</p>;
  if (status === 'already')
    return <p className="text-[12px] tracking-[2px] text-ivory/70 uppercase">You are already subscribed!</p>;

  return (
    <form onSubmit={handleSubmit} className="flex gap-0 max-w-sm mx-auto">
      <input
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent border-b border-ivory/30 text-ivory placeholder:text-ivory/40 py-3 text-[12px] tracking-[1px] outline-none focus:border-gold transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="ml-4 bg-gold text-ivory px-4 py-3 hover:bg-gold-light transition-colors disabled:opacity-60"
        aria-label="Subscribe"
      >
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
