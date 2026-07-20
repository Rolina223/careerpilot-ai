import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getRecentActivity } from '../utils/activityStorage'
import { MotionButton, motionTokens } from './motion/MotionPrimitives'

const actions = [
  { label: 'Create or edit resume', hint: 'Resume builder', to: '/resume-builder', key: 'R' },
  { label: 'Analyze a job description', hint: 'AI workspace', to: '/analyze', key: 'A' },
  { label: 'View resume analytics', hint: 'Score and recommendations', to: '/resume-score', key: 'S' },
  { label: 'Practice an interview', hint: 'Interview practice', to: '/interview', key: 'I' },
  { label: 'Add an application', hint: 'Application tracker', to: '/tracker', key: 'T' },
  { label: 'Create an AI message', hint: 'AI messages', to: '/messages', key: 'M' },
  { label: 'Open settings', hint: 'Preferences and privacy', to: '/settings', key: ',' },
]

const rowMotion = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18, ease: motionTokens.ease } },
}

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const previousFocusRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement
      setQuery('')
      setActiveIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      previousFocusRef.current?.focus?.()
    }
  }, [open])

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const matches = useMemo(() => actions.filter(item => `${item.label} ${item.hint}`.toLowerCase().includes(query.toLowerCase())), [query])
  const recentItems = !query ? getRecentActivity().slice(0, 3).map(item => ({ label: item.action, hint: item.detail, to: item.to || '/dashboard', key: 'Recent' })) : []
  const visibleItems = [...matches, ...recentItems]
  const choose = (item) => {
    navigate(item.to)
    onClose()
  }
  const onInputKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex(index => Math.min(index + 1, Math.max(visibleItems.length - 1, 0)))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(index => Math.max(index - 1, 0))
    }
    if (event.key === 'Enter' && visibleItems[activeIndex]) {
      event.preventDefault()
      choose(visibleItems[activeIndex])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="command-overlay" role="dialog" aria-modal="true" aria-label="Command palette" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
          <motion.button className="command-backdrop" onClick={onClose} aria-label="Close command palette" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className="command-dialog"
            initial={{ opacity: 0, y: 14, scale: 0.975, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 8, scale: 0.985, filter: 'blur(5px)' }}
            transition={{ duration: 0.22, ease: motionTokens.ease }}
          >
            <div className="command-input-wrap">
              <span aria-hidden="true">/</span>
              <input
                ref={inputRef}
                value={query}
                onChange={event => { setQuery(event.target.value); setActiveIndex(0) }}
                onKeyDown={onInputKeyDown}
                placeholder="Search actions, pages, and tools..."
                aria-label="Search commands"
                aria-controls="command-results"
                aria-expanded={open}
                aria-activedescendant={visibleItems[activeIndex] ? `command-item-${activeIndex}` : undefined}
                role="combobox"
              />
              <kbd>Esc</kbd>
            </div>
            <motion.div id="command-results" className="command-results" role="listbox" aria-label="Command results" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}>
              <p id="command-results-heading">Quick actions</p>
              {visibleItems.map((item, index) => (
                <motion.div key={`${item.to}-${index}`} variants={rowMotion}>
                  <MotionButton id={`command-item-${index}`} type="button" role="option" aria-selected={activeIndex === index} onMouseEnter={() => setActiveIndex(index)} onClick={() => choose(item)}>
                    <span><strong>{item.label}</strong><small>{item.hint}</small></span>
                    <kbd>{item.key}</kbd>
                  </MotionButton>
                </motion.div>
              ))}
              {matches.length === 0 && <motion.div className="command-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>No matching action. Try "resume", "interview", or "settings".</motion.div>}
            </motion.div>
            <footer><span>Up/down to navigate</span><span>Enter to select</span><span>Esc to close</span></footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
