import { motion } from 'framer-motion';
import { Download, Code2 } from 'lucide-react';
import { cn, formatNumber } from '../utils';

const CODE_SNIPPETS = [
  ['import { motion } from "framer-motion";', 'import { useState } from "react";', '', 'export default function App() {', '  const [count, setCount] = useState(0);', '  return (', '    <motion.div', '      animate={{ scale: 1.1 }}', '      className="container"', '    >', '      <h1>Design {count}</h1>', '    </motion.div>', '  );', '}'],
  ['const theme = {', '  colors: {', '    primary: "#6366f1",', '    surface: "#0a0a0a",', '  },', '  spacing: [0, 4, 8, 16],', '};', '', 'export default theme;'],
  ['async function fetchDesigns() {', '  const res = await fetch("/api/designs");', '  const data = await res.json();', '  return data.results.map(d => ({', '    ...d,', '    preview: d.preview_image,', '  }));', '}'],
  ['@keyframes pulse {', '  0%, 100% { opacity: 1; }', '  50% { opacity: 0.5; }', '}', '', '.card {', '  animation: pulse 2s infinite;', '  transition: transform 0.3s;', '}'],
];

export default function CodeEditorCard({ tool, style, onExport, index }) {
  const variant = style.id % 8;
  const snippet = CODE_SNIPPETS[variant % CODE_SNIPPETS.length];
  const showMinimap = variant >= 2 && variant < 4;
  const showTabs = variant >= 4 && variant < 6;
  const showBreadcrumbs = variant >= 6;
  const tabName = variant < 2 ? 'App.tsx' : variant < 4 ? 'theme.ts' : variant < 6 ? 'api.ts' : 'styles.css';

  const keywords = ['import', 'from', 'export', 'default', 'function', 'const', 'return', 'async', 'await'];
  const colors = { keyword: '#c678dd', string: '#98c379', comment: '#5c6370', fn: '#61afef', variable: '#e5c07b', bracket: '#abb2bf', plain: '#abb2bf' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group"
    >
      <div
        className={cn('rounded-xl border overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl shadow-lg')}
        style={{ borderColor: `rgba(${style.accentRgb}, 0.15)`, background: '#1e1e1e' }}
      >
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#2d2d2d] bg-[#252526]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          {showTabs && (
            <div className="flex gap-0.5 ml-4">
              {[tabName, 'utils.ts', 'types.d.ts'].map((t, i) => (
                <div key={t} className={cn('px-2 py-0.5 text-[8px] font-mono rounded-t', i === 0 ? 'bg-[#1e1e1e] text-[#ccc]' : 'text-[#666]')}>
                  {t}
                </div>
              ))}
            </div>
          )}
          <div className="text-[8px] text-[#555] font-mono">{tabName}</div>
        </div>

        {showBreadcrumbs && (
          <div className="px-3 py-1 border-b border-[#2d2d2d] text-[8px] text-[#555] font-mono flex items-center gap-1">
            <span>src</span><span className="text-[#333]">/</span><span>components</span><span className="text-[#333]">/</span><span style={{ color: style.accent }}>{tabName}</span>
          </div>
        )}

        <div className="flex">
          <div className="aspect-[4/3] flex-1 relative overflow-hidden">
            {tool.preview_image && (
              <img src={tool.preview_image} alt={tool.name} className="w-full h-full object-cover opacity-20" />
            )}
            <div className="absolute inset-0 p-3 font-mono text-[9px] leading-[1.9] overflow-hidden">
              {snippet.map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-5 text-right pr-2 text-[#333] select-none text-[8px]">{i + 1}</span>
                  <span className="flex-1">
                    {line.split(/(\s+)/).map((word, j) => {
                      if (keywords.includes(word)) return <span key={j} style={{ color: colors.keyword }}>{word}</span>;
                      if (word.startsWith('"') || word.startsWith("'")) return <span key={j} style={{ color: colors.string }}>{word}</span>;
                      if (word.startsWith('//')) return <span key={j} style={{ color: colors.comment }}>{word}</span>;
                      return <span key={j} style={{ color: colors.plain }}>{word}</span>;
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {showMinimap && (
            <div className="w-12 border-l border-[#2d2d2d] p-1 opacity-40">
              {snippet.map((line, i) => (
                <div key={i} className="h-[2px] mb-[1px] rounded-sm" style={{
                  width: `${Math.min(line.length * 1.5, 36)}px`,
                  backgroundColor: line.trim() ? `rgba(${style.accentRgb}, 0.4)` : 'transparent',
                }} />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#2d2d2d] bg-[#1a1a1a]">
          <div className="flex items-center gap-2 mb-2">
            <Code2 size={11} style={{ color: style.accent }} />
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
