'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { getProfile, updateProfile } from './actions';
import { useTheme } from 'next-themes';
import { Sun, Moon, ArrowLeft, Save, User } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [diabetesType, setDiabetesType] = useState('');

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
      loadProfile(token);
    }
  }, [token]);

  async function loadProfile(currentToken: string) {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await getProfile(currentToken);
      if (data) {
        setName(data.name || '');
        setAge(data.age ? String(data.age) : '');
        setGender(data.gender || '');
        setBloodGroup(data.blood_group || '');
        setDiabetesType(data.diabetes_type || '');
      }
    } catch (err: any) {
      setErrorMsg("Failed to load profile: " + err.message);
    }
    setIsLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('age', age);
      formData.append('gender', gender);
      formData.append('blood_group', bloodGroup);
      formData.append('diabetes_type', diabetesType);
      
      await updateProfile(formData, token);
      setSuccessMsg('Profile saved successfully!');
    } catch (err: any) {
      setErrorMsg('Failed to save profile: ' + err.message);
    }
    setIsSaving(false);
  };

  if (!token || isLoading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-200">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-8 font-sans max-w-2xl mx-auto relative transition-colors duration-200">
      
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 flex-1">👤 My Profile</h1>
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

      {successMsg && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg shadow-sm">
          {successMsg}
        </div>
      )}

      {/* PROFILE FORM */}
      <section className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Personal Details</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">Update your health and demographic information.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Age</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 35" min="0" max="120" className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors">
                <option value="">Select Gender...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Blood Group</label>
              <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors">
                <option value="">Select Blood Group...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="md:col-span-2 border-t border-gray-100 dark:border-slate-700 pt-6 mt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Diabetes Type</label>
              <select value={diabetesType} onChange={e => setDiabetesType(e.target.value)} className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 p-2.5 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors">
                <option value="">Not Specified</option>
                <option value="type_1">Type 1 Diabetes</option>
                <option value="type_2">Type 2 Diabetes</option>
                <option value="gestational">Gestational Diabetes</option>
                <option value="prediabetes">Prediabetes</option>
                <option value="none">None / Prevention</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">This helps provide better context for your glucose reports.</p>
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-md font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-75 shadow-sm">
              {isSaving ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Saving...</>
              ) : (
                <><Save size={18} /> Save Profile</>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
