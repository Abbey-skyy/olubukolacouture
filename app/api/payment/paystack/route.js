import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getExchangeRate, toSmallestUnit } from '@/lib/currency';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const { amount, email, currency = 'ngn' } = await req.json();

    if (!amount || amount < 50)
      return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 });

    const rate      = await getExchangeRate();
    const kobo      = toSmallestUnit(Math.round(amount), 'ngn', rate);  // convert GBP pence → kobo

    const reference = `OC-${Date.now()}-${session.user.id.slice(-6)}`;

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email:        email || session.user.email,
        amount:       kobo,
        currency:     'NGN',
        reference,
        callback_url: `${process.env.NEXTAUTH_URL}/checkout/success?ref=${reference}`,
        metadata: {
          userId:      session.user.id,
          originalGBP: amount,
          rate,
        },
      }),
    });

    const data = await res.json();

    if (!data.status)
      return NextResponse.json({ error: data.message || 'Paystack initialisation failed.' }, { status: 500 });

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference:         data.data.reference,
    });
  } catch (err) {
    console.error('[PAYSTACK]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
