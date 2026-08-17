import { Skeleton } from './Skeleton';

export function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-[#16161f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <Skeleton className="w-12 h-12 rounded-lg bg-gray-700" />
          </div>
          <Skeleton className="w-40 h-8 mx-auto bg-gray-700 mb-2" />
          <Skeleton className="w-24 h-4 mx-auto bg-gray-700" />
        </div>

        <div className="bg-[#1e1e2e] rounded-lg p-6 border border-gray-800">
          <div className="space-y-6">
            <div>
              <Skeleton className="w-20 h-4 mb-2 bg-gray-700" />
              <Skeleton className="w-full h-11 bg-gray-700 rounded-lg" />
            </div>
            
            <div>
              <Skeleton className="w-20 h-4 mb-2 bg-gray-700" />
              <Skeleton className="w-full h-11 bg-gray-700 rounded-lg" />
            </div>

            <Skeleton className="w-full h-11 bg-violet-800/50 rounded-lg" />
          </div>

          <div className="mt-6 text-center">
             <Skeleton className="w-48 h-4 mx-auto bg-gray-700" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <Skeleton className="w-64 h-3 mx-auto bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
