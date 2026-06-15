'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    const loginEmail = email.includes('@') ? email : `${email}@demo.com`;
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
    if (error) setErrorMsg(error.message);
    else router.push('/');
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    setErrorMsg('');
    const loginEmail = email.includes('@') ? email : `${email}@demo.com`;
    const { error } = await supabase.auth.signUp({ email: loginEmail, password });
    if (error) setErrorMsg(error.message);
    else setErrorMsg('Check your email for a confirmation link.');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-8 flex items-center justify-center font-sans transition-colors duration-200">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 w-full max-w-md transition-colors duration-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2">❤️ Personal Health Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Sign in to access your secure personal data.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 flex-1 flex flex-col w-full justify-center text-gray-800 dark:text-slate-200">
          <div>
            <label className="text-sm font-medium block mb-1 text-gray-600 dark:text-slate-400" htmlFor="email">Username or Email</label>
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="user1 or you@example.com" required
            />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1 text-gray-600 dark:text-slate-400" htmlFor="password">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required
            />
          </div>
          
          {errorMsg && (
            <p className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 text-center text-sm rounded">
              {errorMsg}
            </p>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50">
              {isLoading ? 'Processing...' : 'Sign In'}
            </button>
            <button type="button" onClick={handleSignUp} disabled={isLoading} className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 py-2 rounded font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50">
              Create New Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
