const AppLockCardLoading = () => {
  return (
   <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm animate-pulse">
  {/* Header Section Skeleton */}
  <div className="flex items-start justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-24"></div>
        <div className="h-3 bg-neutral-200 rounded w-16"></div>
      </div>
    </div>
    <div className="w-3 h-3 bg-neutral-200 rounded-full"></div>
  </div>

  {/* Restricted Features Section Skeleton */}
  <div className="mb-4">
    <div className="h-3 bg-neutral-200 rounded w-32 mb-3"></div>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-neutral-200 rounded"></div>
        <div className="h-3 bg-neutral-200 rounded w-20"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-neutral-200 rounded"></div>
        <div className="h-3 bg-neutral-200 rounded w-24"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-neutral-200 rounded"></div>
        <div className="h-3 bg-neutral-200 rounded w-16"></div>
      </div>
    </div>
  </div>

  {/* Action Buttons Skeleton */}
  <div className="flex gap-2 pt-4 border-t border-neutral-100">
    <div className="flex-1 py-2 px-3 bg-neutral-200 rounded-lg h-10"></div>
    <div className="flex-1 py-2 px-3 bg-neutral-200 rounded-lg h-10"></div>
  </div>
</div>
  );
};

export default AppLockCardLoading;