import { AppIcon } from './app-icon'

type WorkroomListToolbarProps = {
  title: string
  description: string
}

export function WorkroomListToolbar({ title, description }: WorkroomListToolbarProps) {
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
        <button className="sort-workrooms-button" type="button">
          <AppIcon name="chevron" />
          <span>Most recent</span>
        </button>
        <button className="new-workroom-button" type="button">
          <AppIcon name="plus" />
          <span>New workroom</span>
        </button>
      </div>
    </div>
  )
}
