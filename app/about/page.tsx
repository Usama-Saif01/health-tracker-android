'use client'

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Sun, Moon, ArrowLeft, Mail, Code, Globe } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-8 font-sans max-w-3xl mx-auto relative transition-colors duration-200">
      
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 flex-1">👋 About the Developer</h1>
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

      <section className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-200 text-center">
        
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900 bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
            {/* If the user has a photo, they can replace this generic icon with an Image tag */}
            <Code size={48} className="text-blue-500" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
          Usama Saifullah
        </h2>
        <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-6">
          Full Stack Software Engineer
        </p>

        <div className="text-gray-600 dark:text-slate-300 space-y-4 max-w-xl mx-auto leading-relaxed mb-8">
          <p>
            Hi! I am the developer behind the <strong>Personal Health Tracker</strong>. I built this application to provide a secure, fast, and aesthetically pleasing way to log and manage your comprehensive health readings.
          </p>
          <p>
            It is built using Next.js, Supabase, and TailwindCSS, designed to be completely private with enterprise-grade authentication and Row Level Security.
          </p>
        </div>

        {/* SOCIAL LINKS */}
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://github.com/usamasaifullah" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-slate-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-slate-600 transition-colors font-medium">
            <Code size={18} /> GitHub
          </a>
          <a href="mailto:admin@usamasaifullah.cloud" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium">
            <Mail size={18} /> Email Me
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 dark:bg-sky-700 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors font-medium">
            <Globe size={18} /> LinkedIn
          </a>
        </div>

      </section>
    </main>
  );
}
