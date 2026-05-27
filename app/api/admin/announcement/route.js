import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Announcement from '@/models/Announcement';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN' ? session : null;
}

const DEFAULTS = {
  messages: [
    'FREE SHIPPING ON ORDERS OVER £150',
    'NEW ARRIVALS — RESORT COLLECTION 2025',
    'COMPLIMENTARY GIFT WRAPPING ON ALL ORDERS',
    'SAME-DAY DISPATCH BEFORE 2PM',
  ],
  enabled: true,
  speed:   18,
};

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await connectDB();
  const doc = await Announcement.findOne().lean();
  return NextResponse.json(doc || DEFAULTS);
}

export async function PUT(req) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { messages, enabled, speed } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0)
    return NextResponse.json({ error: 'At least one message is required.' }, { status: 400 });

  const cleaned = messages.map((m) => m.trim()).filter(Boolean);
  if (cleaned.length === 0)
    return NextResponse.json({ error: 'Messages cannot be empty.' }, { status: 400 });

  await connectDB();
  const doc = await Announcement.findOneAndUpdate(
    {},
    { $set: { messages: cleaned, enabled: !!enabled, speed: Number(speed) || 18 } },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({ success: true, doc });
}
