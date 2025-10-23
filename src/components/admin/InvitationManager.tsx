'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Chip } from '@heroui/react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { isAdminUser } from '@config/admin-access';

type Invitation = {
  id: string;
  email: string;
  createdAt: string;
  hasUser: boolean;
  conversationCount: number;
};

export default function InvitationManager() {
  const { user, isLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  // Legacy creation/sending removed
  const [isFetching, setIsFetching] = useState(true);
  
  useEffect(() => {
    if (!isLoading && user) {
      const admin = isAdminUser(user.email as string);
      setIsAdmin(admin);
      
      if (admin) {
        fetchInvitations();
      }
    }
  }, [user, isLoading]);
  
  const fetchInvitations = async () => {
    try {
      setIsFetching(true);
      const res = await fetch('/api/admin/invitations');
      if (res.ok) {
        const data = await res.json();
        setInvitations(data.invitations);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setIsFetching(false);
    }
  };
  
  // All mutation handlers removed (feature decommissioned)
  
  if (!isAdmin) {
    return null;
  }
  
  // Status removed from schema
  
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Invitaciones Alpha (Solo Lectura)</h1>
        <p className="text-sm text-gray-500 mt-1">Creación y envío deshabilitados. Se muestra actividad de usuario y conversaciones.</p>
      </div>
      <Table aria-label="Tabla de invitaciones">
        <TableHeader>
          <TableColumn>Email</TableColumn>
          <TableColumn>Tiene Usuario</TableColumn>
          <TableColumn>Mensajes</TableColumn>
          <TableColumn>Creado</TableColumn>
        </TableHeader>
        <TableBody isLoading={isFetching} emptyContent="No hay invitaciones">
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                {invitation.hasUser ? <Chip color="success" variant="flat">Sí</Chip> : <Chip color="default" variant="flat">No</Chip>}
              </TableCell>
              <TableCell>{invitation.conversationCount}</TableCell>
              <TableCell>{new Date(invitation.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}