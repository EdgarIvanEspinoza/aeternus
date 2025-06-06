'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { NotificationProvider } from '../Providers/ToolNotification';
import { HeroUIProvider } from '@heroui/react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider>
      <UserProvider>
        <div className="relative min-h-screen">
          <NotificationProvider>{children}</NotificationProvider>
        </div>
      </UserProvider>
    </HeroUIProvider>
  );
};
