import { motion } from 'framer-motion';
import { Download, Table2 } from 'lucide-react';
import { cn, formatNumber } from '../utils';

const TABLE_DATA = [
  { name: 'Landing Page', framework: 'React', views: '12.5K', exports: '2.1K' },
  { name: 'Dashboard', framework: 'Next.js', views: '8.3K', exports: '1.8K' },
  { name: 'E-Commerce', framework: 'Vue', views: '6.7K', exports: '945' },
  { name: 'Portfolio', framework: 'Astro', views: '4.2K', exports: '678' },
];

export default function StatCard({ tool, style, onExport, index }) {
  const variant = style.id % 5;

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
          {tool.preview_image && (
            <img src={tool.preview_image} alt={tool.name} className="w-full h-full object-cover opacity-15" />
          )}

          <div className="absolute inset-0 p-3 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Table2 size={12} style={{ color: style.accent }} />
              <span className="text-[9px] text-[#555] uppercase tracking-wider font-medium">Data Overview</span>
            </div>

            {variant < 3 ? (
              <div className="flex-1 border border-white/[0.06] rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 text-[8px] text-[#555] uppercase tracking-wider border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="px-2 py-1.5">Name</div>
                  <div className="px-2 py-1.5">Views</div>
                  <div className="px-2 py-1.5">Exports</div>
                </div>
                {TABLE_DATA.slice(0, 3).map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.08 + index * 0.05 }}
                    className="grid grid-cols-3 text-[9px] border-b border-white/[0.04] last:border-0"
                  >
                    <div className="px-2 py-1.5 text-white">{row.name}</div>
                    <div className="px-2 py-1.5 text-[#888]">{row.views}</div>
                    <div className="px-2 py-1.5 text-[#888]">{row.exports}</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-2 gap-2">
                {[
                  { label: 'Total Views', val: '31.7K', sub: '+12%' },
                  { label: 'Total Exports', val: '5.5K', sub: '+8%' },
                  { label: 'Active Designs', val: '247', sub: '+3%' },
                  { label: 'Categories', val: '12', sub: '+1' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.08 + index * 0.05 }}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2"
                  >
                    <div className="text-[8px] text-[#555] mb-1">{item.label}</div>
                    <div className="text-[14px] font-bold text-white">{item.val}</div>
                    <div className="text-[8px] text-green-400">{item.sub}</div>
                  </motion.div>
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
