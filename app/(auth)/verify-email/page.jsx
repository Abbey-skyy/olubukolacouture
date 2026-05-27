'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token        = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    fetch(`/api/auth/verify-email?token=${token}`)
      .then((r) => r.json())
      .then((d) => setStatus(d.success ? 'success' : 'error'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="animate-spin text-gold mx-auto mb-6" />
            <p className="text-[13px] tracking-[1px] text-ebony-light">Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-gold mx-auto mb-6" />
            <h1 className="font-serif text-3xl text-ebony tracking-[2px] mb-4">Email Confirmed!</h1>
            <p className="text-[13px] text-ebony-light leading-relaxed mb-8">
              Your account is now active. You can sign in and start shopping.
            </p>
            <Link href="/login" className="btn-primary text-[10px]">Sign In</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={48} className="text-red-400 mx-auto mb-6" />
            <h1 className="font-serif text-3xl text-ebony tracking-[2px] mb-4">Link Expired</h1>
            <p className="text-[13px] text-ebony-light leading-relaxed mb-8">
              This verification link is invalid or has expired. Please register again or contact support.
            </p>
            <Link href="/register" className="btn-primary text-[10px]">Register Again</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return <Suspense><VerifyContent /></Suspense>;
}
