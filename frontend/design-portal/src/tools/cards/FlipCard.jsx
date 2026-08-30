import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RotateCcw } from 'lucide-react';
import { cn, formatNumber } from '../utils';

export default function FlipCard({ tool, style, onExport, index }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const variant = style.id % 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div
        className="relative cursor-pointer"
        style={{ perspective: variant === 0 ? 1000 : variant === 1 ? 800 : 1200 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative"
        >
          {/* Front */}
          <div
            className={cn('rounded-xl border overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl shadow-lg')}
            style={{
              borderColor: `rgba(${style.accentRgb}, 0.15)`,
              background: '#0a0a0a',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              {tool.preview_image && (
                <img src={tool.preview_image} alt={tool.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <RotateCcw size={12} className="text-white/60" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
                    style={{ backgroundColor: `rgba(${style.accentRgb}, 0.15)`, color: style.accent }}>
                    {tool.framework}
                  </span>
                </div>
                <h3 className="text-[13px] font-semibold text-white mb-1 line-clamp-1">{tool.name}</h3>
                <p className="text-[10px] text-[#666] line-clamp-2">{tool.description}</p>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className={cn('absolute inset-0 rounded-xl border overflow-hidden shadow-lg')}
            style={{
              borderColor: `rgba(${style.accentRgb}, 0.2)`,
              background: `linear-gradient(135deg, rgba(${style.accentRgb}, 0.08), #0a0a0a)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="text-[9px] uppercase tracking-wider mb-3" style={{ color: style.accent }}>Details</div>
              <div className="flex-1 space-y-2 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-[#666]">Category</span>
                  <span className="text-white">{tool.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Framework</span>
                  <span className="text-white">{tool.framework}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Price</span>
                  <span className="text-white">{tool.price === 0 ? 'Free' : `$${tool.price}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Score</span>
                  <span className="text-white">{tool.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Views</span>
                  <span className="text-white">{formatNumber(tool.views)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Exports</span>
                  <span className="text-white">{formatNumber(tool.exports)}</span>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onExport?.(tool); }}
                className="mt-3 w-full h-8 rounded-lg flex items-center justify-center text-[10px] font-semibold"
                style={{ backgroundColor: `rgba(${style.accentRgb}, 0.15)`, color: style.accent }}>
                <Download size={11} className="mr-1.5" /> Export Code
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
