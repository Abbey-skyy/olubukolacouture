'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res  = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) { setSent(true); }
    else { const d = await res.json(); setError(d.error || 'Something went wrong.'); }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/login" className="flex items-center gap-2 text-[11px] tracking-[1.5px] uppercase text-ebony-light hover:text-ebony mb-10 transition-colors">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        {sent ? (
          <div className="text-center">
            <CheckCircle size={48} className="text-gold mx-auto mb-6" />
            <h1 className="font-serif text-3xl text-ebony tracking-[2px] mb-4">Check Your Email</h1>
            <p className="text-[13px] text-ebony-light leading-relaxed">
              If an account exists for <strong>{email}</strong>, we've sent a password reset link. Check your inbox.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-3xl text-ebony tracking-[2px] mb-3">Forgot Password</h1>
            <p className="text-[12px] text-ebony-light mb-10">
              Enter your email and we'll send you a reset link.
            </p>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-3 mb-6">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-minimal" placeholder="your@email.com" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full text-[10px] disabled:opacity-60">
                {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'SEND RESET LINK'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
