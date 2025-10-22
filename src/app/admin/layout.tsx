'use client';

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    // Redirect to login if not logged in
    if (!isLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="loader">
          <l-quantum size="45" speed="1.75" color="#ec4899"></l-quantum>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {children}
    </div>
  );
}