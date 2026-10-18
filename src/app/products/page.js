import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: products, error } = await supabase.from('products').select()

  if (error) {
    return <p className="p-8 text-red-700">Error: {error.message}</p>
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="bg-green-900 text-amber-50 px-6 py-10 text-center">
        <h1 className="text-4xl font-bold tracking-wide">Dawa Harda</h1>
        <p className="mt-2 text-green-100">
          Pure, natural herbal remedies — made the traditional way
        </p>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-green-900 mb-6">Our Products</h2>

        {products.length === 0 ? (
          <p className="text-stone-500">No products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-green-50 flex items-center justify-center text-4xl">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>🌿</span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-green-900">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-stone-600 mt-1">{product.description}</p>
                  )}
                  <p className="mt-3 text-xl font-bold text-green-800">₹{product.retail_price}</p>

                  {product.wholesale_enabled && (
                    <p className="mt-1 text-xs text-amber-700">
                      Wholesale available for {product.wholesale_min_qty}+ units
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}