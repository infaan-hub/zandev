import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Trash2, X, Upload, RotateCcw, Code, Eye, Copy, Check } from 'lucide-react'
import { api } from '../lib/api'
import LivePreview from '../tools/LivePreview'

const FRAMEWORKS = ['HTML', 'React', 'Vue', 'Svelte', 'Next.js', 'Astro']
const CATEGORIES = ['Landing', 'Hero', 'Navigation', 'Cards', 'Dashboard', 'Forms', 'Buttons', 'Animation', 'UI Component', 'Portfolio', 'E-commerce', 'Travel', 'SaaS', 'Blog', 'Auth', 'Other']
const PRICES = ['Free', '$19', '$29', '$49']

const emptyForm = {
  name: '', description: '', prompt: '', framework: 'HTML', category: 'Landing', price: 'Free',
  preview_image: '', gallery_image_1: '', gallery_image_2: '', gallery_image_3: '',
  gallery_image_4: '', gallery_image_5: '',
  html_code: '', css_code: '', js_code: '', react_code: '', vue_code: '', svelte_code: '', next_code: '',
}

const FRAMEWORK_FIELDS = {
  'HTML': ['html_code', 'css_code', 'js_code'],
  'React': ['react_code', 'css_code'],
  'Vue': ['vue_code', 'css_code'],
  'Svelte': ['svelte_code', 'css_code'],
  'Next.js': ['next_code', 'css_code'],
  'Astro': ['html_code', 'css_code', 'js_code'],
}

const FRAMEWORK_LABELS = {
  'HTML': { html_code: 'HTML', css_code: 'CSS', js_code: 'JavaScript' },
  'React': { react_code: 'React Component (JSX)', css_code: 'CSS / Styling' },
  'Vue': { vue_code: 'Vue Component (SFC)', css_code: 'CSS / Styling' },
  'Svelte': { svelte_code: 'Svelte Component', css_code: 'CSS / Styling' },
  'Next.js': { next_code: 'Next.js Component (JSX)', css_code: 'CSS / Styling' },
  'Astro': { html_code: 'Astro Template', css_code: 'CSS / Styling', js_code: 'JavaScript' },
}

function CodeEditor({ value, onChange, placeholder, label }) {
  const textareaRef = useRef(null)
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const s = e.target.selectionStart, end = e.target.selectionEnd
      const nv = value.substring(0, s) + '  ' + value.substring(end)
      onChange(nv)
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2 }, 0)
    }
  }, [value, onChange])

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-white/[0.04] shrink-0">
        <span className="text-[9px] text-[#555] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        spellCheck={false}
        className="flex-1 p-3 bg-[#080808] text-[#e0e0e0] font-mono text-[12px] leading-[1.7] resize-none outline-none border-0 placeholder-[#444] focus:ring-0"
      />
    </div>
  )
}

