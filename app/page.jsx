import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductCard from '@/components/shop/ProductCard';

async function getFeaturedProducts() {
  await connectDB();
  const products = await Product.find({ isFeatured: true, isArchived: false })
    .limit(8)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

async function getNewArrivals() {
  await connectDB();
  const products = await Product.find({ isNewArrival: true, isArchived: false })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        {/* Blush watercolor wash over the photo — opaque left for text, dissolves right */}
        <div className="absolute inset-0 bg-gradient-to-r from-ivory/95 via-ivory/75 to-ivory/15 z-10" />
        {/* Hero photograph */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        <div className="relative z-20 max-w-8xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
          <p className="text-[10px] tracking-[5px] uppercase text-gold mb-4 font-medium">
            New Collection — 2025
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-ebony leading-[1.05] tracking-[2px] mb-8 max-w-3xl">
            Dressed<br />in Grace.
          </h1>
          <p className="text-[14px] text-ebony-light tracking-[1px] mb-10 max-w-md leading-relaxed">
            Curated women's fashion for the modern woman. Timeless silhouettes,<br className="hidden md:block" /> contemporary sensibility.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/shop" className="btn-primary text-[11px]">
              Shop Collection
            </Link>
            <Link href="/shop?filter=new" className="btn-secondary text-[11px]">
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* ── Category Grid ─────────────────────────────────────────────────────── */}
      <section className="max-w-8xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Dresses',     href: '/shop?category=dresses',   img: 'https://res.cloudinary.com/dsejjewwo/image/upload/v1777031905/olubukola-couture/categories/dresses-hero.jpg' },
            { label: 'Tops',        href: '/shop?category=tops',       img: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80' },
            { label: 'Trousers',    href: '/shop?category=trousers',   img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80' },
            { label: 'Accessories', href: '/shop?category=accessories',img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80' },
          ].map((cat) => (
            <Link key={cat.label} href={cat.href} className="group relative aspect-[3/4] overflow-hidden bg-ivory-dark">
              <Image
                src={cat.img}
                alt={cat.label}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              {/* Bottom-to-top blush gradient — creates a reading surface for the label */}
              <div className="absolute inset-0 bg-gradient-to-t from-ivory/90 via-ivory/30 to-transparent transition-opacity group-hover:opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-xl text-ebony tracking-[3px]">{cat.label}</h3>
                <span className="text-[10px] tracking-[2px] text-ebony-light uppercase mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="max-w-8xl mx-auto px-6 lg:px-12 pb-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] tracking-[4px] uppercase text-gold mb-2">Just In</p>
              <h2 className="font-serif text-4xl text-ebony tracking-[2px]">New Arrivals</h2>
            </div>
            <Link href="/shop?filter=new" className="text-[11px] tracking-[2px] uppercase text-ebony hover:text-gold transition-colors border-b border-current pb-0.5">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Editorial Banner ──────────────────────────────────────────────────── */}
      <section className="bg-ivory-dark text-ebony py-24 px-6 lg:px-12">
        <div className="max-w-8xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[10px] tracking-[4px] uppercase text-gold mb-4">The Edit</p>
            <h2 className="font-serif text-5xl lg:text-6xl leading-[1.1] tracking-[2px] mb-6">
              The Resort<br />Collection
            </h2>
            <p className="text-[13px] text-ebony-light leading-relaxed mb-10 max-w-md">
              From sun-soaked terraces to candlelit evenings — pieces designed to travel with you wherever the season takes you.
            </p>
            <Link href="/shop?filter=featured" className="btn-primary text-[11px]">
              Explore the Edit
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80"
              alt="Resort Collection"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-8xl mx-auto px-6 lg:px-12 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] tracking-[4px] uppercase text-gold mb-2">Curated For You</p>
              <h2 className="font-serif text-4xl text-ebony tracking-[2px]">Featured Pieces</h2>
            </div>
            <Link href="/shop" className="text-[11px] tracking-[2px] uppercase text-ebony hover:text-gold transition-colors border-b border-current pb-0.5">
              Shop All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Brand Values ──────────────────────────────────────────────────────── */}
      <section className="border-t border-ivory-dark py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { icon: '🚚', title: 'Free Shipping',    desc: 'On all orders over £150' },
              { icon: '↩',  title: 'Easy Returns',     desc: '30-day free returns' },
              { icon: '🔒', title: 'Secure Checkout',  desc: 'Stripe & Paystack secured' },
              { icon: '✦',  title: 'Expert Styling',   desc: 'Curated by our team' },
            ].map((v) => (
              <div key={v.title} className="space-y-2">
                <div className="text-2xl">{v.icon}</div>
                <h3 className="text-[11px] tracking-[2.5px] uppercase font-semibold text-ebony">{v.title}</h3>
                <p className="text-[12px] text-ebony-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
