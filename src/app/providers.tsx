'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { Wrench } from 'lucide-react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider>
      <UserProvider>
        <div className="relative min-h-screen">
          <ToastProvider
            placement="top-center"
            toastProps={{
              icon: <Wrench />,
              timeout: 9999999,
              variant: 'flat',
            }}
          />
          {children}
        </div>
      </UserProvider>
    </HeroUIProvider>
  );
};
