import type { ReactNode } from 'react'
import { AuthForm } from '../components/auth-form'

function CenteredAuthLayout({ children }: { children: ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center p-4">{children}</main>
}

export function SignInPage() {
  return (
    <CenteredAuthLayout>
      <AuthForm mode="sign-in" />
    </CenteredAuthLayout>
  )
}

export function SignUpPage() {
  return (
    <CenteredAuthLayout>
      <AuthForm mode="sign-up" />
    </CenteredAuthLayout>
  )
}
