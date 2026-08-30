import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ArrowUpDown, Grid3X3, LayoutList, Sparkles, Download, Copy, Check, ChevronDown, Zap } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { api } from '../lib/api';
import { useFetch } from '../lib/useFetch';
import { getStyleForTool } from '../tools/styles';
import ToolCard from '../tools/ToolCard';
import { ToolSkeletonGrid } from '../tools/ToolSkeletons';
import { ToolEmptyState, ToolErrorState } from '../tools/ToolStates';
import { debounce, cn } from '../tools/utils';

const FRAMEWORKS = ['All', 'React', 'Next.js', 'Vue', 'Astro', 'Svelte', 'React Native'];
const CATEGORIES = ['All', 'Landing', 'Dashboard', 'E-Commerce', 'Portfolio', 'Blog', 'Admin', 'Mobile', 'Auth', 'Form'];
const PRICE_FILTERS = ['All', 'Free', 'Premium'];
const SORT_OPTIONS = [
  { value: '-score', label: 'Popular' },
  { value: '-created_at', label: 'Newest' },
  { value: 'name', label: 'A-Z' },
  { value: '-views', label: 'Most Views' },
  { value: '-exports', label: 'Most Exports' },
];
const SOURCES = [
  { key: 'all', label: 'All Designs', icon: Grid3X3 },
  { key: 'zan', label: 'ZanDev', icon: Sparkles },
  { key: 'originkit', label: 'Originkit', icon: Zap },
];

