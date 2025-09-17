'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Avatar } from '@heroui/react';

const baseMessageStyles = 'text-[1.25rem] leading-[1.5] font-bold normal-case';
const gradientText = (gradient: string) => ({
  background: gradient,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: '#fff',
});

interface ChatMessageProps {
  message: {
    id: string | number;
    content: string;
  };
  role: 'data' | 'user' | 'assistant' | 'system';
  username: string | null | undefined;
}

export const ChatMessage = ({
  message,
  role,
  username,
}: ChatMessageProps) => {
  const [QuantumReady, setQuantumReady] = useState(false);
  const { user } = useUser();

  const isAssistant = role === 'assistant';
  const isSystem = role === 'system';
  const isUser = role === 'user';

  let roleLabel: string;
  switch (role) {
    case 'user':
      roleLabel = username ? `${username}` : 'User';
      break;
    case 'assistant':
      roleLabel = 'Lazar Schwartzman';
      break;
    case 'system':
      roleLabel = 'System';
      break;
    default:
      roleLabel = 'Unknown Role';
  }

  let gradient = 'linear-gradient(45deg, #ca8a04 -20%, #dc2626 50%)';
  switch (role) {
    case 'assistant':
      gradient = 'linear-gradient(45deg, #2563eb -20%, #ec4899 50%)';
      break;
    case 'user':
      gradient = 'linear-gradient(45deg, #ca8a04 -20%, #dc2626 50%)';
      break;
    case 'system':
      gradient = 'linear-gradient(45deg, #2563eb -20%, #ca8a04 50%)';
      break;
  }

  useEffect(() => {
    import('ldrs').then(({ quantum }) => {
      quantum.register();
      setQuantumReady(true);
    });
  }, []);

  return (
    <div
      className={`m-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}
      key={message.id}
    >
      <div
        className={`flex flex-col max-w-[75%] ${
          isUser ? 'items-end text-right' : 'items-start text-left'
        }`}
      >
        <span className="flex items-center gap-4 mb-2">
          {!isUser &&  !isSystem && (
            <Avatar
              isBordered
              as="button"
              color="success"
              src={
                isAssistant
                  ? 'assets/lequi_avatar.webp'
                  : 'https://www.gravatar.com/avatar?d=mp'
              }
              alt="user-avatar"
              size="sm"
            />
          )}
          <p className="text-xl font-bold">{`${roleLabel}`}</p>
          {isUser && (
            <Avatar
              isBordered
              as="button"
              color="success"
              src={user?.picture || 'https://www.gravatar.com/avatar?d=mp'}
              alt="user-avatar"
              size="sm"
            />
          )}
        </span>

        {/* Mensaje o Loader */}
        {message.content.length === 0 && QuantumReady && (
          <div className="my-4">
            <l-quantum size="45" speed="1.75" color="#ec4899"></l-quantum>
          </div>
        )}

        <div className={baseMessageStyles} style={gradientText(gradient)}>
          {isAssistant || isSystem ? (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          ) : (
            message.content
          )}
        </div>
      </div>
    </div>
  );
};
