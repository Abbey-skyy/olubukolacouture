'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Mail, Users, Megaphone, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const NAV = [
  { label: 'Dashboard',     href: '/admin',                  icon: LayoutDashboard },
  { label: 'Products',      href: '/admin/products',          icon: Package },
  { label: 'Orders',        href: '/admin/orders',            icon: ShoppingBag },
  { label: 'Newsletter',    href: '/admin/newsletter',        icon: Mail },
  { label: 'Customers',     href: '/admin/customers',         icon: Users },
  { label: 'Announcement',  href: '/admin/announcement',      icon: Megaphone },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-ebony min-h-screen flex flex-col">
      <div className="px-6 py-8 border-b border-ebony-light/20">
        <span className="font-serif text-xl tracking-[4px] text-ebony">OLUBUKOLA</span>
        <span className="block text-[8px] tracking-[4px] text-gold mt-0.5">ADMIN PANEL</span>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={`admin-sidebar-link ${active ? 'active' : ''}`}>
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-ebony-light/20">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="admin-sidebar-link w-full text-left"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
