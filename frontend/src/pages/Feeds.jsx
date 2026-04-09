import { useEffect, useState } from 'react'
import { getFeeds, getFolders, addFeed, deleteFeed } from '../services/api'
import FeedCard from '../components/FeedCard'
import Button from '../components/ui/Button'
import Loader from '../components/Loader'

export default function Feeds() {
  const [feeds, setFeeds] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [error, setError] = useState(null)

  const loadFeeds = () => {
    setLoading(true)
    getFeeds()
      .then((res) => setFeeds(res.data || []))
      .catch((e) => setError(e.response?.data?.msg || e.message || 'Failed to load feeds'))
      .finally(() => setLoading(false))
  }

  const loadFolders = () => {
    getFolders()
      .then((res) => setFolders(res.data || []))
      .catch((e) => console.error('Failed to load folders', e))
  }

  useEffect(() => {
    loadFeeds()
    loadFolders()
  }, [])

  const handleAdd = () => {
    if (!url.trim()) return
    setError(null)

    addFeed({ url: url.trim(), folderId: selectedFolderId || undefined })
      .then((res) => {
        setFeeds((prev) => [res.data, ...prev])
        setUrl('')
        setSelectedFolderId('')
      })
      .catch((e) => setError(e.response?.data?.msg || e.message || 'Failed to add feed'))
  }

  const handleDelete = (id) => {
    deleteFeed(id)
      .then(() => setFeeds((prev) => prev.filter((f) => f.id !== id && f._id !== id)))
      .catch((e) => setError(e.response?.data?.msg || e.message || 'Failed to delete feed'))
  }

  return (
    <div className="space-y-6 py-4">
      <section className="gradient-border glass-card rounded-[32px] p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-orange-200">Feed sources</p>
            <h1 className="mt-2 text-3xl font-extrabold text-white">Manage your RSS pipeline</h1>
            <p className="mt-2 text-slate-300">Add new RSS sources and keep your collection organized without leaving the dashboard.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Paste RSS feed URL"
            className="rounded-2xl border border-white/15 bg-[#0B1120]/90 px-4 py-3 text-slate-100 placeholder:text-slate-500"
          />
          <Button type="button" onClick={handleAdd} className="px-6">
            Add Feed
          </Button>
        </div>
        <div className="mt-3">
          <label className="mb-2 block text-sm text-slate-300">Assign to folder</label>
          <select
            value={selectedFolderId}
            onChange={(event) => setSelectedFolderId(event.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-[#0B1120]/90 px-4 py-3 text-slate-100"
          >
            <option value="">No folder</option>
            {folders.map((folder) => (
              <option key={folder._id} value={folder._id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
      </section>

      {loading ? (
        <Loader message="Fetching feeds..." cards={4} />
      ) : feeds.length === 0 ? (
        <div className="glass-card rounded-[28px] p-8 text-slate-300">No feeds added yet. Start by adding a feed URL above.</div>
      ) : (
        <div className="grid gap-4">
          {feeds.map((feed) => (
            <FeedCard
              key={feed.id || feed._id}
              feed={feed}
              folderName={folders.find((folder) => folder._id === feed.folderId)?.name}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
