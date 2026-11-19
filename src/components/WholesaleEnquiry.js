'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { WHATSAPP_NUMBER } from '@/utils/config'

function cleanPhone(raw) {
  let d = raw.replace(/\D/g, '')
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2)
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1)
  return d
}

const inputClass = (err) =>
  `w-full px-4 py-2 border rounded-lg ${err ? 'border-red-500' : 'border-stone-300'}`

export default function WholesaleEnquiry({ productId, productName, minQty }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [waLink, setWaLink] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')

    const found = {}
    if (!/^[\p{L}][\p{L}\p{M}\s.'-]{1,59}$/u.test(name.trim())) {
      found.name = 'Enter your full name (letters only)'
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      found.phone = 'Enter a valid 10-digit mobile number'
    }
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSending(true)
    const cleanName = name.trim().replace(/\s+/g, ' ')

    const supabase = createClient()
    const { error } = await supabase.rpc('submit_wholesale_enquiry', {
      p_product_id: productId,
      p_name: cleanName,
      p_phone: phone,
    })

    if (error) {
      setError(error.message)
      setSending(false)
      return
    }

    const message =
      `Hi, I'm interested in a *wholesale* order for ${productName} ` +
      `(min. ${minQty} units).\n\nName: ${cleanName}\nPhone: ${phone}`
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

    setWaLink(link)

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    if (!isIOS) window.location.href = link
  }

  if (waLink) {
    return (
      <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
        <p className="font-semibold text-green-900 mb-3">
          Thank you! Tap below to message us on WhatsApp.
        </p>
        <a
          href={waLink}
          className="inline-block bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600"
        >
          Open WhatsApp
        </a>
      </div>
    )
  }

  return (
    <div className="mt-6 border-t border-stone-200 pt-5">
      <p className="text-sm text-stone-700">
        Buying in bulk? Wholesale available for orders of {minQty}+ units.
      </p>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="mt-3 w-full border-2 border-green-900 text-green-900 py-2 rounded-lg font-semibold hover:bg-green-50"
        >
          Wholesale enquiry
        </button>
      ) : (
        <form onSubmit={submit} noValidate className="mt-3 space-y-3">
          <div>
            <input
              placeholder="Your name"
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass(errors.name)}
            />
            {errors.name && <p className="text-red-700 text-xs mt-1">{errors.name}</p>}
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
                value={phone}
                onChange={(e) => setPhone(cleanPhone(e.target.value).slice(0, 10))}
                className={inputClass(errors.phone)}
              />
            </div>
            {errors.phone && <p className="text-red-700 text-xs mt-1">{errors.phone}</p>}
          </div>

          {error && <p className="text-red-700 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-green-900 text-amber-50 py-2 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-60"
          >
            {sending ? 'Sending...' : 'Continue on WhatsApp'}
          </button>
        </form>
      )}
    </div>
  )
}