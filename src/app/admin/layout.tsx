'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import NavBar from '@components/navbar/NavBar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [jacquesMode, setJacquesMode] = useState<boolean>(false);

  useEffect(() => {
    const adminModeFromStorage = localStorage.getItem('adminMode');
    const jacquesModeFromStorage = localStorage.getItem('jacquesMode');
    setAdminMode(adminModeFromStorage ? JSON.parse(adminModeFromStorage) : false);
    setJacquesMode(jacquesModeFromStorage ? JSON.parse(jacquesModeFromStorage) : false);
  }, []);

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
      <NavBar
        adminMode={adminMode}
        jacquesMode={jacquesMode}
        setAdminMode={(mode) => {
          setAdminMode(mode);
          localStorage.setItem('adminMode', JSON.stringify(mode));
        }}
        setJacquesMode={(mode) => {
          setJacquesMode(mode);
          localStorage.setItem('jacquesMode', JSON.stringify(mode));
        }}
      />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}