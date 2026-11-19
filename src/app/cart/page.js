'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { createClient } from '@/utils/supabase/client'
import { WHATSAPP_NUMBER } from '@/utils/config'

const STATES = [
  'Kerala','Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

function cleanPhone(raw) {
  let d = raw.replace(/\D/g, '')
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2)
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1)
  return d
}

const inputClass = (err) =>
  `w-full px-4 py-2 border rounded-lg ${err ? 'border-red-500' : 'border-stone-300'}`

function FieldError({ msg }) {
  return msg ? <p className="text-red-700 text-xs mt-1">{msg}</p> : null
}

export default function CartPage() {
  const { items, loaded, total, setQty, removeItem, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [line, setLine] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pin, setPin] = useState('')
  const [errors, setErrors] = useState({})
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [waLink, setWaLink] = useState('')
  const [orderNo, setOrderNo] = useState(null)

  function validate() {
    const e = {}
    if (!/^[\p{L}][\p{L}\p{M}\s.'-]{1,59}$/u.test(name.trim())) {
      e.name = 'Enter your full name (letters only, 2 to 60 characters)'
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      e.phone = 'Enter a valid 10-digit mobile number'
    }
    if (line.trim().length < 10) {
      e.line = 'Enter house/flat number, street and area (at least 10 characters)'
    }
    if (!/^[\p{L}\p{M}\s.'-]{2,40}$/u.test(city.trim())) {
      e.city = 'Enter your city or town'
    }
    if (!state) {
      e.state = 'Select your state'
    }
    if (!/^[1-9]\d{5}$/.test(pin)) {
      e.pin = 'Enter a valid 6-digit PIN code'
    }
    return e
  }

  async function placeOrder(ev) {
    ev.preventDefault()
    setError('')

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setPlacing(true)

    const cleanName = name.trim().replace(/\s+/g, ' ')
    const address = `${line.trim()}, ${city.trim()}, ${state} - ${pin}`

    const supabase = createClient()
    const { data, error } = await supabase.rpc('place_order', {
      p_name: cleanName,
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
      `Name: ${cleanName}\nPhone: ${phone}\nAddress: ${address}\n\n` +
      `Items:\n${lines}\n\n*Total: ₹${order.out_total}*`

    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

    setOrderNo(order.out_order_number)
    setWaLink(link)
    clearCart()

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    if (!isIOS) window.location.href = link
  }

  if (waLink) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-green-900 mb-3">Order #{orderNo} placed ✓</h1>
        <p className="text-stone-600 mb-6">
          Tap the button below to send your order details to us on WhatsApp.
        </p>
        <a
          href={waLink}
          className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
        >
          Open WhatsApp
        </a>
      </main>
    )
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
        noValidate
        className="mt-8 bg-white border border-green-100 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold text-green-900">Delivery details</h2>

        <div>
          <input
            placeholder="Full name"
            autoComplete="name"
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass(errors.name)}
          />
          <FieldError msg={errors.name} />
        </div>

        <div>
          <div className="flex gap-2">
            <span className="px-3 py-2 border border-stone-300 rounded-lg bg-stone-100 text-stone-700">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              autoComplete="tel-national"
              value={phone}
              onChange={(e) => setPhone(cleanPhone(e.target.value).slice(0, 10))}
              className={inputClass(errors.phone)}
            />
          </div>
          <FieldError msg={errors.phone} />
        </div>

        <div>
          <textarea
            placeholder="House / flat no., street, area, landmark"
            autoComplete="street-address"
            rows={3}
            maxLength={200}
            value={line}
            onChange={(e) => setLine(e.target.value)}
            className={inputClass(errors.line)}
          />
          <FieldError msg={errors.line} />
        </div>

        <div>
          <input
            placeholder="City / Town"
            autoComplete="address-level2"
            maxLength={40}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass(errors.city)}
          />
          <FieldError msg={errors.city} />
        </div>

        <div>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={inputClass(errors.state)}
          >
            <option value="">Select state</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <FieldError msg={errors.state} />
        </div>

        <div>
          <input
            inputMode="numeric"
            placeholder="PIN code (6 digits)"
            autoComplete="postal-code"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={inputClass(errors.pin)}
          />
          <FieldError msg={errors.pin} />
        </div>

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