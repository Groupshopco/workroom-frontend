import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'

type AuthMode = 'sign-in' | 'sign-up'

type AuthFormProps = {
  mode: AuthMode
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const title = mode === 'sign-in' ? 'Sign In' : 'Sign Up'
  const isPasswordValid = password.length >= 7

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!isPasswordValid) {
      setError('Password must be at least 7 characters.')
      return
    }

    setIsSubmitting(true)

    const payload = { email, password }
    const response =
      mode === 'sign-in'
        ? await authClient.signIn.email(payload)
        : await authClient.signUp.email({
            ...payload,
            name: email.split('@')[0] || 'User',
          })

    setIsSubmitting(false)

    if (response.error) {
      setError(response.error.message || 'Authentication failed.')
      return
    }

    window.location.href = '/dashboard'
  }

  async function handleGoogleAuth() {
    setError('')
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
    })
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>

      <button
        type="button"
        onClick={handleGoogleAuth}
        className="mb-4 w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
      >
        Continue with Google
      </button>

      <div className="my-4 text-center text-sm text-slate-500">or</div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={7}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500">Minimum 7 characters.</p>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Please wait...' : title}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        {mode === 'sign-in' ? (
          <>
            New here?{' '}
            <Link to="/sign-up" className="font-semibold text-slate-900 underline">
              Create account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link to="/sign-in" className="font-semibold text-slate-900 underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
