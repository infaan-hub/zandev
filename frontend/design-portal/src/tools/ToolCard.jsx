import { useState, useRef, useCallback, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Download, Eye, Star, Tag, ArrowUpRight, Code2, Layers, Zap, Copy, Check } from 'lucide-react';
import { cn, formatNumber } from './utils';

const inViewOpts = { once: true, margin: '-40px' };

function PreviewArea({ tool, style, isHovered }) {
  const { accent, variant, imageTreatment } = style;
  const preview = tool.preview;
  const hasImage = preview && preview.startsWith('http');
  const isVideo = tool.file_type === 'video' || /\.(mp4|webm)$/i.test(preview);

  if (variant === 'terminal') {
    return <TerminalPreview tool={tool} accent={accent} />;
  }
  if (variant === 'code') {
    return <CodePreview tool={tool} accent={accent} />;
  }
  if (variant === 'metric') {
    return <MetricPreview tool={tool} accent={accent} />;
  }
  if (variant === 'editorial') {
    return <EditorialPreview tool={tool} accent={accent} hasImage={hasImage} isVideo={isVideo} preview={preview} />;
  }
  if (variant === 'bento') {
    return <BentoPreview tool={tool} accent={accent} hasImage={hasImage} isVideo={isVideo} preview={preview} />;
  }

  return (
    <div className={cn(
      'relative overflow-hidden',
      imageTreatment === 'diamond' ? 'aspect-square rotate-45 scale-75' :
      imageTreatment === 'hexagon' ? 'aspect-square' :
      imageTreatment === 'film-strip' ? 'aspect-[2/1]' :
      imageTreatment === 'polaroid' ? 'aspect-square mx-3 mt-3' :
      'aspect-[16/10]',
      imageTreatment === 'rounded-lg' && 'rounded-xl',
      imageTreatment === 'diamond' && 'rounded-lg',
    )}>
      {hasImage ? (
        isVideo ? (
          <video
            src={preview}
            className="w-full h-full object-cover"
            muted loop playsInline preload="metadata"
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
          />
        ) : (
          <img
            src={preview}
            alt={tool.name}
            loading="lazy"
            className={cn(
              'w-full h-full object-cover transition-transform duration-500',
              isHovered && 'scale-105',
              imageTreatment === 'contain' && 'object-contain bg-black/40',
              imageTreatment === 'mask-circle' && 'rounded-full',
              imageTreatment === 'mask-bottom' && 'rounded-b-[40px]',
              imageTreatment === 'blurred-bg' && 'blur-sm scale-110',
            )}
          />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{
          background: `linear-gradient(135deg, ${accent.from}15, ${accent.to}08)`,
        }}>
          <span className="text-2xl font-bold opacity-30" style={{ color: accent.from }}>
            {tool.name?.charAt(0) || '?'}
          </span>
        </div>
      )}
      {imageTreatment === 'overlay-gradient' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      )}
      {imageTreatment === 'glow-border' && (
        <div className="absolute inset-0" style={{ boxShadow: `inset 0 0 30px ${accent.glow}` }} />
      )}
      {style.hasGlow && isHovered && (
        <div className="absolute inset-0 transition-opacity duration-500" style={{
          background: `radial-gradient(circle at 50% 50%, ${accent.glow}, transparent 70%)`,
          opacity: 0.4,
        }} />
      )}
    </div>
  );
}

function TerminalPreview({ tool, accent }) {
  return (
    <div className="aspect-[16/10] bg-[#0a0a0a] p-4 font-mono text-xs">
      <div className="flex gap-1.5 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
      </div>
      <div className="space-y-1.5">
        <div className="flex gap-2">
          <span style={{ color: accent.from }}>$</span>
          <span className="text-gray-400">npx create-{tool.framework?.toLowerCase() || 'react'}@latest</span>
        </div>
        <div className="flex gap-2">
          <span style={{ color: accent.from }}>$</span>
          <span className="text-gray-400">cd {tool.name?.toLowerCase().replace(/\s+/g, '-') || 'project'}</span>
        </div>
        <div className="flex gap-2">
          <span style={{ color: accent.from }}>$</span>
          <span className="text-gray-400">npm install</span>
          <span className="text-green-400/60">✓</span>
        </div>
        <div className="flex gap-2">
          <span style={{ color: accent.from }}>$</span>
          <span className="text-gray-400">npm run dev</span>
        </div>
        <div className="mt-2 text-gray-600">Ready on <span style={{ color: accent.from }}>localhost:3000</span></div>
      </div>
    </div>
  );
}

