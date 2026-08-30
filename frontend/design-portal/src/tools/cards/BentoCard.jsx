import { motion } from 'framer-motion';
import { Download, LayoutGrid } from 'lucide-react';
import { cn, formatNumber } from '../utils';

export default function BentoCard({ tool, style, onExport, index }) {
  const variant = style.id % 5;

  const layouts = [
    { main: 'col-span-2 row-span-2', preview: 'aspect-square', meta: 'col-span-2' },
    { main: 'col-span-1 row-span-2', preview: 'aspect-[3/4]', meta: 'row-span-1' },
    { main: 'col-span-2 row-span-1', preview: 'aspect-[2/1]', meta: 'col-span-2' },
    { main: 'col-span-1 row-span-1', preview: 'aspect-square', meta: 'col-span-1' },
    { main: 'col-span-2 row-span-1', preview: 'aspect-[2/1]', meta: 'col-span-2' },
  ];
  const layout = layouts[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div className={cn(
        'rounded-xl border overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl shadow-lg grid',
        layout.main
      )}
        style={{ borderColor: `rgba(${style.accentRgb}, 0.15)`, background: '#0a0a0a' }}>

        <div className={cn('relative overflow-hidden', layout.preview)}>
          {tool.preview_image && (
            <img src={tool.preview_image} alt={tool.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {variant === 0 && (
            <div className="absolute top-3 left-3 flex gap-1.5">
              {['React', tool.category].filter(Boolean).map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-[8px] font-medium bg-black/40 backdrop-blur-sm text-white/80 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {variant === 1 && (
            <div className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10">
              <LayoutGrid size={12} className="text-white/60" />
            </div>
          )}
        </div>

        <div className={cn('p-4', layout.meta)}>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `rgba(${style.accentRgb}, 0.15)`, color: style.accent }}>
              {tool.framework}
            </span>
            {tool.price === 0 ? (
              <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-green-500/15 text-green-400">Free</span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-yellow-500/15 text-yellow-400">${tool.price}</span>
            )}
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
    </motion.div>
  );
}
