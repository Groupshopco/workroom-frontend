import { useRef } from 'react'
import type { FormEventHandler } from 'react'
import { AIModelPicker } from './ai-model-picker'
import { Modal } from './modal'

export type CommandDraft = {
  title: string
  description: string
  model: string
  prompt: string
  attachmentName: string
}

type CommandEditorModalProps = {
  isEditing: boolean
  draft: CommandDraft
  onDraftChange: (draft: CommandDraft) => void
  onSave: FormEventHandler<HTMLFormElement>
  onClose: () => void
  onDelete: () => void
}

export function CommandEditorModal({
  isEditing,
  draft,
  onDraftChange,
  onSave,
  onClose,
  onDelete,
}: CommandEditorModalProps) {
  const attachmentInput = useRef<HTMLInputElement>(null)

  return (
    <Modal
      title={isEditing ? 'Edit command' : 'New command'}
      className="command-editor-modal"
      onClose={onClose}
    >
      <form className="command-editor-form" onSubmit={onSave}>
        <label>
          <span>Command Title</span>
          <input
            autoFocus
            required
            maxLength={60}
            value={draft.title}
            onChange={(event) => onDraftChange({ ...draft, title: event.target.value })}
            placeholder="Product name"
          />
        </label>
        <label>
          <span>Description (Optional)</span>
          <input
            maxLength={500}
            value={draft.description}
            onChange={(event) => onDraftChange({ ...draft, description: event.target.value })}
            placeholder="Enter description"
          />
        </label>
        <label>
          <span>Model</span>
          <AIModelPicker
            value={draft.model}
            onChange={(model) => onDraftChange({ ...draft, model })}
          />
        </label>
        <div className="command-attachment-row">
          <input
            ref={attachmentInput}
            className="visually-hidden"
            type="file"
            aria-label="Choose a command attachment"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onDraftChange({ ...draft, attachmentName: file.name })
              event.target.value = ''
            }}
          />
          <button
            className="command-attachment-button"
            type="button"
            onClick={() => attachmentInput.current?.click()}
          >
            Add attachments
          </button>
          {draft.attachmentName && (
            <span className="command-attachment-name">{draft.attachmentName}</span>
          )}
        </div>
        <label>
          <span>Prompt</span>
          <textarea
            className="command-prompt-input"
            maxLength={2000}
            value={draft.prompt}
            onChange={(event) => onDraftChange({ ...draft, prompt: event.target.value })}
            placeholder="Enter your prompt here."
          />
        </label>
        <div className="command-editor-actions">
          <button className="command-save-button" type="submit">Save command</button>
          {isEditing ? (
            <button className="command-delete-button" type="button" onClick={onDelete}>
              Delete command
            </button>
          ) : (
            <button className="command-delete-button" type="button" onClick={onClose}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}
