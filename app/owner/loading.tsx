export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden rounded-lg shadow border border-gray-200 p-6 h-32">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Secondary Area Skeleton */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 h-48">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
           <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="p-6">
           <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
           <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}
