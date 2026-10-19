import { authClient } from '../lib/auth-client'
import { UsersTable } from '../components/users-table'

export function DashboardPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold">Dashboard</h1>
          <button
            type="button"
            onClick={async () => {
              await authClient.signOut()
              window.location.href = '/sign-in'
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="mb-4 text-xl font-semibold">Team Members</h2>
        <UsersTable />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 text-sm text-slate-600">
          Boilerplate footer
        </div>
      </footer>
    </div>
  )
}
