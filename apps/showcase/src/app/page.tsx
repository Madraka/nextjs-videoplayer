"use client";

import dynamic from 'next/dynamic';

// Dynamic import to prevent SSR hydration issues
const HomePageClient = dynamic(() => import('./page-client').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Loading Video Player...</p>
      </div>
    </div>
  )
});

export default function HomePage() {
  return <HomePageClient />;
}
