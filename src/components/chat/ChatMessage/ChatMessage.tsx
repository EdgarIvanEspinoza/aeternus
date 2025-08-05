'use client';

import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

const baseMessageStyles = 'text-[1.25rem] leading-[1.5] font-bold normal-case';
const gradientText = (gradient: string) => ({
  background: gradient,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: '#fff',
});

export const ChatMessage = ({
  message,
  role,
  username,
}: {
  message: any;
  role: 'data' | 'user' | 'assistant' | 'system';
  username: string | null | undefined;
}) => {
  const [QuantumReady, setQuantumReady] = useState(false);
  const isAssistant = role === 'assistant';
  const isSystem = role === 'system';
  let roleLabel: string;
  switch (role) {
    case 'user':
      roleLabel = username ? `${username} 🧑‍💻` : 'User';
      break;
    case 'assistant':
      roleLabel = 'Aeternus 🐲';
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
    default:
      gradient = 'linear-gradient(45deg, #ca8a04 -20%, #dc2626 50%)';
  }

  useEffect(() => {
    import('ldrs').then(({ quantum }) => {
      quantum.register();
      setQuantumReady(true);
    });
  }, []);

  return (
    <div className="m-2" key={message.id}>
      <div className="flex flex-col">
        <p className="text-xl font-bold">{`${roleLabel}:`}</p>
        {message.content.length === 0 && QuantumReady && (
          <div className="my-4 ml-5">
            <l-quantum size="45" speed="1.75" color="#ec4899"></l-quantum>
          </div>
        )}
      </div>
      <div className={baseMessageStyles} style={gradientText(gradient)}>
        {isAssistant || isSystem ? <ReactMarkdown>{message.content}</ReactMarkdown> : message.content}
      </div>
    </div>
  );
};
