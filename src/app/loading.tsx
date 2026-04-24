export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header skeleton */}
      <div className="h-16 border-b bg-white">
        <div className="container mx-auto px-4 h-full flex items-center gap-4">
          <div className="skeleton-shimmer h-8 w-20 rounded-lg" />
          <div className="skeleton-shimmer h-8 w-32 rounded-lg hidden md:block" />
          <div className="flex-1" />
          <div className="skeleton-shimmer h-9 w-48 rounded-lg hidden lg:block" />
          <div className="skeleton-shimmer h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Hero skeleton */}
      <section className="bg-white min-h-[500px] md:min-h-[600px] flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="skeleton-shimmer h-6 w-48 rounded-full mx-auto" />
            <div className="skeleton-shimmer h-12 w-full max-w-2xl mx-auto rounded-xl" />
            <div className="skeleton-shimmer h-5 w-64 mx-auto rounded-lg" />
            <div className="skeleton-shimmer h-16 w-full max-w-xl mx-auto rounded-2xl mt-8" />
            <div className="flex justify-center gap-3 mt-6">
              <div className="skeleton-shimmer h-12 w-36 rounded-xl" />
              <div className="skeleton-shimmer h-12 w-36 rounded-xl" />
              <div className="skeleton-shimmer h-12 w-36 rounded-xl" />
            </div>
            <div className="flex justify-center gap-8 mt-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center">
                  <div className="skeleton-shimmer h-8 w-16 rounded-lg mx-auto" />
                  <div className="skeleton-shimmer h-3 w-20 rounded mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category grid skeleton */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="skeleton-shimmer h-8 w-48 rounded-lg mx-auto mb-2" />
          <div className="skeleton-shimmer h-4 w-72 rounded mx-auto mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Card grid skeleton */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="skeleton-shimmer h-8 w-40 rounded-lg mb-2" />
          <div className="skeleton-shimmer h-4 w-64 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border overflow-hidden">
                <div className="skeleton-shimmer h-32" />
                <div className="p-4 space-y-3">
                  <div className="skeleton-shimmer h-4 w-3/4 rounded" />
                  <div className="skeleton-shimmer h-4 w-1/2 rounded" />
                  <div className="flex justify-between pt-2">
                    <div className="skeleton-shimmer h-5 w-20 rounded" />
                    <div className="skeleton-shimmer h-8 w-24 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section skeleton */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="skeleton-shimmer h-8 w-32 rounded-lg mx-auto mb-2" />
          <div className="skeleton-shimmer h-4 w-56 rounded mx-auto mb-10" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-36 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Footer skeleton */}
      <div className="border-t mt-12 py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton-shimmer h-5 w-24 rounded" />
                <div className="skeleton-shimmer h-3 w-full rounded" />
                <div className="skeleton-shimmer h-3 w-3/4 rounded" />
                <div className="skeleton-shimmer h-3 w-5/6 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
