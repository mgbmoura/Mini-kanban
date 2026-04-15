import { Skeleton } from "../ui/skeleton";
import { Settings as SettingsIcon } from 'lucide-react';

export function SettingsSkeleton() {
  return (
    <div className="p-4 md:p-6 max-w-3xl animate-pulse">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-8 h-8 text-gray-700" />
          <Skeleton className="h-8 w-48 bg-gray-800" />
        </div>
        <Skeleton className="h-4 w-80 bg-gray-800" />
      </div>

      <div className="bg-[#1e1e2e] rounded-lg p-6 border border-gray-800">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-5 w-32 mb-3 bg-gray-800" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-full bg-gray-800" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-32 bg-gray-700" />
                <Skeleton className="h-4 w-24 bg-transparent" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6"></div>
          
          <div>
            <Skeleton className="h-5 w-40 mb-2 bg-gray-800" />
            <Skeleton className="w-full h-11 bg-gray-800 rounded-lg" />
          </div>

          <div>
            <Skeleton className="h-5 w-24 mb-2 bg-gray-800" />
            <Skeleton className="w-full h-11 bg-gray-800 rounded-lg" />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-800">
            <Skeleton className="h-11 w-40 rounded-lg bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}