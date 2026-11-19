'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { RATING_LABELS } from '@/utils/ratings'

export default function ReviewForm({ productId }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [website, setWebsite] = useState('') // hidden trap field for bots
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const shown = hover || rating

  async function submit(e) {
    e.preventDefault()
    setError('')

    if (rating === 0) {
      setError('Please choose a star rating')
      return
    }
    if (website) {
      setDone(true) // a bot filled the hidden field, so pretend it worked
      return
    }

    setSending(true)
    const supabase = createClient()
    const { error } = await supabase.rpc('submit_review', {
      p_product_id: productId,
      p_name: name,
      p_rating: rating,
      p_comment: comment,
    })

    if (error) {
      setError(error.message)
      setSending(false)
      return
    }

    setDone(true)
    router.refresh()
  }

  if (done) {
    return (
      <p className="bg-green-50 border border-green-100 rounded-xl p-4 text-green-900">
        Thank you! Your review has been posted.
      </p>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white border border-green-100 rounded-2xl p-5 space-y-4"
    >
      <h3 className="font-semibold text-green-900">Write a review</h3>

      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''} - ${RATING_LABELS[n]}`}
            className={`text-3xl ${n <= shown ? 'text-amber-500' : 'text-stone-300'}`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm font-medium text-stone-700">
          {shown ? RATING_LABELS[shown] : 'Tap a star to rate'}
        </span>
      </div>

      <input
        placeholder="Your name"
        maxLength={60}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-2 border border-stone-300 rounded-lg"
      />

      <textarea
        placeholder="Share your experience (at least 5 characters)"
        rows={4}
        maxLength={1000}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        className="w-full px-4 py-2 border border-stone-300 rounded-lg"
      />

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      {error && <p className="text-red-700 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="bg-green-900 text-amber-50 px-6 py-2 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-60"
      >
        {sending ? 'Posting...' : 'Submit review'}
      </button>
    </form>
  )
}