// Lists workrooms and starts creating new ones.
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { WorkroomCards } from '../components/workroom-cards'
import { WorkroomLayout } from '../components/workroom-layout'
import { WorkroomListToolbar } from '../components/workroom-list-toolbar'
import { createWorkroom, getWorkroomSummaries } from '../lib/workrooms'
/*
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
*/

export function DashboardPage() {
  const navigate = useNavigate()
  const [workrooms] = useState(getWorkroomSummaries)

  const handleCreateWorkroom = () => {
    const workroom = createWorkroom()
    void navigate({
      to: '/workroom/$workroomId',
      params: { workroomId: workroom.id },
    })
  }

  const handleOpenWorkroom = (workroomId: string) => {
    void navigate({
      to: '/workroom/$workroomId',
      params: { workroomId },
    })
  }

  return (
    <WorkroomLayout>
      <section className="dashboard-content">
        <WorkroomListToolbar
          title="Try Workroom: AI-Powered Spreadsheet editor"
          description="Quickly generate, customize, and manage large spreadsheets."
          onCreateWorkroom={handleCreateWorkroom}
        />
        <WorkroomCards items={workrooms} onOpen={handleOpenWorkroom} />
      </section>
    </WorkroomLayout>
  )
}
