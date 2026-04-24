export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-emerald-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:no-underline focus:outline-none focus:ring-2 focus:ring-emerald-300"
    >
      Skip to main content
    </a>
  );
}
