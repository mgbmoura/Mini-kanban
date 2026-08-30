import { Skeleton } from '../Skeleton';
import { IconeMascote } from '../IconeMascote';

export function SkeletonConfiguracoes() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-4 sm:p-6">
      <div className="bg-[#FCFBF7] dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-amber-950/15 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <IconeMascote className="w-10 h-10 opacity-40" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <Skeleton className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>
      </div>
      <div className="bg-[#FCFBF7] dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-amber-950/15 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <Skeleton className="w-24 h-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <Skeleton className="h-4 w-60 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <Skeleton className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <Skeleton className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
