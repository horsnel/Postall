export default function BrowseLoading() {
  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Header skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 space-y-2">
          <div className="skeleton-shimmer h-4 w-32 rounded" />
          <div className="skeleton-shimmer h-8 w-48 rounded" />
          <div className="skeleton-shimmer h-4 w-72 rounded" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search bar + controls skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <div className="skeleton-shimmer h-10 flex-1 max-w-md rounded-lg" />
          <div className="skeleton-shimmer h-10 w-[200px] rounded-lg hidden sm:block" />
          <div className="skeleton-shimmer h-10 w-24 rounded-lg hidden sm:block" />
        </div>

        <div className="flex gap-6">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="bg-white rounded-lg border p-5 space-y-6">
              <div className="skeleton-shimmer h-4 w-16 rounded" />
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="skeleton-shimmer h-4 w-4 rounded" />
                    <div className="skeleton-shimmer h-4 w-24 rounded" />
                  </div>
                ))}
              </div>
              <div className="skeleton-shimmer h-px w-full" />
              <div className="space-y-3">
                <div className="skeleton-shimmer h-4 w-20 rounded" />
                <div className="skeleton-shimmer h-9 w-full rounded-lg" />
              </div>
              <div className="skeleton-shimmer h-px w-full" />
              <div className="space-y-3">
                <div className="skeleton-shimmer h-4 w-24 rounded" />
                <div className="flex gap-2">
                  <div className="skeleton-shimmer h-9 flex-1 rounded-lg" />
                  <div className="skeleton-shimmer h-9 flex-1 rounded-lg" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="skeleton-shimmer h-4 w-40 rounded" />

            {/* Card grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border overflow-hidden">
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="skeleton-shimmer h-5 w-16 rounded-full" />
                      <div className="skeleton-shimmer h-5 w-12 rounded-full" />
                    </div>
                    <div className="skeleton-shimmer h-4 w-full rounded" />
                    <div className="skeleton-shimmer h-4 w-2/3 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="skeleton-shimmer h-6 w-6 rounded-full" />
                      <div className="skeleton-shimmer h-3 w-16 rounded" />
                      <div className="skeleton-shimmer h-3 w-20 rounded" />
                    </div>
                    <div className="border-t pt-3 mt-1">
                      <div className="flex items-center justify-between">
                        <div className="skeleton-shimmer h-5 w-20 rounded" />
                        <div className="skeleton-shimmer h-8 w-20 rounded-lg" />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="skeleton-shimmer h-3 w-16 rounded" />
                        <div className="skeleton-shimmer h-3 w-12 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
