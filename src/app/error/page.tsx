'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'An unknown error occurred ';

  setTimeout(() => {
    window.location.href = '/chat';
  }, 5000);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-xl border border-zinc-800">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="mb-6 text-gray-300">{error}</p>
        <h2 className="text-2xl font-bold mb-4">You will be automatically redirected to the chat page.</h2>
        <div className="flex flex-col space-y-3">
          <Link href="/" className="w-full py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors">
            Back to Home
          </Link>
          <Link href="/api/auth/login" className="w-full py-2.5 text-center bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors">
            Try logging in again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>}>
      <ErrorContent />
    </Suspense>
  );
}