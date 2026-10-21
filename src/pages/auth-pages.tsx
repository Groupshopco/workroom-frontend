import type { ReactNode } from 'react'
import { AuthForm } from '../components/auth-form'
import '../styles/auth-pages.css'

function CenteredAuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-page">
      <LinkBrand />
      <div className="auth-page-content">{children}</div>
    </main>
  )
}

function LinkBrand() {
  return (
    <a className="auth-brand" href="/sign-in" aria-label="Workroom">
      <img src="/logo/workroom-new-logo.svg" alt="" />
    </a>
  )
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
