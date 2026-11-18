import Link from 'next/link'
import CartLink from '@/components/CartLink'

export default function Navbar() {
  return (
    <nav className="bg-green-900 text-amber-50 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold tracking-wide">
        Dawa Harda
      </Link>

      <div className="flex gap-6 text-sm font-medium">
        <Link href="/" className="hover:text-green-200 transition-colors">Home</Link>
        <Link href="/products" className="hover:text-green-200 transition-colors">Products</Link>
        <Link href="/about" className="hover:text-green-200 transition-colors">About</Link>
        <Link href="/#testimonials" className="hover:text-green-200 transition-colors">Reviews</Link>
        <CartLink />
      </div>
    </nav>
  )
}