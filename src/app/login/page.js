'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-sm border border-green-100"
      >
        <h1 className="text-2xl font-bold text-green-900 mb-6 text-center">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border border-stone-300 rounded-lg"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 pr-12 border border-stone-300 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-green-900"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c4.5 0 8.3 2.9 9.5 7a10.5 10.5 0 01-2.7 4.3M6.6 6.6A10.5 10.5 0 002.5 12c1.2 4.1 5 7 9.5 7a9.8 9.8 0 004.1-.9" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12C3.7 7.9 7.5 5 12 5s8.3 2.9 9.5 7c-1.2 4.1-5 7-9.5 7s-8.3-2.9-9.5-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {error && <p className="text-red-700 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-900 text-amber-50 py-2 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </main>
  )
}