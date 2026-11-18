import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import DeleteProductButton from '@/components/DeleteProductButton'

export default async function AdminProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select()
    .order('created_at', { ascending: false })
  const products = data ?? []

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-green-900 text-amber-50 px-4 py-2 rounded-lg hover:bg-green-800"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 && <p className="text-stone-500">No products yet.</p>}

      <div className="space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-green-100 rounded-xl p-4 flex items-center gap-4"
          >
            {p.image_url ? (
              <img src={p.image_url} alt="" className="h-14 w-14 rounded-lg object-cover" />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-green-50 flex items-center justify-center text-2xl">
                🌿
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-green-900">{p.name}</p>
              <p className="text-sm text-stone-600">
                ₹{p.retail_price}
                {p.wholesale_enabled ? ` · wholesale ${p.wholesale_min_qty}+` : ''}
              </p>
            </div>
            <Link href={`/admin/products/${p.id}/edit`} className="text-green-800 hover:underline text-sm">
              Edit
            </Link>
            <DeleteProductButton id={p.id} name={p.name} />
          </div>
        ))}
      </div>
    </main>
  )
}