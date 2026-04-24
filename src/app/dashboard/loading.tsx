export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r bg-white p-4 gap-4">
        <div className="skeleton-shimmer h-10 w-full rounded-xl" />
        <div className="flex-1 space-y-2 mt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-10 w-full rounded-lg" />
          ))}
        </div>
        <div className="skeleton-shimmer h-10 w-full rounded-lg" />
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50/50 p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="skeleton-shimmer h-8 w-48 rounded-lg" />
            <div className="skeleton-shimmer h-4 w-72 rounded" />
          </div>
          <div className="skeleton-shimmer h-10 w-32 rounded-lg" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="skeleton-shimmer h-4 w-24 rounded" />
                <div className="skeleton-shimmer h-8 w-8 rounded-lg" />
              </div>
              <div className="skeleton-shimmer h-8 w-20 rounded" />
              <div className="skeleton-shimmer h-3 w-32 rounded" />
            </div>
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="skeleton-shimmer h-5 w-40 rounded" />
            <div className="skeleton-shimmer h-8 w-24 rounded-lg" />
          </div>
          <div className="skeleton-shimmer h-48 w-full rounded-lg" />
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-xl border p-6">
          <div className="skeleton-shimmer h-5 w-32 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton-shimmer h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <div className="skeleton-shimmer h-4 w-48 rounded" />
                  <div className="skeleton-shimmer h-3 w-32 rounded" />
                </div>
                <div className="skeleton-shimmer h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
