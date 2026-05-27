import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN' ? session : null;
}

export async function GET(req) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const category = searchParams.get('category');
  const includeArchived = searchParams.get('includeArchived') === '1';
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  await connectDB();
  const query = {};
  if (!includeArchived) query.isArchived = false;
  if (category) query.category = category;
  if (q) query.$text = { $search: q };

  const products = await Product.find(query).sort({ createdAt: -1 }).limit(limit).lean();
  return NextResponse.json({ products });
}

export async function POST(req) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    await connectDB();
    // Auto-generate slug from name
    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const product = await Product.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
