"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-white rounded-2xl border border-red-100 shadow-sm">
      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle size={24} />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Something went wrong</h2>
      <p className="text-slate-500 text-sm max-w-xs mb-6 font-normal">
        The dashboard encountered a rendering error. This might be due to a database connection issue or missing configuration.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          <RefreshCcw size={16} /> Try again
        </button>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="px-4 py-2 text-slate-500 text-sm font-medium hover:text-slate-800 transition-colors"
        >
          Return to Hub
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-8 p-4 bg-slate-50 rounded text-left text-[10px] text-slate-400 overflow-auto max-w-full">
          {error.message}
          {error.stack}
        </pre>
      )}
    </div>
  );
}
