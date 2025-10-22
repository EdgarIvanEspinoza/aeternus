'use client';

import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { isAdminUser } from '@config/admin-access';
import { useRouter } from 'next/navigation';
import InvitationManager from '@components/admin/InvitationManager';
import { Button } from '@heroui/react';

export default function InvitationsPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    // Redirigir si no es admin
    if (!isLoading && (!user || !isAdminUser(user.email as string))) {
      router.push('/');
    }
  }, [user, isLoading, router]);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }
  
  if (!user || !isAdminUser(user.email as string)) {
    return null; // No renderizamos nada, el useEffect redirigirá
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administración de Invitaciones</h1>
        <Button 
          variant="flat" 
          color="primary"
          onClick={() => router.push('/admin')}
        >
          Dashboard
        </Button>
      </div>
      <InvitationManager />
    </div>
  );
}