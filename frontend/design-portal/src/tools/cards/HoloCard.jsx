import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles } from 'lucide-react';
import { cn, formatNumber } from '../utils';

export default function HoloCard({ tool, style, onExport, index }) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const variant = style.id % 6;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const holoAngle = (mouse.x * 360);
  const holoShift = mouse.x * 100;

  const themes = {
    0: { name: 'holo', bg: '#0a0a0a', border: `rgba(${style.accentRgb}, 0.2)`, shadow: `0 0 30px rgba(${style.accentRgb}, 0.1)` },
    1: { name: 'cyber', bg: '#0a0010', border: 'rgba(244,63,94,0.3)', shadow: '0 0 20px rgba(244,63,94,0.15), inset 0 0 30px rgba(244,63,94,0.05)' },
    2: { name: 'neon', bg: '#050a14', border: 'rgba(6,182,212,0.3)', shadow: '0 0 20px rgba(6,182,212,0.15), 0 0 60px rgba(6,182,212,0.05)' },
    3: { name: 'vapor', bg: '#0a0514', border: 'rgba(192,132,252,0.3)', shadow: '0 0 20px rgba(192,132,252,0.15)' },
    4: { name: 'space', bg: '#050510', border: 'rgba(129,140,248,0.2)', shadow: '0 0 30px rgba(129,140,248,0.08)' },
    5: { name: 'underwater', bg: '#050f14', border: 'rgba(34,211,238,0.2)', shadow: '0 0 30px rgba(34,211,238,0.08)' },
  };
  const theme = themes[variant] || themes[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div
        onMouseMove={handleMouseMove}
        className={cn('rounded-xl border overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl shadow-lg relative')}
        style={{ borderColor: theme.border, background: theme.bg, boxShadow: theme.shadow }}
      >
        {variant === 0 && (
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: `linear-gradient(${holoAngle}deg, 
                rgba(255,0,0,0.1), rgba(255,127,0,0.1), rgba(255,255,0,0.1), 
                rgba(0,255,0,0.1), rgba(0,0,255,0.1), rgba(139,0,255,0.1))`,
              mixBlendMode: 'overlay',
            }}
          />
        )}

        {variant === 1 && (
          <>
            <div className="absolute inset-0 pointer-events-none opacity-20"
              style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(244,63,94,0.1) 2px, rgba(244,63,94,0.1) 4px)' }} />
            <div className="absolute top-2 right-2 text-[8px] text-red-400 font-mono opacity-60">SYS://ONLINE</div>
          </>
        )}

        {variant === 2 && (
          <div className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              background: `radial-gradient(circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(6,182,212,0.4), transparent 50%)`,
            }}
          />
        )}

        <div className="aspect-[4/3] relative overflow-hidden">
          {tool.preview_image && (
            <img src={tool.preview_image} alt={tool.name} className="w-full h-full object-cover opacity-30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={11} style={{ color: style.accent }} />
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
