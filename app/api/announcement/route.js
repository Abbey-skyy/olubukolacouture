import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Announcement from '@/models/Announcement';

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
  try {
    await connectDB();
    const doc = await Announcement.findOne().lean();
    if (!doc) return NextResponse.json(DEFAULTS);
    return NextResponse.json({
      messages: doc.messages,
      enabled:  doc.enabled,
      speed:    doc.speed,
    });
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}
