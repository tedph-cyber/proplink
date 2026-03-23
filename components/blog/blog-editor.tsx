'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { BlogContent } from './blog-content'

interface BlogEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

type Tab = 'write' | 'preview'

const TOOLBAR_ACTIONS = [
  { label: 'B', title: 'Bold', wrap: ['**', '**'] },
  { label: 'I', title: 'Italic', wrap: ['_', '_'] },
  { label: 'H2', title: 'Heading 2', prefix: '## ' },
  { label: 'H3', title: 'Heading 3', prefix: '### ' },
  { label: '"', title: 'Blockquote', prefix: '> ' },
  { label: '—', title: 'Divider', insert: '\n---\n' },
]

export function BlogEditor({ value, onChange, placeholder }: BlogEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('write')
  const [isDesktop, setIsDesktop] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const applyAction = useCallback((action: typeof TOOLBAR_ACTIONS[number]) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end)

    let newValue = value
    let newCursorStart = start
    let newCursorEnd = end

    if (action.insert) {
      newValue = value.slice(0, start) + action.insert + value.slice(end)
      newCursorStart = newCursorEnd = start + action.insert.length
    } else if (action.prefix) {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      newValue = value.slice(0, lineStart) + action.prefix + value.slice(lineStart)
      newCursorStart = start + action.prefix.length
      newCursorEnd = end + action.prefix.length
    } else if (action.wrap) {
      const [before, after] = action.wrap
      newValue = value.slice(0, start) + before + selected + after + value.slice(end)
      newCursorStart = start + before.length
      newCursorEnd = end + before.length
    }

    onChange(newValue)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(newCursorStart, newCursorEnd)
    })
  }, [value, onChange])

  const showSideBySide = isDesktop

  return (
    <div className="rounded-xl border border-zinc-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-zinc-200 bg-zinc-50 px-3 py-2">
        <div className="flex items-center gap-1 flex-1">
          {TOOLBAR_ACTIONS.map(action => (
            <button
              key={action.title}
              type="button"
              title={action.title}
              onClick={() => applyAction(action)}
              className="rounded px-2 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-200 transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Mobile tab toggle */}
        {!showSideBySide && (
          <div className="flex rounded-lg border border-zinc-200 bg-white overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1 font-medium transition-colors ${
                activeTab === 'write' ? 'bg-[#0568fd] text-white' : 'text-zinc-600'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 font-medium transition-colors ${
                activeTab === 'preview' ? 'bg-[#0568fd] text-white' : 'text-zinc-600'
              }`}
            >
              Preview
            </button>
          </div>
        )}
      </div>

      {/* Editor body */}
      <div className={showSideBySide ? 'grid grid-cols-2 divide-x divide-zinc-200' : ''}>
        {/* Write pane */}
        {(showSideBySide || activeTab === 'write') && (
          <div>
            {showSideBySide && (
              <div className="px-3 py-2 text-xs font-medium text-zinc-500 border-b border-zinc-100 bg-zinc-50/50">
                Markdown
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder || 'Write your post in markdown…\n\n# Heading\n\nParagraph text here.\n\n## Sub-heading\n\n- Bullet point\n- Another point'}
              className="w-full min-h-[480px] resize-y p-4 text-sm text-zinc-800 font-mono leading-relaxed bg-white focus:outline-none placeholder:text-zinc-300"
            />
          </div>
        )}

        {/* Preview pane */}
        {(showSideBySide || activeTab === 'preview') && (
          <div>
            {showSideBySide && (
              <div className="px-3 py-2 text-xs font-medium text-zinc-500 border-b border-zinc-100 bg-zinc-50/50">
                Preview
              </div>
            )}
            <div className="min-h-[480px] p-4 overflow-auto bg-white">
              {value ? (
                <BlogContent content={value} />
              ) : (
                <p className="text-zinc-300 text-sm italic">Preview will appear here…</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
