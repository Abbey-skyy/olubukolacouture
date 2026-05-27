'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '../../../../components/admin/ProductForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
  const { id }                    = useParams();
  const [product, setProduct]     = useState(null);
  const [loading,  setLoading]    = useState(true);
  const [notFound, setNotFound]   = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.product) setProduct(d.product);
        else setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (payload) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data;
  };

  if (loading) return (
    <div className="flex justify-center py-32">
      <Loader2 size={28} className="animate-spin text-gold" />
    </div>
  );

  if (notFound) return (
    <div className="text-center py-32">
      <p className="text-ebony-light">Product not found.</p>
      <Link href="/admin/products" className="btn-primary text-[10px] mt-4 inline-block">Back to Products</Link>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="btn-ghost flex items-center gap-2 text-[11px] tracking-[1.5px] uppercase text-ebony-light hover:text-ebony">
          <ArrowLeft size={15} /> Back to Products
        </Link>
      </div>
      <div className="mb-8">
        <p className="text-[10px] tracking-[3px] uppercase text-gold mb-1">Editing</p>
        <h1 className="font-serif text-3xl text-ebony tracking-[2px]">{product.name}</h1>
      </div>
      <ProductForm initialData={product} onSave={handleSave} />
    </div>
  );
}
