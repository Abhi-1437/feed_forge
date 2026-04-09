import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Button from '../components/ui/Button'
import { login } from '../services/api'

export default function Login() {
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
      const response = await login({ email, password })
      const token = response.data.token

      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('feedforge_display_name', email.split('@')[0] || 'Reader')
        window.dispatchEvent(new Event('authChange'))
        navigate('/dashboard')
      } else {
        setError('Login failed: no token returned')
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="hidden lg:block">
        <div className="max-w-xl space-y-6">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
            Premium SaaS experience
          </span>
          <h1 className="text-5xl font-bold leading-tight text-white">
            Read the signal,
            <span className="text-gradient"> skip the noise.</span>
          </h1>
          <p className="max-w-lg text-lg leading-8 text-slate-400">
            FeedForge brings your RSS universe into one cinematic workspace with quick summaries, bookmarks, and smooth focus-first navigation.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {['Summaries on demand', 'Fluid reading flow', 'Clean portfolio-ready UI'].map((item) => (
              <div key={item} className="glass-panel rounded-[24px] p-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AuthCard
        badge="Welcome back"
        title="Login to FeedForge"
        description="Access your feeds, explore fresh stories, and generate AI summaries in one modern control center."
        footerPrompt="New here?"
        footerLink="/register"
        footerLabel="Create an account"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Enter your password"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[#0B1120]/90 px-4 py-3 text-slate-100 placeholder:text-slate-500"
            />
          </label>

          {error && <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </AuthCard>
    </div>
  )
}
