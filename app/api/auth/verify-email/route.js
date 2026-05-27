import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) return NextResponse.json({ error: 'No token provided.' }, { status: 400 });

  try {
    await connectDB();
    const user = await User.findOne({
      verifyToken:    token,
      verifyTokenExp: { $gt: new Date() },
    });

    if (!user) return NextResponse.json({ error: 'Token is invalid or has expired.' }, { status: 400 });

    await User.findByIdAndUpdate(user._id, {
      emailVerified:  new Date(),
      verifyToken:    null,
      verifyTokenExp: null,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[VERIFY EMAIL]', err);
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 });
  }
}
