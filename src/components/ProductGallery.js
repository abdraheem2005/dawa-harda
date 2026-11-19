'use client'

import { useState } from 'react'

export default function ProductGallery({ images, videos, name }) {
  const media = [
    ...images.map((url) => ({ type: 'image', url })),
    ...videos.map((url) => ({ type: 'video', url })),
  ]
  const [active, setActive] = useState(0)

  if (media.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-green-50 flex items-center justify-center text-7xl">
        🌿
      </div>
    )
  }

  const current = media[active] ?? media[0]

  return (
    <div>
      <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-green-100">
        {current.type === 'image' ? (
          <img src={current.url} alt={name} className="h-full w-full object-contain" />
        ) : (
          <video
            key={current.url}
            src={current.url}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full bg-black"
          />
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {media.map((m, i) => (
            <button
              key={m.url}
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 ${
                i === active ? 'border-green-800' : 'border-transparent'
              }`}
            >
              {m.type === 'image' ? (
                <img src={m.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-stone-800 text-white flex items-center justify-center">
                  ▶
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}