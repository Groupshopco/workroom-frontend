// Handles email and Google sign-in or sign-up.
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

  const title = mode === 'sign-in' ? 'Sign in' : 'Sign up'
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
    <section className={`auth-form auth-form--${mode}`}>
      <h1 className="auth-title">{title}</h1>

      <button
        type="button"
        onClick={handleGoogleAuth}
        className="google-auth-button"
      >
        <svg aria-hidden="true" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.27h2.92c1.7-1.56 2.68-3.86 2.68-6.63Z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.17l-2.92-2.27c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.34A9 9 0 0 0 9 18Z" />
          <path fill="#FBBC05" d="M3.97 10.71a5.4 5.4 0 0 1 0-3.42V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.34Z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.43 1.35l2.57-2.57A8.6 8.6 0 0 0 9 0a9 9 0 0 0-8.04 4.95l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58Z" />
        </svg>
        Continue with Google
      </button>

      <div className="auth-divider" aria-hidden="true" />

      <form onSubmit={handleSubmit} className="auth-fields">
        <div className="auth-field">
          <label htmlFor={`${mode}-email`}>Enter email address</label>
          <input
            id={`${mode}-email`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor={`${mode}-password`}>Create Password</label>
          <input
            id={`${mode}-password`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={7}
          />
          {mode === 'sign-up' ? (
            <p className="password-hint">Use at least 7 characters.</p>
          ) : null}
        </div>

        {error ? <p className="auth-error" role="alert">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="auth-submit-button"
        >
          {isSubmitting ? 'Please wait...' : mode === 'sign-up' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <p className="auth-switch">
        {mode === 'sign-in' ? (
          <>
            Don’t have an account?{' '}
            <Link to="/sign-up">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already a member?{' '}
            <Link to="/sign-in">
              Login
            </Link>
          </>
        )}
      </p>
      {mode === 'sign-up' ? (
        <p className="auth-legal">
          By continuing, you acknowledge that you understand and
          <br />
          agree to the <strong>Terms &amp; Conditions</strong> and <strong>Privacy Policy</strong>
        </p>
      ) : null}
    </section>
  )
}
