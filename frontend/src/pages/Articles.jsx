import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getArticles, searchArticles } from '../services/api'
import ArticleGridCard from '../components/ArticleGridCard'
import Button from '../components/ui/Button'
import Loader from '../components/Loader'
import { cacheArticles, sortArticlesByDate } from '../utils/articles'

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const currentQuery = searchParams.get('q') || ''

  useEffect(() => {
    setQuery(currentQuery)
    if (!currentQuery) {
      setSearchResults(null)
      setLoading(true)
      getArticles()
        .then((res) => {
          const nextArticles = sortArticlesByDate(res.data || [])
          setArticles(nextArticles)
          cacheArticles(nextArticles)
        })
        .catch((e) => setError(e.response?.data?.msg || e.message || 'Failed to load articles'))
        .finally(() => setLoading(false))
      return
    }

    setSearching(true)
    setError(null)
    searchArticles(currentQuery)
      .then((res) => {
        const nextResults = sortArticlesByDate(res.data || [])
        setSearchResults(nextResults)
        cacheArticles(nextResults)
      })
      .catch((e) => setError(e.response?.data?.msg || e.message || 'Search failed'))
      .finally(() => setSearching(false))
  }, [currentQuery])

  const handleSearch = () => {
    const trimmed = query.trim()
    if (trimmed) {
      setSearchParams({ q: trimmed })
    } else {
      setSearchParams({})
    }
  }

  const handleClear = () => {
    setQuery('')
    setSearchResults(null)
    setSearchParams({})
  }

  const displayedArticles = searchResults !== null ? searchResults : articles

  return (
    <div className="space-y-6 py-4">
      <section className="gradient-border glass-card rounded-[32px] p-8">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-orange-200">Reading library</p>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">Discover, scan, and dive deeper</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Explore everything from your RSS feeds in a responsive article grid with quick actions and detail views.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
              placeholder="Search articles by keyword"
              className="min-w-[240px] rounded-2xl border border-white/15 bg-[#0B1120]/90 px-4 py-3 text-slate-100 placeholder:text-slate-500"
            />
            <Button type="button" onClick={handleSearch} disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </Button>
            <Button type="button" onClick={handleClear} variant="secondary">
              Clear
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="glass-panel rounded-2xl px-4 py-3 text-sm text-slate-300">
            {displayedArticles.length} article{displayedArticles.length === 1 ? '' : 's'} visible
          </div>
          {currentQuery && (
            <div className="glass-panel rounded-2xl px-4 py-3 text-sm text-slate-300">
              Active search: <span className="font-semibold text-white">{currentQuery}</span>
            </div>
          )}
        </div>

        {error && <div className="mt-4 rounded-[24px] bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>}
      </section>

      {loading ? (
        <Loader message="Loading articles..." cards={6} />
      ) : displayedArticles.length === 0 ? (
        <div className="glass-card rounded-[28px] p-8 text-slate-300">No matching articles found.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayedArticles.map((article, index) => (
            <ArticleGridCard key={article.id || article._id || article.link} article={article} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
