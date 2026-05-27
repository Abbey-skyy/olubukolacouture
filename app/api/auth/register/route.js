import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { sendVerificationEmail } from '../../../../lib/email';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });

    if (password.length < 12)
      return NextResponse.json({ error: 'Password must be at least 12 characters.' }, { status: 400 });

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });

    const token    = uuidv4();
    const tokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await User.create({
      name,
      email: email.toLowerCase(),
      password,
      verifyToken:    token,
      verifyTokenExp: tokenExp,
      emailVerified:  null,
    });

    await sendVerificationEmail(name, email, token);

    return NextResponse.json({
      success: true,
      message: 'Account created. Please check your email to verify your account.',
    }, { status: 201 });

  } catch (err) {
    console.error('[REGISTER ERROR]', err.message);
    return NextResponse.json({
      error: 'Registration failed: ' + err.message,
    }, { status: 500 });
  }
}