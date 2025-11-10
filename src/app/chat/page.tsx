'use client';
import React, { ReactElement, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Chat } from '@components/chat/Chat';
import NavBar from '@components/navbar/NavBar';
import { useDisclosure } from '@heroui/react';
import { LoginModal } from '@components/modal/LoginModal';
import { isUserAllowed } from '../../config/alpha-access';

const ChatPage = (): ReactElement => {
  const { user, isLoading } = useUser();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [jacquesMode, setJacquesMode] = useState<boolean>(false);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    const adminModeFromStorage = localStorage.getItem('adminMode');
    const jacquesModeFromStorage = localStorage.getItem('jacquesMode');
    setAdminMode(adminModeFromStorage ? JSON.parse(adminModeFromStorage) : false);
    setJacquesMode(jacquesModeFromStorage ? JSON.parse(jacquesModeFromStorage) : false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (user === undefined) {
        onOpen();
      } else {
        onClose();
        // Check if user's email is in the allowed list
        const allowed = isUserAllowed(user.email);
        setIsAllowed(allowed);
      }
    }
  }, [user, isLoading]);

  return (
    <>
      <div className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden">
        {/* Persistent black background layer */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-black" />
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
        <main className="flex-1 flex flex-col items-center w-full pt-14">
          {!isLoading && user && isAllowed && <Chat jacquesMode={jacquesMode} adminMode={adminMode} />}
          {!isLoading && user && !isAllowed && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto">
              <div className="bg-zinc-900/60 p-8 rounded-xl border border-zinc-800 shadow-2xl text-center">
                <h2 className="text-2xl font-bold mb-4">Alpha Testing Phase Concluded</h2>
                <p className="mb-6">
                  Hello <span className="font-semibold">{user.email}</span>,
                </p>
                <p className="mb-4">
                  The alpha testing phase of Aeternus Lab has concluded. We appreciate your interest in the platform.
                </p>
                <p className="mb-6">We are currently processing the feedback received and working on improvements.</p>
                <div className="flex justify-center gap-4">
                  <a
                    href="/api/auth/logout?returnTo=/"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
                    Return to Home Page
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <LoginModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default ChatPage;
