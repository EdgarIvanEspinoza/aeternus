'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

export function UserDataSync() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    const saveUserToDatabase = async () => {
      if (user && !isLoading) {
        try {
          // Extract google id from Auth0 'sub' when applicable (google-oauth2|<id>)
          const rawSub = (user.sub as unknown) as string | undefined;
          const userIdToStore = rawSub && rawSub.startsWith('google-oauth2|') ? rawSub.split('|')[1] : rawSub;

          await fetch('/api/user/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sub: userIdToStore,
              name: user.name,
              email: user.email,
              picture: user.picture,
            }),
          });
          console.log('User data saved to database');
        } catch (error) {
          console.error('Error saving user data:', error);
        }
      }
    };

    saveUserToDatabase();
  }, [user, isLoading]);

  return null; // Este componente no renderiza nada
}