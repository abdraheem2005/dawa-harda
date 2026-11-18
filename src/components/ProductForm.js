'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

async function uploadFile(supabase, file, folder) {
  const ext = file.name.split('.').pop()
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('product-media').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('product-media').getPublicUrl(path)
  return data.publicUrl
}

export default function ProductForm({ product }) {
  const router = useRouter()
  const isEdit = Boolean(product)

  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.retail_price ?? '')
  const [wholesaleEnabled, setWholesaleEnabled] = useState(product?.wholesale_enabled ?? false)
  const [wholesaleMinQty, setWholesaleMinQty] = useState(product?.wholesale_min_qty ?? '')
  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const supabase = createClient()

      let image_url = product?.image_url ?? null
      let video_url = product?.video_url ?? null
      if (imageFile) image_url = await uploadFile(supabase, imageFile, 'images')
      if (videoFile) video_url = await uploadFile(supabase, videoFile, 'videos')

      const row = {
        name,
        description: description || null,
        retail_price: Number(price),
        wholesale_enabled: wholesaleEnabled,
        wholesale_min_qty: wholesaleEnabled ? Number(wholesaleMinQty) : null,
        image_url,
        video_url,
      }

      const { error } = isEdit
        ? await supabase.from('products').update(row).eq('id', product.id)
        : await supabase.from('products').insert(row)

      if (error) throw error

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  const input = 'w-full px-4 py-2 border border-stone-300 rounded-lg bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={label}>Product name</label>
        <input className={input} value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label className={label}>Description</label>
        <textarea
          className={input}
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className={label}>Retail price (₹)</label>
        <input
          className={input}
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="wholesale"
          type="checkbox"
          checked={wholesaleEnabled}
          onChange={(e) => setWholesaleEnabled(e.target.checked)}
        />
        <label htmlFor="wholesale" className="text-sm text-stone-700">
          Enable wholesale enquiries for this product
        </label>
      </div>

      {wholesaleEnabled && (
        <div>
          <label className={label}>Minimum quantity for wholesale</label>
          <input
            className={input}
            type="number"
            min="1"
            value={wholesaleMinQty}
            onChange={(e) => setWholesaleMinQty(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <label className={label}>Photo</label>
        {product?.image_url && (
          <img src={product.image_url} alt="" className="h-24 rounded-lg mb-2 object-cover" />
        )}
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
      </div>

      <div>
        <label className={label}>Video</label>
        {product?.video_url && <p className="text-xs text-stone-500 mb-1">A video is already uploaded.</p>}
        <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
      </div>

      {error && <p className="text-red-700 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-green-900 text-amber-50 px-6 py-2 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-60"
      >
        {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add product'}
      </button>
    </form>
  )
}