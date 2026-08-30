import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { cn, formatNumber } from '../utils';

export default function ParticleCard({ tool, style, onExport, index }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const variant = style.id % 6;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const cw = w / 2, ch = h / 2;

    const count = variant < 2 ? 60 : variant < 4 ? 40 : 80;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * cw,
      y: Math.random() * ch,
      vx: (Math.random() - 0.5) * (variant >= 4 ? 1.5 : 0.8),
      vy: (Math.random() - 0.5) * (variant >= 4 ? 1.5 : 0.8),
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.fillStyle = `rgba(10, 10, 10, 0.15)`;
      ctx.fillRect(0, 0, cw, ch);
      const particles = particlesRef.current;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > cw) p.vx *= -1;
        if (p.y < 0 || p.y > ch) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${style.accentRgb}, ${p.alpha})`;
        ctx.fill();

        if (variant < 3) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x;
            const dy = p.y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 60) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(${style.accentRgb}, ${0.15 * (1 - dist / 60)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        if (variant >= 4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          grad.addColorStop(0, `rgba(${style.accentRgb}, 0.15)`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      if (variant === 3) {
        const time = Date.now() * 0.002;
        for (let x = 0; x < cw; x += 2) {
          const y = ch / 2 + Math.sin(x * 0.02 + time) * 20 + Math.sin(x * 0.05 + time * 1.5) * 10;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${style.accentRgb}, 0.6)`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [variant, style.accentRgb]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div className={cn('rounded-xl border overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl shadow-lg')}
        style={{ borderColor: `rgba(${style.accentRgb}, 0.15)`, background: '#0a0a0a' }}>
        <div className="aspect-[4/3] relative overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          {tool.preview_image && (
            <img src={tool.preview_image} alt={tool.name} className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay" />
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
      </div>
    </motion.div>
  );
}
