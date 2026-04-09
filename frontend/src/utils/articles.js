const STORAGE_KEYS = {
  read: 'feedforge_read_articles',
  bookmarked: 'feedforge_bookmarked_articles',
  cache: 'feedforge_article_cache',
}

export function getArticleId(article) {
  return article?.id || article?._id || article?.guid || article?.link || article?.url || article?.title || 'article'
}

export function getArticleImage(article) {
  const image =
    article?.image ||
    article?.imageUrl ||
    article?.thumbnail ||
    article?.media?.url ||
    article?.enclosure?.url

  if (image) return image

  const seed = encodeURIComponent(getArticleId(article))
  return `https://picsum.photos/seed/${seed}/960/640`
}

export function getArticleExcerpt(article) {
  return (
    article?.description ||
    article?.summary ||
    article?.contentSnippet ||
    article?.content?.slice?.(0, 220) ||
    'No description available for this article yet.'
  )
}

export function getArticleDate(article) {
  const value = article?.publishedAt || article?.pubDate || article?.date || article?.createdAt
  if (!value) return 'Freshly synced'

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Freshly synced'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

export function sortArticlesByDate(articles = []) {
  return [...articles].sort((left, right) => {
    const leftDate = new Date(left?.publishedAt || left?.pubDate || left?.date || 0).getTime()
    const rightDate = new Date(right?.publishedAt || right?.pubDate || right?.date || 0).getTime()
    return rightDate - leftDate
  })
}

function safeParse(value, fallback) {
  try {
    return JSON.parse(value ?? '')
  } catch {
    return fallback
  }
}

export function loadStoredIds(key) {
  if (typeof window === 'undefined') return []
  return safeParse(window.localStorage.getItem(key), [])
}

export function persistStoredIds(key, ids) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(ids))
}

export function toggleStoredId(key, articleId, enabled) {
  const ids = loadStoredIds(key)
  const next = enabled ? [...new Set([...ids, articleId])] : ids.filter((id) => id !== articleId)
  persistStoredIds(key, next)
  return next
}

export function loadArticleCache() {
  if (typeof window === 'undefined') return []
  return safeParse(window.localStorage.getItem(STORAGE_KEYS.cache), [])
}

export function cacheArticles(articles = []) {
  if (typeof window === 'undefined') return
  const trimmed = articles.slice(0, 60)
  window.localStorage.setItem(STORAGE_KEYS.cache, JSON.stringify(trimmed))
}

export function getStoredArticleState(article) {
  const articleId = getArticleId(article)
  return {
    isRead: loadStoredIds(STORAGE_KEYS.read).includes(articleId),
    isBookmarked: loadStoredIds(STORAGE_KEYS.bookmarked).includes(articleId),
  }
}

export function setReadState(article, enabled) {
  return toggleStoredId(STORAGE_KEYS.read, getArticleId(article), enabled)
}

export function setBookmarkState(article, enabled) {
  return toggleStoredId(STORAGE_KEYS.bookmarked, getArticleId(article), enabled)
}

export function countStoredReadArticles() {
  return loadStoredIds(STORAGE_KEYS.read).length
}

export function countStoredBookmarkedArticles() {
  return loadStoredIds(STORAGE_KEYS.bookmarked).length
}

export function getStorageKeys() {
  return STORAGE_KEYS
}
