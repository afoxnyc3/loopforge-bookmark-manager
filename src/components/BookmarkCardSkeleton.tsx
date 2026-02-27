export default function BookmarkCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-1.5 mt-3">
        <div className="h-5 bg-blue-50 rounded-full w-12" />
        <div className="h-5 bg-blue-50 rounded-full w-16" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-20 mt-3" />
    </div>
  );
}
