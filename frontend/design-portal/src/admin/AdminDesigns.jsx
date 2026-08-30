import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Upload, Play, RotateCcw, Copy, Check, Code, Eye } from 'lucide-react'
import { api } from '../lib/api'
import LivePreview from '../tools/LivePreview'

const frameworks = ['React', 'Next.js', 'Vue', 'Astro', 'Svelte', 'React Native', 'HTML', 'CSS', 'JavaScript']
const categories = ['Landing', 'Dashboard', 'E-Commerce', 'Portfolio', 'Blog', 'Admin', 'Mobile', 'Auth', 'Form', 'Component']
const prices = ['Free', '$19', '$29', '$49']

const emptyForm = {
  name: '', category: 'Landing', framework: 'HTML', price: 'Free',
  score: 0, description: '', preview_image: '', code: '',
  html_code: '', css_code: '', js_code: '',
}

const CODE_TABS = [
  { key: 'html', label: 'HTML', lang: 'html' },
  { key: 'css', label: 'CSS', lang: 'css' },
  { key: 'js', label: 'JavaScript', lang: 'javascript' },
]

function CodeEditor({ value, onChange, language, placeholder }) {
  const textareaRef = useRef(null)

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      }, 0)
    }
  }, [value, onChange])

  return (
    <div className="relative flex-1 min-h-0">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        spellCheck={false}
        className="w-full h-full p-[12px] bg-[#050505] text-[#e0e0e0] font-mono text-[11px] leading-[1.7] resize-none outline-none border border-white/[0.05] rounded-[8px] placeholder-[#333]"
      />
    </div>
  )
}

