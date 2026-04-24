export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16 px-4">
        <div className="container mx-auto text-center space-y-4">
          <div className="skeleton-shimmer h-10 w-80 rounded-xl mx-auto bg-white/20" />
          <div className="skeleton-shimmer h-4 w-64 rounded mx-auto bg-white/20" />
          <div className="skeleton-shimmer h-12 w-full max-w-lg mx-auto rounded-xl bg-white/20" />
          <div className="flex justify-center gap-3">
            <div className="skeleton-shimmer h-10 w-32 rounded-lg bg-white/20" />
            <div className="skeleton-shimmer h-10 w-32 rounded-lg bg-white/20" />
          </div>
        </div>
      </section>

      {/* Filter bar skeleton */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-8 w-24 rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-4 text-center space-y-2">
              <div className="skeleton-shimmer h-7 w-20 rounded mx-auto" />
              <div className="skeleton-shimmer h-3 w-16 rounded mx-auto" />
            </div>
          ))}
        </div>

        {/* Job cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="skeleton-shimmer h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-1">
                  <div className="skeleton-shimmer h-4 w-full rounded" />
                  <div className="skeleton-shimmer h-3 w-24 rounded" />
                </div>
                <div className="skeleton-shimmer h-6 w-16 rounded-full" />
              </div>
              <div className="skeleton-shimmer h-3 w-full rounded" />
              <div className="flex gap-2">
                <div className="skeleton-shimmer h-5 w-14 rounded-full" />
                <div className="skeleton-shimmer h-5 w-20 rounded-full" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="skeleton-shimmer h-5 w-24 rounded" />
                <div className="skeleton-shimmer h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
