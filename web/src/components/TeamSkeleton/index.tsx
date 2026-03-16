import { Skeleton } from "../ui/skeleton";
import { Users } from 'lucide-react';

export function TeamSkeleton() {
  return (
    <div className="p-4 md:p-6 max-w-5xl animate-pulse">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-gray-700" />
          <Skeleton className="h-8 w-40 bg-gray-800" />
        </div>
        <Skeleton className="h-4 w-96 bg-gray-800" />
      </div>

      <div className="bg-[#1e1e2e] rounded-lg p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-5 w-48 bg-gray-800" />
          <Skeleton className="h-10 w-32 bg-gray-700" />
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#262637]">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full bg-gray-800" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-32 bg-gray-700" />
                  <Skeleton className="h-4 w-48 bg-gray-700" />
                </div>
              </div>
              <Skeleton className="h-8 w-24 bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}