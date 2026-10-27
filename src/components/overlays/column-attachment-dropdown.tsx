import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { AppIcon } from '../app-icon'
import './column-attachment-dropdown.css'

type ColumnAttachmentDropdownProps = {
  promptRef: RefObject<HTMLFormElement | null>
  menuRef: RefObject<HTMLDivElement | null>
  attachmentName: string
  attachmentImageName: string
  attachmentUrl: string
  onAttachmentChange: (name: string, imageName: string, url: string) => void
}

export function ColumnAttachmentDropdown({
  promptRef,
  menuRef,
  attachmentName,
  attachmentImageName,
  attachmentUrl,
  onAttachmentChange,
}: ColumnAttachmentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLinkInputOpen, setIsLinkInputOpen] = useState(Boolean(attachmentUrl))
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(Boolean(attachmentImageName))
  const [position, setPosition] = useState({ top: 8, left: 8 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const imageInput = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    if (!isOpen || !promptRef.current || !menuRef.current) return

    const updatePosition = () => {
      if (!promptRef.current || !menuRef.current) return

      const promptBounds = promptRef.current.getBoundingClientRect()
      const menuBounds = menuRef.current.getBoundingClientRect()
      const rightSideLeft = promptBounds.right + 10
      const leftSideLeft = promptBounds.left - menuBounds.width - 10
      const nextPosition = {
        top: Math.max(
          8,
          Math.min(promptBounds.bottom - menuBounds.height, window.innerHeight - menuBounds.height - 8),
        ),
        left: rightSideLeft + menuBounds.width <= window.innerWidth - 8
          ? rightSideLeft
          : Math.max(8, leftSideLeft),
      }

      setPosition((current) => (
        current.top === nextPosition.top && current.left === nextPosition.left
          ? current
          : nextPosition
      ))
    }

    updatePosition()
    const resizeObserver = new ResizeObserver(updatePosition)
    resizeObserver.observe(promptRef.current)
    resizeObserver.observe(menuRef.current)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isImageUploadOpen, isLinkInputOpen, isOpen, menuRef, promptRef])

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return
      if (triggerRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return
      setIsOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen, menuRef])

  const updateAttachment = (file: File | undefined, isImage: boolean) => {
    if (file) {
      onAttachmentChange(
        isImage ? attachmentName : file.name,
        isImage ? file.name : attachmentImageName,
        attachmentUrl,
      )
    }
  }

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>, isImage = false) => {
    updateAttachment(event.target.files?.[0], isImage)
    event.target.value = ''
  }

  const dropFile = (event: React.DragEvent<HTMLDivElement>, isImage = false) => {
    event.preventDefault()
    updateAttachment(event.dataTransfer.files[0], isImage)
  }

  const attachmentCount = Number(Boolean(attachmentName))
    + Number(Boolean(attachmentImageName))
    + Number(Boolean(attachmentUrl.trim()))

  return (
    <>
      <button
        ref={triggerRef}
        className="column-attachment-trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        Add attachments
        {attachmentCount > 0 && (
          <span className="column-attachment-count" aria-label={`${attachmentCount} attachments`}>
            {attachmentCount}
          </span>
        )}
        <AppIcon name="chevron" />
      </button>
      <input
        ref={fileInput}
        className="visually-hidden"
        type="file"
        aria-label="Upload a file"
        onChange={selectFile}
      />
      <input
        ref={imageInput}
        className="visually-hidden"
        type="file"
        accept="image/*"
        aria-label="Add an image"
        onChange={(event) => selectFile(event, true)}
      />
      {isOpen && createPortal(
        <div
          ref={menuRef}
          className="column-attachment-menu"
          role="menu"
          aria-label="Add an attachment"
          style={{ top: position.top, left: position.left }}
        >
          {attachmentName ? (
            <div className="column-attachment-file">
              <AppIcon name="file-text" />
              <span className="column-attachment-file-name" title={attachmentName}>
                {attachmentName}
              </span>
              <button
                className="column-attachment-remove"
                type="button"
                aria-label={`Remove ${attachmentName}`}
                onClick={() => onAttachmentChange('', attachmentImageName, attachmentUrl)}
              >
                <AppIcon name="close" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              role="menuitem"
              onClick={() => fileInput.current?.click()}
            >
              <AppIcon name="file-text" />
              <span>Upload a file</span>
            </button>
          )}
          {isLinkInputOpen ? (
            <div className="column-attachment-link-field">
              <AppIcon name="link" />
              <input
                autoFocus
                type="url"
                aria-label="Attachment link"
                placeholder="https://"
                value={attachmentUrl}
                onChange={(event) => onAttachmentChange(
                  attachmentName,
                  attachmentImageName,
                  event.target.value,
                )}
              />
              <button
                className="column-attachment-remove"
                type="button"
                aria-label="Remove attachment link"
                onClick={() => {
                  onAttachmentChange(attachmentName, attachmentImageName, '')
                  setIsLinkInputOpen(false)
                }}
              >
                <AppIcon name="close" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              role="menuitem"
              onClick={() => setIsLinkInputOpen(true)}
            >
              <AppIcon name="link" />
              <span>Add a link</span>
            </button>
          )}
          {attachmentImageName ? (
            <div className="column-attachment-file">
              <AppIcon name="image" />
              <span className="column-attachment-file-name" title={attachmentImageName}>
                {attachmentImageName}
              </span>
              <button
                className="column-attachment-remove"
                type="button"
                aria-label={`Remove ${attachmentImageName}`}
                onClick={() => onAttachmentChange(attachmentName, '', attachmentUrl)}
              >
                <AppIcon name="close" />
              </button>
            </div>
          ) : isImageUploadOpen ? (
            <div
              className="column-attachment-file column-attachment-image-dropzone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => dropFile(event, true)}
            >
              <AppIcon name="image" />
              <span>
                Drag an image here or{' '}
                <button
                  className="column-attachment-upload-link"
                  type="button"
                  onClick={() => imageInput.current?.click()}
                >
                  upload image
                </button>
              </span>
            </div>
          ) : (
            <button
              type="button"
              role="menuitem"
              onClick={() => setIsImageUploadOpen(true)}
            >
              <AppIcon name="image" />
              <span>Upload an image</span>
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => fileInput.current?.click()}
          >
            <AppIcon name="computer-upload" />
            <span>Upload from your computer</span>
          </button>
        </div>,
        document.body,
      )}
    </>
  )
}