function CodePreview({ tool, accent }) {
  const lines = (tool.description || 'Component').split(' ').slice(0, 12);
  return (
    <div className="aspect-[16/10] bg-[#0a0a0a] p-4 font-mono text-[10px] leading-relaxed overflow-hidden">
      <div className="flex gap-1.5 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
      </div>
      <div className="space-y-0.5">
        <div><span className="text-purple-400">import</span> <span className="text-green-400">{'{'}</span> <span className="text-yellow-300">motion</span> <span className="text-green-400">{'}'}</span> <span className="text-purple-400">from</span> <span className="text-orange-300">'framer-motion'</span></div>
        <div className="h-2" />
        <div><span className="text-purple-400">export default function</span> <span style={{ color: accent.from }}>{tool.name?.replace(/\s+/g, '') || 'Component'}</span><span className="text-gray-500">{'() {'}</span></div>
        <div className="pl-4"><span className="text-purple-400">return</span> <span className="text-gray-500">(</span></div>
        <div className="pl-8"><span className="text-blue-400">&lt;motion.div</span></div>
        <div className="pl-12"><span className="text-cyan-300">className</span><span className="text-gray-500">=</span><span className="text-orange-300">"container"</span></div>
        <div className="pl-8"><span className="text-blue-400">&gt;</span></div>
        {lines.slice(0, 3).map((w, i) => (
          <div key={i} className="pl-12 text-gray-600">{'// '}{w}</div>
        ))}
        <div className="pl-8"><span className="text-blue-400">&lt;/motion.div&gt;</span></div>
        <div className="pl-4"><span className="text-gray-500">)</span></div>
        <div><span className="text-gray-500">{'}'}</span></div>
      </div>
    </div>
  );
}

