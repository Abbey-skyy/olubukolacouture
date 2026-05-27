import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  await connectDB();
  const user = await User.findById(session.user.id).populate('wishlist').lean();
  return NextResponse.json({ wishlist: user?.wishlist || [] });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { productId } = await req.json();
  await connectDB();
  await User.findByIdAndUpdate(session.user.id, { $addToSet: { wishlist: productId } });
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { productId } = await req.json();
  await connectDB();
  await User.findByIdAndUpdate(session.user.id, { $pull: { wishlist: productId } });
  return NextResponse.json({ success: true });
}
