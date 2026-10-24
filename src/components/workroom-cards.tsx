// Displays workrooms as cards and links created ones to their editor.
import { AppIcon } from './app-icon'
import { EmptyWorkrooms } from './empty-workrooms'
import type { WorkroomSummary } from '../lib/workrooms'

const members = [
  { initials: 'JD', name: 'Jordan Davis', color: 'gold' },
  { initials: 'SK', name: 'Sam Kim', color: 'blue' },
  { initials: 'AM', name: 'Alex Morgan', color: 'green' },
]

function WorkroomCard({
  title,
  spreadsheetCount,
  lastEdited,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: WorkroomSummary & {
  isFavorite: boolean
  onToggleFavorite: () => void
  onOpen?: () => void
}) {

  return (
    <article className={`workroom-card${onOpen ? ' is-openable' : ''}`}>
      <div className="workroom-card-topline">
        <span className="workroom-card-type">Personal</span>
        <div className="workroom-card-actions">
          <button
            className={`workroom-card-favorite${isFavorite ? ' is-favorite' : ''}`}
            type="button"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
            onClick={onToggleFavorite}
          >
            <AppIcon name="star" />
          </button>
          <button
            className="workroom-card-more"
            type="button"
            aria-label="More workroom options"
          >
            <AppIcon name="more" />
          </button>
        </div>
      </div>

      <h2 className="workroom-card-title">
        {onOpen ? (
          <button className="workroom-card-open" type="button" onClick={onOpen}>{title}</button>
        ) : title}
      </h2>
      <p className="workroom-card-spreadsheets">
        {spreadsheetCount} Spreadsheets
      </p>

      <div className="workroom-card-members" aria-label="Shared with Jordan Davis, Sam Kim, Alex Morgan, and one other">
        <div className="workroom-card-avatars">
          {members.map(({ initials, name, color }) => (
            <span
              className={`workroom-card-avatar is-${color}`}
              key={name}
              aria-hidden="true"
            >
              {initials}
            </span>
          ))}
        </div>
        <span className="workroom-card-member-count" aria-hidden="true">+1</span>
      </div>

      <p className="workroom-card-edited">Last edited {lastEdited}</p>
    </article>
  )
}

export function WorkroomCards({
  items,
  onOpen,
  favoriteById,
  onToggleFavorite,
}: {
  items: WorkroomSummary[]
  onOpen: (id: string) => void
  favoriteById: Record<string, boolean>
  onToggleFavorite: (id: string) => void
}) {
  if (items.length === 0) {
    return <EmptyWorkrooms />
  }

  return (
    <div className="workroom-cards-grid">
      {items.map((workroom) => (
        <WorkroomCard
          key={workroom.id}
          {...workroom}
          isFavorite={favoriteById[workroom.id] ?? true}
          onToggleFavorite={() => onToggleFavorite(workroom.id)}
          onOpen={workroom.isNew ? () => onOpen(workroom.id) : undefined}
        />
      ))}
    </div>
  )
}
