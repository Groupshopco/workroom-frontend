import { useState } from 'react'
import type { ReactNode } from 'react'
import { WorkroomHeader } from './workroom-header'
import { WorkroomSidebar } from './workroom-sidebar'
import '../styles/workroom-layout.css'

type WorkroomLayoutProps = {
  children: ReactNode
}

export function WorkroomLayout({ children }: WorkroomLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className={`workroom-app${isSidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
      <WorkroomHeader
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
      />
      <div className="workroom-body">
        <WorkroomSidebar />
        <main className="workroom-main">{children}</main>
      </div>
    </div>
  )
}
