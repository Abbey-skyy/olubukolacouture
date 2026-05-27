import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Newsletter from '@/models/Newsletter';
import User from '@/models/User';
import { Package, ShoppingBag, Mail, Users, TrendingUp } from 'lucide-react';

async function getDashboardStats() {
  await connectDB();
  const [products, orders, subscribers, customers, revenue] = await Promise.all([
    Product.countDocuments({ isArchived: false }),
    Order.countDocuments({}),
    Newsletter.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'USER' }),
    Order.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalGBP' } } },
    ]),
  ]);
  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .lean();

  return {
    products,
    orders,
    subscribers,
    customers,
    revenueGBP: revenue[0]?.total || 0,
    recentOrders: JSON.parse(JSON.stringify(recentOrders)),
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: 'Total Products',   value: stats.products,    icon: Package,     color: 'text-blue-500' },
    { label: 'Total Orders',     value: stats.orders,      icon: ShoppingBag, color: 'text-green-500' },
    { label: 'Subscribers',      value: stats.subscribers, icon: Mail,        color: 'text-gold' },
    { label: 'Customers',        value: stats.customers,   icon: Users,       color: 'text-purple-500' },
    { label: 'Revenue (GBP)',
      value: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(stats.revenueGBP / 100),
      icon: TrendingUp, color: 'text-gold' },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-3xl text-ebony tracking-[2px]">Dashboard</h1>
        <p className="text-[12px] text-ebony-light mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {statCards.map((s) => (
          <div key={s.label} className="bg-ivory-dark p-6 border border-ivory-dark/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">{s.label}</span>
              <s.icon size={18} className={s.color} />
            </div>
            <p className="text-2xl font-semibold text-ebony">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony mb-4">Recent Orders</h2>
        <div className="border border-ivory-dark overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="bg-ivory-dark">
              <tr>
                {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[2px] uppercase text-ebony-light font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-dark">
              {stats.recentOrders.map((o) => (
                <tr key={o._id} className="hover:bg-ivory-dark/50 transition-colors">
                  <td className="px-4 py-3 font-medium">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-ebony-light">{o.user?.name || 'Unknown'}</td>
                  <td className="px-4 py-3">
                    {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(o.totalGBP / 100)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] tracking-[1px] uppercase bg-gold/10 px-2 py-0.5 rounded">{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-ebony-light">
                    {new Date(o.createdAt).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
