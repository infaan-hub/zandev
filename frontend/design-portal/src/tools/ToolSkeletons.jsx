import { motion } from 'framer-motion';

const shimmer = 'animate-pulse bg-white/[0.04]';

export function ToolSkeleton({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-[18px] border border-white/[0.06] bg-[#080808] overflow-hidden"
    >
      <div className={`aspect-[16/10] ${shimmer}`} />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className={`h-5 w-16 rounded-full ${shimmer}`} />
          <div className={`h-5 w-20 rounded-full ${shimmer}`} />
        </div>
        <div className={`h-4 w-3/4 rounded ${shimmer}`} />
        <div className="space-y-1.5">
          <div className={`h-3 w-full rounded ${shimmer}`} />
          <div className={`h-3 w-2/3 rounded ${shimmer}`} />
        </div>
        <div className="flex gap-3">
          <div className={`h-3 w-14 rounded ${shimmer}`} />
          <div className={`h-3 w-14 rounded ${shimmer}`} />
        </div>
        <div className={`h-9 w-full rounded-lg ${shimmer}`} />
      </div>
    </motion.div>
  );
}

export function ToolSkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <ToolSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
