import { Outlet, createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import { authClient } from './lib/auth-client'
import { SignInPage, SignUpPage } from './pages/auth-pages'
import { DashboardPage } from './pages/dashboard-page'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/sign-in' })
  },
})

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-in',
  component: SignInPage,
})

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-up',
  component: SignUpPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: async () => {
    const session = await authClient.getSession()
    if (!session.data?.session) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: DashboardPage,
})

const routeTree = rootRoute.addChildren([indexRoute, signInRoute, signUpRoute, dashboardRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
