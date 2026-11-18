import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LogoutButton from '@/components/LogoutButton'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-green-900">Admin Dashboard</h1>
      <p className="mt-2 text-stone-600">Logged in as {data.claims.email}</p>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </main>
  )
}