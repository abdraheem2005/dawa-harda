'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { createClient } from '@/utils/supabase/client'
import { WHATSAPP_NUMBER } from '@/utils/config'

export default function CartPage() {
  const { items, loaded, total, setQty, removeItem, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  async function placeOrder(e) {
    e.preventDefault()
    setPlacing(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase.rpc('place_order', {
      p_name: name,
      p_phone: phone,
      p_address: address,
      p_items: items.map((i) => ({ product_id: i.id, qty: i.qty })),
    })

    if (error || !data || data.length === 0) {
      setError(error?.message ?? 'Something went wrong. Please try again.')
      setPlacing(false)
      return
    }

    const order = data[0]
    const lines = order.out_items
      .map((it, n) => `${n + 1}. ${it.name} × ${it.qty} = ₹${it.price * it.qty}`)
      .join('\n')

    const message =
      `*New Order #${order.out_order_number}*\n\n` +
      `Name: ${name}\nPhone: ${phone}\nAddress: ${address}\n\n` +
      `Items:\n${lines}\n\n*Total: ₹${order.out_total}*`

    clearCart()
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

  if (!loaded) {
    return <main className="max-w-3xl mx-auto px-6 py-10 text-stone-500">Loading...</main>
  }

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-green-900 mb-3">Your cart is empty</h1>
        <Link href="/products" className="text-green-800 underline">
          Browse products
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-green-900 mb-6">Your Cart</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-green-100 rounded-xl p-4 flex items-center gap-4"
          >
            {item.image_url ? (
              <img src={item.image_url} alt="" className="h-14 w-14 rounded-lg object-cover" />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-green-50 flex items-center justify-center text-2xl">
                🌿
              </div>
            )}

            <div className="flex-1">
              <p className="font-semibold text-green-900">{item.name}</p>
              <p className="text-sm text-stone-600">₹{item.price} each</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(item.id, item.qty - 1)}
                className="h-8 w-8 rounded-full bg-stone-200 text-stone-800"
              >
                −
              </button>
              <span className="w-6 text-center text-stone-800">{item.qty}</span>
              <button
                onClick={() => setQty(item.id, item.qty + 1)}
                className="h-8 w-8 rounded-full bg-stone-200 text-stone-800"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-700 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <p className="text-right text-xl font-bold text-green-900 mt-6">Total: ₹{total}</p>

      <form
        onSubmit={placeOrder}
        className="mt-8 bg-white border border-green-100 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold text-green-900">Delivery details</h2>

        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-stone-300 rounded-lg"
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          minLength={10}
          className="w-full px-4 py-2 border border-stone-300 rounded-lg"
        />
        <textarea
          placeholder="Full delivery address"
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="w-full px-4 py-2 border border-stone-300 rounded-lg"
        />

        {error && <p className="text-red-700 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={placing}
          className="w-full bg-green-900 text-amber-50 py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-60"
        >
          {placing ? 'Placing order...' : 'Place order on WhatsApp'}
        </button>
      </form>
    </main>
  )
}