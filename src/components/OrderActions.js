'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled']

export default function OrderActions({ id, status, orderNumber }) {
  const router = useRouter()
  const [value, setValue] = useState(status)

  async function changeStatus(e) {
    const next = e.target.value
    const previous = value
    setValue(next)

    const supabase = createClient()
    const { error } = await supabase.from('orders').update({ status: next }).eq('id', id)

    if (error) {
      alert(error.message)
      setValue(previous)
      return
    }
    router.refresh()
  }

  async function remove() {
    if (!confirm(`Delete order #${orderNumber}? This can't be undone.`)) return

    const supabase = createClient()
    const { error } = await supabase.from('orders').delete().eq('id', id)

    if (error) {
      alert(error.message)
      return
    }
    router.refresh()
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={value}
        onChange={changeStatus}
        className="px-3 py-1 border border-stone-300 rounded-lg text-sm"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button onClick={remove} className="text-red-700 text-sm hover:underline">
        Delete
      </button>
    </div>
  )
}