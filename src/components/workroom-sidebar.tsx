// Renders the primary navigation and sign-up promotion.
import { Link, useRouterState } from '@tanstack/react-router'
import { AppIcon, type AppIconName } from './app-icon'

type NavigationItem = {
  label: string
  icon: AppIconName
  to?: '/dashboard' | '/command-studio'
  muted?: boolean
}

const navigation: NavigationItem[] = [
  { label: 'Home', icon: 'grid-plus', to: '/dashboard' },
  { label: 'Command Studio', icon: 'spreadsheet', to: '/command-studio' },
  { label: 'Collections', icon: 'chevron', muted: true },
  { label: 'Templates', icon: 'folder', muted: true },
  { label: 'Settings', icon: 'settings' },
  { label: 'Integrations', icon: 'grid', muted: true },
  { label: 'Billing', icon: 'spreadsheet' },
  { label: 'Help', icon: 'help' },
]

export function WorkroomSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <aside className="sidebar-frame">
      <div className="sidebar-panel">
        <nav className="sidebar-navigation" aria-label="Main navigation">
          {navigation.map(({ label, icon, to, muted }) => {
            const active = to === '/dashboard'
              ? pathname === '/dashboard'
              : to === '/command-studio'
                ? pathname === '/command-studio'
                : false
            const className = `sidebar-link${active ? ' is-active' : ''}${muted ? ' is-muted' : ''}`
            const content = <><AppIcon name={icon} /><span>{label}</span></>

            return to ? (
              <Link
                className={className}
                key={label}
                to={to}
                aria-current={active ? 'page' : undefined}
              >
                {content}
              </Link>
            ) : (
              <button className={className} key={label} type="button">
                {content}
              </button>
            )
          })}
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
