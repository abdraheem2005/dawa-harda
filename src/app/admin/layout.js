import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default function AdminLayout({ children }) {
  return (
    <div>
      <div className="bg-green-50 border-b border-green-100 px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-green-900">
          <Link href="/admin" className="hover:underline">← Dashboard</Link>
          <Link href="/admin/products" className="hover:underline">Products</Link>
          <Link href="/admin/orders" className="hover:underline">Orders</Link>
          <Link href="/admin/reviews" className="hover:underline">Reviews</Link>
          <Link href="/admin/wholesale" className="hover:underline">Wholesale</Link>
        </div>
        <LogoutButton />
      </div>
      {children}
    </div>
  )
}