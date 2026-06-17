import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Health Track',
  description: 'Privacy Policy and Data Handling terms for the Health Track application.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-slate-300">
      <div className="mx-auto max-w-3xl space-y-8 rounded-2xl bg-slate-800 p-8 shadow-xl md:p-12">
        
        <div className="border-b border-slate-700 pb-6">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-400">Effective Date: June 17, 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">1. Introduction</h2>
          <p>
            Welcome to Health Track ("we," "our," or "us"). We are committed to protecting your personal health information. This Privacy Policy explains how your data is collected, stored, and protected when you use our Progressive Web Application (PWA) hosted at <span className="text-blue-400">health.apps.usamasaifullah.cloud</span>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">2. Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li><strong className="text-slate-200">Health Metrics:</strong> Any physiological data you voluntarily log, including but not limited to weight, blood pressure, and glucose levels.</li>
            <li><strong className="text-slate-200">Technical Data:</strong> IP addresses and basic device information, strictly utilized by our edge network for rate-limiting to protect the system from automated abuse.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">3. Offline-First Storage Architecture</h2>
          <p>
            Health Track is built with an Offline-First architecture to prioritize your privacy and data availability:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li><strong className="text-slate-200">Local Storage (IndexedDB):</strong> When you log data offline, it is securely encrypted and stored directly within your device's browser sandbox. We cannot access this local data.</li>
            <li><strong className="text-slate-200">Cloud Synchronization:</strong> Upon re-establishing a network connection, your queued metrics are transmitted via secure HTTPS TLS encryption to our primary database.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">4. Third-Party Infrastructure</h2>
          <p>
            We do <strong>not</strong> sell, rent, or trade your personal or health data to data brokers, advertisers, or any third parties. We solely utilize enterprise-grade infrastructure providers to operate the service:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li><strong>Supabase:</strong> For secure, encrypted cloud database hosting.</li>
            <li><strong>Vercel & Upstash:</strong> For global edge hosting, SSL/TLS encryption, and network security (rate limiting).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">5. Device Permissions</h2>
          <p>
            The application may request the following device permissions:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li><strong>Notifications:</strong> To provide daily reminders to log your health metrics. This permission must be explicitly granted by the user via a physical interaction and can be revoked at any time in your device settings.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">6. User Rights & Data Deletion</h2>
          <p>
            You retain full ownership of your data. You may request a complete export or permanent deletion of your health metrics from our cloud database at any time by contacting the developer. To clear your local device data, simply uninstall the application or clear your browser's site storage.
          </p>
        </section>

        <section className="space-y-4 border-t border-slate-700 pt-6">
          <h2 className="text-xl font-semibold text-slate-100">7. Contact Information</h2>
          <p>
            If you have any questions or concerns regarding this Privacy Policy or your data security, please contact the developer:
          </p>
          <p className="font-mono text-blue-400">contact@usamasaifullah.cloud</p>
        </section>

        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-blue-500"
          >
            Return to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
