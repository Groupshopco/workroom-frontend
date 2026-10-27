// Renders the shared SVG icons used across the app.
import type { ReactNode } from 'react'

export type AppIconName =
  | 'bell'
  | 'attachment'
  | 'chevron'
  | 'circle-arrow-right'
  | 'corner-down-left'
  | 'collapse-left'
  | 'collapse-right'
  | 'close'
  | 'copy'
  | 'focus'
  | 'folder'
  | 'grid'
  | 'grid-plus'
  | 'help'
  | 'filter'
  | 'more'
  | 'plus'
  | 'pencil'
  | 'redo'
  | 'refresh'
  | 'search'
  | 'send'
  | 'settings'
  | 'share'
  | 'spreadsheet'
  | 'star'
  | 'trash'
  | 'undo'
  | 'eye'
  | 'eye-off'
  | 'upload'
  | 'file-text'
  | 'link'
  | 'image'
  | 'computer-upload'

const iconContent: Record<AppIconName, ReactNode> = {
  bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" />,
  attachment: <path d="m8 12.5 5.2-5.2a3 3 0 0 1 4.2 4.2l-7.1 7.1a5 5 0 0 1-7.1-7.1l7.1-7.1" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  'circle-arrow-right': <><path d="M7.3 4.6a10 10 0 1 1-1.2 14.8" /><path d="M2 12h12m-4-4 4 4-4 4" /></>,
  'corner-down-left': <><path d="M9 10 4 15l5 5" /><path d="M20 4v7a4 4 0 0 1-4 4H4" /></>,
  'collapse-left': <path d="m15 18-6-6 6-6M21 18l-6-6 6-6" />,
  'collapse-right': <path d="m9 18 6-6-6-6M3 18l6-6-6-6" />,
  close: <path d="m18 6-12 12M6 6l12 12" />,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
  folder: <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  focus: <path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3M8 12h8" />,
  filter: <path d="M4 6h16M7 12h10m-7 6h4" />,
  grid: <path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" />,
  'grid-plus': <path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm13-1v8m-4-4h8" />,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 4.3 1.7c-1.1 1.1-1.9 1.4-1.9 3m0 3h.01" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  plus: <path d="M12 5v14m-7-7h14" />,
  pencil: <><path d="m16 4 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" /></>,
  redo: <><path d="M21 2v6h-6" /><path d="M20.95 13A9 9 0 1 1 18.48 5.52L21 8" /></>,
  refresh: <><path d="M20 7v5h-5" /><path d="M4 17v-5h5" /><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" /></>,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.1" /></>,
  spreadsheet: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 9v11m6-11v11m-6-6h6" /></>,
  star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m5 4v6m4-6v6" /></>,
  undo: <><path d="M3 2v6h6" /><path d="M3.05 13A9 9 0 1 0 5.52 5.52L3 8" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  'eye-off': <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /><path d="m3 3 18 18" /></>,
  upload: <><path d="M12 16V4m-5 5 5-5 5 5" /><path d="M4 16v4h16v-4" /></>,
  'file-text': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8m-8 4h8" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
  'computer-upload': <><rect x="3" y="3" width="18" height="14" rx="2" /><path d="M8 21h8m-4-4v4m0-14v6m-3-3 3-3 3 3" /></>,
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
