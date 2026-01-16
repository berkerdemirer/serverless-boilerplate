import { Suspense } from 'react';
import { Header } from '@/components/home/header';
import { AuthContent } from '@/components/home/auth-content';

export default function Home() {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main className="flex flex-col gap-8 p-8">
        <h1 className="text-center text-4xl font-bold">Convex + Next.js + WorkOS</h1>
        <Suspense fallback={<ContentSkeleton />}>
          <AuthContent />
        </Suspense>
      </main>
    </>
  );
}

function HeaderSkeleton() {
  return (
    <header className="bg-background sticky top-0 z-10 flex flex-row items-center justify-between border-b-2 border-slate-200 p-4 dark:border-slate-800">
      Convex + Next.js + WorkOS
      <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
    </header>
  );
}

function ContentSkeleton() {
  return (
    <div className="mx-auto flex max-w-lg animate-pulse flex-col gap-8">
      <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-16 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-10 w-40 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
