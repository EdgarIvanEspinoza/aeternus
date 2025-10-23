"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Modal, ModalContent, ModalBody, ModalHeader, Input, Button, Avatar, Spinner } from '@heroui/react';
import { useImpersonation } from '../../context/ImpersonationContext';
import { isAdminUser } from '@config/admin-access';
import { useUser } from '@auth0/nextjs-auth0/client';

interface UserRow {
  id: string;
  name: string;
  email: string;
  picture?: string | null;
}

export const ImpersonationModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
  const { impersonatedUser, setImpersonatedUser, clearImpersonation } = useImpersonation();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [fetchingMore, setFetchingMore] = useState(false);

  const loadUsers = useCallback(async (opts?: { append?: boolean; cursor?: string | null }) => {
    if (!isAdminUser(user?.email || '')) return;
    const { append = false, cursor = null } = opts || {};
    try {
      if (!append) setLoading(true); else setFetchingMore(true);
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      params.set('take', '30');
      if (cursor) params.set('cursor', cursor);
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (append) {
        setUsers((u) => [...u, ...data.users]);
      } else {
        setUsers(data.users);
      }
      setNextCursor(data.nextCursor);
    } catch (e) {
      console.error('Error loading users', e);
    } finally {
      if (!append) setLoading(false); else setFetchingMore(false);
    }
  }, [search, user?.email]);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, loadUsers]);

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loadUsers();
  };

  const impersonate = (u: UserRow) => {
    setImpersonatedUser({ id: u.id, name: u.name, email: u.email, picture: u.picture });
    onOpenChange(false);
  };

  const resetConversationForCurrent = async () => {
    if (!impersonatedUser) return;
    try {
      // Delete messages for current conversationId if exists in localStorage
      const key = `conversationId:${impersonatedUser.id}`;
      const existing = localStorage.getItem(key);
      if (existing) {
        await fetch('/api/chat/deleteMessages', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: impersonatedUser.id, conversationId: existing }),
        });
      }
      // Generate new conversationId
      const newId = crypto.randomUUID();
      localStorage.setItem(key, newId);
      // Simple reload to let hook re-init
      window.location.reload();
    } catch (e) {
      console.error('Error resetting conversation', e);
    }
  };

  const exit = () => {
    clearImpersonation();
    onOpenChange(false);
  };

  if (!isAdminUser(user?.email || '')) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl" scrollBehavior="inside">
      <ModalContent>
  {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Impersonación</ModalHeader>
            <ModalBody>
              <form onSubmit={onSearch} className="flex gap-2 items-center">
                <Input
                  size="sm"
                  label="Buscar"
                  placeholder="Nombre o email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button type="submit" color="secondary" size="sm" variant="flat">Buscar</Button>
                {impersonatedUser && <Button size="sm" variant="flat" color="warning" onPress={exit}>Salir</Button>}
                {impersonatedUser && (
                  <Button size="sm" variant="flat" color="danger" onPress={resetConversationForCurrent}>
                    Reset Chat
                  </Button>
                )}
              </form>
              {loading ? (
                <div className="flex justify-center py-6"><Spinner /></div>
              ) : (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => impersonate(u)}
                      className={`w-full flex items-center gap-3 p-2 rounded border text-left hover:bg-zinc-800/50 transition ${impersonatedUser?.id === u.id ? 'border-pink-500' : 'border-zinc-700'}`}
                    >
                      <Avatar src={u.picture || 'https://www.gravatar.com/avatar?d=mp'} size="sm" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{u.name}</span>
                        <span className="text-xs text-zinc-400">{u.email}</span>
                      </div>
                      {impersonatedUser?.id === u.id && <span className="ml-auto text-xs text-pink-400">Activo</span>}
                    </button>
                  ))}
                  {nextCursor && (
                    <div className="flex justify-center py-2">
                      <Button size="sm" variant="flat" onPress={() => loadUsers({ append: true, cursor: nextCursor })} isLoading={fetchingMore}>Más</Button>
                    </div>
                  )}
                  {users.length === 0 && !loading && (
                    <div className="text-center text-sm text-zinc-500 py-6">No hay usuarios</div>
                  )}
                </div>
              )}
              <div className="pt-2 text-[10px] text-zinc-500">Selecciona un usuario para que todas las acciones (mensajes, feedback) usen su identidad hasta que salgas.</div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
