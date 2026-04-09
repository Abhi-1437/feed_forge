import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import SummaryPanel from '../components/features/SummaryPanel'
import Loader from '../components/Loader'
import { generateSummary, getArticles } from '../services/api'
import {
  cacheArticles,
  getArticleDate,
  getArticleExcerpt,
  getArticleId,
  getArticleImage,
  loadArticleCache,
  sortArticlesByDate,
} from '../utils/articles'

export default function ArticleDetail() {
  const { articleId } = useParams()
  const location = useLocation()
  const [article, setArticle] = useState(location.state?.article || null)
  const [loading, setLoading] = useState(!location.state?.article)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryError, setSummaryError] = useState(null)

  useEffect(() => {
    if (location.state?.article) return

    const cached = loadArticleCache()
    const cachedArticle = cached.find((item) => encodeURIComponent(getArticleId(item)) === articleId)
    if (cachedArticle) {
      setArticle(cachedArticle)
      setLoading(false)
      return
    }

    setLoading(true)
    getArticles()
      .then((response) => {
        const nextArticles = sortArticlesByDate(response.data || [])
        cacheArticles(nextArticles)
        const matched = nextArticles.find((item) => encodeURIComponent(getArticleId(item)) === articleId)
        if (!matched) {
          setError('We could not find this article in your current feed results.')
          return
        }
        setArticle(matched)
      })
      .catch((err) => setError(err.response?.data?.msg || err.message || 'Failed to load article'))
      .finally(() => setLoading(false))
  }, [articleId, location.state])

  const articleContent = useMemo(() => {
    if (!article) return ''
    return article.content || article.contentSnippet || article.description || article.summary || 'No article content available.'
  }, [article])

  const handleGenerateSummary = async () => {
    if (!article) return
    setSummaryLoading(true)
    setSummaryError(null)

    try {
      const response = await generateSummary({
        id: article.id || article._id,
        url: article.link || article.url,
      })
      setSummary(response.data.summary || response.data || 'No summary returned.')
    } catch (err) {
      setSummaryError(err.response?.data?.msg || err.message || 'Failed to generate summary')
    } finally {
      setSummaryLoading(false)
    }
  }

  if (loading) {
    return <Loader message="Loading article details..." cards={2} />
  }

  if (error || !article) {
    return <div className="glass-card rounded-[28px] p-8 text-sm text-rose-100">{error || 'Article unavailable.'}</div>
  }

  return (
    <div className="grid gap-6 py-4 xl:grid-cols-[0.9fr_1.1fr]">
      <motion.div
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="space-y-6"
      >
        <SummaryPanel
          summary={summary}
          loading={summaryLoading}
          error={summaryError}
          sourceUrl={article.link || article.url}
          onGenerate={handleGenerateSummary}
        />

        <section className="glass-card card-hover-glow rounded-[30px] p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Quick context</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="glass-panel rounded-[24px] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Published</p>
              <p className="mt-2 text-lg font-semibold text-white">{getArticleDate(article)}</p>
            </div>
            <div className="glass-panel rounded-[24px] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Source</p>
              <p className="mt-2 text-lg font-semibold text-white">{article.feedTitle || 'FeedForge feed'}</p>
            </div>
          </div>
        </section>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="glass-card card-hover-glow overflow-hidden rounded-[32px]"
      >
        <div className="relative aspect-[16/8] overflow-hidden">
          <img
            src={getArticleImage(article)}
            alt={article.title || 'Article'}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/30 to-transparent" />
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-200">
                {getArticleDate(article)}
              </span>
              {article.feedTitle && (
                <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-orange-100">
                  {article.feedTitle}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">{article.title || 'Untitled article'}</h1>
            <p className="mt-4 text-base leading-8 text-slate-300">{getArticleExcerpt(article)}</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/30 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Full article content</p>
            <div className="mt-4 space-y-4 text-sm leading-8 text-slate-300">
              {String(articleContent)
                .split('\n')
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  )
}
