import { useDashboard } from './DashboardContext'
import { CheckCircle, XCircle } from 'lucide-react'

export default function Toast() {
  const { toasts, isLight } = useDashboard()

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-[8px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-[10px] px-[16px] py-[12px] rounded-[10px] border shadow-xl animate-in slide-in-from-right ${isLight ? 'bg-white border-black/[0.08] text-[#1a1a1a]' : 'bg-[#1a1a1a] border-white/[0.1] text-white'}`}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={16} className="text-[#4ade80]" />
          ) : (
            <XCircle size={16} className="text-[#ef4444]" />
          )}
          <span className="text-[11px]">{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