function DesignModal({ design, onClose, onSave }) {
  const [form, setForm] = useState(() => {
    if (design?.id) {
      return {
        name: design.name || '', description: design.description || '', prompt: design.prompt || '',
        framework: design.framework || 'HTML', category: design.category || 'Landing', price: design.price || 'Free',
        preview_image: design.preview_image || '',
        gallery_image_1: design.gallery_image_1 || '', gallery_image_2: design.gallery_image_2 || '',
        gallery_image_3: design.gallery_image_3 || '', gallery_image_4: design.gallery_image_4 || '',
        gallery_image_5: design.gallery_image_5 || '',
        html_code: design.html_code || '', css_code: design.css_code || '', js_code: design.js_code || '',
        react_code: design.react_code || '', vue_code: design.vue_code || '',
        svelte_code: design.svelte_code || '', next_code: design.next_code || '',
      }
    }
    return emptyForm
  })
  const [saving, setSaving] = useState(false)
  const [activeField, setActiveField] = useState('html_code')
  const [showPreview, setShowPreview] = useState(true)
  const [copied, setCopied] = useState(false)

  const fields = FRAMEWORK_FIELDS[form.framework] || ['html_code', 'css_code', 'js_code']
  const labels = FRAMEWORK_LABELS[form.framework] || {}

  useEffect(() => {
    if (!fields.includes(activeField)) setActiveField(fields[0])
  }, [form.framework])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v || ''))
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

  const handlePublishToggle = async () => {
    if (!design?.id) return
    try {
      if (design.published) {
        await api.adminUnpublishDesign(design.id)
      } else {
        await api.adminPublishDesign(design.id)
      }
      onSave()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(form[activeField] || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasLiveCode = fields.some(f => form[f])

  const inputCls = "w-full h-[40px] px-3 rounded-lg border border-white/[0.15] bg-white/[0.05] text-white text-[12px] placeholder-[#555] outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/30 transition-all"
  const selectCls = "w-full h-[40px] px-3 pr-8 rounded-lg border border-white/[0.15] bg-white/[0.05] text-white text-[12px] outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/30 transition-all cursor-pointer appearance-none"
  const labelCls = "block text-[#aaa] text-[10px] font-semibold uppercase tracking-wider mb-1.5"

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-[1400px] h-[95vh] flex flex-col rounded-2xl border border-white/[0.10] bg-[#0a0a0a] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-[16px] font-semibold">{design?.id ? 'Edit Design' : 'New Design'}</h3>
            {design?.id && (
              <button onClick={handlePublishToggle}
                className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                  design.published ? 'bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20' : 'bg-white/[0.05] text-[#888] hover:bg-white/[0.10]'
                }`}>
                {design.published ? 'Published' : 'Unpublished'}
              </button>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-[#666] hover:text-white hover:bg-white/[0.05] transition-colors"><X size={18} /></button>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: Form */}
          <div className="w-[360px] shrink-0 border-r border-white/[0.06] overflow-y-auto p-5 space-y-4">
            <div>
              <label className={labelCls}>Design Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Modern Dashboard" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Description *</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the design..." rows={3} className={`${inputCls} h-auto py-2.5 resize-none`} />
            </div>

            <div>
              <label className={labelCls}>AI Prompt *</label>
              <textarea value={form.prompt} onChange={e => setForm({...form, prompt: e.target.value})} placeholder="The original prompt used to create this design..." rows={5} className={`${inputCls} h-auto py-2.5 resize-none font-mono text-[11px]`} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Framework</label>
                <div className="relative">
                  <select value={form.framework} onChange={e => setForm({...form, framework: e.target.value})} className={selectCls}>
                    {FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
                </div>
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <div className="relative">
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={selectCls}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
                </div>
              </div>
              <div>
                <label className={labelCls}>Price</label>
                <div className="relative">
                  <select value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={selectCls}>
                    {PRICES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Front Image (Cover) *</label>
              <input type="url" value={form.preview_image} onChange={e => setForm({...form, preview_image: e.target.value})} placeholder="https://example.com/image.jpg" className={inputCls} />
              {form.preview_image && (
                <div className="mt-2 relative w-full h-20 rounded-lg overflow-hidden border border-white/[0.10]">
                  <img src={form.preview_image} className="w-full h-full object-cover" alt="" onError={e => e.target.style.display='none'} />
                </div>
              )}
            </div>

            <div>
              <label className={labelCls}>Gallery Images (Optional, up to 5)</label>
              <div className="space-y-1.5">
                {[1,2,3,4,5].map(i => (
                  <input key={i} type="url" value={form[`gallery_image_${i}`]} onChange={e => setForm({...form, [`gallery_image_${i}`]: e.target.value})} placeholder={`Gallery image ${i} URL`} className={inputCls} />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 sticky bottom-0 bg-[#0a0a0a] py-3">
              <button type="button" onClick={onClose} className="flex-1 h-[40px] rounded-lg border border-white/[0.15] text-[11px] font-semibold text-[#aaa] hover:bg-white/[0.05] transition-colors">Cancel</button>
              <button type="button" onClick={handleSubmit} disabled={saving || !form.name} className="flex-1 h-[40px] rounded-lg bg-[#4ade80] text-black text-[11px] font-semibold hover:-translate-y-0.5 transition-transform disabled:opacity-50">
                {saving ? 'Saving...' : design?.id ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>

          {/* Right: Code Editor + Preview */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Code Section Tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-0.5 bg-white/[0.05] rounded-lg p-0.5">
                {fields.map(f => (
                  <button key={f} onClick={() => setActiveField(f)}
                    className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                      activeField === f ? 'bg-[#4ade80] text-black' : 'text-[#888] hover:text-white hover:bg-white/[0.05]'
                    }`}>
                    {labels[f] || f}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleCopyCode} className="px-3 py-1.5 rounded-md text-[11px] text-[#888] hover:text-white border border-white/[0.10] hover:border-white/[0.20] transition-colors flex items-center gap-1">
                  {copied ? <Check size={11} className="text-[#4ade80]" /> : <Copy size={11} />} {copied ? 'Copied' : 'Copy'}
                </button>
                <button onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-medium border transition-all flex items-center gap-1 ${
                    showPreview ? 'bg-[#4ade80] text-black border-[#4ade80]' : 'text-[#888] border-white/[0.10] hover:border-white/[0.20]'
                  }`}>
                  <Eye size={11} /> Preview
                </button>
              </div>
            </div>

            {/* Editor + Preview */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
              <div className={`flex flex-col min-h-0 ${showPreview ? 'w-1/2 border-r border-white/[0.06]' : 'flex-1'}`}>
                <CodeEditor
                  value={form[activeField]}
                  onChange={val => setForm(prev => ({ ...prev, [activeField]: val }))}
                  placeholder={`Write your ${(labels[activeField] || activeField).toLowerCase()} code here...`}
                  label={labels[activeField] || activeField}
                />
              </div>
              {showPreview && (
                <div className="w-1/2 flex flex-col min-h-0 bg-[#0a0a0a]">
                  <div className="px-3 py-2 border-b border-white/[0.04] flex items-center gap-1.5 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                    <span className="text-[9px] text-[#888] uppercase tracking-wider font-medium">Live Preview</span>
                  </div>
                  <div className="flex-1 p-3 min-h-0">
                    {hasLiveCode ? (
                      <LivePreview
                        html={form.html_code}
                        css={form.css_code}
                        js={form.js_code}
                        className="w-full h-full rounded-lg overflow-hidden border border-white/[0.08]"
                        title="admin-preview"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg border-2 border-dashed border-white/[0.10] flex flex-col items-center justify-center text-[#555] gap-2">
                        <Code size={28} />
                        <span className="text-[12px]">Enter code to see a live preview</span>
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

  const handlePublishToggle = async (d) => {
    try {
      if (d.published) {
        await api.adminUnpublishDesign(d.id)
      } else {
        await api.adminPublishDesign(d.id)
      }
      loadDesigns()
    } catch (err) {
      alert(err.message)
    }
  }

  const hasCode = (d) => d.html_code || d.css_code || d.js_code || d.react_code || d.vue_code || d.svelte_code || d.astro_code || d.next_code

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] tracking-[-0.04em] font-bold">Designs</h1>
          <p className="text-[#555] text-[11px] mt-1">{designs.length} total designs.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadDesigns} className="px-3 py-2 rounded-lg border border-white/[0.10] bg-white/[0.035] text-[10px] font-semibold text-[#aaa] hover:bg-white/[0.08] transition-colors">Refresh</button>
          <button onClick={() => setModal({})} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#4ade80] text-black text-[10px] font-semibold hover:-translate-y-0.5 transition-transform">
            <Plus size={13} /> New Design
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-[#555] text-[12px] py-10 text-center">Loading...</div>
      ) : designs.length === 0 ? (
        <div className="text-center py-20 text-[#555] text-[12px]">No designs yet. Create one!</div>
      ) : (
        <div className="rounded-xl border border-white/[0.08] bg-[#080808] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Preview</th>
                  <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Name</th>
                  <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Framework</th>
                  <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Category</th>
                  <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Price</th>
                  <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Status</th>
                  <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {designs.map(d => (
                  <tr key={d.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5">
                      <div className="w-14 h-10 rounded-md overflow-hidden bg-white/[0.03] flex items-center justify-center">
                        {hasCode(d) ? (
                          <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center"><Code size={14} className="text-[#4ade80]" /></div>
                        ) : d.preview_image ? (
                          <img src={d.preview_image} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                        ) : (
                          <span className="text-[#444] text-[8px]">No media</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-[11px] font-semibold">{d.name}</div>
                      <div className="text-[8px] text-[#555] mt-0.5 max-w-[200px] truncate">{d.description}</div>
                    </td>
                    <td className="px-4 py-2.5 text-[10px] text-[#888]">{d.framework}</td>
                    <td className="px-4 py-2.5 text-[10px] text-[#666]">{d.category}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[9px] font-medium ${d.price === 'Free' ? 'text-[#4ade80]' : 'text-[#fbbf24]'}`}>{d.price}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => handlePublishToggle(d)}
                        className={`text-[9px] font-medium px-2 py-0.5 rounded ${d.published ? 'bg-[#4ade80]/10 text-[#4ade80]' : 'bg-white/[0.05] text-[#666]'}`}>
                        {d.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1.5">
                        <button onClick={() => setModal(d)} className="p-1.5 rounded-md border border-white/[0.10] text-[#888] hover:text-white hover:bg-white/[0.05] transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => handleDelete(d.id, d.name)} className="p-1.5 rounded-md border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
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
