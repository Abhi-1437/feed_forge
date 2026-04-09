import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getArticles, getFeeds } from '../services/api'
import DashboardStats from '../components/DashboardStats'
import ArticleGridCard from '../components/ArticleGridCard'
import Loader from '../components/Loader'
import {
  cacheArticles,
  countStoredBookmarkedArticles,
  countStoredReadArticles,
  sortArticlesByDate,
} from '../utils/articles'

export default function DashboardPremium() {
  const [articles, setArticles] = useState([])
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([getArticles(), getFeeds()])
      .then(([articlesRes, feedsRes]) => {
        const articlesList = sortArticlesByDate(articlesRes.data || [])
        setArticles(articlesList)
        cacheArticles(articlesList)
        setFeeds(feedsRes.data || [])
      })
      .catch((err) => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const latestArticles = articles.slice(0, 3)
  const username = typeof window !== 'undefined' ? localStorage.getItem('feedforge_display_name') || 'Reader' : 'Reader'
  const stats = useMemo(
    () => [
      { label: 'Daily streak', value: Math.max(3, Math.min(14, feeds.length + 2)), caption: 'days in a row', icon: 'DS' },
      { label: 'Bookmarked articles', value: countStoredBookmarkedArticles(), caption: 'saved for later', icon: 'BM' },
      { label: 'Read articles', value: countStoredReadArticles(), caption: 'already finished', icon: 'RD' },
    ],
    [feeds.length]
  )

  return (
    <div className="space-y-8 py-4">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]"
      >
        <div className="gradient-border glass-card relative overflow-hidden rounded-[32px] p-8 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,9,0.18),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(236,127,55,0.2),transparent_28%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.34em] text-orange-200">Dashboard</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">
              Welcome back, {username}.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Track your feed momentum, jump into fresh articles, and generate AI summaries from a warm, focused workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="glass-panel rounded-2xl px-4 py-3 text-sm text-slate-200">{feeds.length} live feeds</div>
              <div className="glass-panel rounded-2xl px-4 py-3 text-sm text-slate-200">{articles.length} total articles</div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Profile</p>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#FF5A09] via-[#EC7F37] to-[#BE4F0C] text-xl font-bold text-white">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{username}</h2>
              <p className="text-sm text-slate-400">Curating your reading pipeline</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { label: 'Focus mode', value: 'Enabled' },
              { label: 'Bookmarks', value: `${countStoredBookmarkedArticles()} saved` },
              { label: 'Read queue', value: `${Math.max(articles.length - countStoredReadArticles(), 0)} pending` },
            ].map((item) => (
              <div key={item.label} className="glass-panel rounded-[24px] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <DashboardStats stats={stats} />

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Fresh reads</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Latest articles</h2>
            <p className="mt-2 text-slate-400">Jump back into the newest stories from your connected feeds.</p>
          </div>
        </div>

        {loading ? (
          <Loader message="Loading dashboard..." cards={3} />
        ) : error ? (
          <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-100">{error}</div>
        ) : latestArticles.length === 0 ? (
          <div className="glass-card rounded-[28px] p-8 text-slate-300">No articles yet. Add feeds to start filling your dashboard.</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {latestArticles.map((article, index) => (
              <ArticleGridCard key={article.id || article._id || article.link} article={article} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
