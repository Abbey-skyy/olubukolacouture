'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

const MIN_PASSWORD = 12;

export default function RegisterPage() {
  const router = useRouter();
  const [form,  setForm]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [show1, setShow1]  = useState(false);
  const [show2, setShow2]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const passwordChecks = [
    { label: '12+ characters',      pass: form.password.length >= 12 },
    { label: 'Uppercase letter',     pass: /[A-Z]/.test(form.password) },
    { label: 'Lowercase letter',     pass: /[a-z]/.test(form.password) },
    { label: 'Number or symbol',     pass: /[0-9!@#$%^&*]/.test(form.password) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < MIN_PASSWORD) { setError(`Password must be at least ${MIN_PASSWORD} characters.`); return; }

    setLoading(true);
    setError('');

    const res  = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error || 'Registration failed.'); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <CheckCircle size={48} className="text-gold mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-ebony tracking-[2px] mb-4">Check Your Email</h1>
          <p className="text-[13px] text-ebony-light leading-relaxed mb-8">
            We've sent a verification link to <strong>{form.email}</strong>.
            Please click the link to activate your account before signing in.
          </p>
          <Link href="/login" className="btn-primary text-[10px]">Go to Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex">
      <div className="hidden lg:flex lg:w-1/2 bg-ebony items-center justify-center relative overflow-hidden">
        <div className="text-center z-10">
          <span className="font-serif text-5xl tracking-[8px] text-ivory">OLUBUKOLA</span>
          <span className="block text-[10px] tracking-[6px] text-gold mt-1">COUTURE</span>
          <p className="text-[12px] text-ivory/50 tracking-[2px] mt-8 uppercase">Join The Club</p>
        </div>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #D4AF37 0%, transparent 60%)' }} />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link href="/" className="lg:hidden block mb-8 text-center">
              <span className="font-serif text-3xl tracking-[6px] text-ebony">OLUBUKOLA</span>
              <span className="block text-[9px] tracking-[5px] text-gold">COUTURE</span>
            </Link>
            <h1 className="font-serif text-3xl text-ebony tracking-[2px]">Create Account</h1>
            <p className="text-[12px] text-ebony-light tracking-[0.5px] mt-2">
              Join and enjoy exclusive member benefits
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-minimal"
                placeholder="Amara Johnson"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-minimal"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={show1 ? 'text' : 'password'}
                  required
                  minLength={MIN_PASSWORD}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-minimal pr-10"
                  placeholder="Min. 12 characters"
                />
                <button type="button" onClick={() => setShow1(!show1)} className="absolute right-0 top-1/2 -translate-y-1/2 btn-ghost p-1">
                  {show1 ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Password strength */}
              {form.password && (
                <div className="mt-3 space-y-1">
                  {passwordChecks.map((c) => (
                    <div key={c.label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${c.pass ? 'bg-gold' : 'bg-ivory-dark border border-ebony-light/30'}`} />
                      <span className={`text-[10px] tracking-[0.5px] ${c.pass ? 'text-ebony' : 'text-ebony-light'}`}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Confirm Password</label>
              <div className="relative">
                <input
                  type={show2 ? 'text' : 'password'}
                  required
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="input-minimal pr-10"
                  placeholder="Repeat password"
                />
                <button type="button" onClick={() => setShow2(!show2)} className="absolute right-0 top-1/2 -translate-y-1/2 btn-ghost p-1">
                  {show2 ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-[10px] disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="text-center text-[12px] text-ebony-light mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-ebony hover:text-gold transition-colors font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
