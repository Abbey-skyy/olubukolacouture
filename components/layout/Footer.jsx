import Link from 'next/link';
import NewsletterFooterForm from '@/components/newsletter/NewsletterFooterForm';

const LINKS = {
  'Shop': [
    { label: 'New In',          href: '/shop?filter=new' },
    { label: 'Dresses',         href: '/shop?category=dresses' },
    { label: 'Tops & Blouses',  href: '/shop?category=tops' },
    { label: 'Skirts',          href: '/shop?category=skirts' },
    { label: '2 Piece',         href: '/shop?category=2-piece' },
    { label: 'Lingerie',        href: '/shop?category=lingerie' },
    { label: 'Auto Gele',       href: '/shop?category=auto-gele' },
    { label: 'Accessories',     href: '/shop?category=beads' },
    { label: 'Sale',            href: '/shop?filter=sale' },
  ],
  'Help': [
    { label: 'Sizing Guide',     href: '/sizing' },
    { label: 'Delivery & Returns', href: '/delivery' },
    { label: 'FAQ',              href: '/faq' },
    { label: 'Contact Us',       href: '/contact' },
    { label: 'Track My Order',   href: '/profile?tab=orders' },
  ],
  'About': [
    { label: 'Our Story',   href: '/about' },
    { label: 'Careers',     href: '/careers' },
    { label: 'Press',       href: '/press' },
    { label: 'Stockists',   href: '/stockists' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ebony-dark text-ivory mt-24">
      {/* Newsletter strip */}
      <div className="border-b border-gold/20 py-16 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-serif text-2xl tracking-[4px] mb-3">JOIN THE CLUB</h3>
          <p className="text-[12px] tracking-[1.5px] text-ivory/60 mb-8">
            Be the first to discover new arrivals, exclusive offers, and curated style edits.
          </p>
          <NewsletterFooterForm />
        </div>
      </div>

      {/* Links */}
      <div className="max-w-8xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div>
            <div className="mb-6">
              <span className="font-serif text-2xl tracking-[6px] text-ivory">OLUBUKOLA</span>
              <span className="block text-[9px] tracking-[5px] text-gold mt-0.5">COUTURE</span>
            </div>
            <p className="text-[12px] leading-[1.9] text-ivory/60 max-w-[200px]">
              Curated women's fashion for the modern woman. Timeless elegance, contemporary design.
            </p>
            <div className="flex gap-4 mt-6">
              {['Instagram', 'TikTok', 'Pinterest'].map((s) => (
                <a key={s} href="#" aria-label={s} className="text-ivory/50 hover:text-ivory transition-colors text-[10px] tracking-[1.5px] uppercase">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[10px] tracking-[3px] uppercase font-semibold text-gold mb-5">{group}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[12px] tracking-[0.5px] text-ivory/60 hover:text-ivory transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ivory/10 px-6 lg:px-12 py-6">
        <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-[1.5px] text-ivory/40 uppercase">
            © {new Date().getFullYear()} Olubukola Couture Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms & Conditions', 'Cookie Settings'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="text-[10px] tracking-[1.5px] text-ivory/40 hover:text-ivory transition-colors uppercase"
              >
                {item}
              </Link>
            ))}
          </div>
          {/* Payment icons (text-based) */}
          <div className="flex items-center gap-3">
            {['VISA', 'MC', 'AMEX', 'PAYSTACK'].map((p) => (
              <span key={p} className="text-[8px] tracking-[1px] border border-ivory/20 px-2 py-1 text-ivory/40 rounded-sm">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
