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
  isAssistant,
  username,
}: {
  message: any;
  isAssistant: boolean;
  username: string | null | undefined;
}) => {
  const [QuantumReady, setQuantumReady] = useState(false);

  const roleLabel = isAssistant ? 'Aeternus 🐲' : `${username} 🧑‍💻`;
  const gradient = isAssistant
    ? 'linear-gradient(45deg, #2563eb -20%, #ec4899 50%)'
    : 'linear-gradient(45deg, #ca8a04 -20%, #dc2626 50%)';

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
        {isAssistant ? <ReactMarkdown>{message.content}</ReactMarkdown> : message.content}
      </div>
    </div>
  );
};
