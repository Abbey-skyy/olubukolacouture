'use client';
import ProductForm from '../../../../components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const handleSave = async (payload) => {
    const res = await fetch('/api/admin/products', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create product');
    return data;
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="btn-ghost flex items-center gap-2 text-[11px] tracking-[1.5px] uppercase text-ebony-light hover:text-ebony">
          <ArrowLeft size={15} /> Back to Products
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ebony tracking-[2px]">Add New Product</h1>
        <p className="text-[12px] text-ebony-light mt-1">Upload at least 4 images for best presentation</p>
      </div>
      <ProductForm onSave={handleSave} />
    </div>
  );
}
