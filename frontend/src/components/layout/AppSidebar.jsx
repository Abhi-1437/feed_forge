import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const navItems = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 13h6V4H4zM14 20h6v-9h-6zM14 10h6V4h-6zM4 20h6v-3H4z" />
      </svg>
    ),
  },
  {
    label: 'Feeds',
    to: '/feeds',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 11a8 8 0 0 1 8 8" />
        <path d="M5 4a15 15 0 0 1 15 15" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Articles',
    to: '/articles',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 6h14M5 12h14M5 18h9" />
      </svg>
    ),
  },
  {
    label: 'Folders',
    to: '/folders',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 7h5l2 2h11v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
]

function NavItems({ onNavigate }) {
  return navItems.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm font-medium transition ${
          isActive
            ? 'bg-white/10 text-white shadow-[0_20px_60px_-24px_rgba(255,90,9,0.45)]'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-pill"
              className="absolute inset-y-1 left-1 w-1 rounded-full bg-gradient-to-b from-[#FF5A09] via-[#EC7F37] to-[#BE4F0C]"
            />
          )}
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  ))
}

export default function AppSidebar({ isOpen, onClose }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-80 p-5 lg:block">
        <motion.div
          animate={{ width: '100%' }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="glass-card flex h-full flex-col rounded-[32px] p-5"
        >
          <div className="gradient-border overflow-hidden rounded-[28px] p-[1px]">
            <div className="rounded-[27px] bg-[linear-gradient(135deg,rgba(255,90,9,0.22),rgba(236,127,55,0.16),rgba(190,79,12,0.12),rgba(255,90,9,0.08))] p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-orange-200">FeedForge</p>
              <h2 className="mt-3 text-2xl font-bold text-white">Your AI reading cockpit</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Curate feeds, scan fast, and turn long-form stories into quick insight.
              </p>
            </div>
          </div>

          <nav className="mt-6 flex flex-1 flex-col gap-2">
            <NavItems />
          </nav>

          <div className="glass-panel rounded-[28px] p-5">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Reading pulse</p>
            <p className="mt-3 text-lg font-semibold text-white">Stay in flow with summaries, bookmarks, and clean focus mode.</p>
          </div>
        </motion.div>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={onClose}
              aria-label="Close sidebar"
            />
            <motion.aside
              className="glass-card absolute inset-y-0 left-0 w-[86vw] max-w-sm rounded-r-[32px] p-5"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-orange-200">FeedForge</p>
                  <p className="mt-2 text-lg font-semibold text-white">Navigation</p>
                </div>
                <button type="button" onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                  Close
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                <NavItems onNavigate={onClose} />
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
