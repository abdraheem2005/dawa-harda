import { createClient } from '@/utils/supabase/server'
import AdminWholesaleList from '@/components/AdminWholesaleList'

export default async function AdminWholesale() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('wholesale_enquiries')
    .select('*, products(name)')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-green-900 mb-6">Wholesale Enquiries</h1>
      <AdminWholesaleList enquiries={data ?? []} />
    </main>
  )
}