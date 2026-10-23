import { useRef, useState } from 'react'
import { AppIcon } from './app-icon'
import '../styles/command-center.css'

type CommandCenterProps = {
  onClose: () => void
}

export function CommandCenter({ onClose }: CommandCenterProps) {
  const [prompt, setPrompt] = useState('')
  const [attachedFile, setAttachedFile] = useState('')
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  return (
    <aside className={`command-center${isFocusMode ? ' is-focus-mode' : ''}`} aria-label="Command center">
      <section className="command-center-card">
        <header className="command-center-header">
          <h2>Command center</h2>
          <div className="command-center-actions">
            <label className="command-center-model">
              <span className="visually-hidden">AI model</span>
              <select defaultValue="GPT 3.5" aria-label="AI model">
                <option>GPT 3.5</option>
                <option>GPT 4</option>
              </select>
            </label>
            <button
              className="command-center-icon-button"
              type="button"
              aria-label="Hide command center"
              onClick={onClose}
            >
              <AppIcon name="eye-off" />
            </button>
            <div className="command-center-menu-wrap">
              <button
                className="command-center-icon-button"
                type="button"
                aria-label="More command center options"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                <AppIcon name="more" />
              </button>
              {isMenuOpen && (
                <button
                  className="command-center-menu-item"
                  type="button"
                  onClick={() => {
                    setPrompt('')
                    setNotice('')
                    setAttachedFile('')
                    setIsMenuOpen(false)
                  }}
                >
                  Clear prompt
                </button>
              )}
            </div>
          </div>
        </header>

        <a className="command-center-help" href="#command-center-prompt">
          How to use the prompt box
        </a>
        <p className="command-center-description">
          Enter your request to work with this spreadsheet. Attach a file or use Focus Mode for a
          more specific task.
        </p>
      </section>

      <form
        className="command-center-composer"
        onSubmit={(event) => {
          event.preventDefault()
          if (!prompt.trim()) return
          setNotice('AI actions are not connected yet. Your prompt is ready to use.')
        }}
      >
        <label className="visually-hidden" htmlFor="command-center-prompt">Your spreadsheet request</label>
        <textarea
          id="command-center-prompt"
          value={prompt}
          placeholder="Ask Workroom to find, organize, or update data in your spreadsheet..."
          onChange={(event) => {
            setPrompt(event.target.value)
            setNotice('')
          }}
        />
        {attachedFile && <span className="command-center-attachment">{attachedFile}</span>}
        {notice && <p className="command-center-notice" role="status">{notice}</p>}
        <div className="command-center-composer-actions">
          <button
            className="command-center-utility-button"
            type="button"
            aria-label="Attach a file"
            onClick={() => fileInput.current?.click()}
          >
            <AppIcon name="attachment" />
          </button>
          <input
            ref={fileInput}
            className="visually-hidden"
            type="file"
            aria-label="Choose a file to attach"
            onChange={(event) => {
              setAttachedFile(event.target.files?.[0]?.name ?? '')
              event.target.value = ''
            }}
          />
          <button
            className={`command-center-utility-button command-center-focus-button${isFocusMode ? ' is-active' : ''}`}
            type="button"
            aria-pressed={isFocusMode}
            onClick={() => setIsFocusMode((active) => !active)}
          >
            <AppIcon name="focus" />
            <span>Focus</span>
          </button>
          <button
            className="command-center-send-button"
            type="submit"
            aria-label="Send prompt"
            disabled={!prompt.trim()}
          >
            <AppIcon name="corner-down-left" />
          </button>
        </div>
      </form>
    </aside>
  )
}
