import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Button from '../components/ui/Button'
import { register } from '../services/api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await register({ name, email, password })
      const token = response.data.token

      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('feedforge_display_name', name || email.split('@')[0] || 'Reader')
        window.dispatchEvent(new Event('authChange'))
        navigate('/login')
      } else {
        setError('Registration failed: no token returned')
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid w-full items-center gap-8 lg:grid-cols-[0.98fr_1.02fr]">
      <AuthCard
        badge="Create account"
        title="Start your FeedForge workspace"
        description="Set up a premium reading dashboard for your feeds, AI summaries, and saved stories."
        footerPrompt="Already have an account?"
        footerLink="/login"
        footerLabel="Login"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-slate-300">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your display name"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[#0B1120]/90 px-4 py-3 text-slate-100 placeholder:text-slate-500"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[#0B1120]/90 px-4 py-3 text-slate-100 placeholder:text-slate-500"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Choose a strong password"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[#0B1120]/90 px-4 py-3 text-slate-100 placeholder:text-slate-500"
            />
          </label>

          {error && <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Registering...' : 'Create account'}
          </Button>
        </form>
      </AuthCard>

      <div className="hidden lg:block">
        <div className="ml-auto max-w-xl space-y-6">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
            Built for deep reading
          </span>
          <h2 className="text-5xl font-bold leading-tight text-white">
            Bring every feed into
            <span className="text-gradient"> one sleek command center.</span>
          </h2>
          <p className="max-w-lg text-lg leading-8 text-slate-400">
            Organize sources, surface the best stories, and turn long reads into faster decisions with motion-rich UI that still feels calm.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-panel rounded-[24px] p-5">
              <p className="text-sm font-semibold text-white">Animated dashboard</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Hero sections, stat cards, and fluid transitions designed for a polished showcase.</p>
            </div>
            <div className="glass-panel rounded-[24px] p-5">
              <p className="text-sm font-semibold text-white">Fast interaction design</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Bookmarks, read state, summaries, and responsive layouts without changing your backend.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
