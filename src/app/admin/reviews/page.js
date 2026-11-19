import { createClient } from '@/utils/supabase/server'
import AdminReviewList from '@/components/AdminReviewList'

export default async function AdminReviews() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('*, products(name)')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-green-900 mb-6">Reviews</h1>
      <AdminReviewList reviews={data ?? []} />
    </main>
  )
}