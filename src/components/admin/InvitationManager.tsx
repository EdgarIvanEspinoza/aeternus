'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Chip } from '@heroui/react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { isAdminUser } from '@config/admin-access';
import { Mail, Copy, Check } from 'lucide-react';

type Invitation = {
  id: string;
  email: string;
  status: 'pending' | 'sent' | 'accepted';
  createdAt: string;
  lastSentAt?: string;
};

export default function InvitationManager() {
  const { user, isLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  
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
  
  const handleCreateInvitation = async () => {
    if (!newEmail.trim()) return;
    
    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail }),
      });
      
      if (res.ok) {
        setNewEmail('');
        setIsModalOpen(false);
        fetchInvitations();
      }
    } catch (error) {
      console.error('Error creating invitation:', error);
    }
  };
  
  const handleSendInvitation = async (id: string) => {
    try {
      setIsSending(true);
      const res = await fetch(`/api/admin/invitations/${id}/send`, {
        method: 'POST',
      });
      
      if (res.ok) {
        fetchInvitations();
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  const copyInvitationLink = (email: string) => {
    const invitationLink = `${window.location.origin}/api/auth/login?invitation=${Buffer.from(email).toString('base64')}`;
    navigator.clipboard.writeText(invitationLink);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };
  
  if (!isAdmin) {
    return null;
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'sent': return 'primary';
      case 'accepted': return 'success';
      default: return 'default';
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Invitaciones Alpha</h1>
        <Button color="primary" onPress={() => setIsModalOpen(true)}>
          Nueva Invitación
        </Button>
      </div>
      
      <Table aria-label="Tabla de invitaciones">
        <TableHeader>
          <TableColumn>Email</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Creado</TableColumn>
          <TableColumn>Último envío</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody isLoading={isFetching} emptyContent="No hay invitaciones">
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                <Chip color={getStatusColor(invitation.status)} variant="flat">
                  {invitation.status === 'pending' ? 'Pendiente' : 
                   invitation.status === 'sent' ? 'Enviada' : 'Aceptada'}
                </Chip>
              </TableCell>
              <TableCell>{new Date(invitation.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                {invitation.lastSentAt ? new Date(invitation.lastSentAt).toLocaleDateString() : 'No enviada'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="primary"
                    isDisabled={invitation.status === 'accepted' || isSending}
                    onPress={() => handleSendInvitation(invitation.id)}
                  >
                    <Mail size={18} />
                  </Button>
                  
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="default"
                    onPress={() => copyInvitationLink(invitation.email)}
                  >
                    {copiedEmail === invitation.email ? <Check size={18} /> : <Copy size={18} />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl">Nueva Invitación Alpha</h2>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Email"
              placeholder="Ingrese el email del usuario a invitar"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              type="email"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button color="primary" onPress={handleCreateInvitation}>
              Crear Invitación
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}