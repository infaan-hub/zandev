import { FolderOpen, Plus, Code2, GitBranch, Clock, MoreHorizontal, Trash2, Edit3, X } from 'lucide-react'
import { useState } from 'react'
import { useDashboard } from './DashboardContext'

const statusColors = (isLight) => ({
  active: isLight ? 'bg-[#4ade80]/10 text-[#16a34a] border-[#4ade80]/30' : 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20',
  paused: isLight ? 'bg-[#fbbf24]/10 text-[#d97706] border-[#fbbf24]/30' : 'bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20',
  completed: isLight ? 'bg-[#60a5fa]/10 text-[#2563eb] border-[#60a5fa]/30' : 'bg-[#60a5fa]/10 text-[#60a5fa] border-[#60a5fa]/20',
})

export default function DashboardProjects() {
  const { projects, createProject, updateProject, deleteProject, duplicateProject, isLight } = useDashboard()
  const [activeMenu, setActiveMenu] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', framework: 'React' })

  const c = {
    card: isLight ? 'bg-white border-black/[0.06] hover:border-black/[0.1]' : 'bg-[#080808] border-white/[0.10] hover:bg-white/[0.03]',
    muted: isLight ? 'text-[#888]' : 'text-[#6c6c6c]',
    subtle: isLight ? 'text-[#666]' : 'text-[#555]',
    body: isLight ? 'text-[#333]' : 'text-[#888]',
    text: isLight ? 'text-[#1a1a1a]' : 'text-white',
    border: isLight ? 'border-black/[0.06]' : 'border-white/[0.06]',
    input: isLight ? 'bg-black/[0.03] border-black/[0.06] text-[#1a1a1a] placeholder:text-[#999] focus:border-black/[0.15]' : 'bg-white/[0.03] border-white/[0.08] text-white placeholder:text-[#555] focus:border-white/[0.2]',
    btn: isLight ? 'bg-black/[0.04] text-[#555] border-black/[0.08] hover:text-[#1a1a1a] hover:bg-black/[0.06]' : 'bg-white/[0.03] text-[#888] border-white/[0.08] hover:text-white hover:bg-white/[0.06]',
    menu: isLight ? 'bg-white border-black/[0.1] shadow-xl' : 'bg-[#1a1a1a] border-white/[0.1] shadow-xl',
    menuHover: isLight ? 'hover:bg-black/[0.04] hover:text-[#1a1a1a]' : 'hover:bg-white/[0.06] hover:text-white',
    form: isLight ? 'bg-white border-black/[0.06]' : 'bg-[#080808] border-white/[0.10]',
  }

  const sc = statusColors(isLight)
  const totalComponents = projects.reduce((acc, p) => acc + p.components, 0)
  const activeProjects = projects.filter(p => p.status === 'active').length

  const handleCreate = () => {
    if (!form.name.trim()) return
    createProject(form)
    setForm({ name: '', description: '', framework: 'React' })
    setShowCreate(false)
  }

  const handleEdit = (project) => {
    setEditing(project.id)
    setForm({ name: project.name, description: project.description, framework: project.framework })
    setActiveMenu(null)
  }

  const handleUpdate = () => {
    if (!form.name.trim()) return
    updateProject(editing, form)
    setEditing(null)
    setForm({ name: '', description: '', framework: 'React' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-[32px]">
        <div>
          <h1 className={`${c.text} text-[clamp(28px,4vw,40px)] leading-[0.95] tracking-[-0.06em] font-bold`}>Projects</h1>
          <p className={`${c.body} text-[12px] leading-[1.7] mt-[8px]`}>Organize your exported components into projects.</p>
        </div>
        <button onClick={() => { setShowCreate(true); setEditing(null); setForm({ name: '', description: '', framework: 'React' }) }} className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-[8px] text-[10px] font-semibold bg-white text-black hover:bg-white/90 transition-colors">
          <Plus size={13} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-3 gap-[12px] mb-[24px]">
        {[
          { label: 'Total Projects', value: projects.length },
          { label: 'Active', value: activeProjects },
          { label: 'Total Components', value: totalComponents },
        ].map((s) => (
          <div key={s.label} className={`p-[16px] rounded-[12px] border ${c.card}`}>
            <div className={`${c.subtle} text-[8px] uppercase tracking-[0.08em] mb-[6px]`}>{s.label}</div>
            <div className={`${c.text} text-[22px] font-bold`}>{s.value}</div>
          </div>
        ))}
      </div>

      {(showCreate || editing) && (
        <div className={`mb-[24px] p-[24px] rounded-[18px] border ${c.form}`}>
          <div className="flex items-center justify-between mb-[16px]">
            <div className={`text-[12px] font-semibold ${c.text}`}>{editing ? 'Edit Project' : 'Create New Project'}</div>
            <button onClick={() => { setShowCreate(false); setEditing(null) }} className={c.subtle}><X size={16} /></button>
          </div>
          <div className="flex flex-col gap-[12px] max-w-[400px]">
            <div>
              <label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[6px] block`}>Project Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="My SaaS App" className={`w-full px-[14px] py-[10px] rounded-[10px] border text-[12px] outline-none transition-colors ${c.input}`} />
            </div>
            <div>
              <label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[6px] block`}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" rows={2} className={`w-full px-[14px] py-[10px] rounded-[10px] border text-[12px] outline-none transition-colors resize-none ${c.input}`} />
            </div>
            <div>
              <label className={`${c.subtle} text-[9px] uppercase tracking-[0.08em] mb-[6px] block`}>Framework</label>
              <div className="flex gap-[6px]">
                {['React', 'Next.js', 'Vue', 'Svelte', 'Astro'].map((fw) => (
                  <button key={fw} onClick={() => setForm({ ...form, framework: fw })} className={`px-[10px] py-[6px] rounded-[6px] text-[9px] font-medium border transition-colors ${form.framework === fw ? 'bg-white text-black border-white' : c.btn}`}>{fw}</button>
                ))}
              </div>
            </div>
            <button onClick={editing ? handleUpdate : handleCreate} className="self-start px-[16px] py-[8px] rounded-[8px] text-[10px] font-semibold bg-white text-black hover:bg-white/90 transition-colors">
              {editing ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px]">
        {projects.map((p) => (
          <div key={p.id} className={`group p-[24px] rounded-[18px] border transition-colors cursor-pointer relative ${c.card}`}>
            <div className="flex items-start justify-between mb-[16px]">
              <div className={`w-[42px] h-[42px] rounded-[12px] border grid place-items-center ${isLight ? 'bg-black/[0.03] border-black/[0.06]' : 'bg-white/[0.05] border-white/[0.08]'}`}>
                <FolderOpen size={18} className={c.body} />
              </div>
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === p.id ? null : p.id) }} className={`${c.subtle} hover:${c.text} transition-colors p-[4px]`}>
                  <MoreHorizontal size={14} />
                </button>
                {activeMenu === p.id && (
                  <div className={`absolute right-0 top-[28px] z-10 w-[160px] p-[4px] rounded-[10px] border ${c.menu}`}>
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(p) }} className={`flex items-center gap-[8px] w-full px-[10px] py-[7px] rounded-[6px] text-[10px] transition-colors ${c.menuHover}`}><Edit3 size={12} /> Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); duplicateProject(p) }} className={`flex items-center gap-[8px] w-full px-[10px] py-[7px] rounded-[6px] text-[10px] transition-colors ${c.menuHover}`}><GitBranch size={12} /> Duplicate</button>
                    <div className={`my-[4px] border-t ${c.border}`} />
                    <div className={`px-[10px] py-[4px] text-[8px] uppercase ${c.subtle}`}>Status</div>
                    {['active', 'paused', 'completed'].map((s) => (
                      <button key={s} onClick={(e) => { e.stopPropagation(); updateProject(p.id, { status: s }); setActiveMenu(null) }} className={`flex items-center gap-[8px] w-full px-[10px] py-[7px] rounded-[6px] text-[10px] capitalize transition-colors ${p.status === s ? 'text-white bg-white/[0.06]' : c.menuHover}`}>{s}</button>
                    ))}
                    <div className={`my-[4px] border-t ${c.border}`} />
                    <button onClick={(e) => { e.stopPropagation(); deleteProject(p.id) }} className="flex items-center gap-[8px] w-full px-[10px] py-[7px] rounded-[6px] text-[10px] text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"><Trash2 size={12} /> Delete</button>
                  </div>
                )}
              </div>
            </div>
            <div className={`text-[14px] font-semibold mb-[4px] ${c.text}`}>{p.name}</div>
            <div className={`${c.body} text-[10px] mb-[4px] leading-[1.5]`}>{p.description}</div>
            <div className="flex items-center gap-[8px] mb-[16px]">
              <span className={`text-[9px] px-[6px] py-[2px] rounded-full border ${c.tag}`}>{p.framework}</span>
              <span className={`text-[9px] px-[6px] py-[2px] rounded-full border ${sc[p.status]}`}>{p.status}</span>
            </div>
            <div className={`flex items-center justify-between pt-[14px] border-t ${c.border}`}>
              <div className={`flex items-center gap-[12px] text-[9px] ${c.body}`}>
                <div className="flex items-center gap-[4px]"><Code2 size={11} />{p.components} components</div>
                <div className="flex items-center gap-[4px]"><GitBranch size={11} />{p.collaborators}</div>
              </div>
              <div className={`flex items-center gap-[4px] text-[9px] ${c.subtle}`}><Clock size={10} />{p.lastUpdated}</div>
            </div>
          </div>
        ))}

        <button onClick={() => { setShowCreate(true); setEditing(null); setForm({ name: '', description: '', framework: 'React' }) }} className={`p-[24px] rounded-[18px] border border-dashed transition-colors flex flex-col items-center justify-center gap-[10px] min-h-[220px] ${isLight ? 'border-black/[0.10] hover:bg-black/[0.02]' : 'border-white/[0.10] hover:bg-white/[0.02]'}`}>
          <div className={`w-[42px] h-[42px] rounded-[12px] border grid place-items-center ${isLight ? 'bg-black/[0.04] border-black/[0.08]' : 'bg-white/[0.04] border-white/[0.08]'}`}>
            <Plus size={18} className={c.subtle} />
          </div>
          <span className={`text-[11px] ${c.subtle}`}>Create new project</span>
        </button>
      </div>
    </div>
  )
}
