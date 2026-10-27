// Composes the shared header, sidebar, and page content layout.
import { useState } from 'react'
import type { ReactNode } from 'react'
import { WorkroomHeader } from './workroom-header'
import { WorkroomSidebar } from './workroom-sidebar'
import '../styles/workroom-layout.css'
import '../styles/dashboard.css'
import '../styles/workroom-cards.css'
import '../styles/spreadsheet-editor.css'
import '../styles/responsive.css'

type WorkroomLayoutProps = {
  children: ReactNode
  isCommandCenterOpen?: boolean
  onCommandCenterOpenChange?: (isOpen: boolean) => void
  isSidebarCollapsedByDefault?: boolean
}

export function WorkroomLayout({
  children,
  isCommandCenterOpen = false,
  onCommandCenterOpenChange,
  isSidebarCollapsedByDefault = false,
}: WorkroomLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isSidebarCollapsedByDefault)
  const isSidebarHidden = isSidebarCollapsed || isCommandCenterOpen

  const toggleSidebar = () => {
    if (isCommandCenterOpen) {
      onCommandCenterOpenChange?.(false)
      setIsSidebarCollapsed(false)
      return
    }
    if (isSidebarCollapsed) onCommandCenterOpenChange?.(false)
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className={`workroom-app${isSidebarHidden ? ' is-sidebar-collapsed' : ''}`}>
      <WorkroomHeader
        isSidebarCollapsed={isSidebarHidden}
        onToggleSidebar={toggleSidebar}
      />
      <div className="workroom-body">
        <WorkroomSidebar />
        <main className="workroom-main">{children}</main>
      </div>
    </div>
  )
}
