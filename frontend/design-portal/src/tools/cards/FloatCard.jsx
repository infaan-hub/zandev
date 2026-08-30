import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, GripVertical } from 'lucide-react';
import { cn, formatNumber } from '../utils';

export default function FloatCard({ tool, style, onExport, index }) {
  const cardRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const variant = style.id % 7;

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (variant < 2) {
      setOffset({ x: x * 8, y: y * 8 });
    } else if (variant < 4) {
      setOffset({ x: x * -12, y: y * -12 });
    } else {
      setOffset({ x: x * 5, y: y * 5 });
    }
  }, [variant]);

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={handleMouseLeave}>
        <motion.div
          animate={{
            x: offset.x,
            y: offset.y,
            scale: variant >= 4 && variant < 6 ? (isHovered ? 1.02 : 1) : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={cn(
            'rounded-xl border overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl shadow-lg relative',
            variant >= 4 && variant < 6 && 'cursor-pointer'
          )}
          style={{ borderColor: `rgba(${style.accentRgb}, 0.15)`, background: '#0a0a0a' }}
        >
          {variant >= 4 && variant < 6 && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: `inset 0 0 40px rgba(${style.accentRgb}, 0.1)` }} />
          )}

          {variant >= 6 && isHovered && (
            <div className="absolute top-2 right-2 z-10">
              <GripVertical size={14} className="text-white/20" />
            </div>
          )}

          <div className="aspect-[4/3] relative overflow-hidden">
            {tool.preview_image && (
              <img src={tool.preview_image} alt={tool.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
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
        </motion.div>
      </div>
    </motion.div>
  );
}
