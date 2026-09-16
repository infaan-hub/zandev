import { FolderOpen, Code2, GitBranch, Clock } from 'lucide-react'
import { useDashboard } from './DashboardContext'

export default function DashboardProjects() {
  const { projects, isLight } = useDashboard()

  const c = {
    card: isLight ? 'bg-white border-black/[0.06] hover:border-black/[0.1]' : 'bg-[#080808] border-white/[0.10] hover:bg-white/[0.03]',
    muted: isLight ? 'text-[#888]' : 'text-[#6c6c6c]',
    subtle: isLight ? 'text-[#666]' : 'text-[#555]',
    body: isLight ? 'text-[#333]' : 'text-[#888]',
    text: isLight ? 'text-[#1a1a1a]' : 'text-white',
    border: isLight ? 'border-black/[0.06]' : 'border-white/[0.06]',
  }

  const totalComponents = projects.reduce((acc, p) => acc + p.components, 0)
  const activeProjects = projects.filter(p => p.status === 'active').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`${c.text} text-[clamp(28px,4vw,40px)] leading-[0.95] tracking-[-0.06em] font-bold`}>Projects</h1>
          <p className={`${c.body} text-[12px] leading-[1.7] mt-2`}>Your exported component projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Projects', value: projects.length },
          { label: 'Active', value: activeProjects },
          { label: 'Total Components', value: totalComponents },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-xl border ${c.card}`}>
            <div className={`${c.subtle} text-[8px] uppercase tracking-wider mb-1.5`}>{s.label}</div>
            <div className={`${c.text} text-[22px] font-bold`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map(p => (
          <div key={p.id} className={`group p-5 rounded-2xl border transition-colors ${c.card}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl border grid place-items-center shrink-0 ${isLight ? 'bg-black/[0.03] border-black/[0.06]' : 'bg-white/[0.05] border-white/[0.08]'}`}>
                <FolderOpen size={16} className={c.body} />
              </div>
              <div className="min-w-0">
                <div className={`text-[13px] font-semibold truncate ${c.text}`}>{p.name}</div>
                <div className={`${c.body} text-[10px] truncate`}>{p.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[9px] px-2 py-0.5 rounded-full border ${c.border} ${c.subtle}`}>{p.framework}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full border ${p.status === 'active' ? 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20' : 'bg-white/[0.05] text-[#666] border-white/[0.08]'}`}>{p.status}</span>
            </div>
            <div className={`flex items-center justify-between pt-3 border-t ${c.border}`}>
              <div className={`flex items-center gap-3 text-[9px] ${c.body}`}>
                <div className="flex items-center gap-1"><Code2 size={10} />{p.components} components</div>
                <div className="flex items-center gap-1"><GitBranch size={10} />{p.collaborators}</div>
              </div>
              <div className={`flex items-center gap-1 text-[9px] ${c.subtle}`}><Clock size={9} />{p.lastUpdated}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
