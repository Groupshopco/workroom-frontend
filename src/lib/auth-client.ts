import { createAuthClient } from 'better-auth/react'

const defaultAuthBaseURL =
  typeof window !== 'undefined' ? `${window.location.origin}/api/auth` : 'http://localhost:3000/api/auth'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL || defaultAuthBaseURL,
})
