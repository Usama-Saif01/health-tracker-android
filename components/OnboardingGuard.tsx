'use client';

import React, { useState, useEffect } from 'react';

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<string>('default');

  useEffect(() => {
    // Check local storage for consent on mount
    const consent = localStorage.getItem('health_app_consent');
    if (consent === 'true') {
      setHasConsent(true);
    } else {
      setHasConsent(false);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);
  };

  const handleInitialize = () => {
    if (isAgreed) {
      localStorage.setItem('health_app_consent', 'true');
      setHasConsent(true);
    }
  };

  // While checking local storage, don't render anything to prevent hydration mismatch flashes
  if (hasConsent === null) return null;

  if (hasConsent) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Health Tracker</h2>
        <p className="text-gray-600 dark:text-slate-300 mb-6 text-sm">
          To provide a seamless experience, this app is designed to work offline. Your health data is securely cached locally on this device when you don't have an internet connection, and automatically synced when you reconnect.
        </p>

        <div className="space-y-4 mb-8">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="flex items-center h-5 mt-0.5">
              <input 
                type="checkbox" 
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-colors"
              />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              I agree to the Privacy Policy. My health data is securely cached locally when offline.
            </span>
          </label>

          <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Stay Notified</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">Enable notifications so we can alert you when offline data is successfully synced.</p>
            <button 
              onClick={requestNotificationPermission}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {notificationStatus === 'granted' ? '✓ Notifications Enabled' : 'Request Permissions'}
            </button>
          </div>
        </div>

        <button 
          onClick={handleInitialize}
          disabled={!isAgreed}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Initialize Dashboard
        </button>
      </div>
    </div>
  );
}
