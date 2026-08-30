import { Search, Package, RefreshCw } from 'lucide-react';

export function ToolEmptyState({ search, category, onReset }) {
  const hasFilters = search || (category && category !== 'All');
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6">
        <Package size={28} className="text-[#444]" />
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">No designs found</h3>
      <p className="text-[#666] text-sm text-center max-w-md mb-6">
        {hasFilters
          ? `No results match your current filters. Try adjusting your search or category.`
          : `No designs are available right now. Check back later.`}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:-translate-y-0.5 transition-transform"
        >
          <RefreshCw size={14} />
          Reset Filters
        </button>
      )}
    </div>
  );
}

export function ToolErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <Search size={28} className="text-red-400" />
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">Unable to load designs</h3>
      <p className="text-[#666] text-sm text-center max-w-md mb-2">
        Something went wrong while fetching the data.
      </p>
      {error && (
        <p className="text-[#444] text-xs font-mono mb-6 max-w-md text-center break-all">{error}</p>
      )}
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:-translate-y-0.5 transition-transform"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
}
