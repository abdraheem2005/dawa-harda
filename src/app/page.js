import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="bg-green-900 text-amber-50 px-6 py-16 text-center">
        <h1 className="text-5xl font-bold tracking-wide">Dawa Harda</h1>
        <p className="mt-3 text-green-100 text-lg">
          Pure, natural herbal remedies — made the traditional way
        </p>
        <Link
          href="/products"
          className="inline-block mt-6 bg-amber-50 text-green-900 font-semibold px-6 py-3 rounded-full hover:bg-white transition-colors"
        >
          Shop Now
        </Link>
      </header>

      <section id="testimonials" className="bg-green-50 px-6 py-14 text-center">
        <h2 className="text-2xl font-semibold text-green-900 mb-4">What Our Customers Say</h2>
        <p className="text-stone-500">Testimonials coming soon.</p>
      </section>
    </main>
  )
}