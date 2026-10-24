// Shows the dashboard heading and workroom list actions.
import { AppIcon } from './app-icon'
import { SortDropdown, type SortOption } from './overlays/sort-dropdown'

type WorkroomListToolbarProps = {
  title: string
  description: string
  onCreateWorkroom: () => void
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
}

export function WorkroomListToolbar({
  title,
  description,
  onCreateWorkroom,
  sortBy,
  onSortChange,
}: WorkroomListToolbarProps) {
  return (
    <div className="workroom-list-toolbar">
      <div className="page-heading">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="workroom-toolbar-actions">
        <button
          className="toolbar-search-button"
          type="button"
          aria-label="Search workrooms"
        >
          <AppIcon name="search" />
        </button>
        <SortDropdown
          value={sortBy}
          onChange={onSortChange}
          label="Sort workrooms"
          className="sort-workrooms-dropdown"
        />
        <button className="new-workroom-button" type="button" onClick={onCreateWorkroom}>
          <AppIcon name="plus" />
          <span>New workroom</span>
        </button>
      </div>
    </div>
  )
}
