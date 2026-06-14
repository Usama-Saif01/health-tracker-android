import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Health Tracker",
  description: "Securely log and track your Accu-Chek blood sugar readings.",
  icons: {
    icon: [
      { url: '/favicon-light.png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.png', media: '(prefers-color-scheme: dark)' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        <Providers>
          <div className="flex-1">
            {children}
          </div>
          <footer className="py-6 text-center text-sm text-gray-500 dark:text-slate-400 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto transition-colors">
            <p>
              &copy; {new Date().getFullYear()} Personal Health Tracker. Developed by{" "}
              <a href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">
                Usama Saifullah
              </a>
              .
            </p>
            <p className="mt-1 text-xs opacity-75">
              Your health data is securely encrypted.
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
