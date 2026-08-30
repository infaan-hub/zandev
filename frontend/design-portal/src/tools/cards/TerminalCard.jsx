import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Terminal as TerminalIcon } from 'lucide-react';
import { cn, formatNumber } from '../utils';

const BOOT_LINES = [
  '$ loading design system...',
  '$ initializing components...',
  '$ rendering preview...',
  '> ready.',
];

export default function TerminalCard({ tool, style, onExport, index }) {
  const [lines, setLines] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const termRef = useRef(null);
  const variant = style.id % 5;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, variant === 0 ? 200 : variant === 1 ? 150 : 300);
    return () => clearInterval(interval);
  }, [variant]);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const promptChar = variant < 2 ? '$' : variant < 3 ? '>' : variant < 4 ? '#' : '>';
  const fontFamily = variant === 0 ? "'Fira Code', monospace" : variant === 1 ? "'JetBrains Mono', monospace" : "'Cascadia Code', monospace";
  const showHeader = variant >= 2;
  const showLineNumbers = variant >= 3;
  const colorScheme = variant === 0 ? 'green' : variant === 1 ? 'blue' : variant === 2 ? 'amber' : variant === 3 ? 'white' : 'cyan';

  const colors = {
    green: { text: '#22c55e', bg: '#0a1a0a', dim: '#15803d' },
    blue: { text: '#3b82f6', bg: '#0a0a1a', dim: '#1d4ed8' },
    amber: { text: '#f59e0b', bg: '#1a1505', dim: '#b45309' },
    white: { text: '#e2e8f0', bg: '#0a0a0a', dim: '#64748b' },
    cyan: { text: '#06b6d4', bg: '#051520', dim: '#0891b2' },
  }[colorScheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div
        className={cn(
          'rounded-xl border overflow-hidden transition-shadow duration-300',
          'group-hover:shadow-2xl shadow-lg'
        )}
        style={{
          borderColor: `rgba(${style.accentRgb}, 0.15)`,
          background: colors.bg,
        }}
      >
        {showHeader && (
          <div
            className="flex items-center gap-2 px-3 py-2 border-b"
            style={{ borderColor: `rgba(${style.accentRgb}, 0.1)`, background: 'rgba(0,0,0,0.3)' }}
          >
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[9px] text-[#555] ml-2 font-mono">terminal — {tool.name?.toLowerCase().replace(/\s+/g, '-')}.sh</span>
          </div>
        )}

        <div className="aspect-[4/3] relative overflow-hidden">
          {tool.preview_image && (
            <img
              src={tool.preview_image}
              alt={tool.name}
              className="w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 p-3 font-mono text-[10px] leading-[1.8] overflow-hidden" ref={termRef}>
            {showLineNumbers && (
              <div className="absolute left-0 top-0 bottom-0 w-6 text-right pr-2 pt-3" style={{ color: colors.dim }}>
                {lines.map((_, i) => (
                  <div key={i} className="text-[8px]">{i + 1}</div>
                ))}
              </div>
            )}
            <div className={showLineNumbers ? 'ml-6' : ''}>
              {lines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    color: line.startsWith('>') ? colors.text : colors.dim,
                    opacity: i === lines.length - 1 ? 1 : 0.6,
                  }}
                >
                  {line}
                </div>
              ))}
              <div style={{ color: colors.text }}>
                {promptChar} <span className={cursorVisible ? 'opacity-100' : 'opacity-0'}>▊</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t" style={{ borderColor: `rgba(${style.accentRgb}, 0.1)` }}>
          <div className="flex items-center gap-2 mb-2">
            <TerminalIcon size={11} style={{ color: colors.text }} />
            <span
              className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `rgba(${style.accentRgb}, 0.15)`, color: style.accent }}
            >
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
            <button
              onClick={(e) => { e.stopPropagation(); onExport?.(tool); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `rgba(${style.accentRgb}, 0.1)` }}
            >
              <Download size={12} style={{ color: style.accent }} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
