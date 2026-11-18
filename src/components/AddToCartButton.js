'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartProvider'

export default function AddToCartButton({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleClick() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      onClick={handleClick}
      className="mt-4 w-full bg-green-900 text-amber-50 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors"
    >
      {added ? 'Added ✓' : 'Add to cart'}
    </button>
  )
}