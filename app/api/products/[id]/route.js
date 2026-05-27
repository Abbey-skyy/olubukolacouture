import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req, { params }) {
  try {
    await connectDB();
    // Support lookup by _id or slug
    const product = await Product.findOne({
      $or: [{ _id: params.id }, { slug: params.id }],
      isArchived: false,
    }).lean();

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product.' }, { status: 500 });
  }
}
