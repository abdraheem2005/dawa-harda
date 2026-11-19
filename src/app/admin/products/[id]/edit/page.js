import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ProductGallery from '@/components/ProductGallery'
import AddToCartButton from '@/components/AddToCartButton'
import Stars from '@/components/Stars'
import ReviewForm from '@/components/ReviewForm'
import { RATING_LABELS } from '@/utils/ratings'

function formatDate(ts) {
  return new Date(ts + 'Z').toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
  })
}

export default async function ProductPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select().eq('id', id).single()

  if (!product) notFound()

  const { data: reviewData } = await supabase
    .from('reviews')
    .select()
    .eq('product_id', id)
    .order('created_at', { ascending: false })
  const reviews = reviewData ?? []
  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const images = product.images?.length
    ? product.images
    : product.image_url
      ? [product.image_url]
      : []
  const videos = product.videos?.length
    ? product.videos
    : product.video_url
      ? [product.video_url]
      : []

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link href="/products" className="text-sm text-green-800 hover:underline">
          ← All products
        </Link>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery images={images} videos={videos} name={product.name} />

          <div>
            <h1 className="text-3xl font-bold text-green-900">{product.name}</h1>

            {reviews.length > 0 && (
              <a href="#reviews" className="mt-2 flex items-center gap-2 hover:underline">
                <Stars value={average} />
                <span className="text-sm text-stone-600">
                  {average.toFixed(1)} ({reviews.length} review{reviews.length > 1 ? 's' : ''})
                </span>
              </a>
            )}

            <p className="mt-3 text-3xl font-bold text-green-800">₹{product.retail_price}</p>

            {product.description && (
              <p className="mt-4 text-stone-700 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            )}

            {product.wholesale_enabled && (
              <p className="mt-4 text-sm text-amber-700">
                Wholesale available for {product.wholesale_min_qty}+ units
              </p>
            )}

            <AddToCartButton product={product} />
          </div>
        </div>

        {(product.how_to_use || product.ingredients) && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.how_to_use && (
              <section className="bg-white border border-green-100 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-green-900 mb-2">How to use</h2>
                <p className="text-stone-700 whitespace-pre-line leading-relaxed">
                  {product.how_to_use}
                </p>
              </section>
            )}
            {product.ingredients && (
              <section className="bg-white border border-green-100 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-green-900 mb-2">Ingredients</h2>
                <p className="text-stone-700 whitespace-pre-line leading-relaxed">
                  {product.ingredients}
                </p>
              </section>
            )}
          </div>
        )}

        <section id="reviews" className="mt-12">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Customer reviews</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              {reviews.length === 0 && (
                <p className="text-stone-500">No reviews yet. Be the first to write one!</p>
              )}
              {reviews.map((r) => (
                <div key={r.id} className="bg-white border border-green-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-green-900">{r.customer_name}</p>
                    <p className="text-xs text-stone-500">{formatDate(r.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stars value={r.rating} size="text-base" />
                    <span className="text-xs text-stone-500">{RATING_LABELS[r.rating]}</span>
                  </div>
                  <p className="mt-1 text-sm text-stone-700 whitespace-pre-line">{r.comment}</p>
                </div>
              ))}
            </div>

            <ReviewForm productId={product.id} />
          </div>
        </section>
      </div>
    </main>
  )
}