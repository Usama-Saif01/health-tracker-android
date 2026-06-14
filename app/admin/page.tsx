'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { getAllUsers, createManualUser, deleteUser } from './actions';
import { useTheme } from 'next-themes';
import { Sun, Moon, ArrowLeft, Trash2, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // New user form state
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Theme states
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setToken(session.access_token);
      } else {
        router.push('/login');
      }
    });
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchUsers(token);
    }
  }, [token]);

  async function fetchUsers(currentToken = token) {
    if (!currentToken) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await getAllUsers(currentToken);
      setUsers(data || []);
    } catch (err: any) {
      setErrorMsg("Failed to fetch users: " + err.message);
    }
    setIsLoading(false);
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsProcessing(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('email', newEmail);
      formData.append('password', newPassword);
      await createManualUser(token, formData);
      setNewEmail('');
      setNewPassword('');
      await fetchUsers(token);
    } catch (err: any) {
      setErrorMsg('Failed to create user: ' + err.message);
    }
    setIsProcessing(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!token) return;
    if (!window.confirm('Are you absolutely sure you want to delete this user? This action cannot be undone.')) return;
    
    setIsProcessing(true);
    setErrorMsg('');
    try {
      await deleteUser(token, userId);
      await fetchUsers(token);
    } catch (err: any) {
      setErrorMsg('Failed to delete user: ' + err.message);
    }
    setIsProcessing(false);
  };

  if (!token) {
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-200">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-8 font-sans max-w-4xl mx-auto relative transition-colors duration-200">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-full bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 flex-1">🛡️ Super Admin Dashboard</h1>
        </div>
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg shadow-sm">
          {errorMsg}
        </div>
      )}

      {/* CREATE USER FORM */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-8 transition-colors duration-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-200 flex items-center gap-2">
          <UserPlus size={20} /> Manually Add User
        </h2>
        <form onSubmit={handleCreateUser} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 dark:text-slate-400 mb-1">Email Address</label>
            <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required placeholder="user@example.com" className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors" />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 dark:text-slate-400 mb-1">Temporary Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="••••••••" minLength={6} className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors" />
          </div>
          <button type="submit" disabled={isProcessing} className="w-full md:w-auto px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-75">
            {isProcessing ? 'Adding...' : 'Add User'}
          </button>
        </form>
      </section>

      {/* USERS TABLE */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-200">Registered Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 text-sm">
                <th className="pb-2">Email</th>
                <th className="pb-2">Created At</th>
                <th className="pb-2">Last Sign In</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-gray-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 dark:text-slate-500 italic">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 dark:text-slate-500 italic">No users found.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 font-medium text-gray-900 dark:text-slate-100">{u.email}</td>
                    <td className="py-3 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="py-3 text-sm">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}</td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={isProcessing}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors disabled:opacity-50"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
