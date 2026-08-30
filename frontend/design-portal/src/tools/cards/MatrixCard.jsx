import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { cn, formatNumber } from '../utils';

export default function MatrixCard({ tool, style, onExport, index }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const variant = style.id % 5;
  const [isHovered, setIsHovered] = useState(false);

  const chars = useMemo(() => {
    const sets = [
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
      '0123456789ABCDEF',
      '/design/{}/code/{}/build/{}/ship/{}',
      '><[]{}()/\\|=-+',
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    ];
    return sets[variant] || sets[0];
  }, [variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const cols = Math.floor(w / 2 / (variant === 0 ? 14 : 10));
    const drops = new Array(cols).fill(1);
    const fontSize = variant === 0 ? 14 : 10;

    const draw = () => {
      ctx.fillStyle = `rgba(10, 10, 10, ${variant >= 2 ? 0.12 : 0.06})`;
      ctx.fillRect(0, 0, w / 2, h / 2);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = 0.3 + Math.random() * 0.7;
        ctx.fillStyle = variant < 2
          ? `rgba(34, 197, 94, ${alpha})`
          : `rgba(${style.accentRgb}, ${alpha})`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > h / 2 && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [chars, variant, style.accentRgb]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn('rounded-xl border overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl shadow-lg')}
        style={{ borderColor: `rgba(${style.accentRgb}, 0.15)`, background: '#0a0a0a' }}
      >
        <div className="aspect-[4/3] relative overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ imageRendering: 'pixelated' }} />
          {tool.preview_image && (
            <img src={tool.preview_image} alt={tool.name}
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-green-500/15 text-green-400">
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
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-green-500/10">
                <Download size={12} className="text-green-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
