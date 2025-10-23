"use client";
import React, { useEffect, useState } from 'react';
import { useImpersonation } from '../../context/ImpersonationContext';
import { useUser } from '@auth0/nextjs-auth0/client';
import { isAdminUser } from '@config/admin-access';

export const ConversationDebugBadge = () => {
  const { impersonatedUser } = useImpersonation();
  const { user } = useUser();
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const key = impersonatedUser ? `conversationId:${impersonatedUser.id}` : 'conversationId:real';
    setConversationId(localStorage.getItem(key));
  }, [impersonatedUser?.id]);

  if (!isAdminUser(user?.email || '')) return null;

  const actorUserId = impersonatedUser ? user?.sub : undefined;
  return (
    <div className="absolute top-2 right-4 z-30 bg-indigo-600/20 border border-indigo-400/40 text-indigo-200 text-[10px] px-2 py-1 rounded max-w-xs space-y-0.5">
      <div className="font-semibold">Debug</div>
      <div>effectiveUserId: {impersonatedUser?.id || user?.sub}</div>
      <div>impersonatedId: {impersonatedUser?.id ? impersonatedUser.id : 'none'}</div>
      <div>actorUserId: {actorUserId || 'self'}</div>
      <div className="truncate">conversationId: {conversationId || 'none'}</div>
    </div>
  );
};