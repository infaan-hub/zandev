import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Upload, Film, Image as ImageIcon } from 'lucide-react'
import { api } from '../lib/api'

const frameworks = ['React', 'Next.js', 'Vue', 'Astro', 'Svelte', 'React Native']
const categories = ['Landing', 'Dashboard', 'E-Commerce', 'Portfolio', 'Blog', 'Admin', 'Mobile', 'Auth', 'Form']
const prices = ['Free', '$19', '$29', '$49']

const emptyForm = {
  name: '', category: 'Landing', framework: 'React', price: 'Free',
  score: 0, description: '', preview_image: '',
}

function DesignModal({ design, onClose, onSave }) {
  const [form, setForm] = useState(design || emptyForm)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(design?.preview || '')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(form.preview_image || '')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('category', form.category)
      fd.append('framework', form.framework)
      fd.append('price', form.price)
      fd.append('score', form.score)
      fd.append('description', form.description)
      fd.append('preview_image', form.preview_image || '')
      if (file) fd.append('file', file)

      if (design?.id) {
        await api.adminUpdateDesign(design.id, fd)
      } else {
        await api.adminCreateDesign(fd)
      }
      onSave()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full h-[36px] px-[12px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[11px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
  const selectCls = "w-full h-[36px] px-[12px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[11px] outline-none focus:border-white/[0.25] transition-colors appearance-none"

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto p-[24px] rounded-[18px] border border-white/[0.10] bg-[#0a0a0a]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-[20px]">
          <h3 className="text-[14px] font-semibold">{design?.id ? 'Edit Design' : 'New Design'}</h3>
          <button onClick={onClose} className="text-[#666] hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-[12px]">
          <div>
            <label className="block text-[#888] text-[8px] font-semibold uppercase tracking-[0.1em] mb-[6px]">Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Design name" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-[10px]">
            <div>
              <label className="block text-[#888] text-[8px] font-semibold uppercase tracking-[0.1em] mb-[6px]">Framework</label>
              <select value={form.framework} onChange={(e) => setForm({...form, framework: e.target.value})} className={selectCls}>
                {frameworks.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[#888] text-[8px] font-semibold uppercase tracking-[0.1em] mb-[6px]">Category</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className={selectCls}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[10px]">
            <div>
              <label className="block text-[#888] text-[8px] font-semibold uppercase tracking-[0.1em] mb-[6px]">Price</label>
              <select value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className={selectCls}>
                {prices.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[#888] text-[8px] font-semibold uppercase tracking-[0.1em] mb-[6px]">Score</label>
              <input type="number" min="0" max="100" value={form.score} onChange={(e) => setForm({...form, score: parseInt(e.target.value) || 0})} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-[#888] text-[8px] font-semibold uppercase tracking-[0.1em] mb-[6px]">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Design description..." rows={3} className={`${inputCls} h-auto py-[8px] resize-none`} />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-[#888] text-[8px] font-semibold uppercase tracking-[0.1em] mb-[6px]">Preview Media</label>
            <div className="flex gap-[8px]">
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFile}
                className="hidden"
                id="design-file"
              />
              <label htmlFor="design-file" className="flex-1 flex items-center justify-center gap-[6px] h-[80px] rounded-[10px] border border-dashed border-white/[0.12] bg-white/[0.02] text-[#666] text-[10px] cursor-pointer hover:border-white/[0.25] hover:bg-white/[0.04] transition-colors">
                {preview ? (
                  <div className="relative w-full h-full">
                    {preview.match(/\.(mp4|webm|ogg|mov)$/i) || form.file_type === 'video' ? (
                      <video src={preview} className="w-full h-full object-cover rounded-[8px]" />
                    ) : (
                      <img src={preview} className="w-full h-full object-cover rounded-[8px]" alt="Preview" />
                    )}
                  </div>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Upload image or video</span>
                  </>
                )}
              </label>
              {preview && (
                <button type="button" onClick={handleRemoveFile} className="self-start mt-[4px] text-[#666] hover:text-red-400">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="mt-[6px]">
              <input type="text" value={form.preview_image} onChange={(e) => { setForm({...form, preview_image: e.target.value}); if (!file) setPreview(e.target.value) }} placeholder="Or paste image/video URL..." className={inputCls} />
            </div>
          </div>

          <div className="flex gap-[8px] mt-[4px]">
            <button type="button" onClick={onClose} className="flex-1 h-[36px] rounded-[8px] border border-white/[0.10] text-[10px] font-semibold text-[#aaa] hover:bg-white/[0.05] transition-colors">Cancel</button>
            <button type="submit" disabled={saving || !form.name} className="flex-1 h-[36px] rounded-[8px] bg-white text-black text-[10px] font-semibold hover:-translate-y-[1px] transition-transform disabled:opacity-50">
              {saving ? 'Saving...' : design?.id ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminDesigns() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  useEffect(() => { loadDesigns() }, [])

  const loadDesigns = async () => {
    try {
      const data = await api.adminGetDesigns()
      setDesigns(data.designs || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await api.adminDeleteDesign(id)
      loadDesigns()
    } catch (err) {
      alert(err.message)
    }
  }

  const isVideo = (d) => d.file_type === 'video' || /\.(mp4|webm|ogg|mov)$/i.test(d.preview || '')

  return (
    <div>
      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="text-[22px] tracking-[-0.04em] font-bold">Designs</h1>
          <p className="text-[#555] text-[11px] mt-[4px]">{designs.length} total designs.</p>
        </div>
        <div className="flex gap-[8px]">
          <button onClick={loadDesigns} className="px-[14px] py-[8px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-[10px] font-semibold text-[#aaa] hover:bg-white/[0.08] transition-colors">Refresh</button>
          <button onClick={() => setModal({})} className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-[8px] bg-white text-black text-[10px] font-semibold hover:-translate-y-[1px] transition-transform">
            <Plus size={13} /> New Design
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-[#555] text-[12px] py-[40px] text-center">Loading...</div>
      ) : designs.length === 0 ? (
        <div className="text-center py-[60px] text-[#555] text-[12px]">No designs yet. Create one!</div>
      ) : (
        <div className="rounded-[14px] border border-white/[0.08] bg-[#080808] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Preview</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Name</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Framework</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Category</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Price</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Score</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {designs.map((d) => (
                  <tr key={d.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-[14px] py-[10px]">
                      <div className="w-[60px] h-[40px] rounded-[6px] overflow-hidden bg-white/[0.03] flex items-center justify-center">
                        {d.preview ? (
                          isVideo(d) ? (
                            <video src={d.preview} className="w-full h-full object-cover" muted />
                          ) : (
                            <img src={d.preview} alt={d.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none' }} />
                          )
                        ) : (
                          <span className="text-[#444] text-[8px]">No media</span>
                        )}
                      </div>
                    </td>
                    <td className="px-[14px] py-[10px]">
                      <div className="text-[11px] font-semibold">{d.name}</div>
                      <div className="text-[8px] text-[#555] mt-[2px] max-w-[200px] truncate">{d.description}</div>
                    </td>
                    <td className="px-[14px] py-[10px] text-[10px] text-[#888]">{d.framework}</td>
                    <td className="px-[14px] py-[10px] text-[10px] text-[#666]">{d.category}</td>
                    <td className="px-[14px] py-[10px]">
                      <span className={`text-[9px] font-medium ${d.price === 'Free' ? 'text-[#4ade80]' : 'text-[#fbbf24]'}`}>{d.price}</span>
                    </td>
                    <td className="px-[14px] py-[10px] text-[11px] font-semibold">{d.score}</td>
                    <td className="px-[14px] py-[10px]">
                      <div className="flex gap-[6px]">
                        <button onClick={() => setModal(d)} className="p-[6px] rounded-[6px] border border-white/[0.10] text-[#888] hover:text-white hover:bg-white/[0.05] transition-colors">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => handleDelete(d.id, d.name)} className="p-[6px] rounded-[6px] border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal !== null && (
        <DesignModal design={modal.id ? modal : null} onClose={() => setModal(null)} onSave={() => { setModal(null); loadDesigns() }} />
      )}
    </div>
  )
}
