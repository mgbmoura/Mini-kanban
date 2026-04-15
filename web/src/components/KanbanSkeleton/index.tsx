
const SkeletonCard = () => (
  <div className="bg-gray-700/50 p-4 rounded-lg shadow space-y-3">
    <div className="flex justify-between">
      <div className="h-4 bg-gray-600 rounded w-1/3"></div>
    </div>
    <div className="h-5 bg-gray-600 rounded w-full"></div>
    <div className="h-3 bg-gray-600 rounded w-3/4"></div>
    <div className="flex justify-between items-center mt-4">
      <div className="h-3 bg-gray-600 rounded w-1/4"></div>
      <div className="h-6 w-6 bg-gray-600 rounded-full"></div>
    </div>
  </div>
);

export function KanbanSkeleton() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {/* Skeleton Column 1 */}
        <div className="bg-gray-800/60 rounded-lg p-4 space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/2"></div>
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Skeleton Column 2 */}
        <div className="bg-gray-800/60 rounded-lg p-4 space-y-4">
          <div className="h-6 bg-gray-700 rounded w-2/3"></div>
          <SkeletonCard />
        </div>

        {/* Skeleton Column 3 */}
        <div className="bg-gray-800/60 rounded-lg p-4 space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
