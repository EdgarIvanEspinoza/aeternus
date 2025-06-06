'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Chat } from '@components/chat/Chat';
import NavBar from '@components/navbar/NavBar';
import { getNameFromUser } from '@utils/main.utils';
import { HeroUIProvider, useDisclosure } from '@heroui/react';
import { LoginModal } from '@components/modal/LoginModal';

const MainComponent = (): ReactElement => {
  const { user, isLoading } = useUser();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    user === undefined ? onOpen() : onClose();
  }, [user, isLoading]);
  console.log(isLoading);

  return (
    <HeroUIProvider>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 dark flex flex-col items-center bg-background">
          {!isLoading && user && <Chat username={getNameFromUser(user)} />}
        </main>
      </div>
      <LoginModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </HeroUIProvider>
  );
};

export default MainComponent;
