import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

async function requireAdmin(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }
  return session;
}

export async function GET(req) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await connectDB();
  const subscribers = await Newsletter.find({}).sort({ subscribedAt: -1 }).lean();
  return NextResponse.json({ subscribers, total: subscribers.length });
}
