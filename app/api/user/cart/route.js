import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(_req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ cart: [] });

  await connectDB();
  const user = await User.findById(session.user.id)
    .populate('cart.product', 'name slug images priceGBP sizes')
    .lean();

  const cart = (user?.cart || [])
    .map((item) => ({
      productId: item.product?._id?.toString(),
      name:      item.product?.name,
      slug:      item.product?.slug,
      image:     item.product?.images?.[0]?.url ?? null,
      priceGBP:  item.product?.priceGBP,
      size:      item.size,
      qty:       item.qty,
    }))
    .filter((item) => item.productId && typeof item.priceGBP === 'number');

  return NextResponse.json({ cart });
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { cart } = await req.json();

  // Normalize context shape (productId) → schema shape (product)
  const normalizedCart = (cart || [])
    .filter((i) => i.productId && i.size && i.qty > 0)
    .map(({ productId, size, qty }) => ({ product: productId, size, qty }));

  await connectDB();
  await User.findByIdAndUpdate(session.user.id, { cart: normalizedCart });
  return NextResponse.json({ success: true });
}
