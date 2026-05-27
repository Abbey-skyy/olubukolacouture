import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN' ? session : null;
}

export async function GET(req) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  await connectDB();
  const query = {};
  if (status) query.status = status;

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ orders });
}
