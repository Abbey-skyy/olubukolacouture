import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductPageClient from '@/components/product/ProductPageClient';

export async function generateMetadata({ params }) {
  await connectDB();
  const product = await Product.findOne({ slug: params.id, isArchived: false }).lean();
  if (!product) return { title: 'Not Found' };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      images: [product.images?.[0]?.url],
    },
  };
}

export default async function ProductPage({ params }) {
  await connectDB();
  const product = await Product.findOne({ slug: params.id, isArchived: false }).lean();
  if (!product) notFound();

  // Related products (same category, exclude self)
  const related = await Product.find({
    category:   product.category,
    isArchived: false,
    _id:        { $ne: product._id },
  })
    .limit(4)
    .lean();

  return (
    <ProductPageClient
      product={JSON.parse(JSON.stringify(product))}
      related={JSON.parse(JSON.stringify(related))}
    />
  );
}
