import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = { title: { template: '%s | Admin — Olubukola Couture' } };

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <div className="min-h-screen bg-ivory flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
