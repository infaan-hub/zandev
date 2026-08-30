import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import { cn, formatNumber } from '../utils';

export default function GlassCard({ tool, style, onExport, index }) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const variant = style.id % 3;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const configs = [
    { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', blur: 12, shadow: '0 8px 32px rgba(0,0,0,0.3)' },
    { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.12)', blur: 16, shadow: '0 8px 40px rgba(0,0,0,0.4)' },
    { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)', blur: 20, shadow: '0 12px 48px rgba(0,0,0,0.5)' },
  ];
  const config = configs[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div
        onMouseMove={handleMouseMove}
        className={cn('rounded-2xl border overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl relative')}
        style={{
          borderColor: config.border,
          background: config.bg,
          backdropFilter: `blur(${config.blur}px)`,
          WebkitBackdropFilter: `blur(${config.blur}px)`,
          boxShadow: config.shadow,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(${style.accentRgb}, 0.08), transparent 50%)`,
          }}
        />

        <div className="aspect-[4/3] relative overflow-hidden">
          {tool.preview_image && (
            <img src={tool.preview_image} alt={tool.name} className="w-full h-full object-cover opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `rgba(${style.accentRgb}, 0.1)`,
                  color: style.accent,
                  backdropFilter: 'blur(8px)',
                }}>
                {tool.framework}
              </span>
            </div>
            <h3 className="text-[13px] font-semibold text-white mb-1 line-clamp-1">{tool.name}</h3>
            <p className="text-[10px] text-white/50 line-clamp-2 mb-3">{tool.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[9px] text-white/40">
                <span>{formatNumber(tool.views)} views</span>
                <span>{formatNumber(tool.exports)} exports</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onExport?.(tool); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `rgba(${style.accentRgb}, 0.1)`,
                  backdropFilter: 'blur(8px)',
                }}>
                <Download size={12} style={{ color: style.accent }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
