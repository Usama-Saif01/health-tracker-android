'use client';

import { useState } from 'react';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Force reload current context to see if connection is restored
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      setIsRetrying(false);
    }, 800);
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-md w-full text-center space-y-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700/50 transition-all duration-300">
        
        {/* Animated Icon Circle */}
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-950/40 rounded-full text-red-600 dark:text-red-400 shadow-inner">
            {/* Pulsing ring */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20 animate-ping"></span>
            <WifiOff size={44} className="relative z-10 animate-pulse" />
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">
            You're Offline
          </h1>
          <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
            It looks like you've lost internet connectivity. Don't worry—your logs and data are secure, and full functionality will return as soon as you're reconnected.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-4">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-sm md:text-base"
          >
            <RefreshCw size={18} className={isRetrying ? 'animate-spin' : ''} />
            {isRetrying ? 'Checking connection...' : 'Retry Connection'}
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-200 font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer text-sm md:text-base"
          >
            <Home size={18} />
            Go to Dashboard
          </button>
        </div>

        {/* Status Indicator */}
        <div className="text-xs text-gray-400 dark:text-slate-500 pt-2 border-t border-gray-100 dark:border-slate-700/40">
          Personal Health Tracker PWA
        </div>

      </div>
    </main>
  );
}
