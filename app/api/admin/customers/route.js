import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN' ? session : null;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await connectDB();

  const [users, orderCounts] = await Promise.all([
    User.find({})
      .select('name email role createdAt emailVerified newsletterSub')
      .sort({ createdAt: -1 })
      .lean(),
    Order.aggregate([
      { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpentGBP: { $sum: '$totalGBP' } } },
    ]),
  ]);

  const countMap = Object.fromEntries(
    orderCounts.map((r) => [r._id.toString(), { orderCount: r.orderCount, totalSpentGBP: r.totalSpentGBP }])
  );

  const customers = users.map((u) => ({
    ...u,
    ...(countMap[u._id.toString()] || { orderCount: 0, totalSpentGBP: 0 }),
  }));

  return NextResponse.json({ customers });
}
