import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import { cn, formatNumber } from '../utils';

function BaseCard({ tool, style, onExport, index }) {
  const css = style.css || {};
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const baseStyle = {
    background: css.bg || '#0a0a0a',
    border: css.border || '1px solid rgba(255,255,255,0.06)',
    borderRadius: css.borderRadius || '12px',
    boxShadow: css.shadow || 'none',
  };

  const isDarkText = css.darkText;
  const textColor = isDarkText ? '#18181b' : '#ffffff';
  const subtextColor = isDarkText ? '#666' : '#888';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.4) }}
      className="group"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative overflow-hidden transition-shadow duration-300',
          css.compact && 'text-[10px]',
          css.wide && 'aspect-[16/7]',
          css.square && 'aspect-square',
          css.tall && 'aspect-[3/4]',
          !css.wide && !css.square && !css.tall && 'aspect-[4/3]',
        )}
        style={baseStyle}
      >
        {/* === DECORATIVE OVERLAYS === */}

        {/* Top accent bar */}
        {css.topBar && (
          <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{ backgroundColor: style.accent }} />
        )}

        {/* Left accent bar */}
        {css.leftBar && (
          <div className="absolute top-0 left-0 bottom-0 w-1 z-10" style={{ backgroundColor: style.accent }} />
        )}

        {/* Corner fold */}
        {css.cornerFold && (
          <div className="absolute top-0 right-0 w-8 h-8 z-10" style={{
            background: `linear-gradient(135deg, transparent 50%, rgba(${style.accentRgb}, 0.2) 50%)`,
          }} />
        )}

        {/* Stripes pattern */}
        {css.stripes && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${style.accent} 10px, ${style.accent} 11px)`,
          }} />
        )}

        {/* Checkered pattern */}
        {css.checkered && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{
            backgroundImage: `repeating-conic-gradient(${style.accent} 0% 25%, transparent 0% 50%)`,
            backgroundSize: '20px 20px',
          }} />
        )}

        {/* Glow underline */}
        {css.glowUnder && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] z-10" style={{
            boxShadow: `0 0 12px 2px ${style.accent}`,
            backgroundColor: style.accent,
          }} />
        )}

        {/* Grain overlay */}
        {css.grain && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.15]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }} />
        )}

        {/* Scanlines */}
        {css.scanlines && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.06]" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
          }} />
        )}

        {/* Noise texture */}
        {css.noise && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />
        )}

        {/* Diagonal lines */}
        {css.diagonal && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]" style={{
            backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 8px, ${style.accent} 8px, ${style.accent} 9px)`,
          }} />
        )}

        {/* Dot pattern */}
        {css.dots && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]" style={{
            backgroundImage: `radial-gradient(circle, ${style.accent} 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }} />
        )}

        {/* Rivets */}
        {css.rivets && (
          <>
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full z-10" style={{ background: 'radial-gradient(circle at 30% 30%, #888, #333)' }} />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full z-10" style={{ background: 'radial-gradient(circle at 30% 30%, #888, #333)' }} />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full z-10" style={{ background: 'radial-gradient(circle at 30% 30%, #888, #333)' }} />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full z-10" style={{ background: 'radial-gradient(circle at 30% 30%, #888, #333)' }} />
          </>
        )}

        {/* Hologram effect */}
        {css.hologram && (
          <div className="absolute inset-0 pointer-events-none z-[1]" style={{
            background: `linear-gradient(${isHovered ? mouse.x * 360 : 0}deg, 
              rgba(255,0,0,0.03), rgba(0,255,0,0.03), rgba(0,0,255,0.03))`,
            mixBlendMode: 'screen',
          }} />
        )}

        {/* Ribbon */}
        {css.ribbon && (
          <div className="absolute -top-1 -right-12 w-32 h-6 z-10 flex items-center justify-center rotate-45"
            style={{ backgroundColor: style.accent }}>
            <span className="text-[7px] font-bold text-white uppercase tracking-wider">New</span>
          </div>
        )}

        {/* Stamp effect */}
        {css.stamp && (
          <div className="absolute top-3 right-3 z-10 border-2 rounded px-2 py-0.5 rotate-[-12deg] opacity-60"
            style={{ borderColor: style.accent, color: style.accent }}>
            <span className="text-[8px] font-bold uppercase">Approved</span>
          </div>
        )}

        {/* Ticket edge (perforated) */}
        {css.ticketEdge && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10"
            style={{ background: '#030303' }} />
        )}

        {/* Washi tape */}
        {css.washi && (
          <div className="absolute -top-1 left-4 w-12 h-5 z-10 opacity-60"
            style={{ background: `linear-gradient(90deg, ${style.accent}88, ${style.accent}44)`, transform: 'rotate(-2deg)' }} />
        )}

        {/* Sticky note fold */}
        {css.sticky && (
          <div className="absolute bottom-0 right-0 w-6 h-6 z-10" style={{
            background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.05) 50%)',
          }} />
        )}

        {/* Badge corner */}
        {css.badge && (
          <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded border flex items-center justify-center"
            style={{ borderColor: `rgba(${style.accentRgb}, 0.3)`, background: 'rgba(0,0,0,0.3)' }}>
            <span className="text-[8px] font-bold" style={{ color: style.accent }}>{tool.name?.charAt(0)}</span>
          </div>
        )}

        {/* Film strip holes */}
        {css.filmStrip && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-3 z-10 flex flex-col items-center justify-around py-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-2 h-1.5 rounded-sm" style={{ background: '#333' }} />
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-3 z-10 flex flex-col items-center justify-around py-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-2 h-1.5 rounded-sm" style={{ background: '#333' }} />
              ))}
            </div>
          </>
        )}

        {/* Viewfinder corners */}
        {css.viewfinder && (
          <>
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 z-10" style={{ borderColor: style.accent }} />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 z-10" style={{ borderColor: style.accent }} />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 z-10" style={{ borderColor: style.accent }} />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 z-10" style={{ borderColor: style.accent }} />
          </>
        )}

        {/* Crosshair */}
        {css.crosshair && (
          <>
            <div className="absolute top-1/2 left-0 right-0 h-[1px] z-[1]" style={{ background: `${style.accent}33` }} />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] z-[1]" style={{ background: `${style.accent}33` }} />
          </>
        )}

        {/* Zebra stripes */}
        {css.zebra && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 6px, white 6px, white 12px)',
          }} />
        )}

        {/* Halftone */}
        {css.halftone && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]" style={{
            backgroundImage: `radial-gradient(circle, ${style.accent} 1px, transparent 1px)`,
            backgroundSize: '8px 8px',
          }} />
        )}

        {/* Carbon fiber */}
        {css.carbon && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.06]" style={{
            backgroundImage: `repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%)`,
            backgroundSize: '4px 4px',
          }} />
        )}

        {/* Perforated */}
        {css.perforated && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.05]" style={{
            backgroundImage: 'radial-gradient(circle, transparent 3px, rgba(255,255,255,0.08) 3px, rgba(255,255,255,0.08) 4px, transparent 4px)',
            backgroundSize: '12px 12px',
          }} />
        )}

        {/* Marble veins */}
        {css.marble && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.15]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.015' numOctaves='3'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='30'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23m)' fill='%23ddd' opacity='0.3'/%3E%3C/svg%3E")`,
          }} />
        )}

        {/* Concrete */}
        {css.concrete && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.12]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23c)' opacity='0.4'/%3E%3C/svg%3E")`,
          }} />
        )}

        {/* Kintsugi gold lines */}
        {css.kintsugi && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-20" style={{
            backgroundImage: `
              linear-gradient(137deg, transparent 45%, ${style.accent} 45.5%, ${style.accent} 46%, transparent 46.5%),
              linear-gradient(23deg, transparent 48%, ${style.accent} 48.5%, ${style.accent} 49%, transparent 49.5%)
            `,
          }} />
        )}

        {/* Origami fold */}
        {css.origami && (
          <div className="absolute top-0 right-0 w-12 h-12 z-10" style={{
            background: 'linear-gradient(225deg, transparent 50%, rgba(0,0,0,0.04) 50%)',
          }} />
        )}

        {/* Shibori tie-dye */}
        {css.shibori && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]" style={{
            backgroundImage: `radial-gradient(ellipse at 30% 40%, ${style.accent}, transparent 60%),
              radial-gradient(ellipse at 70% 60%, ${style.accent}, transparent 60%)`,
          }} />
        )}

        {/* Sashiko stitching */}
        {css.sashiko && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 4px, ${style.accent} 4px, ${style.accent} 5px),
              repeating-linear-gradient(-45deg, transparent, transparent 4px, ${style.accent} 4px, ${style.accent} 5px)`,
          }} />
        )}

        {/* Tangram */}
        {css.tangram && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.06]" style={{
            backgroundImage: `
              linear-gradient(45deg, ${style.accent} 25%, transparent 25%),
              linear-gradient(-45deg, ${style.accent} 25%, transparent 25%),
              linear-gradient(135deg, ${style.accent} 25%, transparent 25%)
            `,
            backgroundSize: '40px 40px',
          }} />
        )}

        {/* Celtic knot */}
        {css.celtic && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.06]" style={{
            backgroundImage: `repeating-conic-gradient(${style.accent} 0% 25%, transparent 0% 50%)`,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(circle, white 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, white 30%, transparent 70%)',
          }} />
        )}

        {/* Art Deco */}
        {css.artDeco && (
          <>
            <div className="absolute top-0 left-0 right-0 h-2 z-10" style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${style.accent} 0px, ${style.accent} 4px, transparent 4px, transparent 8px)`,
            }} />
            <div className="absolute bottom-0 left-0 right-0 h-2 z-10" style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${style.accent} 0px, ${style.accent} 4px, transparent 4px, transparent 8px)`,
            }} />
          </>
        )}

        {/* Victorian ornate corners */}
        {css.victorian && (
          <>
            <div className="absolute top-1 left-1 w-6 h-6 border-t border-l z-10" style={{ borderColor: `${style.accent}44` }} />
            <div className="absolute top-1 right-1 w-6 h-6 border-t border-r z-10" style={{ borderColor: `${style.accent}44` }} />
            <div className="absolute bottom-1 left-1 w-6 h-6 border-b border-l z-10" style={{ borderColor: `${style.accent}44` }} />
            <div className="absolute bottom-1 right-1 w-6 h-6 border-b border-r z-10" style={{ borderColor: `${style.accent}44` }} />
          </>
        )}

        {/* Art Nouveau curves */}
        {css.artNouveau && (
          <div className="absolute top-0 left-0 right-0 h-6 z-10" style={{
            borderRadius: '0 0 50% 50%',
            background: `linear-gradient(to bottom, rgba(${style.accentRgb}, 0.1), transparent)`,
          }} />
        )}

        {/* Gothic arches */}
        {css.gothic && (
          <div className="absolute top-0 left-0 right-0 h-8 z-10" style={{
            clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
            background: `rgba(${style.accentRgb}, 0.1)`,
          }} />
        )}

        {/* Baroque ornate */}
        {css.baroque && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.05]" style={{
            borderImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20 0 Q40 20 20 40 Q0 20 20 0' fill='none' stroke='%23d4a574' stroke-width='1'/%3E%3C/svg%3E") 20 fill`,
          }} />
        )}

        {/* Modular grid overlay */}
        {css.modular && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }} />
        )}

        {/* Grid locked */}
        {css.gridLocked && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.06]" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />
        )}

        {/* Wave edge */}
        {css.waveEdge && (
          <div className="absolute top-0 left-0 right-0 h-4 z-10" style={{
            borderRadius: '0 0 50% 50% / 0 0 100% 100%',
            background: `rgba(${style.accentRgb}, 0.1)`,
          }} />
        )}

        {/* Zigzag top */}
        {css.zigzag && (
          <div className="absolute top-0 left-0 right-0 h-3 z-10" style={{
            backgroundImage: `linear-gradient(135deg, ${style.accent}22 25%, transparent 25%)`,
            backgroundSize: '8px 8px',
          }} />
        )}

        {/* Sawtooth */}
        {css.sawtooth && (
          <div className="absolute bottom-0 left-0 right-0 h-3 z-10" style={{
            clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)',
            background: `rgba(${style.accentRgb}, 0.15)`,
          }} />
        )}

        {/* Pixelated border */}
        {css.pixelated && (
          <div className="absolute inset-0 pointer-events-none z-[1]" style={{
            border: `4px solid rgba(${style.accentRgb}, 0.2)`,
            imageRendering: 'pixelated',
          }} />
        )}

        {/* Low poly background */}
        {css.lowPoly && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.06]" style={{
            backgroundImage: `
              linear-gradient(60deg, ${style.accent}22 25%, transparent 25.5%, transparent 75%, ${style.accent}22 75.5%),
              linear-gradient(-60deg, ${style.accent}22 25%, transparent 25.5%, transparent 75%, ${style.accent}22 75.5%)
            `,
            backgroundSize: '30px 52px',
          }} />
        )}

        {/* Wireframe */}
        {css.wireframe && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            transform: 'perspective(500px) rotateX(30deg)',
            transformOrigin: 'center top',
          }} />
        )}

        {/* Isometric grid */}
        {css.isometric && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.06]" style={{
            backgroundImage: `
              linear-gradient(30deg, ${style.accent}22 12%, transparent 12.5%, transparent 87%, ${style.accent}22 87.5%),
              linear-gradient(150deg, ${style.accent}22 12%, transparent 12.5%, transparent 87%, ${style.accent}22 87.5%),
              linear-gradient(30deg, ${style.accent}22 12%, transparent 12.5%, transparent 87%, ${style.accent}22 87.5%),
              linear-gradient(150deg, ${style.accent}22 12%, transparent 12.5%, transparent 87%, ${style.accent}22 87.5%)
            `,
            backgroundSize: '40px 70px',
          }} />
        )}

        {/* Parallax layers indicator */}
        {css.parallax && (
          <div className="absolute inset-0 pointer-events-none z-[1]">
            <div className="absolute inset-4 border border-white/[0.03] rounded" style={{ transform: 'translateZ(10px)' }} />
            <div className="absolute inset-8 border border-white/[0.02] rounded" style={{ transform: 'translateZ(20px)' }} />
            <div className="absolute inset-12 border border-white/[0.01] rounded" style={{ transform: 'translateZ(30px)' }} />
          </div>
        )}

        {/* Depth map */}
        {css.depthMap && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.15]" style={{
            background: `radial-gradient(ellipse at ${mouse.x * 100}% ${mouse.y * 100}%, ${style.accent}, transparent 70%)`,
          }} />
        )}

        {/* Cel shaded */}
        {css.cel && (
          <div className="absolute inset-0 pointer-events-none z-[1]" style={{
            border: '3px solid #18181b',
            borderRadius: 'inherit',
          }} />
        )}

        {/* Watercolor bleed */}
        {css.watercolor && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.06]" style={{
            background: `
              radial-gradient(ellipse at 20% 30%, ${style.accent}, transparent 50%),
              radial-gradient(ellipse at 80% 70%, #f472b6, transparent 50%),
              radial-gradient(ellipse at 50% 50%, #86efac, transparent 50%)
            `,
            filter: 'blur(20px)',
          }} />
        )}

        {/* Ink wash */}
        {css.inkWash && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]" style={{
            background: `radial-gradient(ellipse at 40% 40%, #18181b, transparent 60%)`,
          }} />
        )}

        {/* LED dots */}
        {css.led && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.1]" style={{
            backgroundImage: `radial-gradient(circle, ${style.accent} 1px, transparent 1px)`,
            backgroundSize: '6px 6px',
          }} />
        )}

        {/* Pixel grid */}
        {css.pixelGrid && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.06]" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
            `,
            backgroundSize: '4px 4px',
          }} />
        )}

        {/* Dot matrix display */}
        {css.dotMatrix && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]" style={{
            backgroundImage: `radial-gradient(circle, ${style.accent} 1.5px, transparent 1.5px)`,
            backgroundSize: '8px 8px',
          }} />
        )}

        {/* Segment display */}
        {css.segment && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 12px, ${style.accent} 12px, ${style.accent} 13px)`,
          }} />
        )}

        {/* VFD glow */}
        {css.vfd && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]" style={{
            background: `radial-gradient(ellipse at center, rgba(${style.accentRgb}, 0.2), transparent 70%)`,
          }} />
        )}

        {/* Sepia tone */}
        {css.sepia && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]" style={{
            background: 'linear-gradient(180deg, rgba(112,66,20,0.1), transparent)',
          }} />
        )}

        {/* Duotone overlay */}
        {css.duotone && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.06]" style={{
            background: `linear-gradient(135deg, ${style.accent}, transparent)`,
            mixBlendMode: 'overlay',
          }} />
        )}

        {/* Tritone */}
        {css.tritone && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.05]" style={{
            background: `linear-gradient(135deg, ${style.accent}, transparent 50%, #f43f5e)`,
            mixBlendMode: 'color',
          }} />
        )}

        {/* Prism refraction */}
        {css.prism && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.1]" style={{
            background: `linear-gradient(${isHovered ? mouse.x * 360 : 45}deg, 
              rgba(255,0,0,0.1), rgba(255,127,0,0.1), rgba(255,255,0,0.1), 
              rgba(0,255,0,0.1), rgba(0,0,255,0.1), rgba(139,0,255,0.1))`,
            mixBlendMode: 'screen',
          }} />
        )}

        {/* Iridescent */}
        {css.iridescent && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]" style={{
            background: `linear-gradient(${mouse.x * 360}deg, 
              #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff)`,
            mixBlendMode: 'overlay',
          }} />
        )}

        {/* Thermal imaging */}
        {css.thermal && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.1]" style={{
            background: `radial-gradient(circle at ${mouse.x * 100}% ${mouse.y * 100}%, 
              rgba(255,0,0,0.3), rgba(255,165,0,0.2), rgba(255,255,0,0.1), transparent)`,
          }} />
        )}

        {/* Pulsar rings */}
        {css.pulsar && (
          <div className="absolute inset-0 pointer-events-none z-[1] flex items-center justify-center opacity-10">
            <div className="w-20 h-20 rounded-full border" style={{ borderColor: style.accent, animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
            <div className="absolute w-32 h-32 rounded-full border" style={{ borderColor: style.accent, opacity: 0.5, animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s' }} />
          </div>
        )}

        {/* Antimatter split */}
        {css.antimatter && (
          <div className="absolute inset-0 pointer-events-none z-[1]" style={{
            background: isHovered
              ? `linear-gradient(90deg, rgba(${style.accentRgb}, 0.05) 50%, transparent 50%)`
              : 'none',
          }} />
        )}

        {/* Tachyon streaks */}
        {css.tachyon && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.06]" style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 20px, ${style.accent} 20px, ${style.accent} 21px)`,
          }} />
        )}

        {/* Flux field */}
        {css.flux && (
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]" style={{
            background: `radial-gradient(circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(${style.accentRgb}, 0.2), transparent 60%)`,
          }} />
        )}

        {/* === CONTENT === */}

        {/* Preview image */}
        <div className="absolute inset-0 z-[2]">
          {tool.preview_image && (
            <img
              src={tool.preview_image}
              alt={tool.name}
              className={cn(
                'w-full h-full object-cover transition-transform duration-700',
                isHovered && 'scale-105',
              )}
              loading="lazy"
            />
          )}
          {!tool.preview_image && (
            <div className="w-full h-full flex items-center justify-center"
              style={{ color: `rgba(${style.accentRgb}, 0.2)` }}>
              <span className="text-4xl font-bold">{tool.name?.charAt(0)}</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className={cn(
            'absolute inset-0 transition-opacity duration-300',
            isDarkText ? 'bg-gradient-to-t from-black/30 via-transparent to-transparent' : 'bg-gradient-to-t from-black/80 via-black/20 to-transparent',
          )} />
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 z-[3] flex flex-col justify-end p-4">
          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: isDarkText ? `rgba(${style.accentRgb}, 0.1)` : `rgba(${style.accentRgb}, 0.15)`,
                color: style.accent,
                backdropFilter: 'blur(8px)',
              }}>
              {tool.framework}
            </span>
            {tool.price === 'Free' || tool.price === 0 ? (
              <span className={cn('px-2 py-0.5 rounded text-[9px] font-semibold',
                isDarkText ? 'bg-green-100 text-green-700' : 'bg-green-500/15 text-green-400')}>
                Free
              </span>
            ) : (
              <span className={cn('px-2 py-0.5 rounded text-[9px] font-semibold',
                isDarkText ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-500/15 text-yellow-400')}>
                ${tool.price}
              </span>
            )}
          </div>

          {/* Hover action */}
          <div className={cn(
            'absolute top-3 right-3 transition-opacity duration-200',
            isHovered ? 'opacity-100' : 'opacity-0',
          )}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: isDarkText ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
              }}>
              <Eye size={12} style={{ color: isDarkText ? '#333' : 'white' }} />
            </div>
          </div>

          {/* Bottom content */}
          <div>
            <h3 className={cn('text-[13px] font-semibold mb-1 line-clamp-1', isDarkText ? 'text-[#18181b]' : 'text-white')}>
              {tool.name}
            </h3>
            <p className={cn('text-[10px] line-clamp-2 mb-3', isDarkText ? 'text-[#666]' : 'text-[#888]')}>
              {tool.description}
            </p>
            <div className="flex items-center justify-between">
              <div className={cn('flex items-center gap-3 text-[9px]', isDarkText ? 'text-[#999]' : 'text-[#555]')}>
                <span>{formatNumber(tool.views)} views</span>
                <span>{formatNumber(tool.exports)} exports</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onExport?.(tool); }}
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200',
                  isHovered ? 'scale-110' : 'scale-100',
                )}
                style={{
                  backgroundColor: isDarkText ? `rgba(${style.accentRgb}, 0.08)` : `rgba(${style.accentRgb}, 0.1)`,
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

export default memo(BaseCard);
