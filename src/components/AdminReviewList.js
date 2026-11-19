'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Stars from '@/components/Stars'
import { RATING_LABELS } from '@/utils/ratings'

function formatDate(ts) {
  return new Date(ts + 'Z').toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function AdminReviewList({ reviews }) {
  const router = useRouter()
  const [selected, setSelected] = useState([])
  const [busy, setBusy] = useState(false)

  const allSelected = reviews.length > 0 && selected.length === reviews.length

  function toggle(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function toggleAll() {
    setSelected(allSelected ? [] : reviews.map((r) => r.id))
  }

  async function deleteIds(ids, message) {
    if (!confirm(message)) return
    setBusy(true)
    const supabase = createClient()
    const { error } = await supabase.from('reviews').delete().in('id', ids)
    setBusy(false)

    if (error) {
      alert(error.message)
      return
    }
    setSelected([])
    router.refresh()
  }

  if (reviews.length === 0) {
    return <p className="text-stone-500">No reviews yet.</p>
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} />
          Select all
        </label>

        <button
          onClick={() =>
            deleteIds(
              selected,
              `Delete ${selected.length} selected review(s)? This can't be undone.`
            )
          }
          disabled={selected.length === 0 || busy}
          className="text-sm text-red-700 hover:underline disabled:opacity-40 disabled:no-underline"
        >
          Delete selected ({selected.length})
        </button>

        <button
          onClick={() =>
            deleteIds(
              reviews.map((r) => r.id),
              `Delete ALL ${reviews.length} reviews? This can't be undone.`
            )
          }
          disabled={busy}
          className="ml-auto text-sm font-semibold text-red-700 hover:underline disabled:opacity-40"
        >
          Delete all ({reviews.length})
        </button>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white border border-green-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selected.includes(r.id)}
                onChange={() => toggle(r.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-green-900">{r.customer_name}</p>
                    <p className="text-xs text-stone-500">
                      {r.products?.name ?? 'Deleted product'} · {formatDate(r.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      deleteIds([r.id], "Delete this review? This can't be undone.")
                    }
                    disabled={busy}
                    className="text-red-700 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <Stars value={r.rating} />
                  <span className="text-xs text-stone-500">{RATING_LABELS[r.rating]}</span>
                </div>
                <p className="mt-1 text-sm text-stone-700 whitespace-pre-line">{r.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}