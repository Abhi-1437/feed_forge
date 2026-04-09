import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from './ui/Button'
import {
  getArticleDate,
  getArticleExcerpt,
  getArticleId,
  getArticleImage,
  getStoredArticleState,
  setBookmarkState,
  setReadState,
} from '../utils/articles'

export default function ArticleGridCard({ article, index = 0 }) {
  const [isRead, setIsRead] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = getStoredArticleState(article)
    setIsRead(stored.isRead)
    setIsBookmarked(stored.isBookmarked)
  }, [article])

  const handleView = () => {
    navigate(`/articles/${encodeURIComponent(getArticleId(article))}`, { state: { article } })
  }

  const toggleRead = () => {
    const next = !isRead
    setReadState(article, next)
    setIsRead(next)
  }

  const toggleBookmark = () => {
    const next = !isBookmarked
    setBookmarkState(article, next)
    setIsBookmarked(next)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="gradient-border glass-card card-hover-glow group overflow-hidden rounded-[30px]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={getArticleImage(article)}
          alt={article?.title || 'Article'}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#393939] via-[#393939]/20 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-200">
            {getArticleDate(article)}
          </span>
          {article?.feedTitle && (
            <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-orange-100">
              {article.feedTitle}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 text-xl font-semibold text-white">{article?.title || 'Untitled article'}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{getArticleExcerpt(article)}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <motion.button
            type="button"
            onClick={toggleBookmark}
            whileTap={{ scale: 0.92 }}
            className={`rounded-2xl px-3 py-2 text-sm transition ${
              isBookmarked ? 'bg-orange-500/15 text-orange-100 shadow-[0_0_18px_rgba(255,90,9,0.24)]' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <motion.svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill={isBookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                animate={{ scale: isBookmarked ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </motion.svg>
              {isBookmarked ? 'Saved' : 'Bookmark'}
            </span>
          </motion.button>
          <motion.button
            type="button"
            onClick={toggleRead}
            whileTap={{ scale: 0.92 }}
            className={`rounded-2xl px-3 py-2 text-sm transition ${
              isRead ? 'bg-emerald-400/15 text-emerald-100' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {isRead ? 'Read' : 'Mark read'}
          </motion.button>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <a
            href={article?.link || article?.url || '#'}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Open source
          </a>
          <Button type="button" onClick={handleView} className="px-5 py-2.5">
            View
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
