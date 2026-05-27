import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(req) {
  try {
    const { email, source = 'popup' } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });

    await connectDB();

    // Upsert logic — no duplicates
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.isActive) {
        await Newsletter.findByIdAndUpdate(existing._id, { isActive: true, subscribedAt: new Date() });
        return NextResponse.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
      }
      return NextResponse.json({ success: true, alreadySubscribed: true, message: 'You are already subscribed!' });
    }

    await Newsletter.create({ email: email.toLowerCase(), source });

    return NextResponse.json({ success: true, message: 'Successfully subscribed!' }, { status: 201 });
  } catch (err) {
    console.error('[NEWSLETTER SUBSCRIBE]', err);
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 });
  }
}