function MetricPreview({ tool, accent }) {
  const views = tool.views || 0;
  const exports = tool.exports || 0;
  return (
    <div className="aspect-[16/10] p-5 flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent.from}20` }}>
          <Layers size={18} style={{ color: accent.from }} />
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Performance</div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Score', value: tool.score || 0, max: 100 },
          { label: 'Views', value: views, max: Math.max(views * 1.2, 100) },
          { label: 'Exports', value: exports, max: Math.max(exports * 1.2, 100) },
        ].map(({ label, value, max }) => (
          <div key={label}>
            <div className="text-lg font-bold" style={{ color: accent.from }}>{formatNumber(value)}</div>
            <div className="text-[8px] text-gray-600 uppercase tracking-wider">{label}</div>
            <div className="mt-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorialPreview({ tool, accent, hasImage, isVideo, preview }) {
  return (
    <div className="aspect-[16/10] relative overflow-hidden">
      {hasImage ? (
        isVideo ? (
          <video src={preview} className="w-full h-full object-cover" muted loop playsInline preload="metadata" />
        ) : (
          <img src={preview} alt={tool.name} loading="lazy" className="w-full h-full object-cover" />
        )
      ) : (
        <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${accent.from}12, ${accent.to}06)` }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-[8px] uppercase tracking-[0.2em] font-medium mb-1" style={{ color: accent.from }}>
          {tool.category || 'Design'}
        </div>
        <div className="text-sm font-bold leading-tight">{tool.name}</div>
      </div>
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
        <ArrowUpRight size={14} className="text-white/70" />
      </div>
    </div>
  );
}

function BentoPreview({ tool, accent, hasImage, isVideo, preview }) {
  return (
    <div className="aspect-[16/10] grid grid-cols-2 grid-rows-2 gap-1 p-1">
      <div className={cn(
        'row-span-2 rounded-lg overflow-hidden relative',
        hasImage ? '' : 'flex items-center justify-center',
      )} style={!hasImage ? { background: `${accent.from}10` } : undefined}>
        {hasImage ? (
          isVideo ? (
            <video src={preview} className="w-full h-full object-cover" muted loop playsInline preload="metadata" />
          ) : (
            <img src={preview} alt={tool.name} loading="lazy" className="w-full h-full object-cover" />
          )
        ) : (
          <span className="text-2xl font-bold opacity-20" style={{ color: accent.from }}>{tool.name?.charAt(0)}</span>
        )}
      </div>
      <div className="rounded-lg p-2.5 flex flex-col justify-center" style={{ background: `${accent.from}08` }}>
        <div className="text-[7px] text-gray-500 uppercase tracking-wider mb-0.5">Score</div>
        <div className="text-sm font-bold" style={{ color: accent.from }}>{tool.score || 0}</div>
      </div>
      <div className="rounded-lg p-2.5 flex flex-col justify-center" style={{ background: `${accent.to}08` }}>
        <div className="text-[7px] text-gray-500 uppercase tracking-wider mb-0.5">Views</div>
        <div className="text-sm font-bold" style={{ color: accent.to }}>{formatNumber(tool.views || 0)}</div>
      </div>
    </div>
  );
}

function CardContent({ tool, style, isHovered, onExport }) {
  const { accent, variant, fontTreatment, border } = style;
  const isOK = tool._source === 'originkit';
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (exporting || exported) return;
    setExporting(true);
    try {
      await onExport(tool);
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={cn(
      'flex flex-col gap-2 p-4',
      variant === 'compact' && 'p-3',
      variant === 'minimal' && 'p-5',
    )}>
      {/* Tags row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {isOK ? (
          <>
            <span className="px-2 py-0.5 rounded-full text-[8px] font-semibold border" style={{
              borderColor: `${accent.from}30`,
              background: `${accent.from}12`,
              color: accent.from,
            }}>Originkit</span>
            {tool.categoryLabel && (
              <span className="px-2 py-0.5 rounded-full text-[8px] font-medium border border-white/[0.08] bg-white/[0.03] text-[#aaa]">
                {tool.categoryLabel}
              </span>
            )}
          </>
        ) : (
          <>
            {tool.framework && (
              <span className="px-2 py-0.5 rounded-full text-[8px] font-medium border border-white/[0.08] bg-white/[0.03] text-[#aaa]">
                {tool.framework}
              </span>
            )}
            {tool.category && (
              <span className="px-2 py-0.5 rounded-full text-[8px] font-medium border border-white/[0.08] bg-white/[0.03] text-[#aaa]">
                {tool.category}
              </span>
            )}
          </>
        )}
        <span className={cn(
          'px-2 py-0.5 rounded-full text-[8px] font-medium ml-auto',
          tool.price === 'Free'
            ? 'text-emerald-400 border border-emerald-500/20 bg-emerald-500/10'
            : 'text-amber-400 border border-amber-500/20 bg-amber-500/10'
        )}>
          {tool.price || 'Free'}
        </span>
      </div>

      {/* Title */}
      <h3 className={cn(
        'font-semibold leading-tight tracking-tight',
        variant === 'compact' ? 'text-[13px]' : 'text-[14px]',
        fontTreatment === 'display' && 'text-[16px] font-bold',
        fontTreatment === 'condensed' && 'tracking-tighter',
        fontTreatment === 'wide' && 'tracking-wider',
        fontTreatment === 'thin' && 'font-light',
        fontTreatment === 'heavy' && 'font-black',
        fontTreatment === 'uppercase' && 'uppercase text-[12px]',
      )}>
        {isOK ? tool.displayName : tool.name}
      </h3>

      {/* Description */}
      {variant !== 'compact' && variant !== 'minimal' && (
        <p className="text-[#666] text-[10px] leading-[1.6] line-clamp-2 min-h-[28px]">
          {tool.description}
        </p>
      )}

      {/* Tags for Originkit */}
      {isOK && tool.tags && (
        <div className="flex gap-1 flex-wrap">
          {tool.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[#666] text-[7px] font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats for ZanDev */}
      {!isOK && variant !== 'compact' && variant !== 'minimal' && (
        <div className="flex gap-3 text-[9px] text-[#555]">
          <span className="flex items-center gap-1"><Eye size={10} /> {formatNumber(tool.views || 0)}</span>
          <span className="flex items-center gap-1"><Download size={10} /> {formatNumber(tool.exports || 0)}</span>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleExport}
        disabled={exporting}
        className={cn(
          'w-full h-[34px] rounded-lg text-[10px] font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-1.5 mt-1 text-white hover:-translate-y-0.5',
        )}
        style={{ background: isOK ? `linear-gradient(135deg, ${accent.from}, ${accent.to})` : undefined, color: isOK ? undefined : '#000', backgroundColor: isOK ? undefined : 'white' }}
      >
        {exporting ? (
          <span className="animate-pulse">Loading...</span>
        ) : exported ? (
          <><Check size={12} /> Copied!</>
        ) : isOK ? (
          <><ExternalLink size={12} /> Get Source Code</>
        ) : (
          <><Download size={12} /> Export Design</>
        )}
      </button>
    </div>
  );
}

function getHoverClasses(effect, accent) {
  switch (effect) {
    case 'lift': return 'hover:-translate-y-1.5 hover:shadow-xl';
    case 'glow': return '';
    case 'scale': return 'hover:scale-[1.02]';
    case 'tilt': return 'hover:[transform:perspective(800px)_rotateY(-2deg)]';
    case 'border': return '';
    case 'shadow': return 'hover:shadow-2xl';
    case 'brighten': return 'hover:brightness-110';
    case 'shrink': return 'hover:scale-[0.98]';
    case 'rotate': return 'hover:[transform:rotate(-0.5deg)]';
    case 'slide': return 'hover:-translate-x-0.5';
    case 'morph': return 'hover:rounded-3xl';
    case 'pulse': return 'hover:animate-pulse';
    case 'magnet': return 'hover:scale-[1.01] hover:-translate-y-0.5';
    case 'elastic': return 'hover:scale-105 active:scale-95';
    case 'spring': return 'hover:-translate-y-2 hover:scale-[1.01]';
    default: return 'hover:-translate-y-1';
  }
}

function getBorderGlow(effect, accent, isHovered) {
  if (!isHovered) return {};
  switch (effect) {
    case 'glow': return { boxShadow: `0 0 20px ${accent.glow}, 0 0 40px ${accent.glow}` };
    case 'border': return { borderColor: accent.from + '60' };
    default: return {};
  }
}

function DecorationLayer({ decoration, accent, isHovered }) {
  if (decoration === 'none') return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
      {decoration === 'dots' && (
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, ${accent.from} 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }} />
      )}
      {decoration === 'grid' && (
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(${accent.from}10 1px, transparent 1px), linear-gradient(90deg, ${accent.from}10 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }} />
      )}
      {decoration === 'lines' && (
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 20px, ${accent.from}15 20px, ${accent.from}15 21px)`,
        }} />
      )}
      {decoration === 'glow-spot' && isHovered && (
        <div className="absolute top-0 right-0 w-32 h-32 opacity-30 transition-opacity duration-700" style={{
          background: `radial-gradient(circle, ${accent.glow}, transparent 70%)`,
        }} />
      )}
      {decoration === 'gradient-orb' && (
        <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-xl" style={{
          background: `radial-gradient(circle, ${accent.from}, transparent)`,
        }} />
      )}
      {decoration === 'noise' && (
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }} />
      )}
      {decoration === 'scan-line' && isHovered && (
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }} />
      )}
      {decoration === 'corner-accent' && (
        <div className="absolute top-0 left-0 w-8 h-8">
          <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, ${accent.from}40, transparent)` }} />
          <div className="absolute top-0 left-0 w-[1px] h-full" style={{ background: `linear-gradient(180deg, ${accent.from}40, transparent)` }} />
        </div>
      )}
      {decoration === 'stripe' && (
        <div className="absolute top-0 right-0 w-1 h-full" style={{ background: `linear-gradient(180deg, ${accent.from}, ${accent.to})`, opacity: 0.3 }} />
      )}
      {decoration === 'radial' && (
        <div className="absolute inset-0 opacity-[0.04]" style={{
          background: `radial-gradient(circle at 50% 50%, ${accent.from}, transparent 60%)`,
        }} />
      )}
      {decoration === 'circuit' && (
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(${accent.from}20 1px, transparent 1px), linear-gradient(90deg, ${accent.from}20 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      )}
      {decoration === 'constellation' && isHovered && (
        <>
          <div className="absolute top-3 right-3 w-1 h-1 rounded-full" style={{ background: accent.from, opacity: 0.4 }} />
          <div className="absolute bottom-5 left-4 w-0.5 h-0.5 rounded-full" style={{ background: accent.to, opacity: 0.3 }} />
          <div className="absolute top-1/2 right-1/3 w-0.5 h-0.5 rounded-full" style={{ background: accent.from, opacity: 0.2 }} />
        </>
      )}
    </div>
  );
}

function getVariantClasses(variant) {
  switch (variant) {
    case 'compact': return 'max-w-none';
    case 'glass': return 'backdrop-blur-xl bg-white/[0.03]';
    case 'holographic': return 'backdrop-blur-xl bg-white/[0.04]';
    case 'neon': return 'bg-[#050510]';
    case 'cyber': return 'bg-[#080812]';
    case 'terminal': return 'bg-[#0a0a0a] font-mono';
    case 'code': return 'bg-[#0a0a0a] font-mono';
    case 'metric': return 'bg-[#0c0c12]';
    case 'editorial': return 'overflow-hidden';
    case 'bento': return 'bg-[#0a0a0c]';
    case 'minimal': return 'bg-transparent border-0 border-b border-white/[0.06] rounded-none';
    case 'floating': return 'bg-[#0a0a0c]';
    case 'perspective': return 'bg-[#0a0a0c]';
    case 'organic': return 'bg-[#0a0a0a] rounded-[24px]';
    case 'glitch': return 'bg-[#080808]';
    case 'retro': return 'bg-[#0c0c08]';
    case 'luxury': return 'bg-gradient-to-br from-[#0a0a0c] to-[#10100c]';
    case 'scientific': return 'bg-[#080c12]';
    case 'cosmic': return 'bg-[#06060f]';
    case 'abstract': return 'bg-[#0a0a0a]';
    case 'overlay': return 'bg-transparent';
    default: return 'bg-[#080808]';
  }
}

const ToolCard = memo(function ToolCard({ tool, style, onExport, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const { variant, bg, border, accent, hover, animation, radius, hasGradientBorder } = style;

  const cardClasses = cn(
    'relative overflow-hidden transition-all duration-300 cursor-pointer group',
    `rounded-[${radius}px]`,
    bg.css,
    getVariantClasses(variant),
    getHoverClasses(hover, accent),
    border.css,
    variant === 'minimal' ? '' : 'border',
  );

  const animProps = {
    initial: animation === 'none' ? false : { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.5, delay: Math.min(index * 0.03, 0.3), ease: [0.25, 0.46, 0.45, 0.94] },
  };

  const borderStyle = hasGradientBorder ? {
    borderImage: `linear-gradient(135deg, ${accent.from}40, ${accent.to}20) 1`,
  } : {};

  const glowStyle = getBorderGlow(hover, accent, isHovered);

  return (
    <motion.article
      ref={ref}
      {...(animation !== 'none' ? animProps : {})}
      className={cardClasses}
      style={{ ...borderStyle, ...glowStyle, borderRadius: radius }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="article"
      aria-label={tool.name}
    >
      <DecorationLayer decoration={style.decoration} accent={accent} isHovered={isHovered} />
      <PreviewArea tool={tool} style={style} isHovered={isHovered} />
      <CardContent tool={tool} style={style} isHovered={isHovered} onExport={onExport} />
    </motion.article>
  );
});

export default ToolCard;
