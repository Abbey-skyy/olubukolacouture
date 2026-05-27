import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');

  await connectDB();
  const query = { user: session.user.id };
  if (statusFilter) query.status = statusFilter;

  const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const body = await req.json();
    await connectDB();
    const order = await Order.create({ ...body, user: session.user.id });
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
