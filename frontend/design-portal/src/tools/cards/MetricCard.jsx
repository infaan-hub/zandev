import { motion } from 'framer-motion';
import { Download, BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn, formatNumber } from '../utils';

const METRICS = [
  { label: 'Revenue', value: '$48.2K', change: '+12.5%', up: true },
  { label: 'Users', value: '2,847', change: '+8.3%', up: true },
  { label: 'Conversion', value: '3.24%', change: '-0.8%', up: false },
  { label: 'Sessions', value: '18.9K', change: '+22.1%', up: true },
];

export default function MetricCard({ tool, style, onExport, index }) {
  const variant = style.id % 10;
  const metric = METRICS[variant % METRICS.length];
  const showSparkline = variant >= 2 && variant < 5;
  const showProgress = variant >= 5 && variant < 7;
  const showComparison = variant >= 7;
  const isLarge = variant >= 4 && variant < 6;

  const sparklinePoints = Array.from({ length: 20 }, (_, i) => {
    const base = 30 + Math.sin(i * 0.5 + variant) * 15;
    return `${i * 5},${60 - base + Math.sin(i * 0.3) * 10}`;
  }).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div
        className={cn(
          'rounded-xl border overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl shadow-lg',
          isLarge ? 'col-span-2' : ''
        )}
        style={{ borderColor: `rgba(${style.accentRgb}, 0.15)`, background: '#0a0a0a' }}
      >
        <div className={cn('relative overflow-hidden', isLarge ? 'aspect-[8/3]' : 'aspect-[4/3]')}>
          {tool.preview_image && (
            <img src={tool.preview_image} alt={tool.name} className="w-full h-full object-cover opacity-20" />
          )}

          <div className={cn('absolute inset-0 flex flex-col justify-between', isLarge ? 'p-6' : 'p-4')}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#555] mb-1">{metric.label}</div>
                <div className={cn('font-bold text-white', isLarge ? 'text-[32px]' : 'text-[22px]')}>
                  {metric.value}
                </div>
                <div className={cn('flex items-center gap-1 text-[10px] font-medium mt-1',
                  metric.up ? 'text-green-400' : 'text-red-400')}>
                  {metric.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {metric.change}
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `rgba(${style.accentRgb}, 0.1)` }}>
                <BarChart3 size={14} style={{ color: style.accent }} />
              </div>
            </div>

            {showSparkline && (
              <svg className="w-full h-12 opacity-40" viewBox="0 0 100 70" preserveAspectRatio="none">
                <polyline fill="none" stroke={style.accent} strokeWidth="1.5" points={sparklinePoints} />
              </svg>
            )}

            {showProgress && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[8px] text-[#555]">
                  <span>Progress</span><span>73%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '73%' }}
                    transition={{ duration: 1.5, delay: 0.3 + index * 0.05 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${style.accent}, rgba(${style.accentRgb}, 0.5))` }}
                  />
                </div>
              </div>
            )}

            {showComparison && (
              <div className="grid grid-cols-3 gap-2">
                {['Mon', 'Tue', 'Wed'].map((day, i) => (
                  <div key={day} className="text-center">
                    <div className="text-[8px] text-[#555] mb-1">{day}</div>
                    <div className="h-12 rounded bg-white/[0.03] flex items-end justify-center p-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${30 + i * 20}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="w-full rounded-sm"
                        style={{ backgroundColor: `rgba(${style.accentRgb}, ${0.3 + i * 0.2})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t" style={{ borderColor: `rgba(${style.accentRgb}, 0.1)` }}>
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
  );
}