export default function Tools() {
  const [source, setSource] = useState('all');
  const [framework, setFramework] = useState('All');
  const [category, setCategory] = useState('All');
  const [price, setPrice] = useState('All');
  const [sort, setSort] = useState('-score');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [exportedCode, setExportedCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const searchRef = useRef(null);

  const debouncedSetSearch = useMemo(
    () => debounce((val) => setDebouncedSearch(val), 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(search);
  }, [search, debouncedSetSearch]);

  const params = useMemo(() => {
    const p = {};
    if (framework !== 'All') p.framework = framework;
    if (category !== 'All') p.category = category;
    if (price !== 'All') p.price = price;
    if (sort) p.sort = sort;
    if (debouncedSearch) p.search = debouncedSearch;
    return p;
  }, [framework, category, price, sort, debouncedSearch]);

  const { data, loading, error, refetch } = useFetch(
    () => api.getDesigns(params),
    [framework, category, price, sort, debouncedSearch]
  );

  const originkitParams = useMemo(() => {
    const p = {};
    if (debouncedSearch) p.search = debouncedSearch;
    return p;
  }, [debouncedSearch]);

  const { data: originkitData, loading: originkitLoading } = useFetch(
    () => api.getOriginkit(originkitParams),
    [debouncedSearch]
  );

  const zanDesigns = useMemo(() => (data?.results || []).map(d => ({ ...d, _source: 'zan' })), [data]);
  const originkitDesigns = useMemo(() => (originkitData?.results || []).map(d => ({ ...d, _source: 'originkit' })), [originkitData]);

  const allDesigns = useMemo(() => {
    if (source === 'zan') return zanDesigns;
    if (source === 'originkit') return originkitDesigns;
    return [...zanDesigns, ...originkitDesigns];
  }, [source, zanDesigns, originkitDesigns]);

  const totalDesigns = (data?.count || 0) + (originkitData?.count || 0);

  const handleExport = useCallback(async (tool) => {
    if (tool._source === 'originkit') {
      const res = await api.getOriginkitDetail(tool.name);
      setExportedCode({ code: res.code || `// ${tool.displayName || tool.name} - Originkit Component\n// Source: https://originkit.dev`, name: tool.name });
    } else {
      const res = await api.exportDesign(tool.id);
      setExportedCode(res);
    }
  }, []);

  const handleReset = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
    setFramework('All');
    setCategory('All');
    setPrice('All');
    setSort('-score');
    setSource('all');
  }, []);

  const hasActiveFilters = framework !== 'All' || category !== 'All' || price !== 'All' || debouncedSearch || source !== 'all';

  return (
    <PageLayout title="">
      {/* Hero */}
      <div className="text-center mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[10px] font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
            {totalDesigns}+ Production-Ready Designs
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[clamp(32px,5vw,60px)] leading-[0.95] tracking-[-0.06em] font-bold mb-4"
        >
          Browse. Copy.
          <span className="text-[#555]"> Ship.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[#747474] text-[13px] leading-[1.7] max-w-[480px] mx-auto"
        >
          Production-ready designs, inspect the source code, and paste components directly into your project.
        </motion.p>
      </div>

      <div className="max-w-[1400px] mx-auto">
        {/* Search + Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search designs, frameworks, categories..."
                className="w-full h-10 pl-10 pr-10 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.2] focus:bg-white/[0.05] transition-all"
              />
              {search && (
                <button
                  onClick={() => { setSearch(''); searchRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'h-10 px-4 rounded-xl border text-[11px] font-medium flex items-center gap-2 transition-all',
                showFilters
                  ? 'bg-white text-black border-white'
                  : 'bg-white/[0.03] text-[#888] border-white/[0.08] hover:border-white/[0.15]'
              )}
            >
              <SlidersHorizontal size={13} />
              Filters
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>
          </div>

          {/* Source tabs */}
          <div className="flex flex-wrap gap-2 mb-3">
            {SOURCES.map((s) => (
              <button
                key={s.key}
                onClick={() => setSource(s.key)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-[10px] font-medium border transition-all flex items-center gap-1.5',
                  source === s.key
                    ? 'bg-white text-black border-white'
                    : 'bg-white/[0.03] text-[#888] border-white/[0.06] hover:border-white/[0.15]'
                )}
              >
                <s.icon size={11} />
                {s.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none h-8 px-3 pr-7 rounded-lg border border-white/[0.06] bg-white/[0.03] text-[#888] text-[10px] font-medium outline-none cursor-pointer hover:border-white/[0.15] transition-colors"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-[#111] text-white">{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Expanded filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pb-4 space-y-3">
                  {source !== 'originkit' && (
                    <>
                      <div>
                        <div className="text-[9px] text-[#555] uppercase tracking-wider font-medium mb-2">Framework</div>
                        <div className="flex flex-wrap gap-1.5">
                          {FRAMEWORKS.map((f) => (
                            <button
                              key={f}
                              onClick={() => setFramework(f)}
                              className={cn(
                                'px-3 py-1 rounded-md text-[10px] font-medium border transition-all',
                                framework === f
                                  ? 'bg-white text-black border-white'
                                  : 'bg-white/[0.03] text-[#888] border-white/[0.06] hover:border-white/[0.15]'
                              )}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#555] uppercase tracking-wider font-medium mb-2">Category</div>
                        <div className="flex flex-wrap gap-1.5">
                          {CATEGORIES.map((c) => (
                            <button
                              key={c}
                              onClick={() => setCategory(c)}
                              className={cn(
                                'px-3 py-1 rounded-md text-[10px] font-medium border transition-all',
                                category === c
                                  ? 'bg-white text-black border-white'
                                  : 'bg-white/[0.03] text-[#888] border-white/[0.06] hover:border-white/[0.15]'
                              )}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#555] uppercase tracking-wider font-medium mb-2">Price</div>
                        <div className="flex flex-wrap gap-1.5">
                          {PRICE_FILTERS.map((p) => (
                            <button
                              key={p}
                              onClick={() => setPrice(p)}
                              className={cn(
                                'px-3 py-1 rounded-md text-[10px] font-medium border transition-all',
                                price === p
                                  ? 'bg-white text-black border-white'
                                  : 'bg-white/[0.03] text-[#888] border-white/[0.06] hover:border-white/[0.15]'
                              )}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {hasActiveFilters && (
                    <button
                      onClick={handleReset}
                      className="text-[10px] text-[#666] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <X size={10} /> Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results count */}
        {!loading && !error && (
          <div className="text-[10px] text-[#555] mb-4 flex items-center gap-2">
            <span>{allDesigns.length} designs</span>
            {hasActiveFilters && (
              <span className="text-[#444]">· filtered</span>
            )}
          </div>
        )}

        {/* Content */}
        {loading || originkitLoading ? (
          <ToolSkeletonGrid count={12} />
        ) : error ? (
          <ToolErrorState error={error} onRetry={refetch} />
        ) : allDesigns.length === 0 ? (
          <ToolEmptyState search={debouncedSearch} category={category} onReset={handleReset} />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
          >
            {allDesigns.map((tool, i) => {
              const style = getStyleForTool(tool._source === 'originkit' ? tool.name : tool.id);
              return (
                <ToolCard
                  key={tool._source === 'originkit' ? `ok-${tool.name}` : `zan-${tool.id}`}
                  tool={tool}
                  style={style}
                  onExport={handleExport}
                  index={i}
                />
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {exportedCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setExportedCode(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[700px] max-h-[85vh] flex flex-col rounded-2xl border border-white/[0.10] bg-[#0a0a0a] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-[15px] font-semibold">Exported Code</h3>
                  <p className="text-[10px] text-[#555] mt-1">Ready to copy into your project</p>
                </div>
                <button onClick={() => setExportedCode(null)} className="text-[#666] hover:text-white text-xl transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-5">
                <pre className="p-4 rounded-xl bg-[#050505] border border-white/[0.05] text-[11px] leading-[1.8] text-[#aaa] overflow-x-auto whitespace-pre-wrap break-words font-mono">
                  {exportedCode.code}
                </pre>
              </div>
              <div className="flex gap-2 p-5 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(exportedCode.code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex-1 h-10 rounded-xl bg-white text-black text-[11px] font-semibold hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-1.5"
                >
                  {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Code</>}
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([exportedCode.code], { type: 'text/javascript' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${exportedCode.name || 'component'}.jsx`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 h-10 rounded-xl border border-white/[0.10] text-[11px] font-semibold text-[#aaa] hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download size={13} /> Download .jsx
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
