import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useAuth } from '../AuthProvider'
import Footer from './Footer'
import CommandPalette from './CommandPalette'
import { logActivity } from '../utils/activityStorage'
import { MotionButton, ToastMotion, motionTokens, pageMotion, staggerContainer, staggerItem } from './motion/MotionPrimitives'

const workspaceLinks = [
  { to: '/dashboard', label: 'Overview', icon: 'grid' },
  { to: '/analyze', label: 'AI workspace', icon: 'spark' },
  { to: '/resume-builder', label: 'Resume builder', icon: 'file' },
  { to: '/resume-templates', label: 'Templates', icon: 'layout' },
  { to: '/resume-score', label: 'Analytics', icon: 'chart' },
  { to: '/jobs', label: 'Jobs', icon: 'briefcase' },
  { to: '/tracker', label: 'Applications', icon: 'check' },
  { to: '/messages', label: 'AI messages', icon: 'message' },
  { to: '/email-templates', label: 'Email studio', icon: 'mail' },
]

const practiceLinks = [
  { to: '/interview', label: 'Interview practice', icon: 'mic' },
  { to: '/aptitude', label: 'Aptitude prep', icon: 'brain' },
  { to: '/coding', label: 'Coding prep', icon: 'code' },
]

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    spark: <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" />,
    file: <><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5M9 12h6M9 16h6" /></>,
    layout: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M9 9h12" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5h8v2M3 12h18M10 12v2h4v-2" /></>,
    check: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="m8 12 2.5 2.5L16 9" /></>,
    message: <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.5-.8L4 20l1.5-4A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
    brain: <path d="M9.5 4a3.5 3.5 0 0 0-6.4 2 3 3 0 0 0 .7 5.8A3.5 3.5 0 0 0 7 17h2.5V4Zm5 0a3.5 3.5 0 0 1 6.4 2 3 3 0 0 1-.7 5.8A3.5 3.5 0 0 1 17 17h-2.5V4Z" />,
    code: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.2 2.2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3.2v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.2-2.2.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H5v-3.2h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.2-2.2.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3.5h3.2v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.2 2.2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
  }

  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Sidebar({ mobile, onNavigate }) {
  const { pathname } = useLocation()
  const isActive = (to) => pathname === to || (to === '/analyze' && pathname === '/')
  const group = (title, links) => (
    <motion.div className="shell-nav-group" variants={staggerContainer} initial="initial" animate="animate">
      <p>{title}</p>
      {links.map((link) => (
        <motion.div key={link.to} variants={staggerItem} whileHover={{ x: 2 }} whileTap={{ scale: 0.985 }} transition={motionTokens.spring}>
          <Link to={link.to} onClick={onNavigate} className={`shell-nav-link ${isActive(link.to) ? 'active' : ''}`} aria-current={isActive(link.to) ? 'page' : undefined}>
            <Icon name={link.icon} />
            <span>{link.label}</span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )

  return (
    <motion.aside
      className={`app-sidebar ${mobile ? 'mobile' : ''}`}
      aria-label="Workspace navigation"
      initial={{ opacity: 0, x: mobile ? -22 : -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: motionTokens.ease }}
    >
      <Link className="shell-brand" to="/dashboard" onClick={onNavigate}>
        <motion.span className="brand-mark" whileHover={{ rotate: -8, scale: 1.04 }} transition={motionTokens.spring}>
          <Icon name="spark" size={17} />
        </motion.span>
        <span>CareerPilot</span>
      </Link>
      {group('Workspace', workspaceLinks)}
      {group('Practice', practiceLinks)}
      <div className="sidebar-bottom">
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }} transition={motionTokens.spring}>
          <Link to="/pricing" onClick={onNavigate} className="shell-upgrade">
            <span>Upgrade your search</span>
            <small>View plans -&gt;</small>
          </Link>
        </motion.div>
        <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.985 }} transition={motionTokens.spring}>
          <Link className="shell-nav-link" to="/settings" onClick={onNavigate} aria-current={isActive('/settings') ? 'page' : undefined}>
            <Icon name="settings" />
            <span>Settings</span>
          </Link>
        </motion.div>
      </div>
    </motion.aside>
  )
}

export default function AppShell({ children, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [shortcutHint, setShortcutHint] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const initials = (user?.email || 'CP').slice(0, 2).toUpperCase()

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
        setShortcutHint('Open command palette')
      }
      if (event.key === '/') {
        const activeTag = document.activeElement?.tagName?.toLowerCase()
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          event.preventDefault()
          setCommandOpen(true)
          setShortcutHint('Search actions')
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!shortcutHint) return undefined
    const timer = window.setTimeout(() => setShortcutHint(''), 1800)
    return () => window.clearTimeout(timer)
  }, [shortcutHint])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div className="workspace-shell" initial={false}>
      <Sidebar />
      <motion.header
        className={`workspace-header ${scrolled ? 'scrolled' : ''}`}
        initial={reduceMotion ? false : { y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: motionTokens.ease }}
      >
        <MotionButton className="header-icon mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
          <Icon name="menu" />
        </MotionButton>
        <MotionButton className="command-trigger" type="button" onClick={() => setCommandOpen(true)} aria-label="Open command palette">
          <Icon name="search" size={16} />
          <span>Search your workspace</span>
          <kbd>Ctrl K</kbd>
        </MotionButton>
        <div className="header-actions">
          <MotionButton className="header-icon" onClick={onToggleTheme} aria-label="Toggle color theme">
            <Icon name="sun" size={17} />
          </MotionButton>
          <MotionButton
            className="avatar-button"
            aria-label="Sign out"
            onClick={async () => {
              logActivity('Signed out', 'Left the workspace', '/')
              await signOut()
              navigate('/')
            }}
          >
            {initials}
          </MotionButton>
        </div>
      </motion.header>

      <AnimatePresence>{shortcutHint && <ToastMotion className="workspace-shortcut-hint">{shortcutHint}</ToastMotion>}</AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="mobile-nav-overlay" role="dialog" aria-modal="true" aria-labelledby="mobile-nav-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <motion.div className="mobile-nav-panel" initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={motionTokens.softSpring}>
              <h2 id="mobile-nav-title" className="sr-only">Workspace navigation</h2>
              <MotionButton className="header-icon close-nav" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                <Icon name="close" />
              </MotionButton>
              <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
            </motion.div>
            <button className="mobile-nav-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} id="main-content" className="workspace-content" tabIndex={-1} {...pageMotion}>
          {children}
        </motion.main>
      </AnimatePresence>
    </motion.div>
  )
}

export function MarketingShell({ children, onToggleTheme }) {
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div className="marketing-shell" initial={false}>
      <motion.header className={`marketing-header ${scrolled ? 'scrolled' : ''}`} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.28, ease: motionTokens.ease }}>
        <Link className="shell-brand" to="/">
          <motion.span className="brand-mark" whileHover={{ rotate: -8, scale: 1.04 }} transition={motionTokens.spring}>
            <Icon name="spark" size={17} />
          </motion.span>
          <span>CareerPilot</span>
        </Link>
        <nav>
          <Link to="/pricing">Pricing</Link>
          <Link to="/login">Sign in</Link>
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link to={user ? '/dashboard' : '/login'} className="marketing-cta">{user ? 'Open workspace' : 'Get started'}</Link>
          </motion.div>
          <MotionButton className="header-icon" onClick={onToggleTheme} aria-label="Toggle color theme">
            <Icon name="sun" size={17} />
          </MotionButton>
        </nav>
      </motion.header>
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} {...pageMotion}>{children}</motion.div>
      </AnimatePresence>
      <Footer />
    </motion.div>
  )
}
