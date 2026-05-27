import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password)
      return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 });

    if (password.length < 12)
      return NextResponse.json({ error: 'Password must be at least 12 characters.' }, { status: 400 });

    await connectDB();

    const user = await User.findOne({
      resetToken:    token,
      resetTokenExp: { $gt: new Date() },
    });

    if (!user)
      return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });

    user.password      = password;
    user.resetToken    = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[RESET PASSWORD]', err);
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}
