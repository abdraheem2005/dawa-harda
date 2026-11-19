'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const MAX_IMAGE_MB = 10
const MAX_VIDEO_MB = 50

async function uploadFile(supabase, file, folder) {
  const ext = file.name.split('.').pop()
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('product-media').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('product-media').getPublicUrl(path)
  return data.publicUrl
}

function checkSizes(files, maxMb) {
  for (const f of files) {
    if (f.size > maxMb * 1024 * 1024) {
      throw new Error(`"${f.name}" is too big. Maximum is ${maxMb} MB per file.`)
    }
  }
}

export default function ProductForm({ product }) {
  const router = useRouter()
  const isEdit = Boolean(product)

  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [howToUse, setHowToUse] = useState(product?.how_to_use ?? '')
  const [ingredients, setIngredients] = useState(product?.ingredients ?? '')
  const [price, setPrice] = useState(product?.retail_price ?? '')
  const [wholesaleEnabled, setWholesaleEnabled] = useState(product?.wholesale_enabled ?? false)
  const [wholesaleMinQty, setWholesaleMinQty] = useState(product?.wholesale_min_qty ?? '')

  const [images, setImages] = useState(
    product?.images?.length ? product.images : product?.image_url ? [product.image_url] : []
  )
  const [videos, setVideos] = useState(
    product?.videos?.length ? product.videos : product?.video_url ? [product.video_url] : []
  )
  const [newImages, setNewImages] = useState([])
  const [newVideos, setNewVideos] = useState([])

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function makeCover(url) {
    setImages([url, ...images.filter((u) => u !== url)])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      checkSizes(newImages, MAX_IMAGE_MB)
      checkSizes(newVideos, MAX_VIDEO_MB)

      const supabase = createClient()

      const finalImages = [...images]
      for (const f of newImages) finalImages.push(await uploadFile(supabase, f, 'images'))

      const finalVideos = [...videos]
      for (const f of newVideos) finalVideos.push(await uploadFile(supabase, f, 'videos'))

      const row = {
        name,
        description: description || null,
        how_to_use: howToUse || null,
        ingredients: ingredients || null,
        retail_price: Number(price),
        wholesale_enabled: wholesaleEnabled,
        wholesale_min_qty: wholesaleEnabled ? Number(wholesaleMinQty) : null,
        images: finalImages,
        videos: finalVideos,
        image_url: finalImages[0] ?? null,
        video_url: finalVideos[0] ?? null,
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
        <label className={label}>How to use</label>
        <textarea
          className={input}
          rows={5}
          value={howToUse}
          onChange={(e) => setHowToUse(e.target.value)}
        />
      </div>

      <div>
        <label className={label}>Ingredients</label>
        <textarea
          className={input}
          rows={4}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
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
        <label className={label}>Photos (the first one is the cover)</label>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((url, i) => (
              <div key={url} className="w-24">
                <img src={url} alt="" className="h-24 w-24 rounded-lg object-cover" />
                <div className="mt-1 text-xs flex justify-between">
                  {i === 0 ? (
                    <span className="text-green-800 font-semibold">Cover</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makeCover(url)}
                      className="text-green-800 hover:underline"
                    >
                      Make cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((u) => u !== url))}
                    className="text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setNewImages(Array.from(e.target.files))}
        />
        {newImages.length > 0 && (
          <p className="text-xs text-stone-500 mt-1">{newImages.length} new photo(s) selected</p>
        )}
      </div>

      <div>
        <label className={label}>Videos (MP4 plays on all phones)</label>
        {videos.length > 0 && (
          <ul className="mb-3 space-y-1">
            {videos.map((url, i) => (
              <li key={url} className="flex items-center justify-between text-sm text-stone-700">
                <span>Video {i + 1}</span>
                <button
                  type="button"
                  onClick={() => setVideos(videos.filter((u) => u !== url))}
                  className="text-red-700 hover:underline text-xs"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={(e) => setNewVideos(Array.from(e.target.files))}
        />
        {newVideos.length > 0 && (
          <p className="text-xs text-stone-500 mt-1">{newVideos.length} new video(s) selected</p>
        )}
      </div>

      {error && <p className="text-red-700 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-green-900 text-amber-50 px-6 py-2 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-60"
      >
        {saving ? 'Saving (videos can take a while)...' : isEdit ? 'Save changes' : 'Add product'}
      </button>
    </form>
  )
}