import { Esqueleto } from './Esqueleto';

export function EsqueletoLogin() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 app-grid-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <Esqueleto className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <Esqueleto className="w-40 h-8 mx-auto bg-slate-200 dark:bg-slate-800 mb-2 rounded-lg" />
          <Esqueleto className="w-56 h-4 mx-auto bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
        <div className="bg-[#FCFBF7] dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-amber-950/15 dark:border-slate-800 shadow-xl">
          <div className="space-y-4">
            <div>
              <Esqueleto className="w-20 h-4 mb-2 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <Esqueleto className="w-full h-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>

            <div>
              <Esqueleto className="w-20 h-4 mb-2 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <Esqueleto className="w-full h-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>

            <Esqueleto className="w-full h-11 bg-emerald-600/30 rounded-xl mt-2" />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <Esqueleto className="w-48 h-4 mx-auto bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
