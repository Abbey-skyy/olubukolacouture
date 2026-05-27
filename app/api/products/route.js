import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category');
    const sizes    = searchParams.get('sizes')?.split(',').filter(Boolean);
    const sale     = searchParams.get('sale') === '1';
    const featured = searchParams.get('featured') === '1';
    const newIn    = searchParams.get('new') === '1';
    const q        = searchParams.get('q');
    const sort     = searchParams.get('sort') || 'newest';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page     = parseInt(searchParams.get('page') || '1', 10);
    const limit    = parseInt(searchParams.get('limit') || '12', 10);

    const query = { isArchived: false };

    if (category) query.category = category;
    if (sale)     query.isSale   = true;
    if (featured) query.isFeatured = true;
    if (newIn)    query.isNewArrival = true;
    if (sizes?.length) query['sizes.label'] = { $in: sizes };
    if (minPrice || maxPrice) {
      query.priceGBP = {};
      if (minPrice) query.priceGBP.$gte = Number(minPrice);
      if (maxPrice) query.priceGBP.$lte = Number(maxPrice);
    }
    if (q) query.$text = { $search: q };

    const sortMap = {
      newest:     { createdAt: -1 },
      price_asc:  { priceGBP: 1 },
      price_desc: { priceGBP: -1 },
      bestseller: { soldCount: -1 },
    };

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortMap[sort] || sortMap.newest)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[GET /api/products]', err);
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}
