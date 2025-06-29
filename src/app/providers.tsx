'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const navigate = (href: string) => router.push(href);
  const useHref = (href: string) => href; // Adjust if you use a basePath

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
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
