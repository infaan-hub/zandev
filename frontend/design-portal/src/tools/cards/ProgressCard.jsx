import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { cn, formatNumber } from '../utils';

export default function ProgressCard({ tool, style, onExport, index }) {
  const variant = style.id % 10;
  const progress = 65 + (variant * 3) % 30;
  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div className={cn('rounded-xl border overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl shadow-lg')}
        style={{ borderColor: `rgba(${style.accentRgb}, 0.15)`, background: '#0a0a0a' }}>
        <div className="aspect-[4/3] relative overflow-hidden flex items-center justify-center">
          {tool.preview_image && (
            <img src={tool.preview_image} alt={tool.name} className="absolute inset-0 w-full h-full object-cover opacity-15" />
          )}

          <div className="absolute inset-0 flex items-center justify-center p-6">
            {variant < 3 && (
              <div className="relative">
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <motion.circle
                    cx="45" cy="45" r="38" fill="none"
                    stroke={style.accent}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1.5, delay: 0.3 + index * 0.05 }}
                    transform="rotate(-90 45 45)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[18px] font-bold text-white">{progress}%</span>
                </div>
              </div>
            )}

            {variant >= 3 && variant < 6 && (
              <div className="w-full space-y-3 px-6">
                {[80, 60, 45].map((val, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[8px] text-[#555] mb-1">
                      <span>{['Design', 'Code', 'Test'][i]}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.15 + index * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: `rgba(${style.accentRgb}, ${0.4 + i * 0.2})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {variant >= 6 && (
              <div className="grid grid-cols-4 gap-1.5 w-full px-6">
                {Array.from({ length: 16 }, (_, i) => {
                  const filled = i < Math.floor(16 * progress / 100);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.02 * i + index * 0.05 }}
                      className="aspect-square rounded-sm"
                      style={{
                        backgroundColor: filled ? `rgba(${style.accentRgb}, ${0.3 + (i / 16) * 0.5})` : 'rgba(255,255,255,0.03)',
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
                style={{ backgroundColor: `rgba(${style.accentRgb}, 0.15)`, color: style.accent }}>
                {tool.framework}
              </span>
            </div>
            <h3 className="text-[13px] font-semibold text-white mb-1 line-clamp-1">{tool.name}</h3>
            <p className="text-[10px] text-[#666] line-clamp-2 mb-3">{tool.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[9px] text-[#555]">
                <span>{formatNumber(tool.views)} views</span>
                <span>{formatNumber(tool.exports)} exports</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onExport?.(tool); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `rgba(${style.accentRgb}, 0.1)` }}>
                <Download size={12} style={{ color: style.accent }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
