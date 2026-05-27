/**
 * Seed script — populates the database with sample products and an admin user.
 * Run with: node scripts/seed.js
 * Requires MONGODB_URI in .env.local
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

// ── Inline schemas (avoids ESM issues in seed) ─────────────────────────────
const productSchema = new mongoose.Schema({
  name: String, slug: String, description: String, category: String,
  priceGBP: Number, compareAtGBP: Number,
  sizes: [{ label: String, stock: Number }],
  images: [{ url: String, alt: String, order: Number }],
  colors: [{ name: String, hex: String }],
  tags: [String],
  isFeatured: Boolean, isNewArrival: Boolean, isSale: Boolean, isArchived: Boolean,
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String, emailVerified: Date,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const User    = mongoose.models.User    || mongoose.model('User', userSchema);

const PRODUCTS = [
  {
    name: 'Ivory Draped Midi Dress',
    slug: 'ivory-draped-midi-dress',
    description: 'Elegant draped midi dress in flowing ivory fabric. Features a wrap-style front, adjustable tie waist, and midi-length hemline. Perfect for elevated casual occasions or evening events.',
    category: 'dresses',
    priceGBP: 18900,
    sizes: [{ label: 'XS', stock: 5 }, { label: 'S', stock: 8 }, { label: 'M', stock: 6 }, { label: 'L', stock: 4 }, { label: 'XL', stock: 2 }],
    images: [
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', alt: 'Ivory Draped Midi Dress', order: 0 },
      { url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80', alt: 'Ivory Draped Midi Dress Back', order: 1 },
    ],
    colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Ebony', hex: '#555D50' }],
    tags: ['dress', 'midi', 'draped', 'wrap'],
    isFeatured: true, isNewArrival: true, isSale: false, isArchived: false,
  },
  {
    name: 'Gold Shimmer Evening Gown',
    slug: 'gold-shimmer-evening-gown',
    description: 'Stunning floor-length evening gown with a luxurious gold shimmer finish. Fitted bodice, sweetheart neckline, and flowing skirt. Designed for those who want to make an entrance.',
    category: 'dresses',
    priceGBP: 34500,
    compareAtGBP: 42000,
    sizes: [{ label: 'XS', stock: 2 }, { label: 'S', stock: 4 }, { label: 'M', stock: 3 }, { label: 'L', stock: 2 }],
    images: [
      { url: 'https://images.unsplash.com/photo-1566479179817-1dcbee7553fb?w=800&q=80', alt: 'Gold Shimmer Evening Gown', order: 0 },
    ],
    colors: [{ name: 'Gold', hex: '#D4AF37' }],
    tags: ['gown', 'evening', 'formal', 'gold'],
    isFeatured: true, isNewArrival: false, isSale: true, isArchived: false,
  },
  {
    name: 'Ebony Tailored Blazer',
    slug: 'ebony-tailored-blazer',
    description: 'Sharp-shouldered tailored blazer in deep ebony. Single-button closure, structured lapels, and a fitted silhouette that commands attention. Pairs perfectly with tailored trousers or a flowing midi skirt.',
    category: 'jackets',
    priceGBP: 24900,
    sizes: [{ label: 'XS', stock: 3 }, { label: 'S', stock: 7 }, { label: 'M', stock: 9 }, { label: 'L', stock: 5 }, { label: 'XL', stock: 3 }],
    images: [
      { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', alt: 'Ebony Tailored Blazer', order: 0 },
    ],
    colors: [{ name: 'Ebony', hex: '#555D50' }, { name: 'Ivory', hex: '#FFFFF0' }],
    tags: ['blazer', 'jacket', 'tailored', 'workwear'],
    isFeatured: true, isNewArrival: true, isSale: false, isArchived: false,
  },
  {
    name: 'Silk Wide-Leg Trousers',
    slug: 'silk-wide-leg-trousers',
    description: 'Luxuriously fluid wide-leg trousers crafted from a silk-blend fabric. High-waisted with an elasticated back panel for comfort. A wardrobe essential that transitions effortlessly from day to evening.',
    category: 'trousers',
    priceGBP: 16500,
    sizes: [{ label: 'XS', stock: 4 }, { label: 'S', stock: 6 }, { label: 'M', stock: 8 }, { label: 'L', stock: 5 }],
    images: [
      { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b8e45?w=800&q=80', alt: 'Silk Wide-Leg Trousers', order: 0 },
    ],
    colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Ebony', hex: '#555D50' }, { name: 'Champagne', hex: '#F7E7CE' }],
    tags: ['trousers', 'wide-leg', 'silk', 'luxury'],
    isFeatured: false, isNewArrival: true, isSale: false, isArchived: false,
  },
  {
    name: 'Ruffle Sleeve Blouse',
    slug: 'ruffle-sleeve-blouse',
    description: 'Romantic ruffle-sleeved blouse in a lightweight chiffon fabric. Features a V-neckline, billowing ruffle cuffs, and a relaxed body. An effortlessly feminine piece that dresses up or down.',
    category: 'tops',
    priceGBP: 8900,
    sizes: [{ label: 'XS', stock: 10 }, { label: 'S', stock: 12 }, { label: 'M', stock: 10 }, { label: 'L', stock: 7 }, { label: 'XL', stock: 4 }],
    images: [
      { url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80', alt: 'Ruffle Sleeve Blouse', order: 0 },
    ],
    colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Blush', hex: '#FFB6C1' }],
    tags: ['blouse', 'top', 'ruffle', 'chiffon'],
    isFeatured: true, isNewArrival: false, isSale: false, isArchived: false,
  },
  {
    name: 'Asymmetric Midi Skirt',
    slug: 'asymmetric-midi-skirt',
    description: 'Modern asymmetric midi skirt with a high-low hemline. Crafted in a textured crepe fabric with a wrap-style front and concealed side zip. A contemporary piece with movement and elegance.',
    category: 'skirts',
    priceGBP: 13500,
    sizes: [{ label: 'XS', stock: 3 }, { label: 'S', stock: 5 }, { label: 'M', stock: 7 }, { label: 'L', stock: 4 }, { label: 'XL', stock: 2 }],
    images: [
      { url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80', alt: 'Asymmetric Midi Skirt', order: 0 },
    ],
    colors: [{ name: 'Ebony', hex: '#555D50' }, { name: 'Ivory', hex: '#FFFFF0' }],
    tags: ['skirt', 'midi', 'asymmetric', 'crepe'],
    isFeatured: false, isNewArrival: true, isSale: false, isArchived: false,
  },
  {
    name: 'Cashmere Turtleneck',
    slug: 'cashmere-turtleneck',
    description: 'Pure cashmere turtleneck in a refined ribbed knit. Exceptionally soft with a relaxed, oversized fit. A timeless investment piece that grows more beautiful with wear.',
    category: 'knitwear',
    priceGBP: 21500,
    sizes: [{ label: 'XS', stock: 2 }, { label: 'S', stock: 5 }, { label: 'M', stock: 8 }, { label: 'L', stock: 5 }, { label: 'XL', stock: 3 }],
    images: [
      { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80', alt: 'Cashmere Turtleneck', order: 0 },
    ],
    colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Camel', hex: '#C19A6B' }, { name: 'Ebony', hex: '#555D50' }],
    tags: ['knitwear', 'cashmere', 'turtleneck', 'luxury'],
    isFeatured: true, isNewArrival: false, isSale: false, isArchived: false,
  },
  {
    name: 'Chain-Link Belt',
    slug: 'chain-link-belt',
    description: 'Elegant gold-tone chain-link belt. Adjustable with a hook closure. Wear over blazers, dresses, or knitwear to add a luxurious finishing touch to any outfit.',
    category: 'accessories',
    priceGBP: 4900,
    sizes: [{ label: 'One Size', stock: 20 }],
    images: [
      { url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80', alt: 'Chain-Link Belt', order: 0 },
    ],
    colors: [{ name: 'Gold', hex: '#D4AF37' }, { name: 'Silver', hex: '#C0C0C0' }],
    tags: ['belt', 'accessories', 'chain', 'gold'],
    isFeatured: false, isNewArrival: true, isSale: false, isArchived: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    // Insert products
    const inserted = await Product.insertMany(PRODUCTS);
    console.log(`✓ Inserted ${inserted.length} products`);

    // Create admin user if not exists
    const bcrypt = require('bcryptjs');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@olubukola-couture.com';
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      const hashed = await bcrypt.hash('AdminPassword123!', 12);
      await User.create({
        name:          'Admin',
        email:         adminEmail,
        password:      hashed,
        role:          'ADMIN',
        emailVerified: new Date(),
      });
      console.log(`✓ Admin user created: ${adminEmail} (password: AdminPassword123!)`);
      console.log('  ⚠  CHANGE THIS PASSWORD IMMEDIATELY after first login.');
    } else {
      console.log(`✓ Admin user already exists: ${adminEmail}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Seed complete!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
