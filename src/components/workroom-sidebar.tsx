import { Link } from '@tanstack/react-router'
import { AppIcon, type AppIconName } from './app-icon'

type NavigationItem = {
  label: string
  icon: AppIconName
  active?: boolean
  muted?: boolean
}

const navigation: NavigationItem[] = [
  { label: 'Home', icon: 'grid-plus', active: true },
  { label: 'Collections', icon: 'chevron', muted: true },
  { label: 'Templates', icon: 'folder', muted: true },
  { label: 'Settings', icon: 'settings' },
  { label: 'Integrations', icon: 'grid', muted: true },
  { label: 'Billing', icon: 'spreadsheet' },
  { label: 'Help', icon: 'help' },
]

export function WorkroomSidebar() {
  return (
    <aside className="sidebar-frame">
      <div className="sidebar-panel">
        <nav className="sidebar-navigation" aria-label="Main navigation">
          {navigation.map(({ label, icon, active, muted }) => (
            <button
              className={`sidebar-link${active ? ' is-active' : ''}${muted ? ' is-muted' : ''}`}
              key={label}
              type="button"
              aria-current={active ? 'page' : undefined}
            >
              <AppIcon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <section className="sidebar-promo">
          <AppIcon name="circle-arrow-right" className="promo-icon" />
          <h2>Manage large spreadsheets</h2>
          <p>Sign up now to create custom data for your spreadsheets using AI.</p>
          <Link to="/sign-up" className="promo-button">Create Account</Link>
        </section>
      </div>
    </aside>
  )
}
