'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

function formatDate(ts) {
  return new Date(ts + 'Z').toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function AdminWholesaleList({ enquiries }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function deleteIds(ids, message) {
    if (!confirm(message)) return
    setBusy(true)
    const supabase = createClient()
    const { error } = await supabase.from('wholesale_enquiries').delete().in('id', ids)
    setBusy(false)

    if (error) {
      alert(error.message)
      return
    }
    router.refresh()
  }

  if (enquiries.length === 0) {
    return <p className="text-stone-500">No wholesale enquiries yet.</p>
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() =>
            deleteIds(
              enquiries.map((e) => e.id),
              `Delete ALL ${enquiries.length} enquiries? This can't be undone.`
            )
          }
          disabled={busy}
          className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-40"
        >
          Delete all ({enquiries.length})
        </button>
      </div>

      <div className="space-y-3">
        {enquiries.map((q) => (
          <div key={q.id} className="bg-white border border-green-100 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-green-900">{q.customer_name}</p>
                <p className="text-sm text-stone-700">{q.phone}</p>
                <p className="text-xs text-stone-500 mt-1">
                  {q.products?.name ?? 'Deleted product'} · {formatDate(q.created_at)}
                </p>
              </div>
              <button
                onClick={() => deleteIds([q.id], "Delete this enquiry? This can't be undone.")}
                disabled={busy}
                className="text-red-700 text-sm hover:underline"
              >
                Delete
              </button>
            </div>

            {/^\d{10}$/.test(q.phone) && (
              <a
                href={`https://wa.me/91${q.phone}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-green-800 hover:underline"
              >
                Message on WhatsApp
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}