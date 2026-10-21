import { Link } from '@tanstack/react-router'
import { AppIcon } from './app-icon'

type WorkroomHeaderProps = {
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function WorkroomHeader({ isSidebarCollapsed, onToggleSidebar }: WorkroomHeaderProps) {
  return (
    <header className="workroom-header">
      <div className="header-brand">
        <button
          className="icon-button sidebar-toggle"
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isSidebarCollapsed}
        >
          <AppIcon name="collapse-left" />
        </button>
        <Link className="brand" to="/dashboard" aria-label="Workroom home">
          <img className="brand-logo" src="/logo/workroom-new-logo.svg" alt="" />
        </Link>
      </div>

      <label className="search-box">
        <AppIcon name="search" />
        <input type="search" placeholder="Start searching here..." aria-label="Search" />
      </label>

      <nav className="header-actions" aria-label="Workspace actions">
        <button className="header-action" type="button"><AppIcon name="share" /><span>Share</span></button>
        <button className="header-action" type="button"><AppIcon name="upload" /><span>Export</span></button>
        <button className="header-action" type="button"><AppIcon name="more" /><span>More</span></button>
        <button className="icon-button notification-button" type="button" aria-label="Notifications">
          <AppIcon name="bell" />
        </button>
        <Link className="header-signup" to="/sign-up">Sign up for free</Link>
      </nav>
    </header>
  )
}
