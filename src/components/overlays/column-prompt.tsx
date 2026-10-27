import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AppIcon } from '../app-icon'
import { ColumnAttachmentDropdown } from './column-attachment-dropdown'
import './column-prompt.css'
import type { WorkroomColumnPromptConfig } from '../../lib/workrooms'

type ColumnPromptProps = {
  isOpen: boolean
  anchorElement: HTMLButtonElement | null
  initialTitle: string
  initialConfig: WorkroomColumnPromptConfig | null
  onClose: () => void
  onSaveColumn: (title: string, config: WorkroomColumnPromptConfig) => void
}

export function ColumnPrompt({
  isOpen,
  anchorElement,
  initialTitle,
  initialConfig,
  onClose,
  onSaveColumn,
}: ColumnPromptProps) {
  const [position, setPosition] = useState({ top: 8, left: 8 })
  const [columnTitle, setColumnTitle] = useState(initialTitle)
  const [columnContext, setColumnContext] = useState(initialConfig?.context ?? '')
  const [columnModel, setColumnModel] = useState(initialConfig?.model ?? 'GPT - 4o mini')
  const [isColumnAutoRunEnabled, setIsColumnAutoRunEnabled] = useState(initialConfig?.autoRun ?? false)
  const [isColumnFocusMode, setIsColumnFocusMode] = useState(initialConfig?.focusMode ?? false)
  const [columnPrompt, setColumnPrompt] = useState(initialConfig?.prompt ?? '')
  const [columnAttachmentName, setColumnAttachmentName] = useState(initialConfig?.attachmentName ?? '')
  const [columnAttachmentImageName, setColumnAttachmentImageName] = useState(initialConfig?.attachmentImageName ?? '')
  const [columnAttachmentUrl, setColumnAttachmentUrl] = useState(initialConfig?.attachmentUrl ?? '')
  const dialogRef = useRef<HTMLFormElement>(null)
  const attachmentMenu = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!isOpen || !anchorElement || !dialogRef.current) return

    const updatePosition = () => {
      if (!dialogRef.current) return

      const buttonBounds = anchorElement.getBoundingClientRect()
      const dialogBounds = dialogRef.current.getBoundingClientRect()
      const nextPosition = {
        top: Math.max(
          8,
          Math.min(buttonBounds.bottom + 12, window.innerHeight - dialogBounds.height - 8),
        ),
        left: Math.max(
          8,
          Math.min(buttonBounds.left - 40, window.innerWidth - dialogBounds.width - 8),
        ),
      }

      setPosition((current) => (
        current.top === nextPosition.top && current.left === nextPosition.left
          ? current
          : nextPosition
      ))
    }

    updatePosition()
    const resizeObserver = new ResizeObserver(updatePosition)
    resizeObserver.observe(dialogRef.current)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [anchorElement, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (
        dialogRef.current?.contains(target)
        || anchorElement?.contains(target)
        || attachmentMenu.current?.contains(target)
      ) return
      onClose()
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.target instanceof Node && attachmentMenu.current?.contains(event.target)) return
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [anchorElement, isOpen, onClose])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = columnTitle.trim()
    if (!title) return

    onSaveColumn(title, {
      context: columnContext.trim(),
      model: columnModel,
      autoRun: isColumnAutoRunEnabled,
      focusMode: isColumnFocusMode,
      attachmentName: columnAttachmentName,
      attachmentImageName: columnAttachmentImageName,
      attachmentUrl: columnAttachmentUrl.trim(),
      prompt: columnPrompt.trim(),
    })
  }

  if (!isOpen) return null

  return (
    <>
      {createPortal(
        <form
          ref={dialogRef}
          className="column-prompt-dialog"
          role="dialog"
          aria-modal="false"
          aria-labelledby="column-prompt-title"
          style={{ top: position.top, left: position.left }}
          onSubmit={handleSubmit}
        >
          <header className="column-prompt-header">
            <h2 id="column-prompt-title">Configure column prompt</h2>
            <button
              className="column-prompt-close"
              type="button"
              aria-label="Close column prompt"
              onClick={onClose}
            >
              <AppIcon name="close" />
            </button>
          </header>
          <label className="column-prompt-field">
            <span>Column Title</span>
            <input
              autoFocus
              required
              value={columnTitle}
              placeholder="Add column title"
              onChange={(event) => setColumnTitle(event.target.value)}
            />
          </label>
          <label className="column-prompt-field">
            <span>Context (Optional)</span>
            <span className="column-prompt-textarea-wrap">
              <textarea
                value={columnContext}
                placeholder="Add context for the column"
                onChange={(event) => setColumnContext(event.target.value)}
              />
              <button
                type="button"
                aria-label="Clear column context"
                onClick={() => setColumnContext('')}
              >
                <AppIcon name="refresh" />
              </button>
            </span>
          </label>
          <label className="column-prompt-field">
            <span>Model</span>
            <select value={columnModel} onChange={(event) => setColumnModel(event.target.value)}>
              <option>GPT - 4o mini</option>
              <option>GPT 3.5</option>
              <option>GPT 4</option>
            </select>
          </label>
          <button
            className="column-prompt-auto-run"
            type="button"
            aria-pressed={isColumnAutoRunEnabled}
            onClick={() => setIsColumnAutoRunEnabled((enabled) => !enabled)}
          >
            <span>Auto run prompt</span>
            <span
              className={`column-prompt-toggle${isColumnAutoRunEnabled ? ' is-on' : ''}`}
              aria-hidden="true"
            >
              <span />
            </span>
          </button>
          <div className="column-prompt-tools">
            <ColumnAttachmentDropdown
              promptRef={dialogRef}
              menuRef={attachmentMenu}
              attachmentName={columnAttachmentName}
              attachmentImageName={columnAttachmentImageName}
              attachmentUrl={columnAttachmentUrl}
              onAttachmentChange={(name, imageName, url) => {
                setColumnAttachmentName(name)
                setColumnAttachmentImageName(imageName)
                setColumnAttachmentUrl(url)
              }}
            />
            <button
              type="button"
              aria-pressed={isColumnFocusMode}
              onClick={() => setIsColumnFocusMode((enabled) => !enabled)}
            >
              Add Focus <AppIcon name="chevron" />
            </button>
          </div>
          <label className="column-prompt-field column-prompt-main-field">
            <span>Prompt</span>
            <span className="column-prompt-textarea-wrap">
              <textarea
                value={columnPrompt}
                placeholder="Enter your prompt here."
                onChange={(event) => setColumnPrompt(event.target.value)}
              />
              <button
                className="column-prompt-submit"
                type="submit"
                aria-label={initialTitle ? 'Save column settings' : 'Add configured column'}
                disabled={!columnTitle.trim()}
              >
                <AppIcon name="corner-down-left" />
              </button>
            </span>
          </label>
        </form>,
        document.body,
      )}
    </>
  )
}
