import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import { cn, formatNumber } from '../utils';

export default function TiltCard({ tool, style, onExport, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -15, y: x * 15 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const variant = style.id % 10;
  const perspective = variant < 3 ? 800 : variant < 6 ? 600 : 1000;
  const maxTilt = variant < 3 ? 15 : variant < 6 ? 20 : 10;
  const showReflection = variant >= 3 && variant < 6;
  const showGlow = variant >= 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: `${perspective}px`,
          transformStyle: 'preserve-3d',
        }}
        className="relative"
      >
        <div
          className={cn(
            'relative rounded-xl border overflow-hidden cursor-pointer transition-shadow duration-300',
            isHovered ? 'shadow-2xl' : 'shadow-lg'
          )}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isHovered ? 20 : 0}px)`,
            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
            transformStyle: 'preserve-3d',
            borderColor: `rgba(${style.accentRgb}, 0.15)`,
            background: '#0a0a0a',
          }}
        >
          {showGlow && (
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${(tilt.y / 15 + 0.5) * 100}% ${(tilt.x / 15 + 0.5) * 100}%, rgba(${style.accentRgb}, 0.15), transparent 60%)`,
              }}
            />
          )}

          <div className="aspect-[4/3] relative overflow-hidden">
            {tool.preview_image ? (
              <img
                src={tool.preview_image}
                alt={tool.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ transform: `translateZ(30px)` }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl font-bold"
                style={{ color: `rgba(${style.accentRgb}, 0.3)` }}
              >
                {tool.name?.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          <div className="p-4" style={{ transform: 'translateZ(20px)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `rgba(${style.accentRgb}, 0.15)`,
                  color: style.accent,
                }}
              >
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
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); onExport?.(tool); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: `rgba(${style.accentRgb}, 0.1)` }}
                >
                  <Download size={12} style={{ color: style.accent }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {showReflection && (
          <div
            className="absolute -bottom-1 left-2 right-2 h-8 rounded-xl opacity-20 blur-sm pointer-events-none"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scaleY(-1)`,
              background: `linear-gradient(to bottom, rgba(${style.accentRgb}, 0.3), transparent)`,
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
