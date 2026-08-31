import { useState, useEffect } from 'react'
import { FolderPlus, Check, X } from 'lucide-react'
import { api } from '../lib/api'

export default function CollectionManager({ designId }) {
  const [collections, setCollections] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    api.getCollections().then(data => setCollections(data.collections || [])).catch(() => {})
  }, [])

  const handleAdd = async (collectionId) => {
    try {
      await api.addToCollection(collectionId, designId)
      setShowDropdown(false)
    } catch {}
  }

  const handleCreateAndAdd = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const data = await api.createCollection({ name: newName })
      await api.addToCollection(data.id, designId)
      setCollections([...collections, { id: data.id, name: newName, design_count: 1 }])
      setNewName('')
      setShowDropdown(false)
    } catch {} finally {
      setCreating(false)
    }
  }

  return (
    <div className="relative">
      <button onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium border border-white/[0.10] text-[#aaa] hover:bg-white/[0.05] transition-colors">
        <FolderPlus size={11} /> Save to Collection
      </button>
      {showDropdown && (
        <div className="absolute right-0 top-full mt-1 w-[220px] bg-[#111] border border-white/[0.10] rounded-lg p-2 z-50 shadow-xl">
          <div className="max-h-[200px] overflow-auto space-y-1 mb-2">
            {collections.map(c => (
              <button key={c.id} onClick={() => handleAdd(c.id)}
                className="w-full text-left px-3 py-1.5 rounded text-xs text-[#aaa] hover:bg-white/[0.05] hover:text-white transition-colors flex items-center justify-between">
                {c.name} <span className="text-[10px] text-[#555]">{c.design_count}</span>
              </button>
            ))}
            {collections.length === 0 && <p className="text-[10px] text-[#555] px-3 py-2">No collections yet</p>}
          </div>
          <div className="border-t border-white/[0.06] pt-2 flex gap-1">
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
              className="flex-1 h-7 px-2 rounded bg-white/[0.03] text-white text-[10px] outline-none border border-white/[0.06]"
              placeholder="New collection..." />
            <button onClick={handleCreateAndAdd} disabled={creating || !newName.trim()}
              className="h-7 px-2 rounded bg-white text-black text-[10px] font-semibold disabled:opacity-50">
              <Check size={10} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
