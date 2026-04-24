export default function MessagesLoading() {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Conversation list skeleton */}
      <aside className="w-full md:w-[320px] lg:w-[360px] border-r bg-white shrink-0">
        <div className="p-4 border-b space-y-3">
          <div className="skeleton-shimmer h-8 w-32 rounded-lg" />
          <div className="skeleton-shimmer h-10 w-full rounded-lg" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="skeleton-shimmer h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="skeleton-shimmer h-4 w-32 rounded" />
                <div className="skeleton-shimmer h-3 w-48 rounded" />
              </div>
              <div className="skeleton-shimmer h-3 w-10 rounded shrink-0" />
              {i === 0 && (
                <div className="h-5 w-5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Chat thread skeleton */}
      <main className="hidden md:flex flex-col flex-1">
        {/* Chat header */}
        <div className="h-16 border-b bg-white flex items-center gap-3 px-4">
          <div className="skeleton-shimmer h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <div className="skeleton-shimmer h-4 w-32 rounded" />
            <div className="skeleton-shimmer h-3 w-20 rounded" />
          </div>
          <div className="ml-auto skeleton-shimmer h-9 w-9 rounded-full" />
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Received message */}
          <div className="flex items-start gap-2 max-w-[70%]">
            <div className="skeleton-shimmer h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-1">
              <div className="skeleton-shimmer h-20 w-60 rounded-2xl rounded-tl-sm" />
              <div className="skeleton-shimmer h-3 w-12 rounded" />
            </div>
          </div>

          {/* Sent message */}
          <div className="flex items-start gap-2 max-w-[70%] ml-auto flex-row-reverse">
            <div className="skeleton-shimmer h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-1">
              <div className="skeleton-shimmer h-16 w-52 rounded-2xl rounded-tr-sm bg-emerald-100" />
              <div className="skeleton-shimmer h-3 w-12 rounded ml-auto" />
            </div>
          </div>

          {/* More messages */}
          <div className="flex items-start gap-2 max-w-[70%]">
            <div className="skeleton-shimmer h-8 w-8 rounded-full shrink-0" />
            <div className="skeleton-shimmer h-24 w-56 rounded-2xl rounded-tl-sm" />
          </div>

          <div className="flex items-start gap-2 max-w-[70%] ml-auto flex-row-reverse">
            <div className="skeleton-shimmer h-8 w-8 rounded-full shrink-0" />
            <div className="skeleton-shimmer h-14 w-40 rounded-2xl rounded-tr-sm bg-emerald-100" />
          </div>

          <div className="flex items-start gap-2 max-w-[70%]">
            <div className="skeleton-shimmer h-8 w-8 rounded-full shrink-0" />
            <div className="skeleton-shimmer h-20 w-64 rounded-2xl rounded-tl-sm" />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t bg-white p-4 flex items-center gap-2">
          <div className="skeleton-shimmer h-10 flex-1 rounded-xl" />
          <div className="skeleton-shimmer h-10 w-10 rounded-full" />
          <div className="skeleton-shimmer h-10 w-10 rounded-full bg-emerald-100" />
        </div>
      </main>
    </div>
  );
}