function DesignModal({ design, onClose, onSave }) {
  const [form, setForm] = useState(() => {
    if (design?.id) {
      return {
        name: design.name || '',
        category: design.category || 'Landing',
        framework: design.framework || 'HTML',
        price: design.price || 'Free',
        score: design.score || 0,
        description: design.description || '',
        preview_image: design.preview_image || '',
        code: design.code || '',
        html_code: design.html_code || '',
        css_code: design.css_code || '',
        js_code: design.js_code || '',
      }
    }
    return emptyForm
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(design?.preview || '')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('html')
  const [showPreview, setShowPreview] = useState(true)
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

  const hasLiveCode = form.html_code || form.css_code || form.js_code

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
      fd.append('code', form.code || '')
      fd.append('html_code', form.html_code || '')
      fd.append('css_code', form.css_code || '')
      fd.append('js_code', form.js_code || '')
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

  const handleClear = () => {
    setForm(prev => ({ ...prev, html_code: '', css_code: '', js_code: '' }))
  }

  const inputCls = "w-full h-[36px] px-[12px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[11px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
  const selectCls = "w-full h-[36px] px-[12px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[11px] outline-none focus:border-white/[0.25] transition-colors appearance-none"

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-[1200px] h-[90vh] flex flex-col rounded-[18px] border border-white/[0.10] bg-[#0a0a0a] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-white/[0.06] shrink-0">
          <h3 className="text-[14px] font-semibold">{design?.id ? 'Edit Design' : 'New Design'}</h3>
          <button onClick={onClose} className="text-[#666] hover:text-white"><X size={18} /></button>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: Form */}
          <div className="w-[340px] shrink-0 border-r border-white/[0.06] overflow-y-auto p-[20px] space-y-[14px]">
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

            {/* JSX Code (download) */}
            <div>
              <label className="block text-[#888] text-[8px] font-semibold uppercase tracking-[0.1em] mb-[6px]">JSX Code (downloadable)</label>
              <textarea
                value={form.code}
                onChange={(e) => setForm({...form, code: e.target.value})}
                placeholder="React component code for download..."
                rows={4}
                className={`${inputCls} h-auto py-[8px] resize-none font-mono text-[10px] leading-[1.6]`}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-[#888] text-[8px] font-semibold uppercase tracking-[0.1em] mb-[6px]">Fallback Preview Media</label>
              <div className="flex gap-[8px]">
                <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" id="design-file" />
                <label htmlFor="design-file" className="flex-1 flex items-center justify-center gap-[6px] h-[60px] rounded-[10px] border border-dashed border-white/[0.12] bg-white/[0.02] text-[#666] text-[10px] cursor-pointer hover:border-white/[0.25] hover:bg-white/[0.04] transition-colors">
                  {preview ? (
                    <div className="relative w-full h-full">
                      <img src={preview} className="w-full h-full object-cover rounded-[8px]" alt="Preview" />
                    </div>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Upload image</span>
                    </>
                  )}
                </label>
                {preview && (
                  <button type="button" onClick={handleRemoveFile} className="self-start mt-[4px] text-[#666] hover:text-red-400">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-[8px] pt-[4px]">
              <button type="button" onClick={onClose} className="flex-1 h-[36px] rounded-[8px] border border-white/[0.10] text-[10px] font-semibold text-[#aaa] hover:bg-white/[0.05] transition-colors">Cancel</button>
              <button type="button" onClick={handleSubmit} disabled={saving || !form.name} className="flex-1 h-[36px] rounded-[8px] bg-white text-black text-[10px] font-semibold hover:-translate-y-[1px] transition-transform disabled:opacity-50">
                {saving ? 'Saving...' : design?.id ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>

          {/* Right: Code Editor + Preview */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Code Tabs + Preview Toggle */}
            <div className="flex items-center justify-between px-[16px] py-[10px] border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-[2px] bg-white/[0.03] rounded-[8px] p-[2px]">
                {CODE_TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-[12px] py-[5px] rounded-[6px] text-[10px] font-medium transition-all ${
                      activeTab === tab.key
                        ? 'bg-white text-black'
                        : 'text-[#666] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-[8px]">
                <button onClick={handleClear} className="px-[10px] py-[5px] rounded-[6px] text-[10px] text-[#666] hover:text-white border border-white/[0.06] hover:border-white/[0.15] transition-colors flex items-center gap-[4px]">
                  <RotateCcw size={10} /> Clear
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-[10px] py-[5px] rounded-[6px] text-[10px] font-medium border transition-all flex items-center gap-[4px] ${
                    showPreview
                      ? 'bg-white text-black border-white'
                      : 'text-[#666] border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <Eye size={10} /> Preview
                </button>
              </div>
            </div>

            {/* Editor + Preview */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
              {/* Code Editor */}
              <div className={`flex flex-col min-h-0 ${showPreview ? 'w-1/2 border-r border-white/[0.06]' : 'flex-1'}`}>
                <CodeEditor
                  value={form[`${activeTab}_code`]}
                  onChange={(val) => setForm(prev => ({ ...prev, [`${activeTab}_code`]: val }))}
                  language={activeTab}
                  placeholder={`Write your ${activeTab.toUpperCase()} code here...`}
                />
              </div>

              {/* Live Preview */}
              {showPreview && (
                <div className="w-1/2 flex flex-col min-h-0 bg-[#0d0d0d]">
                  <div className="px-[12px] py-[8px] border-b border-white/[0.04] flex items-center gap-[6px] shrink-0">
                    <div className="w-[6px] h-[6px] rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] text-[#555] uppercase tracking-wider font-medium">Live Preview</span>
                  </div>
                  <div className="flex-1 p-[12px] min-h-0">
                    {hasLiveCode ? (
                      <LivePreview
                        html={form.html_code}
                        css={form.css_code}
                        js={form.js_code}
                        className="w-full h-full rounded-[8px] overflow-hidden border border-white/[0.05]"
                        title="admin-preview"
                      />
                    ) : (
                      <div className="w-full h-full rounded-[8px] border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-[#333] gap-[8px]">
                        <Code size={24} />
                        <span className="text-[11px]">Write HTML, CSS, or JS to see a live preview</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
  const hasCode = (d) => d.html_code || d.css_code || d.js_code

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
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Code</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {designs.map((d) => (
                  <tr key={d.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-[14px] py-[10px]">
                      <div className="w-[60px] h-[40px] rounded-[6px] overflow-hidden bg-white/[0.03] flex items-center justify-center">
                        {hasCode(d) ? (
                          <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
                            <Code size={14} className="text-green-500" />
                          </div>
                        ) : d.preview ? (
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
                      {hasCode(d) ? (
                        <span className="text-[9px] px-[6px] py-[2px] rounded bg-green-500/10 text-green-400 font-medium">Live</span>
                      ) : (
                        <span className="text-[9px] text-[#444]">-</span>
                      )}
                    </td>
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
