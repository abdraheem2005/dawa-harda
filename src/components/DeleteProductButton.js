'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function DeleteProductButton({ id, name }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="text-red-700 hover:underline text-sm">
      Delete
    </button>
  )
}