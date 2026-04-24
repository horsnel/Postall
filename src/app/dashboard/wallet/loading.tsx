export default function WalletLoading() {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
          <div className="skeleton-shimmer h-4 w-60 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton-shimmer h-10 w-32 rounded-lg" />
          <div className="skeleton-shimmer h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Balance cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main balance */}
        <div className="md:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white space-y-4">
          <div className="skeleton-shimmer h-4 w-28 rounded bg-white/20" />
          <div className="skeleton-shimmer h-10 w-48 rounded-lg bg-white/20" />
          <div className="flex gap-4 pt-2">
            <div className="skeleton-shimmer h-10 w-28 rounded-lg bg-white/20" />
            <div className="skeleton-shimmer h-10 w-28 rounded-lg bg-white/20" />
          </div>
        </div>

        {/* Crypto balance */}
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="skeleton-shimmer h-4 w-32 rounded" />
          <div className="skeleton-shimmer h-8 w-24 rounded" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="skeleton-shimmer h-6 w-6 rounded-full" />
                  <div className="skeleton-shimmer h-3 w-16 rounded" />
                </div>
                <div className="skeleton-shimmer h-4 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction history skeleton */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="skeleton-shimmer h-5 w-40 rounded" />
          <div className="skeleton-shimmer h-9 w-32 rounded-lg" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="skeleton-shimmer h-10 w-10 rounded-xl" />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="skeleton-shimmer h-4 w-40 rounded" />
                <div className="skeleton-shimmer h-3 w-28 rounded" />
              </div>
              <div className="text-right space-y-1">
                <div className="skeleton-shimmer h-4 w-24 rounded" />
                <div className="skeleton-shimmer h-3 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-9 w-9 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
