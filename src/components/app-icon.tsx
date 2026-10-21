import type { ReactNode } from 'react'

export type AppIconName =
  | 'bell'
  | 'chevron'
  | 'circle-arrow-right'
  | 'collapse-left'
  | 'collapse-right'
  | 'folder'
  | 'grid'
  | 'grid-plus'
  | 'help'
  | 'more'
  | 'plus'
  | 'search'
  | 'settings'
  | 'share'
  | 'spreadsheet'
  | 'upload'

const iconContent: Record<AppIconName, ReactNode> = {
  bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  'circle-arrow-right': <><path d="M7.3 4.6a10 10 0 1 1-1.2 14.8" /><path d="M2 12h12m-4-4 4 4-4 4" /></>,
  'collapse-left': <path d="m15 18-6-6 6-6M21 18l-6-6 6-6" />,
  'collapse-right': <path d="m9 18 6-6-6-6M3 18l6-6-6-6" />,
  folder: <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  grid: <path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" />,
  'grid-plus': <path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm13-1v8m-4-4h8" />,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 4.3 1.7c-1.1 1.1-1.9 1.4-1.9 3m0 3h.01" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  plus: <path d="M12 5v14m-7-7h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" /></>,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.1" /></>,
  spreadsheet: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 9v11m6-11v11m-6-6h6" /></>,
  upload: <><path d="M12 16V4m-5 5 5-5 5 5" /><path d="M4 16v4h16v-4" /></>,
}

type AppIconProps = {
  name: AppIconName
  className?: string
}

export function AppIcon({ name, className }: AppIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconContent[name]}
    </svg>
  )
}
