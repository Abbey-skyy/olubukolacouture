'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get('callbackUrl') || '/profile';
  const errorParam   = searchParams.get('error');

  const [form, setForm]     = useState({ email: '', password: '', rememberMe: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(
    errorParam === 'EMAIL_NOT_VERIFIED'
      ? 'Please verify your email before signing in. Check your inbox.'
      : errorParam ? 'Invalid email or password.' : ''
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect:   false,
      email:      form.email,
      password:   form.password,
      rememberMe: String(form.rememberMe),
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === 'EMAIL_NOT_VERIFIED') {
        setError('Please verify your email before signing in. Check your inbox.');
      } else {
        setError('Invalid email or password.');
      }
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Left — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-ebony items-center justify-center relative overflow-hidden">
        <div className="text-center z-10">
          <span className="font-serif text-5xl tracking-[8px] text-ivory">OLUBUKOLA</span>
          <span className="block text-[10px] tracking-[6px] text-gold mt-1">COUTURE</span>
          <p className="text-[12px] text-ivory/50 tracking-[2px] mt-8 uppercase">Elegance. Curated.</p>
        </div>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #D4AF37 0%, transparent 60%)' }} />
      </div>

      {/* Right — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link href="/" className="lg:hidden block mb-8 text-center">
              <span className="font-serif text-3xl tracking-[6px] text-ebony">OLUBUKOLA</span>
              <span className="block text-[9px] tracking-[5px] text-gold">COUTURE</span>
            </Link>
            <h1 className="font-serif text-3xl text-ebony tracking-[2px]">Welcome Back</h1>
            <p className="text-[12px] text-ebony-light tracking-[0.5px] mt-2">
              Sign in to your Olubukola Couture account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-3 mb-6 tracking-[0.3px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-minimal pr-10"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 btn-ghost p-1"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                  className="accent-gold w-4 h-4"
                />
                <span className="text-[11px] tracking-[0.5px] text-ebony-light">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[11px] tracking-[0.5px] text-gold hover:text-gold-dark transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-[10px] disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'SIGN IN'}
            </button>
          </form>

          <p className="text-center text-[12px] text-ebony-light mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-ebony hover:text-gold transition-colors font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
