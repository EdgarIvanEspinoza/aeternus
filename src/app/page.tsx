'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Chat } from '@components/chat/Chat';
import NavBar from '@components/navbar/NavBar';
import { getNameFromUser } from '@utils/main.utils';
import { useDisclosure } from '@heroui/react';
import { LoginModal } from '@components/modal/LoginModal';

const MainComponent = (): ReactElement => {
  const { user, isLoading } = useUser();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [adminMode, setAdminMode] = useState(true);

  useEffect(() => {
    user === undefined ? onOpen() : onClose();
  }, [user, isLoading]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <NavBar adminMode={adminMode} setAdminMode={setAdminMode} />
        <main className="flex-1 dark flex flex-col items-center bg-background">
          {!isLoading && user && <Chat username={getNameFromUser(user)} adminMode={adminMode} />}
        </main>
      </div>
      <LoginModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default MainComponent;
