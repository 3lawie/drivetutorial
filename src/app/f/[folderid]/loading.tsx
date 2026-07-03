export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-0 text-gray-100 p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Header skeleton — stacks on mobile, row on desktop */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <div className="h-8 w-20 shrink-0 animate-pulse rounded-md bg-surface-2" />
            <div className="h-3 w-3 shrink-0 rounded bg-surface-2" />
            <div className="h-8 w-28 shrink-0 animate-pulse rounded-md bg-surface-2" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-surface-2 sm:w-28" />
            <div className="h-9 w-9 animate-pulse rounded-full bg-surface-2" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="overflow-hidden rounded-xl border border-gray-800/60 bg-surface-1 shadow-xl shadow-black/10">
          {/* Table header — hidden on mobile */}
          <div className="hidden border-b border-gray-800/60 px-5 py-3 md:block">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6"><div className="h-3 w-12 animate-pulse rounded bg-surface-2" /></div>
              <div className="col-span-2"><div className="h-3 w-10 animate-pulse rounded bg-surface-2" /></div>
              <div className="col-span-2"><div className="h-3 w-8 animate-pulse rounded bg-surface-2" /></div>
              <div className="col-span-2 flex justify-end"><div className="h-3 w-14 animate-pulse rounded bg-surface-2" /></div>
            </div>
          </div>

          {/* Rows — flex on mobile, grid on desktop (mirrors file-row.tsx) */}
          <ul>
            {[75, 50, 65, 40, 85, 55].map((width, i) => (
              <li
                key={i}
                className={`flex items-center gap-4 px-4 py-3 sm:grid sm:grid-cols-12 sm:px-5 sm:py-3.5 ${i < 5 ? "border-b border-gray-800/40" : ""}`}
              >
                {/* Name — always visible */}
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:col-span-6">
                  <div className="h-5 w-5 shrink-0 animate-pulse rounded bg-surface-2" />
                  <div
                    className="h-4 animate-pulse rounded bg-surface-2"
                    style={{ width: `${width}%` }}
                  />
                </div>

                {/* Type — hidden on mobile */}
                <div className="hidden sm:col-span-2 sm:block">
                  <div className="h-3 w-10 animate-pulse rounded bg-surface-2" />
                </div>

                {/* Size — hidden on mobile */}
                <div className="hidden sm:col-span-2 sm:block">
                  <div className="h-3 w-14 animate-pulse rounded bg-surface-2" />
                </div>

                {/* Action — always visible (matches file-row behavior) */}
                <div className="flex shrink-0 justify-end sm:col-span-2">
                  <div className="h-7 w-7 animate-pulse rounded-lg bg-surface-2" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Upload button skeleton */}
        <div className="mt-8 flex justify-center pb-8">
          <div className="h-10 w-36 animate-pulse rounded-lg bg-surface-2" />
        </div>

      </div>
    </div>
  );
}
