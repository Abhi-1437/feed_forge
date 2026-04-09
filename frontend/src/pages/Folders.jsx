import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Loader from '../components/Loader'
import Button from '../components/ui/Button'

export default function Folders() {
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [newFolderName, setNewFolderName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')

  useEffect(() => {
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/folders')
      setFolders(response.data)
    } catch (error) {
      console.error('Error fetching folders:', error)
    } finally {
      setLoading(false)
    }
  }

  const createFolder = async (e) => {
    e.preventDefault()
    if (!newFolderName.trim()) return

    try {
      const response = await api.post('/folders', { name: newFolderName })
      setFolders([response.data, ...folders])
      setNewFolderName('')
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  const updateFolder = async (id, name) => {
    try {
      const response = await api.patch(`/folders/${id}`, { name })
      setFolders(folders.map(f => f._id === id ? response.data : f))
      setEditingId(null)
      setEditingName('')
    } catch (error) {
      console.error('Error updating folder:', error)
    }
  }

  const deleteFolder = async (id) => {
    if (!confirm('Are you sure you want to delete this folder?')) return

    try {
      await api.delete(`/folders/${id}`)
      setFolders(folders.filter(f => f._id !== id))
    } catch (error) {
      console.error('Error deleting folder:', error)
    }
  }

  if (loading) return <Loader message="Loading folders..." cards={3} />

  return (
    <div className="space-y-6 py-4">
      <section className="gradient-border glass-card rounded-[32px] p-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-200">Organization</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Folders</h1>
          <p className="mt-2 text-slate-400">Group feeds into focused categories and keep your reading workspace tidy.</p>
        </div>

        <form onSubmit={createFolder}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder name..."
              className="flex-1 rounded-2xl border border-white/10 bg-[#0B1120]/90 px-4 py-3 text-white placeholder-slate-400"
            />
            <Button type="submit" className="px-6">
              Create
            </Button>
          </div>
        </form>
      </section>

      <div className="space-y-3">
        {folders.length === 0 ? (
          <div className="glass-card rounded-[28px] py-12 text-center">
            <p className="text-slate-400">No folders yet. Create one to get started.</p>
          </div>
        ) : (
          folders.map((folder) => (
            <div
              key={folder._id}
              className="glass-card flex flex-col gap-4 rounded-[28px] p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              {editingId === folder._id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                  className="flex-1 rounded-2xl border border-white/20 bg-[#0B1120]/90 px-4 py-3 text-white"
                />
              ) : (
                <div className="flex-1">
                  <h3 className="font-medium text-white">{folder.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Created {new Date(folder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {editingId === folder._id ? (
                  <>
                    <Button type="button" onClick={() => updateFolder(folder._id, editingName)} className="px-4 py-2.5">
                      Save
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setEditingId(null)} className="px-4 py-2.5">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setEditingId(folder._id)
                        setEditingName(folder.name)
                      }}
                      className="px-4 py-2.5"
                    >
                      Edit
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => deleteFolder(folder._id)} className="px-4 py-2.5">
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
