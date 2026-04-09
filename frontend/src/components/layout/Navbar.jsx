import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

export default function Navbar({ onToggleSidebar }) {
  const [search, setSearch] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleAuthChange = () => setToken(localStorage.getItem('token'))
    window.addEventListener('storage', handleAuthChange)
    window.addEventListener('authChange', handleAuthChange)
    return () => {
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearch(params.get('q') || '')
  }, [location.search])

  const handleSearch = (event) => {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/articles?q=${encodeURIComponent(query)}` : '/articles')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.dispatchEvent(new Event('authChange'))
    setToken(null)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 px-4 py-4 sm:px-6 lg:px-8">
      <div className="glass-card shadow-glow mx-auto flex max-w-7xl flex-wrap items-center gap-4 rounded-[28px] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">FeedForge</p>
            <p className="text-sm font-semibold text-white">AI-powered RSS Aggregator</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="glass-panel flex min-w-[240px] flex-1 items-center gap-3 rounded-2xl px-4 py-3">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search headlines, summaries, or topics"
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500"
          />
          <Button type="submit" className="px-4 py-2.5">
            Search
          </Button>
        </form>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 sm:block">
            Synced for focused reading
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF5A09] via-[#EC7F37] to-[#BE4F0C] text-sm font-bold text-white shadow-[0_0_20px_rgba(255,90,9,0.38)]">
            FF
          </div>
          {token && (
            <Button type="button" variant="secondary" className="px-4 py-2.5" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
