"use client";
import React, { ReactElement, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Chat } from '@components/chat/Chat';
import NavBar from '@components/navbar/NavBar';
import { useDisclosure } from '@heroui/react';
import { LoginModal } from '@components/modal/LoginModal';

const ChatPage = (): ReactElement => {
  const { user, isLoading } = useUser();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [jacquesMode, setJacquesMode] = useState<boolean>(false);

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
        <main className="flex-1 flex flex-col items-center w-full">
          {!isLoading && user && <Chat jacquesMode={jacquesMode} adminMode={adminMode} />}
        </main>
      </div>
      <LoginModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default ChatPage;
