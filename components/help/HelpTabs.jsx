'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { label: 'Sizing Guide', href: '/sizing' },
  { label: 'Delivery & Returns', href: '/delivery' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
];

export default function HelpTabs() {
  const pathname = usePathname();
  return (
    <div className="border-b border-ivory-dark bg-ivory">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <nav className="flex overflow-x-auto">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`py-4 px-5 lg:px-8 text-[10px] tracking-[2px] uppercase font-semibold whitespace-nowrap border-b-2 transition-colors ${
                pathname === tab.href
                  ? 'border-gold text-ebony'
                  : 'border-transparent text-ebony-light hover:text-ebony'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
