import { motion } from 'framer-motion';
import { Download, Camera } from 'lucide-react';
import { cn, formatNumber } from '../utils';

export default function PolaroidCard({ tool, style, onExport, index }) {
  const variant = style.id % 5;
  const rotation = variant === 0 ? -3 : variant === 1 ? 2 : variant === 2 ? -1 : variant === 3 ? 4 : 0;
  const tapeColor = ['#fbbf24', '#f472b6', '#86efac', '#93c5fd', '#fca5a5'][variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: rotation }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div className={cn('rounded-sm overflow-hidden transition-all duration-300 group-hover:shadow-2xl shadow-lg group-hover:rotate-0')}
        style={{
          background: variant < 3 ? '#fafaf9' : '#1a1a1a',
          padding: '12px 12px 40px 12px',
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {variant < 3 && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-8 h-4 rounded-b-sm opacity-60"
            style={{ backgroundColor: tapeColor, transform: `rotate(${rotation * -0.5}deg)` }} />
        )}

        <div className="aspect-square relative overflow-hidden rounded-sm mb-0">
          {tool.preview_image ? (
            <img src={tool.preview_image} alt={tool.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `rgba(${style.accentRgb}, 0.1)` }}>
              <Camera size={24} style={{ color: `rgba(${style.accentRgb}, 0.3)` }} />
            </div>
          )}
        </div>

        <div className="pt-3">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-[10px] font-semibold', variant < 3 ? 'text-[#333]' : 'text-white')}>
              {tool.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('text-[8px]', variant < 3 ? 'text-[#999]' : 'text-[#666]')}>
              {tool.framework}
            </span>
            <span className={cn('text-[8px]', variant < 3 ? 'text-[#bbb]' : 'text-[#555]')}>·</span>
            <span className={cn('text-[8px]', variant < 3 ? 'text-[#999]' : 'text-[#666]')}>
              {formatNumber(tool.views)} views
            </span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onExport?.(tool); }}
            className={cn(
              'mt-2 w-full h-7 rounded text-[9px] font-semibold flex items-center justify-center gap-1 transition-colors',
              variant < 3
                ? 'bg-[#333] text-white hover:bg-[#444]'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}>
            <Download size={10} /> Export
          </button>
        </div>
      </div>
    </motion.div>
  );
}
