import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { createPasswordResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required.' }, { status: 400 });

    await connectDB();
    const result = await createPasswordResetToken(email);

    // Always return success to prevent email enumeration
    if (result) {
      await sendPasswordResetEmail(result.user.name, result.user.email, result.token);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[FORGOT PASSWORD]', err);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
