import { createClient } from '@/utils/supabase/server'
import OrderActions from '@/components/OrderActions'

const BADGE = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

// Supabase gives times in UTC without a "Z", so add it, then show Indian time
function formatDate(ts) {
  return new Date(ts + 'Z').toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default async function AdminOrders() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select()
    .order('created_at', { ascending: false })
  const orders = data ?? []

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-green-900 mb-6">Orders</h1>

      {orders.length === 0 && <p className="text-stone-500">No orders yet.</p>}

      <div className="space-y-4">
        {orders.map((o) => {
          const phoneOk = /^\d{10}$/.test(o.phone)
          return (
            <div key={o.id} className="bg-white border border-green-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-green-900">Order #{o.order_number}</p>
                  <p className="text-xs text-stone-500">{formatDate(o.created_at)}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    BADGE[o.status] ?? 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {o.status}
                </span>
              </div>

              <div className="mt-3 text-sm text-stone-700 space-y-1">
                <p>
                  <span className="font-medium">{o.customer_name}</span> · {o.phone}
                </p>
                <p>{o.address}</p>
              </div>

              <ul className="mt-3 text-sm text-stone-700 border-t border-stone-100 pt-3 space-y-1">
                {(o.items ?? []).map((it, i) => (
                  <li key={i}>
                    {it.name} × {it.qty} — ₹{it.price * it.qty}
                  </li>
                ))}
              </ul>

              <p className="mt-2 font-bold text-green-900">Total: ₹{o.total_amount}</p>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <OrderActions id={o.id} status={o.status} orderNumber={o.order_number} />
                {phoneOk && (
                  <a
                    href={`https://wa.me/91${o.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-green-800 hover:underline"
                  >
                    Message customer
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}