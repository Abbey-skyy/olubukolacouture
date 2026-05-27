import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const { amount, currency = 'gbp', email, paymentMethodTypes } = await req.json();

    if (!amount || amount < 50)
      return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 });

    if (currency !== 'gbp')
      return NextResponse.json({ error: 'Stripe is configured for GBP only. Use Paystack for NGN.' }, { status: 400 });

    const paymentIntent = await stripe.paymentIntents.create({
      amount:               Math.round(amount),  // already in pence
      currency:             'gbp',
      automatic_payment_methods: { enabled: true }, // handles Apple Pay & Google Pay automatically
      receipt_email:        email || session.user.email,
      metadata: {
        userId: session.user.id,
        email:  session.user.email,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('[STRIPE]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
