// Lists workrooms and starts creating new ones.
import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { SortOption } from '../components/overlays/sort-dropdown'
import { WorkroomCards } from '../components/workroom-cards'
import { WorkroomLayout } from '../components/workroom-layout'
import { WorkroomListToolbar } from '../components/workroom-list-toolbar'
import { createWorkroom, getWorkroomSummaries } from '../lib/workrooms'

const relativeTimeReference = Date.UTC(9999, 0, 1)

export function DashboardPage() {
  const navigate = useNavigate()
  const [workrooms] = useState(getWorkroomSummaries)
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [favoriteById, setFavoriteById] = useState<Record<string, boolean>>({})

  const sortedWorkrooms = useMemo(() => {
    const getEditedAt = (value: string) => {
      const date = Date.parse(value)
      if (!Number.isNaN(date)) return date
      if (value.toLowerCase() === 'just now') return relativeTimeReference

      const relativeTime = value.match(/(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago/i)
      if (!relativeTime) return 0

      const unitsInMinutes: Record<string, number> = {
        minute: 1,
        hour: 60,
        day: 1440,
        week: 10080,
        month: 43200,
        year: 525600,
      }
      const elapsed = Number(relativeTime[1]) * unitsInMinutes[relativeTime[2].toLowerCase()]
      return relativeTimeReference - elapsed * 60_000
    }

    return [...workrooms].sort((first, second) => {
      if (sortBy === 'favorites') {
        return Number(favoriteById[second.id] ?? true) - Number(favoriteById[first.id] ?? true)
      }
      const firstEditedAt = getEditedAt(first.lastEdited)
      const secondEditedAt = getEditedAt(second.lastEdited)
      if (sortBy === 'oldest') return firstEditedAt - secondEditedAt
      return secondEditedAt - firstEditedAt
    })
  }, [workrooms, sortBy, favoriteById])

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
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <WorkroomCards
          items={sortedWorkrooms}
          onOpen={handleOpenWorkroom}
          favoriteById={favoriteById}
          onToggleFavorite={(workroomId) => setFavoriteById((current) => ({
            ...current,
            [workroomId]: !(current[workroomId] ?? true),
          }))}
        />
      </section>
    </WorkroomLayout>
  )
}
