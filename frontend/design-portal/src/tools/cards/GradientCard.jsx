import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { cn, formatNumber } from '../utils';

export default function GradientCard({ tool, style, onExport, index }) {
  const variant = style.id % 15;
  const gradient = style.gradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div className={cn('rounded-2xl overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl shadow-lg relative')}
        style={{ boxShadow: `0 0 0 1px rgba(${style.accentRgb}, 0.2), 0 8px 32px rgba(0,0,0,0.3)` }}>
        <div className="absolute inset-0" style={{ background: gradient, opacity: 0.15 }} />

        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1), transparent 50%)`,
        }} />

        <div className="aspect-[4/3] relative overflow-hidden">
          {tool.preview_image && (
            <img src={tool.preview_image} alt={tool.name} className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute top-3 left-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
              background: `linear-gradient(135deg, rgba(${style.accentRgb}, 0.4), rgba(${style.accentRgb}, 0.1))`,
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span className="text-[10px] font-bold text-white">{tool.name?.charAt(0)}</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-white/10 text-white backdrop-blur-sm">
                {tool.framework}
              </span>
              {tool.price === 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-green-400/20 text-green-300">Free</span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white/10 text-white">${tool.price}</span>
              )}
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-1 line-clamp-1">{tool.name}</h3>
            <p className="text-[10px] text-white/50 line-clamp-2 mb-3">{tool.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[9px] text-white/40">
                <span>{formatNumber(tool.views)} views</span>
                <span>{formatNumber(tool.exports)} exports</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onExport?.(tool); }}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <Download size={13} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
