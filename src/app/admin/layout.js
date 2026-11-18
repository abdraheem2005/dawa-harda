import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default function AdminLayout({ children }) {
  return (
    <div>
      <div className="bg-green-50 border-b border-green-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-5 text-sm font-medium text-green-900">
          <Link href="/admin" className="hover:underline">← Dashboard</Link>
          <Link href="/admin/products" className="hover:underline">Products</Link>
        </div>
        <LogoutButton />
      </div>
      {children}
    </div>
  )
}